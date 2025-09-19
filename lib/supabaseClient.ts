import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lazily create the client ONLY when you need it.
// This prevents build-time crashes when env vars are not set yet.
export function getSupabaseClient() {
  if (!url || !anon) {
    throw new Error('Supabase client requested but env vars are missing.');
  }
  return createClient(url, anon);
}
