create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_title text not null,
  product_category text not null,
  product_image text,
  unit_price numeric(10,2) not null,
  quantity integer not null check (quantity > 0),
  total_price numeric(10,2) not null,
  payment_method text not null check (payment_method in ('card', 'paypal')),
  status text not null default 'pending_payment',
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.orders enable row level security;

create policy "Users can read their own orders"
on public.orders
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own orders"
on public.orders
for insert
to authenticated
with check (auth.uid() = user_id);
