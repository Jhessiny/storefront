# Storefront

A modern e-commerce storefront built with Next.js 16, React 19, Supabase, and Stripe.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Backend:** Supabase (Auth + Postgres + Storage)
- **Payments:** Stripe
- **Data Fetching:** TanStack Query 5 (client), direct calls (server)
- **Client State:** Zustand (cart)
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Animations:** Framer Motion
- **Testing:** Vitest + Testing Library

## Architecture

Clean architecture with a dual-path approach for Next.js App Router:

- **Server path** (Server Components, Server Actions): Factory functions create repositories directly — no DI needed
- **Client path** (interactive components): DI via React Context — providers wire use cases, hooks consume them

```
src/
├── domain/           # Entities & repository interfaces
├── application/      # Use cases
├── infrastructure/   # Supabase/Stripe implementations, factories, server actions
├── main/             # Client-side DI providers
├── presentation/     # UI components, hooks, Zustand store
├── shared/           # Errors, types, utilities
└── app/              # Next.js routes
```

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- Supabase account
- Stripe account (optional for initial development)

### Setup

1. **Clone and install:**

   ```bash
   git clone <repo-url> && cd storefront
   pnpm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Fill in your Supabase and Stripe keys — see `.env.example` for details.

   Supabase uses the new key format:
   - `sb_publishable_...` (anon/public key)
   - `sb_secret_...` (service role key — server-side only, never expose to browser)

3. **Link Supabase and push the database schema:**

   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```

4. **Seed the database:**

   ```bash
   npx tsx --env-file=.env scripts/seed.ts
   ```

   Stripe integration is optional — the seed script will skip Stripe product/price creation if `STRIPE_SECRET_KEY` is not set.

5. **Start the dev server:**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

### Stripe Webhooks (local development)

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

Use the printed `whsec_...` signing secret as `STRIPE_WEBHOOK_SECRET` in `.env`.

## Scripts

| Command           | Description               |
| ----------------- | ------------------------- |
| `pnpm dev`        | Start development server  |
| `pnpm build`      | Production build          |
| `pnpm start`      | Start production server   |
| `pnpm lint`       | Run ESLint                |
| `pnpm test`       | Run tests                 |
| `pnpm test:watch` | Run tests in watch mode   |
| `pnpm format`     | Format code with Prettier |

## Database

Schema is managed via Supabase migrations in `supabase/migrations/`.

**Tables:** `categories`, `products`, `product_images`, `orders`, `order_items`, `cart_items`

- Products include full-text search via `tsvector` + GIN index
- Row-Level Security (RLS) enabled on all tables
- Products/categories are public read; orders/cart scoped to authenticated user

## Project Structure

See [STOREFRONT_PLAN.md](./STOREFRONT_PLAN.md) for the full architecture plan, database schema, data flow examples, and implementation phases.
