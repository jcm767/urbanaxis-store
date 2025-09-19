// app/api/stripe-webhook/route.ts
import { NextResponse } from "next/server";

// Temporary no-op webhook so builds don't fail.
// We'll wire this up later after envs are in place.
export async function POST() {
  return NextResponse.json({ received: true });
}

export async function GET() {
  return new Response("ok");
}
