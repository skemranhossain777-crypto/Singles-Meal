
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const isConfigured = Boolean(
  url &&
  key &&
  !url.includes("YOUR_PROJECT") &&
  !key.includes("YOUR_SUPABASE_ANON_KEY")
);

export const supabase = isConfigured ? createClient(url!, key!) : null;
export const hasSupabase = Boolean(supabase);


