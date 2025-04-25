import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // ajuste o path conforme o local do seu arquivo authOptions

type Plano = 'mensal' | 'semestral' | 'anual';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id || !session.user.email) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const plano = body.plano as Plano;

    const planos: Record<Plano, {
      reason: string;
      amount: number;
      frequency: number;
      frequency_type: 'months' | 'years';
    }> = {
      mensal: {
        reason: 'Assinatura Mensal',
        amount: 29.9,
        frequency: 1,
        frequency_type: 'months',
      },
      semestral: {
        reason: 'Assinatura Semestral',
        amount: 149.9,
        frequency: 6,
        frequency_type: 'months',
      },
      anual: {
        reason: 'Assinatura Anual',
        amount: 279.9,
        frequency: 1,
        frequency_type: 'years',
      },
    };

    const planoData = planos[plano];

    if (!planoData) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    const response = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason: planoData.reason,
        auto_recurring: {
          frequency: planoData.frequency,
          frequency_type: planoData.frequency_type,
          transaction_amount: planoData.amount,
          currency_id: 'BRL',
          start_date: new Date().toISOString(),
          end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString(), // assinatura válida por 5 anos
        },
        back_url: `${process.env.NEXT_PUBLIC_SITE_URL}/assinatura/sucesso`,
        payer_email: session.user.email,
        external_reference: session.user.id,
        metadata: {
          plano,
          userId: session.user.id,
        },
      }),
    });

    const data = await response.json();
    console.error('Erro Mercado Pago:', response.status, data);

    if (!response.ok) {
      console.error('[MERCADO_PAGO_ERROR]', data);
      return NextResponse.json({ error: 'Erro ao criar assinatura' }, { status: 500 });
    }

    return NextResponse.json({ init_point: data.init_point }, { status: 200 });

  } catch (error: any) {
    console.error('[CREATE_PAYMENT_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}
