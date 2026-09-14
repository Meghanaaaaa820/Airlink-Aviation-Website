# Airlink Aviation Website Redevelopment — Initial Audit

**Audit scope:** public production reference at `https://www.airlinkaviation.in/`  
**Audit date:** 14 September 2026  
**Local project state:** no application source was present in the attached workspace; only the redevelopment brief was available.

## Executive conclusion

The current public website is a compact, single-page marketing site rather than the dynamic B2B product platform described in the brief. It is deployed on Vercel and is built with Next.js/React, server-rendered markup, Next Image optimization, and Tailwind-style utility classes. The visible product catalogue is embedded into the homepage and has no product detail URLs, searchable catalogue, resource library, enquiry workflow, admin area, or visible API/database surface.

The safest redevelopment path is a new staging build that preserves the current production site unchanged. The first implementation should establish a content model and reusable product/detail templates, then migrate only verified company content and approved assets. The source repository is still required to audit the actual code structure, dependencies, environment variables, deployment configuration, and any hidden functionality.

## 1. Current technology stack — verified from the public deployment

| Area | Finding | Confidence |
|---|---|---|
| Rendering/runtime | Next.js App Router-style output (`self.__next_f`, `/_next/static/chunks`, `app/page-...js`) | High |
| UI framework | React client component behavior is visible in the navbar bundle (`useState`) | High |
| Language | Likely JavaScript/TypeScript; public output cannot distinguish the source language | Medium |
| Styling | Tailwind-style utility classes plus a generated global CSS file | High |
| Image handling | Next Image component and `/_next/image` optimization routes | High |
| Hosting | Vercel response headers and Vercel cache identifiers | High |
| Database/backend | No public evidence of a database, server API, authentication, or CMS | Not verified |
| Build/deployment config | Not available without the source repository | Unknown |

The public HTML is server-rendered, while the navigation menu is a small client-side component. This is a good foundation for SEO, but it does not expose enough information to infer the source folder structure or server architecture.

## 2. Current information architecture

The site currently exposes one public route:

- `/` — homepage

The homepage navigation points to anchor sections:

- `#about`
- `#capabilities`
- `#products`
- `#contact`

The current sitemap contains only the root URL. `robots.txt` allows crawling and points to the sitemap.

### Visible homepage sections

1. Fixed header with logo, company name, desktop links, and mobile hamburger menu
2. Hero / positioning statement
3. About Airlink
4. Core capabilities
5. Products
6. Why Airlink / proof-point section
7. Contact information
8. Footer

There are no publicly discoverable About, Capabilities, Industries, Resources, Contact, product detail, or admin routes in the current deployment.

## 3. Current product implementation

Eight product families are visible on the homepage:

1. Aircraft HMI Control Panels
2. Multifunctional Displays (MFDs)
3. Radio Simulators
4. RF Cable Assemblies
5. Fiber Optic Interconnect Solutions
6. MIL-Grade Circular Connectors
7. Control Panels
8. MicroD Connectors

The public output indicates that these cards are rendered directly as homepage content, with image paths under `/images/products/` or `/images/`. No product IDs, slugs, detail links, category filter controls, specifications table, datasheet links, related products, or enquiry-by-product controls are exposed.

This means the product system should be redesigned as data-driven content rather than extended by adding more hardcoded cards.

## 4. Existing content and assets observed

### Company and positioning content

The public site presents Airlink Aviation Pvt. Ltd. as an aerospace and defence electronics company focused on rugged electronic and electromechanical systems. Visible positioning includes:

- rugged aerospace and defence electronic systems
- aircraft cockpit controls
- embedded computing systems
- rugged displays
- EWIS / wiring and harness solutions
- RF cable harnessing
- radio simulators and training systems
- MicroD connectors and interconnect solutions

### Public contact details

These details are visible on the current site and should be treated as migration candidates, not independently re-verified claims:

- `sales@airlinkaviation.in`
- `info@airlinkaviation.in`
- `+91-8700454009`
- `+91-8277908949`
- `#526, 3rd Floor, 7th Cross Rd, HAL 3rd Stage, Jeevan Bima Nagar, Bengaluru, Karnataka 560075`
- LinkedIn: `https://www.linkedin.com/company/airlink-aviation-pvt-ltd/`

### Asset observations

