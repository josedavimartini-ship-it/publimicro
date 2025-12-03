# 🎯 Testando o Sistema de Pagamentos

## ✅ O que foi configurado

1. **Price IDs do Stripe**
   - Destaque (R$ 20): `price_1SQXY4FTa31reGpf1w2KTfGA`
   - Marketing (R$ 120): `price_1SQXZxFTa31reGpf7HGHw8In`

2. **Rotas API criadas**
   - `/api/checkout/create-session` - Cria sessão de pagamento
   - `/api/webhooks/stripe` - Processa confirmações de pagamento

3. **Página de confirmação atualizada**
   - Botões de upgrade integrados com Stripe Checkout

## 🧪 Como Testar (Modo Test)

### 1. Postar um anúncio
```
1. Acesse: http://localhost:3000/acheme-coisas/postar
2. Preencha o formulário
3. Faça upload de fotos
4. Clique em "Publicar Anúncio"
```

### 2. Testar pagamento do Destaque (R$ 20)
```
1. Na página de confirmação, clique em "Destacar Anúncio"
2. Você será redirecionado para o Stripe Checkout
3. Use um cartão de teste:
   - Número: 4242 4242 4242 4242
   - Validade: Qualquer data futura (ex: 12/25)
   - CVC: Qualquer 3 dígitos (ex: 123)
   - CEP: Qualquer (ex: 12345)
4. Complete o pagamento
5. Você será redirecionado de volta
```

### 3. Verificar se funcionou
```sql
-- No Supabase SQL Editor, rode:
SELECT 
  id, 
  title, 
  is_featured, 
  featured_until 
FROM listings 
WHERE id = 'SEU_LISTING_ID';

-- Você deve ver:
-- is_featured = true
-- featured_until = data 30 dias no futuro
```

## 🔧 Configurar Webhook (IMPORTANTE!)

Para o pagamento funcionar automaticamente, você precisa configurar o webhook:

### Passo 1: Instalar Stripe CLI (para desenvolvimento local)
```powershell
# Baixe em: https://stripe.com/docs/stripe-cli
# Ou use:
winget install stripe

# Login no Stripe
stripe login

# Forward webhooks para seu localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Isso vai mostrar um **webhook secret** (começa com `whsec_`).

### Passo 2: Atualizar .env.local
Copie o webhook secret e atualize:
```bash
STRIPE_WEBHOOK_SECRET=whsec_o_seu_secret_aqui
```

### Passo 3: Reiniciar servidor
```powershell
# Ctrl+C para parar
pnpm dev
```

## 🎉 Resultado Esperado

Quando o pagamento for confirmado:
- **Destaque**: `is_featured = true`, `featured_until` = +30 dias
- **Marketing**: `marketing_campaign_active = true`

## 🚀 Próximos Passos

1. **Habilitar Pix**
   - Vá para: Stripe Dashboard → Settings → Payment methods
   - Ative "Pix"
   - Em `create-session/route.ts`, adicione `'pix'` em `payment_method_types`

2. **Criar tabela de payments** (opcional)
   ```sql
   CREATE TABLE payments (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     listing_id UUID REFERENCES listings(id),
     user_id UUID REFERENCES auth.users(id),
     stripe_session_id TEXT,
     amount DECIMAL(10, 2),
     product_type TEXT,
     status TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. **Deploy webhook para produção**
   - No Stripe Dashboard → Developers → Webhooks
   - Adicione endpoint: `https://seu-dominio.com/api/webhooks/stripe`
   - Selecione evento: `checkout.session.completed`
   - Copie o signing secret e adicione no Vercel

## 🐛 Troubleshooting

**Erro: "Price ID não configurado"**
→ Verifique se as variáveis estão no `.env.local`

**Pagamento não atualiza o listing**
→ Webhook não está configurado. Rode `stripe listen`

**"Unauthorized"**
→ Faça login antes de postar o anúncio

## 📞 Precisa de Ajuda?

Me avise se algo não funcionar! 🚀
