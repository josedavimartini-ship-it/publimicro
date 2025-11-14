import { NextResponse } from "next/server";
import { getStripe, STRIPE_PRICES } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { listingId, productType } = await req.json();

    if (!listingId || !productType) {
      return NextResponse.json(
        { error: "Listing ID e tipo de produto são obrigatórios" },
        { status: 400 }
      );
    }

    // Pegar token de autenticação do header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Token de autenticação ausente" },
        { status: 401 }
      );
    }

    // Criar cliente Supabase com o token do usuário
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Verificar autenticação
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // ============================================
    // VERIFICAÇÃO DE IDENTIDADE OBRIGATÓRIA
    // ============================================
    // Check if user is verified before allowing premium purchases
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("verification_status")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return NextResponse.json(
        { error: "Erro ao verificar perfil do usuário" },
        { status: 500 }
      );
    }

    // Require verification for premium features
    if (profile?.verification_status !== "approved") {
      return NextResponse.json(
        { 
          error: "Verificação de identidade necessária",
          requiresVerification: true,
          verificationStatus: profile?.verification_status || "not_started"
        },
        { status: 403 }
      );
    }

    // Verificar se o listing existe e pertence ao usuário
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, title, user_id")
      .eq("id", listingId)
      .single();

    if (listingError || !listing) {
      return NextResponse.json(
        { error: "Anúncio não encontrado" },
        { status: 404 }
      );
    }

    if (listing.user_id !== user.id) {
      return NextResponse.json(
        { error: "Você não tem permissão para modificar este anúncio" },
        { status: 403 }
      );
    }

    // Selecionar o preço correto
    const priceId =
      productType === "destaque"
        ? STRIPE_PRICES.DESTAQUE
        : STRIPE_PRICES.MARKETING;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID não configurado" },
        { status: 500 }
      );
    }

    // Criar sessão de checkout do Stripe
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Pix será adicionado depois
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/acheme-coisas/publicado?id=${listingId}&payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/acheme-coisas/publicado?id=${listingId}&payment=cancelled`,
      metadata: {
        listingId,
        userId: user.id,
        productType,
        listingTitle: listing.title,
      },
      customer_email: user.email,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Erro ao criar sessão de checkout:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar sessão de pagamento" },
      { status: 500 }
    );
  }
}
