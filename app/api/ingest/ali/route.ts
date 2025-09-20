// app/api/ingest/ali/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// very safe slugify
function slugify(s: string) {
  return String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

// naive category inference
function inferCategory(s: string): 'tops'|'bottoms'|'jackets'|'accessories' {
  const x = s.toLowerCase();
  if (/(jacket|puffer|coat|outerwear|parka|bomber|windbreaker)/.test(x)) return 'jackets';
  if (/(jean|denim|pant|trouser|bottom|short|cargo|skirt)/.test(x)) return 'bottoms';
  if (/(hoodie|sweater|sweatshirt|pullover|zip|t[-\s]?shirt|tee|shirt|top|blouse|tank|knit)/.test(x)) return 'tops';
  if (/(belt|hat|cap|beanie|bag|scarf|sunglass|glasses|jewel|ring|necklace|bracelet)/.test(x)) return 'accessories';
  return 'tops';
}

// scrape image URLs from AliExpress HTML (og:image + any ae-pic URLs)
function extractImages(html: string): string[] {
  const out = new Set<string>();
  const og = [...html.matchAll(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi)].map(m=>m[1]);
  og.forEach(u=>out.add(u));
  const ae = [...html.matchAll(/https:\/\/ae-pic-[^"'\s]+\.avif/gi)].map(m=>m[0]);
  ae.forEach(u=>out.add(u));
  const jpg = [...html.matchAll(/https:\/\/ae-pic-[^"'\s]+\.(?:jpg|jpeg|png)/gi)].map(m=>m[0]);
  jpg.forEach(u=>out.add(u));
  return Array.from(out).slice(0,8);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = String(body?.url || '');
    const title = String(body?.title || '');
    const price = Number(body?.price || 0);
    const gender = body?.gender ? String(body.gender) as any : null;
    let category = (body?.category as any) || null;
    const tags = Array.isArray(body?.tags) ? body.tags : [];

    if (!url || !title || !price) {
      return NextResponse.json({ ok:false, error:'missing-fields' }, { status: 200 });
    }

    // fetch AliExpress page
    const res = await fetch(url, { cache: 'no-store' });
    const html = await res.text();

    // gather images/colors (simplified: single "default" color; can expand later)
    const imgs = extractImages(html);
    const colors = body?.colors && Array.isArray(body.colors) && body.colors.length ? body.colors : ['default'];
    const imagesByColor: Record<string,string[]> = { [colors[0]]: imgs };

    const cat = category ?? inferCategory(title + ' ' + html);
    const slug = slugify(title);

    const row = {
      title,
      slug,
      price,
      category: cat,
      gender,
      tags,
      colors,
      imagesByColor,
      image: imgs[0] ?? null,
      description: body?.description ?? null,
      source_url: url,
      published: true
    };

    const { error } = await supabaseAdmin.from('products').upsert(row, { onConflict: 'slug' });
    if (error) {
      console.error('insert error', error.message);
      return NextResponse.json({ ok:false, error:'db-error' }, { status: 200 });
    }
    return NextResponse.json({ ok:true, slug, preview: row });
  } catch (e) {
    console.error('ingest error', e);
    return NextResponse.json({ ok:false, error:'server-error' }, { status: 200 });
  }
}
