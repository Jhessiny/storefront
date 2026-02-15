# Storefront — New Next.js E-Commerce Project Plan

## Context

Rebuilding the old `next-eccomerce` project from scratch as `storefront` for portfolio purposes. The old project has solid clean architecture but is 3+ years outdated (Next.js 13, React 18, no tests, broken checkout, typo in name). We're adapting the clean architecture patterns from both the old e-commerce project and the user's React+Vite project (`PROJECT_STRUCTURE.md`) for Next.js 15 App Router.

---

## Tech Stack

| Category | Tool |
|----------|------|
| Framework | Next.js 15, React 19, TypeScript 5.9 |
| Backend | Supabase (Auth + Postgres + Storage) |
| Payments | Stripe |
| Data fetching | TanStack Query 5 (client), direct calls (server) |
| Client state | Zustand (cart) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Animations | Framer Motion |
| Testing | Vitest + Testing Library |
| Linting | ESLint 9 (flat config), Prettier |
| Git hooks | Husky, lint-staged, commitlint |
| Package manager | pnpm |

---

## Key Architecture Decision: Clean Architecture + App Router

**The tension:** Clean Architecture uses DI via React Context, but Server Components can't use context.

**Solution — dual-path architecture:**

- **Server path** (pages, Server Components, Server Actions): Call factories directly → get repository → execute use case. No DI needed since server code isn't swappable at runtime.
- **Client path** (interactive components): Same DI pattern as the Vite project — providers wire use cases into context, hooks consume them.

The domain and application layers are shared by both paths. Only the wiring differs.

Server Actions live in `infrastructure/actions/` as mutation adapters — they're the bridge between client form submissions and server-side use cases.

---

## Directory Structure

```
storefront/
├── scripts/
│   └── seed.ts                          # DB + Stripe seeding
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── src/
│   ├── app/                             # Next.js routes only
│   │   ├── layout.tsx                   # Root layout + providers
│   │   ├── page.tsx                     # Home (featured products, hero)
│   │   ├── loading.tsx / error.tsx / not-found.tsx
│   │   ├── globals.css
│   │   ├── products/
│   │   │   ├── page.tsx                 # Product listing (Server Component)
│   │   │   └── [slug]/page.tsx          # Product detail (Server Component)
│   │   ├── checkout/page.tsx            # Checkout (Client Component)
│   │   ├── success/page.tsx             # Post-payment confirmation
│   │   ├── orders/
│   │   │   ├── page.tsx                 # Order history (Server, protected)
│   │   │   └── [id]/page.tsx
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── callback/route.ts        # Supabase auth callback
│   │   └── api/webhook/stripe/route.ts  # Stripe webhook
│   │
│   ├── domain/                          # Layer 1 — Pure types & interfaces
│   │   ├── entities/                    # Product, Category, CartItem, Order, User
│   │   └── repositories/               # Interfaces for each entity
│   │
│   ├── application/                     # Layer 2 — Use cases
│   │   └── use-cases/                   # product/, category/, cart/, order/, auth/, payment/
│   │
│   ├── infrastructure/                  # Layer 3 — Implementations
│   │   ├── api/                         # supabase-server.ts, supabase-browser.ts, stripe-server.ts
│   │   ├── repositories/               # Supabase/Stripe implementations
│   │   ├── factories/                   # Composition root for server-side
│   │   └── actions/                     # Server Actions (auth, order, cart, payment)
│   │
│   ├── main/                            # Layer 4 — Client-side DI
│   │   ├── contexts/
│   │   └── providers/                   # app-provider, query-provider, auth-provider, cart-provider
│   │
│   ├── presentation/                    # Layer 5 — UI
│   │   ├── components/
│   │   │   ├── ui/                      # shadcn/ui primitives
│   │   │   ├── layout/                  # header, footer, mobile-nav
│   │   │   └── features/               # product/, cart/, search/, auth/, checkout/, orders/
│   │   ├── hooks/                       # use-cart, use-auth, use-products, query-keys
│   │   └── store/                       # Zustand cart store
│   │
│   ├── shared/                          # Cross-layer
│   │   ├── errors/                      # DomainError base + concrete errors
│   │   ├── types/                       # Response<T>, database.ts (generated)
│   │   └── utils/                       # either.ts, query-adapter.ts, format-currency.ts
│   │
│   └── lib/utils.ts                     # cn() helper
```

---

## Database Schema (Supabase/Postgres)

**Tables:** `categories`, `products` (with `search_vector` tsvector + GIN index), `product_images`, `orders`, `order_items`, `cart_items`

**Key details:**
- Products have `stripe_price_id` column — seed script creates Stripe products/prices
- `search_vector` is a generated column from title + brand + description for full-text search
- RLS enabled: products/categories are public read, orders/cart scoped to `auth.uid()`
- `cart_items` has `unique(user_id, product_id)` for upsert support

### SQL Schema

