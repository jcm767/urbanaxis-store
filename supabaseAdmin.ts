// Simple admin client placeholder (not used at build time)
import { createClient } from '@supabase/supabase-js';

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !service) throw new Error('Missing Supabase env vars');
  return createClient(url, service, { auth: { persistSession: false } });
}
