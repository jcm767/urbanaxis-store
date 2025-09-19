// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "@/lib/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(request: Request) {
  try {
    const { slug, size = "M", color = "Black", quantity = 1 } = await request.json();

    const product = products.find((p) => p.slug === slug);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Dollars -> cents
    const unitAmount = Math.round(product.price * 100);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      // If you want shipping addresses:
      shipping_address_collection: { allowed_countries: ["US"] },

      line_items: [
        {
          quantity,
          price_data: {
            currency: "usd",
            unit_amount: unitAmount,
            product_data: {
              name: product.name,
              images: product.image ? [product.image] : [],
              description: product.description?.slice(0, 500) || undefined,
            },
          },
        },
      ],

      // Where Stripe sends the customer after payment/cancel
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/`,

      // Save useful info so you can fulfill the order from AliExpress
      metadata: {
        slug: product.slug,
        size,
        color,
        supplierUrl: product.sourceUrl || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message ?? "Checkout error" }, { status: 500 });
  }
}
