# 🔧 Corrigir Preços do Stripe (Recurring → One-time)

## ❌ Problema
Os Price IDs que você criou estão configurados como **assinatura recorrente** (subscription), mas precisamos de **pagamento único** (one-time payment).

## ✅ Solução: Criar novos preços

### Passo 1: Acessar produtos no Stripe
https://dashboard.stripe.com/test/products

### Passo 2: Editar "Destaque na Home - 30 dias"

1. Clique no produto
2. Na seção **"Pricing"**, clique em **"Add another price"**
3. Configure:
   - **Price**: R$ 20,00
   - **Billing period**: ❌ NÃO selecione nada (deixe sem billing period)
   - **Payment type**: Selecione **"One-time"** ou deixe sem "recurring"
   - **Currency**: BRL
4. Clique em **"Add price"**
5. **COPIE O NOVO PRICE ID** (começa com `price_...`)

### Passo 3: Editar "Marketing Orgânico - 30 dias"

1. Clique no produto
2. Na seção **"Pricing"**, clique em **"Add another price"**
3. Configure:
   - **Price**: R$ 120,00
   - **Billing period**: ❌ NÃO selecione nada
   - **Payment type**: **One-time**
   - **Currency**: BRL
4. Clique em **"Add price"**
5. **COPIE O NOVO PRICE ID**

### Passo 4: Atualizar .env.local

Substitua os price IDs antigos pelos novos:

```bash
NEXT_PUBLIC_STRIPE_PRICE_DESTAQUE=price_NOVO_ID_AQUI
NEXT_PUBLIC_STRIPE_PRICE_MARKETING=price_NOVO_ID_AQUI
```

### Passo 5: Reiniciar servidor

```powershell
# Ctrl+C no terminal
pnpm dev
```

## 🎯 Como criar preço one-time corretamente

No formulário de criação do preço, você verá:

```
┌─────────────────────────────────┐
│ Price: R$ 20.00                 │
│                                 │
│ ○ Recurring (mensal/anual)      │  ❌ NÃO SELECIONE
│ ● One-time                      │  ✅ SELECIONE ESTE
│                                 │
│ Currency: BRL                   │
└─────────────────────────────────┘
```

## ✅ Depois de atualizar

Teste novamente:
1. Postar anúncio
2. Clicar em "Destacar Anúncio"
3. Deve redirecionar para Stripe Checkout com pagamento único ✅
