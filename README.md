# Urban Axis Store

Next.js (App Router) + Supabase + Stripe + Vercel.

## Dev
- `npm install`
- `npm run dev` — start locally
- `npm run build` — production build
- `npm start` — run production build

## Environment Variables (Vercel → Project → Settings → Environment Variables)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`  *(server only)*
- `NEXT_PUBLIC_SITE_URL`  *(use your .vercel.app while testing; later https://theurbanaxis.com)*
- `STRIPE_SECRET_KEY`  *(test or live)*
- `STRIPE_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET`

## API Routes
- `POST /api/checkout` → creates Stripe Checkout session
- `POST /api/stripe-webhook` → handles `checkout.session.completed`, `charge.refunded`

## Notes
- Keep `node_modules/` out of git (`.gitignore`).
- Use Git LFS **only for media** (png/jpg/gif/mp4), not code.

