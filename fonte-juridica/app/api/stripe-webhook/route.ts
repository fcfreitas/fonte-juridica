import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDb } from "../db";
import { ObjectId } from "mongodb";


export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const buf = await req.arrayBuffer();
  const body = Buffer.from(buf);
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const { db } = await connectToDb();

  // Eventos que nos interessam
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { pagante: true, stripeSubscriptionId: session.subscription } }
    );
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await db.collection("users").updateOne(
      { stripeSubscriptionId: subscription.id },
      { $set: { pagante: false } }
    );
  }

  return NextResponse.json({ received: true });
}
