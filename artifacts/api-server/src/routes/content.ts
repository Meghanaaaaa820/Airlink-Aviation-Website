import { Router, type IRouter } from "express";
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

const router: IRouter = Router();

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
    const [created] = await db
      .insert(enquiriesTable)
      .values({
        productSlug: parsed.data.productSlug ?? null,
        name: parsed.data.name.trim(),
        company: parsed.data.company.trim(),
        email: parsed.data.email.trim().toLowerCase(),
        phone: parsed.data.phone.trim(),
        requirement: parsed.data.requirement.trim(),
        message: parsed.data.message.trim(),
      })
      .returning({ id: enquiriesTable.id });

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