- A company logo is served from `/images/logo/logo.png`.
- Product and capability images are served from local `/images/` paths.
- The hero background references an Unsplash image URL in the public markup/styles. This should be reviewed and either approved, replaced with a company-owned asset, or retained with appropriate licensing verification.
- The site uses responsive Next Image URLs, which is worth preserving in the new build.

## 5. Existing functionality

### Present

- Responsive header navigation
- Mobile menu toggle
- Anchor navigation between homepage sections
- Responsive image rendering through Next Image
- Basic SEO metadata
- `robots.txt`
- `sitemap.xml`
- Direct mailto and telephone links
- LinkedIn outbound link

### Not found in the public surface

- Product search or filtering
- Product detail pages
- Product enquiry form
- General contact form
- Resource/document downloads
- Newsletter or lead capture
- Authentication
- Admin dashboard
- File uploads
- Public JSON/API endpoints
- Database-backed content
- Analytics or consent UI visible in the page output

The absence of a public surface does not prove that hidden source functionality does not exist. The original repository is needed before removing or replacing anything.

## 6. SEO and accessibility baseline

### Positive baseline

- Descriptive page title and meta description
- Open Graph title, description, URL, and site name
- `robots` and `googlebot` directives
- Canonical URL
- Semantic `main`, `section`, `header`, and `footer` elements
- A single primary homepage `h1`
- Alt text is present for the visible logo and image components
- Mobile menu has an accessible label

### Issues to address

- The canonical URL uses the non-`www` host while the audited URL is `www`; the redirect/canonical policy should be made deliberate and consistent.
- The sitemap contains only one URL, limiting product and solution discoverability.
- Product content is not individually indexable.
- Product families should receive unique title, description, canonical, Open Graph, and structured data metadata once detail routes exist.
- The current public metadata contains strong claims such as “DRDO Trusted Supplier,” references to HAL and BEL, and numerical proof points. These must be explicitly verified and approved before being carried into the new site.
- Accessibility needs a browser-level audit for focus order, contrast, keyboard operation, heading hierarchy, reduced motion, and mobile menu behavior; static HTML alone is insufficient.

## 7. Requirements gap against the redevelopment brief

| Brief requirement | Current public status | Recommended action |
|---|---|---|
| Dynamic products | Not present | Introduce database/content model and reusable list/detail templates |
| Product detail URLs | Not present | Add `/products/:slug` routes |
| Search/filter | Not present | Add simple category filter and text search after content model exists |
| Enquiry system | Not present | Add validated server-side form, persistence, notification path, and rate limiting |
| Resources | Not present | Add resource model with verified document uploads and related products |
| Admin panel | Not present | Add authenticated admin only if a supported backend/database is confirmed |
| Database | Not observable | Prefer PostgreSQL with migrations if building a new backend |
| API | Not observable | Add typed/validated public and admin endpoints |
| Industries/applications | Only implied in homepage copy | Create only from approved source content |
| Quality/certifications | Some claims are visible | Require evidence/approval before publishing claims |
| SEO scale | Homepage-only | Generate metadata and sitemap entries from published content |
| Staging safety | Current production is live | Build separately; do not alter DNS or production deployment |

## 8. What should be preserved

- Existing live deployment and domain
- Company logo and approved company-owned imagery
- Verified contact information
- Current high-level positioning where the company approves the wording
- Product family names as migration candidates
- Strong mobile-first responsiveness
- Next Image optimization approach
- Server-rendered/SEO-friendly architecture
- Simple, technical visual direction rather than consumer/e-commerce styling

## 9. What should be redesigned

- Navigation from anchor-only links to a clear multi-page information architecture
- Homepage hierarchy and calls to action
- Product catalogue and product discovery
- Product content presentation, including specifications and configurations
- Enquiry/contact workflow
- Resource library
- Content governance and publishing workflow
- Accessibility states and form feedback
- SEO structure, canonical host policy, sitemap, and schema
- Error/loading/empty states

## 10. Recommended target architecture

Because no source repository is available, this is a recommendation rather than a claim about the existing implementation:

