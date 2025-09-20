// app/api/cart-sync/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = Array.isArray(body?.items) ? body.items : [];
    const user_id = body?.user_id ?? null;

    // If no user, do nothing (anonymous carts stay in localStorage)
    if (!user_id) return NextResponse.json({ ok: true, skipped: 'no-user' });

    // Upsert into a simple carts table { user_id uuid PK, items jsonb, updated_at timestamptz }
    const { error } = await supabaseAdmin
      .from('carts')
      .upsert({ user_id, items, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });

    if (error) {
      console.error('cart-sync upsert error', error.message);
      return NextResponse.json({ ok: false, error: 'db-error' }, { status: 200 }); // soft fail
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('cart-sync error', e);
    return NextResponse.json({ ok: false }, { status: 200 }); // soft fail
  }
}
