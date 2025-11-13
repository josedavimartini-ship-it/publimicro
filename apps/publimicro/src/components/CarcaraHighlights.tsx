"use client";
import React, { useEffect, useState } from 'react';
import CANONICAL_PROPERS from '@/lib/AcheMeRuralPropers.json';
import { fetchCanonicalSitios, mapCanonicalPropersToSitios } from '@/lib/carcaraHelpers';
import { PropertyCard } from '@publimicro/ui';

type Sitio = any;

export default function CarcaraHighlights({ limit = 6, hideTestListings = true }: { limit?: number; hideTestListings?: boolean }) {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Static immediate mapping
    try {
      const staticMapped = mapCanonicalPropersToSitios(CANONICAL_PROPERS).slice(0, limit);
      setSitios(staticMapped as Sitio[]);
    } catch (err) {
      console.warn('CarcaraHighlights: failed to map static canonical propers', err);
      setSitios([]);
    }

    // Attempt live refresh
    (async () => {
      try {
        const live = await fetchCanonicalSitios({ limit, hideTestListings });
        if (live && live.length > 0) setSitios(live as Sitio[]);
      } catch (err) {
        console.warn('CarcaraHighlights: live fetch failed', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [limit, hideTestListings]);

  const brl = (v: number | null | undefined) => {
    try {
      if (!v && v !== 0) return undefined;
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v as number);
    } catch (e) {
      return undefined;
    }
  };

  return (
    <section className="py-16">
      <h2 className="text-4xl font-bold text-[#E6C98B] mb-8 text-center">Sítios Disponíveis - Lances Abertos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Simple placeholders while loading
          Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="h-80 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-xl animate-pulse" />
          ))
        ) : (
          sitios.map((s: any) => {
            const opening = s.openingOffer || s.lance_inicial || s.preco || null;
            const estimated = s.estimatedMarketValue || null;
            const locationText = `${s.zona || 'Zona Rural'} - ${s.localizacao || s.location || 'Corumbaíba/GO'}`;
            const tagline = s.tagline ? `${s.tagline} — ` : '';
            const desc = `${tagline}${locationText}\nEstimated: ${estimated ? brl(estimated) : '—'} | Opening: ${opening ? brl(opening) : '—'}`;

            return (
              <PropertyCard
                key={s.id}
                id={s.id}
                title={s.nome || s.title}
                description={desc}
                price={opening || 0}
                currentBid={s.current_bid}
                featured={s.destaque}
                location={{ city: s.localizacao || 'Corumbaíba', state: 'GO', neighborhood: s.zona }}
                area={{ total: s.tamanho || s.area_total || s.total_area || 0 }}
                photos={s.fotos || []}
                link={`/imoveis/${s.id}`}
                type="sitio"
              />
            );
          })
        )}
      </div>
    </section>
  );
}
