# Urban Axis Next.js Starter (Build-Proof)

This is a minimal App Router project that **builds on Vercel** and includes:
- `app/api/checkout/route.ts` (creates a Checkout Session)
- `app/api/stripe-webhook/route.ts` (verifies webhooks; ready to extend)
- `vercel.json` redirect for www → apex (no next.config.js needed)

## Required env vars (set in Vercel)
NEXT_PUBLIC_SITE_URL=https://your-deployment-url
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

Optional (for Supabase admin later):
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

## Deploy
1. Push to GitHub.
2. Import to Vercel.
3. Set env vars → Redeploy.
4. Open `/` and click **Buy**.
