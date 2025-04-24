
import { connectToDb } from "@/app/api/db"; // sua função de conexão

import { NextResponse } from 'next/server';
import { MercadoPagoConfig } from 'mercadopago';
import { Payment } from 'mercadopago/dist/clients/payment';

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

// Cria o client de pagamento
const payment = new Payment(mercadopago);

export async function POST(req: Request) {
  const body = await req.json();

  if (body.type === 'payment') {
    const paymentId = Number(body.data.id); // o ID precisa ser número

    try {
      const result = await payment.get({ id: paymentId });

      if (result.status === 'approved') {
        const plano = result.metadata?.plano;
        const userId = result.metadata?.userId;

        if (!userId) {
          return NextResponse.json({ error: 'Usuário não identificado' }, { status: 400 });
        }

        const { db } = await connectToDb();

        await db.collection('assinaturas').updateOne(
          { userId },
          {
            $set: {
              ativo: true,
              plano,
              atualizadoEm: new Date(),
              expiracao: calcularExpiracao(plano),
            },
          },
          { upsert: true }
        );
      }

      return NextResponse.json({ status: 'ok' });
    } catch (err: any) {
      return NextResponse.json({ error: err.message || 'Erro ao processar pagamento' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

function calcularExpiracao(plano: string): Date {
  const hoje = new Date();
  switch (plano) {
    case 'mensal':
      hoje.setMonth(hoje.getMonth() + 1);
      break;
    case 'semestral':
      hoje.setMonth(hoje.getMonth() + 6);
      break;
    case 'anual':
      hoje.setFullYear(hoje.getFullYear() + 1);
      break;
  }
  return hoje;
}
