create extension if not exists pgcrypto;

create table if not exists administrators (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  role text not null default 'admin',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references categories(id),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id),
  brand_id uuid not null references brands(id),
  slug text not null unique,
  sku text not null unique,
  name text not null,
  short_description text not null default '',
  description text not null default '',
  benefits text not null default '',
  ingredients text not null default '',
  usage_instructions text not null default '',
  precautions text not null default '',
  presentation text not null default '',
  price_cents bigint not null check (price_cents >= 0),
  currency char(3) not null default 'COP',
  featured boolean not null default false,
  active boolean not null default true,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt text not null default '',
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists inventory (
  product_id uuid primary key references products(id) on delete cascade,
  available_stock integer not null default 0 check (available_stock >= 0),
  reserved_stock integer not null default 0 check (reserved_stock >= 0),
  low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id),
  quantity integer not null,
  reason text not null,
  reference text,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  status text not null default 'pendiente_pago',
  subtotal_cents bigint not null default 0 check (subtotal_cents >= 0),
  discount_cents bigint not null default 0 check (discount_cents >= 0),
  shipping_cents bigint not null default 0 check (shipping_cents >= 0),
  total_cents bigint not null default 0 check (total_cents >= 0),
  currency char(3) not null default 'COP',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity integer not null check (quantity > 0),
  unit_price_cents bigint not null check (unit_price_cents >= 0),
  total_cents bigint not null check (total_cents >= 0)
);

create table if not exists order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id),
  provider text not null,
  provider_reference text not null unique,
  status text not null default 'pending',
  amount_cents bigint not null check (amount_cents >= 0),
  currency char(3) not null default 'COP',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists payment_events (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references payments(id),
  provider text not null,
  event_id text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  unique (provider, event_id)
);

create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text not null default '',
  discount_type text not null,
  discount_value integer not null check (discount_value > 0),
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists shipping_zones (
  id uuid primary key default gen_random_uuid(),
  department text not null,
  city text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (department, city)
);

create table if not exists shipping_rates (
  id uuid primary key default gen_random_uuid(),
  zone_id uuid not null references shipping_zones(id) on delete cascade,
  carrier text not null,
  price_cents bigint not null check (price_cents >= 0),
  free_from_cents bigint,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists self_esteem_messages (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists store_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_featured on products(featured) where active = true;
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_payments_status on payments(status);

insert into categories (name, slug)
values
  ('Maquillaje', 'maquillaje'),
  ('Skincare', 'skincare'),
  ('Cuidado capilar', 'cuidado-capilar')
on conflict (slug) do nothing;

insert into brands (name)
values ('ThaLu Curated'), ('Ritual Botanico'), ('Cuidado Esencial')
on conflict (name) do nothing;

with product_seed as (
  select
    c.id as category_id,
    b.id as brand_id,
    seed.slug,
    seed.sku,
    seed.name,
    seed.short_description,
    seed.price_cents,
    seed.tags,
    seed.image_url
  from (
    values
      ('maquillaje', 'ThaLu Curated', 'labial-satinado-rosa', 'THA-MAQ-001', 'Labial satinado Rosa Suave', 'Color cremoso de acabado satinado para acompanar rutinas de dia y noche.', 4800000::bigint, array['Nuevo','Favorito']::text[], 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80'),
      ('skincare', 'Ritual Botanico', 'serum-luminoso-facial', 'THA-SKI-001', 'Serum luminoso facial', 'Textura ligera para una rutina facial delicada y una piel con apariencia fresca.', 9200000::bigint, array['Skincare','Ritual']::text[], 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80'),
      ('cuidado-capilar', 'Cuidado Esencial', 'mascarilla-capilar-nutritiva', 'THA-CAP-001', 'Mascarilla capilar nutritiva', 'Tratamiento cosmetico para acompanar el brillo y la suavidad del cabello.', 7600000::bigint, array['Capilar','Kit']::text[], 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80')
  ) as seed(category_slug, brand_name, slug, sku, name, short_description, price_cents, tags, image_url)
  join categories c on c.slug = seed.category_slug
  join brands b on b.name = seed.brand_name
),
inserted_products as (
  insert into products (category_id, brand_id, slug, sku, name, short_description, price_cents, featured, tags)
  select category_id, brand_id, slug, sku, name, short_description, price_cents, true, tags
  from product_seed
  on conflict (slug) do update set
    short_description = excluded.short_description,
    price_cents = excluded.price_cents,
    featured = excluded.featured,
    tags = excluded.tags,
    updated_at = now()
  returning id, slug
)
insert into product_images (product_id, url, alt, is_primary)
select p.id, s.image_url, s.name, true
from inserted_products p
join product_seed s on s.slug = p.slug
on conflict do nothing;

insert into inventory (product_id, available_stock, low_stock_threshold)
select id, 12, 4 from products
on conflict (product_id) do nothing;

insert into self_esteem_messages (message)
values
  ('Tu belleza es unica, igual que tu historia.'),
  ('Nunca olvides lo valiosa que eres.'),
  ('Dedicarte tiempo tambien es una forma de quererte.'),
  ('Brilla siendo tu misma, a tu manera.'),
  ('Tu autenticidad es tu mayor encanto.')
on conflict do nothing;
