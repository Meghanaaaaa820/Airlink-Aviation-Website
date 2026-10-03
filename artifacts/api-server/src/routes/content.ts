import { Router, type IRouter } from "express";
import { Resend } from "resend";
import { and, asc, count, eq, ilike, ne, or } from "drizzle-orm";
import {
  CreateEnquiryBody,
  CreateEnquiryResponse,
  GetProductBySlugParams,
  GetProductBySlugResponse,
  GetProductsQueryParams,
  GetProductsResponse,
  GetResourcesQueryParams,
  GetResourcesResponse,
  GetSiteSummaryResponse,
} from "@workspace/api-zod";
import { db } from "@workspace/db";
import {
  enquiriesTable,
  productsTable,
  resourcesTable,
  type Product,
} from "@workspace/db/schema";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const resendApiKey = process.env.RESEND_API_KEY?.trim();
const resend = resendApiKey ? new Resend(resendApiKey) : null;

if (!resend) {
  logger.warn(
    "RESEND_API_KEY is not configured; enquiry email notifications are disabled.",
  );
}

function productSummary(product: Product) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    shortDescription: product.shortDescription,
    image: product.image,
    eyebrow: product.eyebrow,
    featured: product.featured,
  };
}

router.get("/site/summary", async (req, res) => {
  try {
    const [productCountResult] = await db
      .select({ value: count() })
      .from(productsTable);
    const data = GetSiteSummaryResponse.parse({
      productCount: Number(productCountResult?.value ?? 0),
      capabilityCount: 4,
      supportLabel: "Lifecycle support",
      qualityLabel: "Quality-led systems",
    });
    res.json(data);
  } catch (error) {
    req.log.error({ err: error }, "Failed to load site summary");
    res.status(500).json({ error: "Unable to load site summary" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const query = GetProductsQueryParams.parse(req.query);
    const conditions = [];

    if (query.category && query.category !== "all") {
      conditions.push(eq(productsTable.category, query.category));
    }
    if (query.featured !== undefined) {
      conditions.push(eq(productsTable.featured, query.featured));
    }
    if (query.search) {
      const searchTerm = `%${query.search}%`;
      conditions.push(
        or(
          ilike(productsTable.name, searchTerm),
          ilike(productsTable.category, searchTerm),
          ilike(productsTable.shortDescription, searchTerm),
        ),
      );
    }

    const rows = await db
      .select()
      .from(productsTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(asc(productsTable.name));

    res.json(GetProductsResponse.parse(rows.map(productSummary)));
  } catch (error) {
    req.log.error({ err: error }, "Failed to load products");
    res.status(500).json({ error: "Unable to load products" });
  }
});

router.get("/products/:slug", async (req, res) => {
  try {
    const { slug } = GetProductBySlugParams.parse(req.params);
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.slug, slug))
      .limit(1);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const relatedRows = await db
      .select()
      .from(productsTable)
      .where(
        and(
          eq(productsTable.category, product.category),
          ne(productsTable.id, product.id),
        ),
      )
      .orderBy(asc(productsTable.name))
      .limit(3);

    const data = GetProductBySlugResponse.parse({
      ...productSummary(product),
      description: product.description,
      features: product.features,
      applications: product.applications,
      specifications: product.specifications,
      relatedProducts: relatedRows.map(productSummary),
    });
    res.json(data);
  } catch (error) {
    req.log.error({ err: error }, "Failed to load product");
    res.status(500).json({ error: "Unable to load product" });
  }
});

router.get("/resources", async (req, res) => {
  try {
    const query = GetResourcesQueryParams.parse(req.query);
    const rows = await db
      .select()
      .from(resourcesTable)
      .where(
        and(
          eq(resourcesTable.published, true),
          query.category && query.category !== "all"
            ? eq(resourcesTable.category, query.category)
            : undefined,
        ),
      )
      .orderBy(asc(resourcesTable.title));

    res.json(
      GetResourcesResponse.parse(
        rows.map(({ id, title, description, category, type, actionLabel, href }) => ({
          id,
          title,
          description,
          category,
          type,
          actionLabel,
          href,
        })),
      ),
    );
  } catch (error) {
    req.log.error({ err: error }, "Failed to load resources");
    res.status(500).json({ error: "Unable to load resources" });
  }
});

router.post("/enquiries", async (req, res) => {
  const parsed = CreateEnquiryBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: "Please check the enquiry details and try again.",
      fields: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([key, messages]) => [
          key,
          messages?.[0] ?? "Invalid value",
        ]),
      ),
    });
    return;
  }

  try {
    const name = parsed.data.name.trim();
    const company = parsed.data.company.trim();
    const email = parsed.data.email.trim().toLowerCase();
    const phone = parsed.data.phone.trim();
    const requirement = parsed.data.requirement.trim();
    const message = parsed.data.message.trim();
    const productSlug = parsed.data.productSlug ?? null;

    // 1. Save enquiry in the database
    const [created] = await db
      .insert(enquiriesTable)
      .values({
        productSlug,
        name,
        company,
        email,
        phone,
        requirement,
        message,
      })
      .returning({ id: enquiriesTable.id });

    // Email notification is a secondary side effect. The saved enquiry is the
    // source of truth, so email problems must not turn a successful save into
    // a failed submission that prompts the visitor to submit it again.
    if (!resend) {
      req.log.warn(
        { enquiryId: created?.id },
        "Enquiry was saved; email notification skipped because RESEND_API_KEY is not configured",
      );
    } else {
      try {
        const recipientEmails = (process.env.ENQUIRY_TO_EMAIL ?? "")
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
        const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();

        if (!fromEmail) {
          throw new Error("RESEND_FROM_EMAIL is not configured");
        }

        if (recipientEmails.length === 0) {
          throw new Error("ENQUIRY_TO_EMAIL is not configured");
        }

        const { error: emailError } = await resend.emails.send({
          from: fromEmail,
          to: recipientEmails,
          replyTo: email,
          subject: `New Airlink Aviation Enquiry - ${name}`,
          html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
          <h2 style="color: #0b2333;">New Website Enquiry</h2>

          <p>A new enquiry has been submitted through the Airlink Aviation website.</p>

          <table style="border-collapse: collapse; width: 100%; max-width: 700px;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold;">Name</td>
              <td style="padding: 8px 12px;">${name}</td>
            </tr>

            <tr>
              <td style="padding: 8px 12px; font-weight: bold;">Company</td>
              <td style="padding: 8px 12px;">${company}</td>
            </tr>

            <tr>
              <td style="padding: 8px 12px; font-weight: bold;">Email</td>
              <td style="padding: 8px 12px;">${email}</td>
            </tr>

            <tr>
              <td style="padding: 8px 12px; font-weight: bold;">Phone</td>
              <td style="padding: 8px 12px;">${phone}</td>
            </tr>

            <tr>
              <td style="padding: 8px 12px; font-weight: bold;">Requirement</td>
              <td style="padding: 8px 12px;">${requirement}</td>
            </tr>

            <tr>
              <td style="padding: 8px 12px; font-weight: bold;">Product</td>
              <td style="padding: 8px 12px;">${productSlug ?? "General enquiry"}</td>
            </tr>

            <tr>
              <td style="padding: 8px 12px; font-weight: bold; vertical-align: top;">Message</td>
              <td style="padding: 8px 12px; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>

          <p style="margin-top: 24px;">
            You can reply directly to this email to contact the person who submitted the enquiry.
          </p>
        </div>
      `,
        });

        if (emailError) {
          req.log.error(
            { err: emailError, enquiryId: created?.id },
            "Enquiry was saved, but email notification failed",
          );
        }
      } catch (emailFailure) {
        req.log.error(
          { err: emailFailure, enquiryId: created?.id },
          "Enquiry was saved, but email notification failed",
        );
      }
    }

    const data = CreateEnquiryResponse.parse({
      id: String(created?.id ?? ""),
      message: "Your enquiry has been received. Our team will follow up shortly.",
    });

    res.status(201).json(data);
  } catch (error) {
    req.log.error({ err: error }, "Failed to create enquiry");
    res.status(500).json({ error: "Unable to submit enquiry" });
  }
});
export default router;