import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

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
      const session = event.data.object as any;
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

      // Atualizar listing com base no tipo de produto
      if (productType === "destaque") {
        // Adicionar 30 dias de destaque
        const featuredUntil = new Date();
        featuredUntil.setDate(featuredUntil.getDate() + 30);

        const { error } = await supabase
          .from("listings")
          .update({
            is_featured: true,
            featured_until: featuredUntil.toISOString(),
          })
          .eq("id", listingId);

        if (error) {
          console.error("Erro ao atualizar destaque:", error);
        } else {
          console.log(`Listing ${listingId} destacado até ${featuredUntil}`);
        }
      } else if (productType === "marketing") {
        // Ativar campanha de marketing
        const { error } = await supabase
          .from("listings")
          .update({
            marketing_campaign_active: true,
          })
          .eq("id", listingId);

        if (error) {
          console.error("Erro ao ativar marketing:", error);
        } else {
          console.log(`Marketing ativado para listing ${listingId}`);
          // TODO: Adicionar à fila de marketing (email, social media, etc)
        }
      }

      // Opcional: Salvar registro do pagamento
      // await supabase.from("payments").insert({
      //   listing_id: listingId,
      //   user_id: userId,
      //   stripe_session_id: session.id,
      //   amount: session.amount_total / 100,
      //   product_type: productType,
      //   status: "completed",
      // });
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
