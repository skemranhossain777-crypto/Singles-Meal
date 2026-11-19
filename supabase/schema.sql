
-- Singles Meal initial schema. Review policies and test with real roles before launch.
create extension if not exists pgcrypto;

create type public.user_role as enum ('customer','admin','kitchen','rider');
create type public.order_status as enum ('pending_payment','confirmed','preparing','ready_for_pickup','out_for_delivery','delivered','cancelled','refunded');
create type public.subscription_status as enum ('pending','active','paused','cancelled','expired');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role public.user_role not null default 'customer',
  locale text not null default 'en' check (locale in ('en','bn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.health_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  goal text,
  activity_level text,
  height_cm numeric,
  weight_kg numeric,
  date_of_birth date,
  diet_preference text,
  consent_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.customer_allergies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  allergen text not null,
  severity text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  allergen_tags text[] not null default '{}',
  unit text not null default 'g',
  created_at timestamptz not null default now()
);

create table public.meals (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  name_bn text,
  description text,
  category text not null check (category in ('Breakfast','Lunch','Dinner','Snack','Dessert')),
  price_bdt integer not null check (price_bdt >= 0),
  calories integer not null default 0 check (calories >= 0),
  protein_g numeric not null default 0,
  carbs_g numeric not null default 0,
  fat_g numeric not null default 0,
  image_url text,
  tags text[] not null default '{}',
  allergens text[] not null default '{}',
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id),
  quantity numeric not null check (quantity > 0),
  unit text not null,
  unique(meal_id, ingredient_id)
);

create table public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  billing_period text not null check (billing_period in ('daily','weekly','monthly')),
  base_price_bdt integer not null check (base_price_bdt >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  plan_id uuid not null references public.meal_plans(id),
  status public.subscription_status not null default 'pending',
  starts_on date not null,
  ends_on date,
  delivery_address text not null,
  preferences jsonb not null default '{}',
  next_billing_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  status public.order_status not null default 'pending_payment',
  customer_name text not null,
  customer_phone text not null,
  delivery_address text not null,
  delivery_slot text not null,
  subtotal_bdt integer not null check (subtotal_bdt >= 0),
  delivery_fee_bdt integer not null default 0 check (delivery_fee_bdt >= 0),
  total_bdt integer generated always as (subtotal_bdt + delivery_fee_bdt) stored,
  payment_reference text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  meal_id uuid references public.meals(id),
  meal_name_snapshot text not null,
  quantity integer not null check (quantity > 0),
  unit_price_bdt integer not null check (unit_price_bdt >= 0),
  calories_snapshot integer not null default 0
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id),
  provider text not null,
  provider_transaction_id text unique,
  amount_bdt integer not null check (amount_bdt >= 0),
  status text not null check (status in ('initiated','pending','paid','failed','refunded')),
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id),
  rider_id uuid references public.profiles(id),
  status text not null default 'unassigned',
  estimated_delivery_at timestamptz,
  delivered_at timestamptz,
  delivery_notes text
);

create table public.food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  meal_id uuid references public.meals(id),
  meal_name text not null,
  calories integer not null default 0,
  protein_g numeric not null default 0,
  carbs_g numeric not null default 0,
  fat_g numeric not null default 0,
  consumed_at timestamptz not null default now(),
  source text not null default 'manual' check (source in ('manual','order','wearable'))
);

create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  ingredient_id uuid not null references public.ingredients(id),
  quantity numeric not null default 0,
  unit text not null,
  expiry_date date,
  updated_at timestamptz not null default now()
);

create table public.kitchen_batches (
  id uuid primary key default gen_random_uuid(),
  batch_date date not null,
  meal_id uuid not null references public.meals(id),
  planned_portions integer not null default 0,
  completed_portions integer not null default 0,
  status text not null default 'planned',
  cutoff_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  meal_id uuid references public.meals(id),
  order_id uuid references public.orders(id),
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Profile creation trigger.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.phone)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role in ('admin','kitchen','rider'));
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

