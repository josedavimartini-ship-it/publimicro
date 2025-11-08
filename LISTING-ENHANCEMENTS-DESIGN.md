# PubliMicro - Listing Enhancement Products
**Date:** November 7, 2025

## 📊 Product Overview

This is a **per-listing add-on system** where users pay to enhance individual announcements with:
1. **Homepage Highlight** (30 days featured placement)
2. **Organic Marketing** (professional marketing campaign)

These are **separate from subscription tiers** - users can purchase these for any listing regardless of their subscription level (Free/Premium/Pro).

---

## 💰 Pricing Structure

### AcheMeCoisas (General Classifieds - Category: `items`)
- **Highlight (30 days)**: R$ 12,00
- **Organic Marketing**: R$ 70,00
- **Bundle (Both)**: R$ 75,00 (save R$ 7)

### AcheMeMotors (Vehicles - Categories: `vehicles`, `machinery`, `marine`)
- **Highlight (30 days)**: R$ 20,00
- **Organic Marketing**: R$ 120,00
- **Bundle (Both)**: R$ 130,00 (save R$ 10)

### AcheMeProper (Real Estate - Category: `properties`)
- **Highlight (30 days)**: R$ 30,00
- **Organic Marketing**: R$ 180,00
- **Bundle (Both)**: R$ 195,00 (save R$ 15)

---

## 🗄️ Database Schema Addition

### New Table: `listing_enhancements`

```sql
CREATE TABLE IF NOT EXISTS public.listing_enhancements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Enhancement Type
  enhancement_type VARCHAR(50) NOT NULL CHECK (enhancement_type IN (
    'highlight',           -- Homepage & category highlight
    'organic_marketing',   -- Full marketing campaign
    'bundle'              -- Both highlight + marketing
  )),
  
  -- Category-specific pricing (stored for record keeping)
  category VARCHAR(50) NOT NULL,
  price_paid DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  
  -- Stripe Payment Details
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN (
    'pending',
    'paid',
    'failed',
    'refunded'
  )),
  
  -- Highlight Details (for highlight & bundle types)
  highlight_starts_at TIMESTAMP WITH TIME ZONE,
  highlight_ends_at TIMESTAMP WITH TIME ZONE, -- 30 days after start
  highlight_active BOOLEAN DEFAULT FALSE,
  
  -- Organic Marketing Details (for organic_marketing & bundle types)
  marketing_status VARCHAR(20) DEFAULT 'pending' CHECK (marketing_status IN (
    'pending',      -- Payment confirmed, awaiting campaign setup
    'in_progress',  -- Campaign actively running
    'completed',    -- Campaign finished
    'paused',       -- Temporarily paused
    'canceled'      -- User canceled
  )),
  marketing_started_at TIMESTAMP WITH TIME ZONE,
  marketing_completed_at TIMESTAMP WITH TIME ZONE,
  marketing_notes TEXT, -- Admin notes about campaign progress
  
  -- Performance Metrics
  total_impressions INT DEFAULT 0,
  total_clicks INT DEFAULT 0,
  total_leads INT DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_listing_enhancements_announcement ON listing_enhancements(announcement_id);
CREATE INDEX idx_listing_enhancements_user ON listing_enhancements(user_id);
CREATE INDEX idx_listing_enhancements_type ON listing_enhancements(enhancement_type);
CREATE INDEX idx_listing_enhancements_highlight_active ON listing_enhancements(highlight_active, highlight_ends_at) WHERE highlight_active = TRUE;
CREATE INDEX idx_listing_enhancements_marketing_status ON listing_enhancements(marketing_status);
```

### Update `announcements` table

We already have these fields - just document their usage:
- `is_featured` → Set to TRUE when user has active highlight enhancement
- `views_count`, `contacts_count`, `whatsapp_clicks` → Track enhancement performance

---

## 🎯 Stripe Products Setup

### Create Stripe Products (One-time Payments)

