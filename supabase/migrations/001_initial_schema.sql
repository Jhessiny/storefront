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
