// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) return NextResponse.json([], { status: 200 });
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
