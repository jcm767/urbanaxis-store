import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Lazily create the admin client ONLY when needed.
export function getSupabaseAdmin() {
  if (!url || !key) {
    throw new Error('Supabase admin requested but env vars are missing.');
  }
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