alter table public.profiles enable row level security;
alter table public.health_profiles enable row level security;
alter table public.customer_allergies enable row level security;
alter table public.ingredients enable row level security;
alter table public.meals enable row level security;
alter table public.recipes enable row level security;
alter table public.meal_plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.deliveries enable row level security;
alter table public.food_logs enable row level security;
alter table public.inventory enable row level security;
alter table public.kitchen_batches enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;

create policy "profiles own or admin read" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles own update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "health own read" on public.health_profiles for select using (user_id = auth.uid() or public.is_admin());
create policy "health own write" on public.health_profiles for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "allergies own access" on public.customer_allergies for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "meals public read" on public.meals for select using (is_available = true or public.is_staff());
create policy "meals admin manage" on public.meals for all using (public.is_admin()) with check (public.is_admin());
create policy "ingredients staff read" on public.ingredients for select using (auth.uid() is not null);
create policy "ingredients admin manage" on public.ingredients for all using (public.is_admin()) with check (public.is_admin());
create policy "recipes staff read" on public.recipes for select using (public.is_staff());
create policy "recipes admin manage" on public.recipes for all using (public.is_admin()) with check (public.is_admin());
create policy "plans public read" on public.meal_plans for select using (is_active = true or public.is_staff());
create policy "plans admin manage" on public.meal_plans for all using (public.is_admin()) with check (public.is_admin());
create policy "subscriptions own or staff read" on public.subscriptions for select using (customer_id = auth.uid() or public.is_staff());
create policy "subscriptions own create" on public.subscriptions for insert with check (customer_id = auth.uid());
create policy "subscriptions admin update" on public.subscriptions for update using (public.is_admin()) with check (public.is_admin());
create policy "orders own or staff read" on public.orders for select using (customer_id = auth.uid() or public.is_staff());
create policy "orders own create" on public.orders for insert with check (customer_id = auth.uid());
create policy "orders staff update" on public.orders for update using (public.is_staff()) with check (public.is_staff());
create policy "order items own or staff read" on public.order_items for select using (exists(select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or public.is_staff())));
create policy "order items own create" on public.order_items for insert with check (exists(select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid() and o.status = 'pending_payment'));
create policy "payments own or staff read" on public.payments for select using (exists(select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or public.is_staff())));
create policy "payments admin manage" on public.payments for all using (public.is_admin()) with check (public.is_admin());
create policy "deliveries staff read" on public.deliveries for select using (public.is_staff() or exists(select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid()));
create policy "deliveries admin manage" on public.deliveries for all using (public.is_admin()) with check (public.is_admin());
create policy "food logs own access" on public.food_logs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "inventory staff read" on public.inventory for select using (public.is_staff());
create policy "inventory admin manage" on public.inventory for all using (public.is_admin()) with check (public.is_admin());
create policy "batches staff read" on public.kitchen_batches for select using (public.is_staff());
create policy "batches staff update" on public.kitchen_batches for update using (public.is_staff()) with check (public.is_staff());
create policy "reviews public read" on public.reviews for select using (true);
create policy "reviews customer create" on public.reviews for insert with check (customer_id = auth.uid());
create policy "notifications own access" on public.notifications for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Starter meal catalog. Replace sample nutrition with recipe-calculated verified values.
insert into public.meals (slug,name,name_bn,description,category,price_bdt,calories,protein_g,carbs_g,fat_g,image_url,tags,allergens)
values
('grilled-chicken-power-bowl','Grilled Chicken Power Bowl','গ্রিলড চিকেন পাওয়ার বোল','Grilled chicken, brown rice, seasonal greens and lemon dressing.','Lunch',390,480,38,46,14,'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900',array['High protein','Balanced'],array[]::text[]),
('garden-egg-avocado-toast','Garden Egg & Avocado Toast','ডিম ও অ্যাভোকাডো টোস্ট','Two eggs, wholegrain toast, avocado and fresh herbs.','Breakfast',260,350,19,31,16,'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900',array['Breakfast'],array['Egg','Gluten']),
('salmon-greens-plate','Salmon & Greens Plate','স্যালমন ও গ্রিনস প্লেট','Oven-baked salmon with greens and sweet potato.','Dinner',620,520,36,39,22,'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900',array['Omega-3','Balanced'],array['Fish','Milk']),
('mango-chia-yogurt','Mango Chia Yogurt Cup','আম ও চিয়া ইয়োগার্ট কাপ','Yogurt, chia seeds, mango and toasted nuts.','Snack',180,210,11,28,7,'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900',array['Fresh','Snack'],array['Milk','Tree nuts']),
('lentil-roasted-veg-bowl','Lentil & Roasted Veg Bowl','ডাল ও রোস্টেড ভেজ বোল','Spiced lentils, roasted vegetables and fragrant rice.','Lunch',290,430,20,64,10,'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900',array['Plant-based','Fiber'],array[]::text[]),
('banana-oat-pancakes','Banana Oat Pancakes','কলা ওট প্যানকেক','Oat pancakes with banana and yogurt.','Breakfast',240,330,13,52,8,'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=900',array['Breakfast'],array['Milk','Gluten'])
on conflict (slug) do nothing;

