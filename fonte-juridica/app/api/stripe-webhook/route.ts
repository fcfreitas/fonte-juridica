import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDb } from "../db";
import { ObjectId } from "mongodb";

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
    console.error("Erro ao verificar assinatura do webhook:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  console.log("Evento recebido:", event.type);

  const { db } = await connectToDb();
  console.log("Conectado ao MongoDB");

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    console.log("Metadata userId recebido:", userId);
    console.log("Subscription ID recebido:", session.subscription);

    if (userId && session.subscription) {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        ) as Stripe.Subscription;
        
        const expireDate = subscription.ended_at ;
        
  
        const result = await db.collection("user").updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              pagante: true,
              stripeSubscriptionId: session.subscription,
              expireDate: expireDate, // timestamp UNIX
            },
          }
        );
  
        console.log("Resultado da atualização:", result);
      } catch (error) {
        console.error("Erro ao buscar assinatura ou atualizar usuário:", error);
      }
    } else {
      console.warn("userId ou subscription ausentes");
    }
  }

  return NextResponse.json({ received: true });
}