import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: Request) {
  const { userId, email } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: email,
    line_items: [
      {
        price: "price_1RM8xFEAMiX09CraovsIbNYO", // Substitua pelo seu real price_id
        quantity: 1,
      },
    ],
    locale: "pt-BR",
    success_url: process.env.NEXT_PUBLIC_SITE_URL+`/assinatura/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: process.env.NEXT_PUBLIC_SITE_URL+`/assinatura/cancelado`,
    metadata: {
      userId,
    },
  });

  return NextResponse.json({ url: session.url });
}
