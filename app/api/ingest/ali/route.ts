// app/api/ingest/ali/route.ts
// Extract image URLs from a fetched AliExpress product HTML snippet.
// Uses Array.from(matchAll(...)) to avoid --downlevelIteration requirement.

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const html: string = typeof body?.html === 'string' ? body.html : '';

    if (!html) {
      return NextResponse.json({ error: 'Missing html' }, { status: 400 });
    }

    // Common patterns: og:image meta tags, and direct image URLs (avif/jpg/jpeg/png)
    const og = Array.from(
      html.matchAll(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/gi),
      (m) => m[1]
    );

    const avif = Array.from(
      html.matchAll(/https?:\/\/[^\s"'<>]+\.avif/gi),
      (m) => m[0]
    );
    const jpg = Array.from(
      html.matchAll(/https?:\/\/[^\s"'<>]+\.jpe?g/gi),
      (m) => m[0]
    );
    const png = Array.from(
      html.matchAll(/https?:\/\/[^\s"'<>]+\.png/gi),
      (m) => m[0]
    );

    // Deduplicate while preserving order
    const out: string[] = [];
    const seen = new Set<string>();
    for (const u of [...og, ...avif, ...jpg, ...png]) {
      if (!seen.has(u)) {
        seen.add(u);
        out.push(u);
      }
    }

    return NextResponse.json({ images: out });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Unexpected error', details: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
