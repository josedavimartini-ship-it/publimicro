'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { LISTING_TIERS, getTierComparisonFeatures, formatTierPrice } from '@/lib/listingTiers';

interface TierSelectorProps {
  selectedTier: string;
  onSelectTier: (tierId: string) => void;
  canUseFree: boolean; // Whether user can still use free tier
  showComparison?: boolean;
}

export default function TierSelector({ 
  selectedTier, 
  onSelectTier, 
  canUseFree,
  showComparison = true 
}: TierSelectorProps) {
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');
  
  const comparisonFeatures = getTierComparisonFeatures();
  
  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm ${billingCycle === 'monthly' ? 'text-[#D4A574]' : 'text-[#676767]'}`}>
          Mensal
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            billingCycle === 'yearly' ? 'bg-[#A8C97F]' : 'bg-[#3a3a3a]'
          }`}
        >
          <div 
            className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
              billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm ${billingCycle === 'yearly' ? 'text-[#A8C97F]' : 'text-[#676767]'}`}>
          Anual <span className="text-xs text-[#A8C97F]">(-17%)</span>
        </span>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {LISTING_TIERS.map((tier) => {
          const isSelected = selectedTier === tier.id;
          const isDisabled = tier.id === 'free' && !canUseFree;
          
          return (
            <div
              key={tier.id}
              onClick={() => !isDisabled && onSelectTier(tier.id)}
              className={`relative rounded-2xl p-6 border-2 transition-all cursor-pointer ${
                isDisabled 
                  ? 'opacity-50 cursor-not-allowed border-[#3a3a3a] bg-[#1a1a1a]'
                  : isSelected
                    ? 'border-[#D4A574] bg-[#2a2a2a] scale-105 shadow-xl shadow-[#D4A574]/20'
                    : 'border-[#3a3a3a] bg-[#1a1a1a] hover:border-[#4a4a4a]'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#D4A574] to-[#CD7F32] text-[#0a0a0a] text-xs font-bold rounded-full">
                  Mais Popular
                </div>
              )}
              
              {/* Tier Icon & Name */}
              <div className="text-center mb-4">
                <span className="text-3xl">{tier.icon}</span>
                <h3 className="text-xl font-bold mt-2" style={{ color: tier.color }}>
                  {tier.name}
                </h3>
                <p className="text-xs text-[#676767] mt-1">{tier.description}</p>
              </div>
              
              {/* Price */}
              <div className="text-center mb-6">
                <div className="text-3xl font-black text-[#E6C98B]">
                  {formatTierPrice(tier, billingCycle === 'yearly')}
                </div>
                {tier.priceMonthly > 0 && billingCycle === 'yearly' && (
                  <div className="text-xs text-[#A8C97F] mt-1">
                    Economia de R$ {((tier.priceMonthly * 12) - tier.priceYearly).toFixed(2)}
                  </div>
                )}
              </div>
              
              {/* Quick Features */}
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-[#8B9B6E]">
                  <Check className="w-4 h-4 text-[#A8C97F]" />
                  Até {tier.limits.maxPhotos} fotos
                </li>
                <li className="flex items-center gap-2 text-sm text-[#8B9B6E]">
                  {tier.limits.maxVideos > 0 ? (
                    <>
                      <Check className="w-4 h-4 text-[#A8C97F]" />
                      {tier.limits.maxVideos} vídeo{tier.limits.maxVideos > 1 ? 's' : ''}
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-[#676767]" />
                      <span className="text-[#676767]">Sem vídeos</span>
                    </>
                  )}
                </li>
                <li className="flex items-center gap-2 text-sm text-[#8B9B6E]">
                  <Check className="w-4 h-4 text-[#A8C97F]" />
                  {tier.limits.durationDays} dias
                </li>
                {tier.limits.canFeature && (
                  <li className="flex items-center gap-2 text-sm text-[#8B9B6E]">
                    <Check className="w-4 h-4 text-[#A8C97F]" />
                    Destaque na busca
                  </li>
                )}
              </ul>
              
              {/* Select Button */}
              <button
                disabled={isDisabled}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  isDisabled
                    ? 'bg-[#3a3a3a] text-[#676767] cursor-not-allowed'
                    : isSelected
                      ? 'bg-gradient-to-r from-[#D4A574] to-[#CD7F32] text-[#0a0a0a]'
                      : 'bg-[#3a3a3a] text-[#D4A574] hover:bg-[#4a4a4a]'
                }`}
              >
                {isDisabled ? 'Já utilizado' : isSelected ? 'Selecionado' : 'Selecionar'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      {showComparison && (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#3a3a3a]">
                <th className="text-left py-3 px-4 text-[#8B9B6E] font-normal">Recurso</th>
                {LISTING_TIERS.map((tier) => (
                  <th 
                    key={tier.id} 
                    className="text-center py-3 px-4 font-bold"
                    style={{ color: tier.color }}
                  >
                    {tier.icon} {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((row, index) => (
                <tr 
                  key={row.feature}
                  className={`border-b border-[#2a2a2a] ${index % 2 === 0 ? 'bg-[#1a1a1a]' : ''}`}
                >
                  <td className="py-3 px-4 text-[#D4A574] text-sm">{row.feature}</td>
                  <td className="text-center py-3 px-4 text-[#8B9B6E] text-sm">{row.free}</td>
                  <td className="text-center py-3 px-4 text-[#8B9B6E] text-sm">{row.standard}</td>
                  <td className="text-center py-3 px-4 text-[#8B9B6E] text-sm">{row.premium}</td>
                  <td className="text-center py-3 px-4 text-[#8B9B6E] text-sm">{row.professional}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Free Tier Notice */}
      {!canUseFree && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-center">
          <p className="text-yellow-400 text-sm">
            ⚠️ Você já utilizou seu anúncio gratuito. Escolha um plano pago para continuar.
          </p>
        </div>
      )}
    </div>
  );
}
