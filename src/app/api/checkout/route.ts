
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripeClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { price, anuncioId, successUrl, cancelUrl } = body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        { price_data: { currency: 'brl', product_data: { name: 'Destaque de anúncio' }, unit_amount: Math.round(price * 100) }, quantity: 1 }
      ],
      success_url: successUrl || 'http://localhost:3000/',
      cancel_url: cancelUrl || 'http://localhost:3000/'
    });
    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