insert into public.meal_plans (name,description,billing_period,base_price_bdt)
values
('Daily Essentials','Flexible meals for the days you need.','daily',650),
('5-Day Balance','Weekday meal routine.','weekly',2900),
('Full Month','Monthly meal schedule; final quote based on selections.','monthly',0)
on conflict do nothing;


-- Secure order creation: prices and nutrition snapshots are read from the trusted catalog,
-- never accepted from the browser. The caller must be an authenticated customer.
create or replace function public.create_customer_order(
  p_customer_name text,
  p_customer_phone text,
  p_delivery_address text,
  p_delivery_slot text,
  p_items jsonb
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer uuid := auth.uid();
  v_order_id uuid;
  v_subtotal integer;
  v_item jsonb;
  v_meal public.meals%rowtype;
  v_qty integer;
begin
  if v_customer is null then
    raise exception 'Authentication required';
  end if;
  if coalesce(trim(p_customer_name),'') = '' or coalesce(trim(p_customer_phone),'') = ''
     or coalesce(trim(p_delivery_address),'') = '' or coalesce(trim(p_delivery_slot),'') = '' then
    raise exception 'Complete all delivery details';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Basket is empty';
  end if;

  v_subtotal := 0;
  for v_item in select value from jsonb_array_elements(p_items)
  loop
    select * into v_meal from public.meals
      where id = (v_item->>'meal_id')::uuid and is_available = true;
    if not found then raise exception 'A selected meal is unavailable'; end if;
    v_qty := (v_item->>'quantity')::integer;
    if v_qty < 1 or v_qty > 30 then raise exception 'Invalid meal quantity'; end if;
    v_subtotal := v_subtotal + (v_meal.price_bdt * v_qty);
  end loop;

  insert into public.orders(customer_id,status,customer_name,customer_phone,delivery_address,delivery_slot,subtotal_bdt)
  values(v_customer,'pending_payment',p_customer_name,p_customer_phone,p_delivery_address,p_delivery_slot,v_subtotal)
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    select * into v_meal from public.meals
      where id = (v_item->>'meal_id')::uuid and is_available = true;
    v_qty := (v_item->>'quantity')::integer;
    insert into public.order_items(order_id,meal_id,meal_name_snapshot,quantity,unit_price_bdt,calories_snapshot)
    values(v_order_id,v_meal.id,v_meal.name,v_qty,v_meal.price_bdt,v_meal.calories);
  end loop;
  return v_order_id;
end;
$$;

revoke all on function public.create_customer_order(text,text,text,text,jsonb) from public;
grant execute on function public.create_customer_order(text,text,text,text,jsonb) to authenticated;