```javascript
// Run this in Stripe Dashboard or via API

// AcheMeCoisas - Items
const itemsHighlight = await stripe.products.create({
  name: 'Destaque HomePage - AcheMeCoisas',
  description: '30 dias de destaque na página inicial e seção de referência',
  metadata: { category: 'items', enhancement_type: 'highlight' }
});

const itemsHighlightPrice = await stripe.prices.create({
  product: itemsHighlight.id,
  unit_amount: 1200, // R$ 12.00
  currency: 'brl',
  metadata: { duration_days: 30 }
});

const itemsMarketing = await stripe.products.create({
  name: 'Marketing Orgânico - AcheMeCoisas',
  description: 'Campanha profissional de marketing orgânico',
  metadata: { category: 'items', enhancement_type: 'organic_marketing' }
});

const itemsMarketingPrice = await stripe.prices.create({
  product: itemsMarketing.id,
  unit_amount: 7000, // R$ 70.00
  currency: 'brl'
});

const itemsBundle = await stripe.products.create({
  name: 'Pacote Completo - AcheMeCoisas',
  description: 'Destaque + Marketing Orgânico (Economize R$ 7)',
  metadata: { category: 'items', enhancement_type: 'bundle' }
});

const itemsBundlePrice = await stripe.prices.create({
  product: itemsBundle.id,
  unit_amount: 7500, // R$ 75.00 (save R$ 7)
  currency: 'brl'
});

// Repeat for motors (R$ 20, R$ 120, R$ 130) and proper (R$ 30, R$ 180, R$ 195)
```

---

## 🔄 User Flow

### 1. User Creates Announcement
- Fill out announcement form
- Publish announcement (status: 'draft' → 'active')

### 2. Enhancement Upsell
After publishing, show modal:
```
🎉 Anúncio Publicado com Sucesso!

Quer mais visibilidade?

┌─────────────────────────────────────┐
│ 🌟 Destaque na HomePage             │
│ • 30 dias em destaque               │
│ • Aparece no topo da página inicial │
│ • Badge "Destaque"                  │
│ R$ 12,00                            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📢 Marketing Orgânico               │
│ • Campanha profissional             │
│ • Posts em redes sociais            │
│ • SEO otimizado                     │
│ R$ 70,00                            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 💎 Pacote Completo (ECONOMIZE R$ 7) │
│ • Destaque + Marketing              │
│ R$ 75,00 (de R$ 82,00)              │
└─────────────────────────────────────┘

[Comprar Agora] [Fazer Depois] [Não, Obrigado]
```

### 3. Stripe Checkout
```typescript
// Create checkout session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card', 'boleto'],
  line_items: [{
    price: selectedPriceId,
    quantity: 1
  }],
  mode: 'payment', // One-time payment, not subscription
  success_url: `${baseUrl}/anuncio/${announcementId}/enhancement-success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/anuncio/${announcementId}`,
  metadata: {
    announcement_id: announcementId,
    user_id: userId,
    enhancement_type: enhancementType,
    category: announcementCategory
  }
});
```

### 4. Webhook Processing
```typescript
// On payment success
case 'checkout.session.completed':
  const { announcement_id, enhancement_type, category } = session.metadata;
  
  // Create listing_enhancement record
  await supabase.from('listing_enhancements').insert({
    announcement_id,
    user_id: session.customer,
    enhancement_type,
    category,
    price_paid: session.amount_total / 100,
    stripe_payment_intent_id: session.payment_intent,
    payment_status: 'paid',
    highlight_starts_at: new Date(),
    highlight_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    highlight_active: enhancement_type !== 'organic_marketing',
    marketing_status: enhancement_type === 'highlight' ? null : 'pending'
  });
  
  // Update announcement
  if (enhancement_type !== 'organic_marketing') {
    await supabase.from('announcements').update({
      is_featured: true
    }).eq('id', announcement_id);
  }
  
  // Send confirmation email
  await sendEnhancementConfirmationEmail(user_id, enhancement_type);
```

---

## 🎨 Frontend Components

