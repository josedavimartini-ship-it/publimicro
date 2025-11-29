import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripeClient";

interface CheckoutRequestBody {
  price: number;
  anuncioId?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: CheckoutRequestBody = await req.json();

    const { price, successUrl, cancelUrl } = body;

    if (!price || isNaN(price)) {
      return NextResponse.json({ error: "Preço inválido" }, { status: 400 });
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured on server' }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { name: "Destaque de anúncio" },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || "http://localhost:3000/",
      cancel_url: cancelUrl || "http://localhost:3000/",
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro desconhecido ao criar checkout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
