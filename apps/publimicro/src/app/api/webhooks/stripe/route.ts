import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import type Stripe from 'stripe';

// Desabilitar parsing do body para webhooks
export const runtime = "nodejs";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Assinatura ausente" },
        { status: 400 }
      );
    }

    // Verificar assinatura do webhook
    let event;
    try {
      const stripe = getStripe();
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Erro ao verificar webhook:", err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Processar evento
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { listingId, productType, userId } = session.metadata;

      console.log("Pagamento recebido:", {
        listingId,
        productType,
        userId,
        amount: session.amount_total / 100,
      });

      // Criar cliente Supabase com service role (pode atualizar qualquer row)
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Calculate expiration date (30 days)
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Atualizar listing com base no tipo de produto
      if (productType === "destaque") {
        const { error } = await supabase
          .from("listings")
          .update({
            is_featured: true,
            featured_until: expiresAt.toISOString(),
          })
          .eq("id", listingId);

        if (error) {
          console.error("Erro ao atualizar destaque:", error);
        } else {
          console.log(`Listing ${listingId} destacado até ${expiresAt}`);
        }
      } else if (productType === "marketing") {
        const { error } = await supabase
          .from("listings")
          .update({
            marketing_campaign_active: true,
            marketing_activated_at: now.toISOString(),
            marketing_expires_at: expiresAt.toISOString(),
          })
          .eq("id", listingId);

        if (error) {
          console.error("Erro ao ativar marketing:", error);
        } else {
          console.log(`Marketing ativado para listing ${listingId} até ${expiresAt}`);
          // TODO: Adicionar à fila de marketing (email, social media, etc)
        }
      }

      // Save payment record for audit trail
      const { error: paymentError } = await supabase.from("payments").insert({
        listing_id: listingId,
        user_id: userId,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
        amount: session.amount_total / 100,
        currency: session.currency?.toUpperCase() || 'BRL',
        product_type: productType,
        status: "completed",
        payment_method: session.payment_method_types?.[0] || 'card',
        receipt_url: null, // Can be fetched from payment_intent if needed
        customer_email: session.customer_email || session.customer_details?.email,
        activated_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      });

      if (paymentError) {
        console.error("Erro ao salvar pagamento:", paymentError);
      } else {
        console.log(`Pagamento registrado: ${session.id}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Erro no webhook:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