```sql
-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  brand text not null,
  price numeric(10,2) not null check (price > 0),
  compare_at_price numeric(10,2),
  category_id uuid not null references categories(id),
  thumbnail_url text not null,
  rating numeric(3,2) default 0,
  stock integer not null default 0 check (stock >= 0),
  stripe_product_id text,
  stripe_price_id text,
  is_active boolean not null default true,
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(brand, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_search on products using gin(search_vector);
create index idx_products_category on products(category_id);
create index idx_products_price on products(price);
create index idx_products_slug on products(slug);

-- Product images
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt_text text,
  sort_order integer not null default 0
);

-- Orders
create type order_status as enum ('pending', 'paid', 'shipped', 'delivered', 'cancelled');

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  status order_status not null default 'pending',
  total numeric(10,2) not null,
  stripe_session_id text,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_user on orders(user_id);

-- Order items
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  created_at timestamptz not null default now()
);

-- Cart items (for logged-in user persistence)
create table cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  product_id uuid not null references products(id),
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create index idx_cart_items_user on cart_items(user_id);

-- RLS policies
alter table products enable row level security;
alter table categories enable row level security;
alter table product_images enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table cart_items enable row level security;

create policy "Products are viewable by everyone"
  on products for select using (is_active = true);

create policy "Categories are viewable by everyone"
  on categories for select using (true);

create policy "Product images are viewable by everyone"
  on product_images for select using (true);

create policy "Users can view own orders"
  on orders for select using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on orders for insert with check (auth.uid() = user_id);

create policy "Users can view own order items"
  on order_items for select using (
    exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  );

create policy "Users can manage own cart"
  on cart_items for all using (auth.uid() = user_id);
```

---

## Implementation Phases

### Phase 1: Project Scaffolding
- `pnpm create next-app@latest storefront` (App Router, TS, Tailwind, src/)
- Install all dependencies
- Init shadcn/ui (output to `src/presentation/components/ui/`)
- Configure ESLint 9 flat config with layer-based import ordering
- Configure Prettier (no semi, single quotes, no trailing comma)
- Configure Husky + lint-staged + commitlint
- Configure Vitest
- Set up `.env.example`, `next.config.ts`
- Create full directory structure

### Phase 2: Shared + Domain Layers
- Port Either monad from old project (rename Error/Success → Left/Right)
- Create DomainError base class + concrete errors
- Create all entity types and repository interfaces
- Create query-adapter and format-currency utils

### Phase 3: Infrastructure Layer (can parallelize with Phase 4)
- Supabase server/browser client factories
- Stripe server instance
- All repository implementations (product, category, order, cart, auth, payment)
- Factory functions for server-side composition
- Error mappers (Supabase → DomainError)

### Phase 4: Application Layer (can parallelize with Phase 3)
- All use case classes with namespace types
- GetProducts, GetProductBySlug, SearchProducts
- GetCategories
- CreateOrder, GetOrders, GetOrderById
- SyncCart, LoadCart
- SignIn, SignUp, SignOut, GetSession
- CreateCheckoutSession

### Phase 5: Database + Seeding
- Supabase migration with full schema
- Seed script: create categories, create Stripe products/prices, insert products with images
- Generate TypeScript types from Supabase

### Phase 6: Server Actions + Main Layer
- Server Actions for auth, orders, cart sync, payment
- Client-side providers (QueryProvider, AuthProvider, CartProvider, AppProvider)
- Wire providers into root layout

### Phase 7: Presentation Layer
- Layout: header (with search bar, cart icon, user menu), footer
- Products page: server-rendered grid + filters sidebar (URL-based state)
- Product detail page: image gallery, add-to-cart button, recommendations
- Cart: Zustand store, cart sheet (shadcn Sheet), cart items list
- Auth: login/register forms calling server actions
- Checkout: cart review + Stripe redirect
- Orders: order history list + detail pages
- Success: payment confirmation + cart clearing

### Phase 8: Stripe Webhook
- Route handler for `checkout.session.completed`
- Update order status to `paid`

### Phase 9: Testing
- Unit tests for use cases with mock repositories
- Either monad + query adapter tests
- Component tests for cart, search, forms

### Phase 10: Polish
- Framer Motion animations (cart sheet, page transitions, product hover)
- Skeleton loading states (`loading.tsx`)
- Error boundaries (`error.tsx`)
- SEO metadata (`generateMetadata`)
- Optimistic cart updates

---

## Data Flow Examples

### Server Component (product listing)

```
URL with searchParams
  → app/products/page.tsx (Server Component)
  → makeProductRepository() (factory, creates Supabase server client)
  → new GetProducts(repository).execute(params)
  → repository queries Supabase
  → returns Either<DomainError, PaginatedProducts>
  → Server Component checks isError/isSuccess
  → renders ProductGrid with data
```

### Client mutation (add to cart)

```
User clicks "Add to Cart"
  → add-to-cart-button.tsx (Client Component)
  → useCartStore().increaseItemAmount(product)
  → Zustand updates state instantly
  → cart-sheet re-renders with new item
  → (if logged in) debounced syncCartAction server action
  → server action calls CartRepository.syncCart()
```

### Checkout flow

```
User clicks "Pay" on checkout page
  → checkout-form.tsx calls createCheckoutSessionAction(cartItems)
  → Server Action: creates pending order + Stripe session
  → Returns { url: stripe_checkout_url }
  → Client redirects to Stripe Checkout
  → Stripe redirects to /success?session_id=...
  → Stripe webhook fires → order updated to 'paid'
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Verification

1. `pnpm dev` — app runs without errors
2. Browse products with search, category filter, price filter, sorting
3. Add/remove items from cart, verify persistence across refresh
4. Register/login with email, verify protected routes redirect
5. Complete checkout flow → Stripe → success page → order in history
6. `pnpm test` — all tests pass
7. `pnpm build` — production build succeeds
8. `pnpm lint` — no lint errors
