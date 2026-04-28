create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  user_email text,
  product_title text not null,
  product_category text not null,
  product_image text,
  unit_price numeric(10,2) not null,
  quantity integer not null check (quantity > 0),
  total_price numeric(10,2) not null,
  payment_method text not null check (payment_method in ('card', 'paypal')),
  provider_order_id text,
  provider_session_id text,
  status text not null default 'pending_payment',
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.orders add column if not exists provider_order_id text;
alter table public.orders add column if not exists provider_session_id text;
alter table public.orders add column if not exists user_email text;
alter table public.orders add column if not exists unread_for_admin integer not null default 0;
alter table public.orders add column if not exists unread_for_buyer integer not null default 0;
alter table public.orders add column if not exists last_message_at timestamptz;
alter table public.orders add column if not exists last_message_preview text;
alter table public.orders add column if not exists last_message_author_role text;

create table if not exists public.order_messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  user_email text,
  author_role text not null check (author_role in ('admin', 'buyer')),
  message text not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.orders enable row level security;
alter table public.order_messages enable row level security;

drop policy if exists "Users can read their own orders" on public.orders;
create policy "Users can read their own orders"
on public.orders
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own orders" on public.orders;
create policy "Users can insert their own orders"
on public.orders
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can read their own messages" on public.order_messages;
create policy "Users can read their own messages"
on public.order_messages
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own messages" on public.order_messages;
create policy "Users can insert their own messages"
on public.order_messages
for insert
to authenticated
with check (auth.uid() = user_id);
