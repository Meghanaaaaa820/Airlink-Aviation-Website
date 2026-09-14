# Airlink Aviation Website

Staging website for Airlink Aviation, helping aerospace and defence B2B visitors understand product families and start technical enquiries.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/airlink-aviation/src/App.tsx` — public routes, page composition, API hook usage, and enquiry flows
- `artifacts/airlink-aviation/src/index.css` — Airlink visual tokens, typography, grid texture, and responsive styling
- `lib/api-spec/openapi.yaml` — source of truth for public content and enquiry API contracts
- `artifacts/api-server/src/routes/content.ts` — products, site summary, resources, and enquiry endpoints
- `lib/db/src/schema/index.ts` — PostgreSQL/Drizzle schema for products, resources, and enquiries
- `AIRLINK-AUDIT.md` — initial audit of the live production reference and redevelopment gaps

## Architecture decisions

- The live production domain is untouched; this artifact is a separate staging build.
- Public product and resource content is served through the shared API and PostgreSQL rather than hardcoded into page components.
- The initial content model stores configuration-dependent technical details as explicit "provided for the selected configuration" copy instead of inventing specifications.
- The frontend uses generated OpenAPI hooks from `@workspace/api-client-react`; the backend validates request and response shapes with generated Zod schemas.
- Admin authentication and content management are intentionally deferred until the source repository and operational requirements are supplied.

## Product

Public routes include the homepage, product catalogue with search/category filters, reusable product detail pages, resources, about, capabilities, and an enquiry/contact flow. Enquiries are validated server-side and persisted in PostgreSQL.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`.
- The generated React client uses `Headers.entries()`, so `lib/api-client-react/tsconfig.json` must include `dom.iterable`.
- Do not connect the staging artifact to `www.airlinkaviation.in` or alter DNS until the new content is approved.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