- **Frontend:** Next.js with TypeScript, App Router, server components by default
- **Styling:** retain a utility-first system only if it exists in the source; otherwise establish a small tokenized design system
- **Content/data:** PostgreSQL with migrations and a thin server-side data access layer
- **Validation:** shared schemas for client hints and mandatory server validation
- **Public routes:** `/`, `/about`, `/capabilities`, `/products`, `/products/[slug]`, `/industries`, `/resources`, `/contact`
- **Admin routes:** isolated `/admin` area with secure session handling and role checks
- **Storage:** private/controlled object storage for datasheets and images, with validated file types and size limits
- **SEO:** route-level metadata, canonical URLs, sitemap generation from published records, robots policy, and conservative JSON-LD
- **Operations:** separate staging deployment, environment variables, migration process, error logging, backups, and rollback plan

### Suggested folder structure

```text
app/
  (public)/
    page.tsx
    about/page.tsx
    capabilities/page.tsx
    products/page.tsx
    products/[slug]/page.tsx
    industries/page.tsx
    resources/page.tsx
    contact/page.tsx
  admin/
    products/
    resources/
    enquiries/
  api/
    products/
    enquiries/
    resources/
components/
  layout/
  products/
  forms/
  content/
lib/
  db/
  validation/
  seo/
  storage/
  email/
public/
  images/
  icons/
  documents/
```

## 11. Recommended database schema

Start with a normalized relational model, keeping content fields extensible without making every page a generic CMS:

- `product_categories`: name, slug, description, display order, published state
- `products`: name, slug, category ID, short description, overview, status, SEO fields, timestamps
- `product_images`: product ID, storage key, alt text, display order
- `product_features`: product ID, text, display order
- `product_specifications`: product ID, label, value, unit, display order
- `product_applications`: product ID, application text, display order
- `product_standards`: product ID, standard text, evidence/reference, approval state
- `product_configurations`: product ID, label, value/description, display order
- `product_relations`: product ID, related product ID
- `resources`: title, slug, description, category, storage key, MIME type, related product ID, published state, date
- `enquiries`: product ID nullable, name, company, email, phone, requirement, message, status, audit timestamps
- `admin_users`: email, password hash or supported identity reference, role, active state, timestamps

Do not populate technical specifications, standards, customer names, or performance numbers until the company provides verified source material.

## 12. Development phases

1. **Source handoff and repository audit:** inspect package files, routes, components, APIs, schema, environment handling, and deployment files.
2. **Content verification:** approve product names, descriptions, claims, contact data, standards, imagery, and documents.
3. **Foundation:** staging deployment, design tokens, layout, routing, database, migrations, validation, and error handling.
4. **Public UI:** homepage, About, Capabilities, Industries, Resources, Contact, navigation, footer, and responsive states.
5. **Dynamic catalogue:** product model, listing, filter/search, detail template, related products, and SEO.
6. **Enquiries:** product/general enquiry forms, server validation, persistence, notification delivery, spam/rate controls, and admin visibility.
7. **Admin:** authentication, products, resources, enquiries, publishing controls, and safe file handling.
8. **Quality pass:** accessibility, responsive checks, performance, SEO, security review, and content QA.
9. **Staging acceptance:** stakeholder review on a separate URL; no production DNS changes.
10. **Production cutover:** only after approval, backup/rollback plan, final verification, and explicit authorization.

## 13. Risks and open items

- **Source code unavailable:** architecture, hidden routes, existing forms, dependencies, and deployment settings cannot be confirmed.
- **Claim verification:** public copy contains potentially material defence/customer/standards claims; publishing them without evidence creates reputational and legal risk.
- **Asset licensing:** the hero references an external Unsplash image; ownership/licence and replacement decision are outstanding.
- **Content completeness:** the homepage says “20+” products/solutions while only eight product families are visible; the complete catalogue must be supplied or extracted from the source.
- **Enquiry delivery:** recipient mailbox, SMTP/provider, retention, notification rules, and spam controls are not defined.
- **Admin identity:** administrator accounts, roles, password reset, and operational ownership are not defined.
- **Deployment ownership:** Vercel is visible publicly, but the project/account, environment variables, database, and rollback process are not available in this workspace.
- **Production safety:** the live domain must remain untouched until staging acceptance is complete.

## Audit handoff needed

To complete the repository-level audit required by the brief, provide one of:

1. the existing source project in this workspace,
2. a Replit project link/path for the current build, or
3. a source archive/repository connection.

Until then, implementation should be treated as a new staging build based only on the verified public reference and clearly marked, approved content.