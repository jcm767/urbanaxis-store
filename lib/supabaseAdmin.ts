// lib/supabaseAdmin.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

function noop(): any {
  return {
    from() {
      return {
        upsert: async () => ({ data: null, error: null }),
        insert: async () => ({ data: null, error: null }),
        update: async () => ({ data: null, error: null }),
        select: async () => ({ data: null, error: null }),
      };
    },
  };
}

export const supabaseAdmin: SupabaseClient | any =
  url && serviceRole
    ? createClient(url, serviceRole, { auth: { persistSession: false } })
    : noop();

export default supabaseAdmin;
