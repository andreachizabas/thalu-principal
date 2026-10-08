create table if not exists beauty_services (
  id uuid primary key default gen_random_uuid(), name text not null, description text not null default '', category text not null,
  image_url text not null default '', price_cents bigint check (price_cents is null or price_cents >= 0), currency char(3) not null default 'COP',
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0), active boolean not null default true, sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists beauty_service_requests (
  id uuid primary key, full_name text not null, phone text not null, city text not null check (city in ('Manizales', 'Villamaría')),
  address text not null, neighborhood text not null, service_id uuid not null references beauty_services(id), preferred_date date, preferred_time time,
  notes text not null default '', status text not null default 'Nueva', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists idx_beauty_service_requests_status on beauty_service_requests(status);
create unique index if not exists idx_beauty_services_name on beauty_services(name);

insert into beauty_services (name, description, category, image_url, currency, sort_order)
values
  ('Manicure tradicional', 'Arreglo y esmaltado de uñas de las manos.', 'Uñas', '/images/thalu-beauty.png', 'COP', 1),
  ('Uñas semipermanentes', 'Aplicación de esmalte semipermanente en las manos.', 'Uñas', '/images/thalu-makeup.png', 'COP', 2),
  ('Uñas Press On', 'Aplicación de uñas Press On.', 'Uñas', '/images/thalu-lipstick.png', 'COP', 3),
  ('Semipermanente en pies', 'Esmaltado semipermanente para uñas de los pies.', 'Uñas', '/images/thalu-blossom.png', 'COP', 4),
  ('Cepillado de cabello', 'Cepillado y peinado mediante herramientas apropiadas.', 'Cuidado capilar', '/images/thalu-beauty.png', 'COP', 5),
  ('Planchado de cabello', 'Alisado temporal y acabado mediante plancha de cabello.', 'Cuidado capilar', '/images/thalu-hair-mask.png', 'COP', 6)
on conflict (name) do nothing;
