import { connectToDb } from "@/app/api/db";
import { NextResponse } from "next/server";
import { MercadoPagoConfig } from "mercadopago";
import { PreApproval } from "mercadopago/dist/clients/preApproval";
import { Payment } from "mercadopago/dist/clients/payment";

interface PreApprovalWithMetadata {
  id: string;
  status: string;
  date_created: string;
  next_payment_date?: string;
  reason?: string;
  auto_recurring?: {
    frequency: number;
    frequency_type: string;
    transaction_amount: number;
    currency_id: string;
    start_date: string;
    end_date?: string;
  };
  back_url?: string;
  payer_email?: string;
  external_reference?: string;
  metadata?: {
    userId: string;
    plano: string;
  };
}


const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

const preapproval = new PreApproval(mercadopago);
const payment = new Payment(mercadopago);

export async function POST(req: Request) {
  const rawBody = await req.text();
  const params = new URLSearchParams(rawBody);

  const type = params.get("type");
  const dataId = params.get("data.id");

  console.log("[WEBHOOK RECEBIDO]", { type, dataId });

  try {
    if (type === "preapproval") {
      const preapprovalId = dataId!;
      const result = await preapproval.get({ id: preapprovalId }) as PreApprovalWithMetadata & {
        metadata?: {
          userId: string;
          plano: string;
        };
      };

      const userId = result.metadata?.userId;
      const plano = result.metadata?.plano;

      if (!userId) {
        console.warn("[PREAPPROVAL] userId ausente no metadata");
        return NextResponse.json({ error: "Usuário não identificado" }, { status: 400 });
      }

      const { db } = await connectToDb();

      await db.collection("assinaturas").updateOne(
        { userId },
        {
          $set: {
            plano,
            ativo: true,
            preapprovalId,
            criadoEm: new Date(),
          },
        },
        { upsert: true }
      );

      console.log("[PREAPPROVAL] Assinatura registrada com sucesso");
      return NextResponse.json({ status: "preapproval salvo" });
    }

    if (type === "authorized_payment") {
      const paymentId = Number(dataId);
      const result = await payment.get({ id: paymentId });

      if (result.status !== "approved") {
        console.warn("[AUTHORIZED_PAYMENT] Pagamento não aprovado");
        return NextResponse.json({ status: "Pagamento não aprovado" });
      }

      const plano = result.metadata?.plano;
      const userId = result.metadata?.userId;

      if (!userId) {
        console.warn("[AUTHORIZED_PAYMENT] userId ausente no metadata");
        return NextResponse.json({ error: "Usuário não identificado" }, { status: 400 });
      }

      const { db } = await connectToDb();

      await db.collection("assinaturas").updateOne(
        { userId },
        {
          $set: {
            plano,
            ativo: true,
            atualizadoEm: new Date(),
            expiracao: calcularExpiracao(plano),
            ultimoPagamento: new Date(result.date_approved!),
          },
        },
        { upsert: true }
      );

      console.log("[AUTHORIZED_PAYMENT] Assinatura renovada com sucesso");
      return NextResponse.json({ status: "pagamento salvo" });
    }

    return NextResponse.json({ status: "evento ignorado" });
  } catch (err: any) {
    console.error("[ERRO MERCADO PAGO WEBHOOK]", err);
    return NextResponse.json({ error: err.message || "Erro interno" }, { status: 500 });
  }
}

function calcularExpiracao(plano: string): Date {
  const hoje = new Date();
  switch (plano) {
    case "mensal":
      hoje.setMonth(hoje.getMonth() + 1);
      break;
    case "semestral":
      hoje.setMonth(hoje.getMonth() + 6);
      break;
    case "anual":
      hoje.setFullYear(hoje.getFullYear() + 1);
      break;
    default:
      hoje.setMonth(hoje.getMonth() + 1);
  }
  return hoje;
}