### `EnhancementUpsellModal.tsx`
```typescript
interface EnhancementUpsellModalProps {
  announcementId: string;
  category: AnnouncementCategory;
  onClose: () => void;
}

const PRICING = {
  items: {
    highlight: 12.00,
    organic_marketing: 70.00,
    bundle: 75.00,
    savings: 7.00
  },
  vehicles: {
    highlight: 20.00,
    organic_marketing: 120.00,
    bundle: 130.00,
    savings: 10.00
  },
  properties: {
    highlight: 30.00,
    organic_marketing: 180.00,
    bundle: 195.00,
    savings: 15.00
  }
};

export function EnhancementUpsellModal({ announcementId, category, onClose }: EnhancementUpsellModalProps) {
  const pricing = PRICING[category] || PRICING.items;
  
  const handlePurchase = async (type: 'highlight' | 'organic_marketing' | 'bundle') => {
    const response = await fetch('/api/enhancements/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ announcementId, enhancementType: type, category })
    });
    
    const { sessionId } = await response.json();
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    await stripe.redirectToCheckout({ sessionId });
  };
  
  return (
    <Modal>
      {/* Render pricing cards */}
    </Modal>
  );
}
```

### `EnhancementBadge.tsx`
Display on announcements with active highlights:
```tsx
{announcement.is_featured && (
  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
    ⭐ Em Destaque
  </Badge>
)}
```

---

## 📋 API Routes to Create

### 1. `POST /api/enhancements/create-checkout`
Create Stripe checkout session for enhancement purchase

### 2. `POST /api/webhooks/stripe-enhancements`
Handle Stripe webhooks (payment.succeeded, payment.failed)

### 3. `GET /api/enhancements/[announcementId]`
Get all enhancements for an announcement

### 4. `GET /api/admin/enhancements/marketing-queue`
Admin view of pending marketing campaigns

---

## 🔍 Admin Dashboard Features

### Marketing Campaign Manager
```
┌─────────────────────────────────────────────────────┐
│ 📢 Campanhas de Marketing Pendentes                │
├─────────────────────────────────────────────────────┤
│ ID: #12345                                          │
│ Anúncio: "Casa 3 Quartos - Centro SP"              │
│ Categoria: Proper                                   │
│ Pago: R$ 180,00                                     │
│ Status: Pendente                                    │
│ [Iniciar Campanha] [Ver Detalhes]                  │
├─────────────────────────────────────────────────────┤
│ ID: #12344                                          │
│ Anúncio: "Honda Civic 2020 - Baixo KM"             │
│ Categoria: Motors                                   │
│ Pago: R$ 120,00                                     │
│ Status: Em Progresso (15/30 dias)                  │
│ Métricas: 1,234 impressões, 45 cliques, 3 leads    │
│ [Pausar] [Adicionar Nota] [Ver Detalhes]           │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Next Steps

1. **Run Migration**: Add `listing_enhancements` table
2. **Create Stripe Products**: Set up 9 products (3 categories × 3 enhancement types)
3. **Build API Routes**: Checkout creation + webhook handler
4. **Build UI Components**: Upsell modal + enhancement badges
5. **Admin Panel**: Marketing campaign manager
6. **Testing**: End-to-end purchase flow

---

## 💡 Business Model Benefits

1. **Recurring Revenue**: Users re-purchase highlights every 30 days for popular listings
2. **High Margins**: Marketing campaigns can be automated/templatized
3. **Upsell Opportunity**: Capture users right after announcement excitement
4. **Category Differentiation**: Higher prices for high-value categories (real estate, vehicles)
5. **Bundle Incentive**: Encourage bigger purchases with savings

**Projected Monthly Revenue** (conservative):
- 100 highlights/month × R$ 20 avg = R$ 2,000
- 20 marketing campaigns/month × R$ 120 avg = R$ 2,400
- **Total: R$ 4,400/month** from enhancements alone

---

## 🔐 Security Considerations

- Verify announcement ownership before allowing enhancement purchase
- Prevent multiple active highlights for same announcement (allow renewal)
- Rate limit enhancement API to prevent abuse
- Validate Stripe webhook signatures
- Log all enhancement transactions for audit trail
