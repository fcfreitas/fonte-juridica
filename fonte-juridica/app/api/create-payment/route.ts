import { NextResponse } from 'next/server';
import { MercadoPagoConfig } from 'mercadopago';
import { Preference } from 'mercadopago/dist/clients/preference';

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

const preference = new Preference(mercadopago);

type Plano = 'mensal' | 'semestral' | 'anual';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const plano = body.plano as Plano;

    const planos: Record<Plano, { title: string; price: number }> = {
      mensal: { title: 'Assinatura Mensal', price: 29.9 },
      semestral: { title: 'Assinatura Semestral', price: 149.9 },
      anual: { title: 'Assinatura Anual', price: 279.9 },
    };

    if (!plano || !(plano in planos)) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    const preferenceData = {
      items: [
        {
          id: plano,
          title: planos[plano].title,
          quantity: 1,
          unit_price: planos[plano].price,
          currency_id: 'BRL',
        },
      ],
      back_urls: {
        success: `${process.env.NEXTAUTH_URL}/assinatura/sucesso`,
        failure: `${process.env.NEXTAUTH_URL}/assinatura/erro`,
      },
      auto_return: 'approved',
      metadata: { plano },
    };

    const response = await preference.create({ body: preferenceData });

    return NextResponse.json({ init_point: response.init_point }, { status: 200 });
  } catch (error: any) {
    console.error('[MERCADO_PAGO_CREATE_PAYMENT_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}