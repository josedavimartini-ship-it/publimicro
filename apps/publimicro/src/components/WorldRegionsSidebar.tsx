"use client";

import BrazilTimeClock from "./BrazilTimeClock";
import { MapPin, TrendingUp, Users, Home } from "lucide-react";

interface BrazilRegion {
  name: string;
  states: {
    name: string;
    uf: string;
    capital: string;
    cities: string[];
    stats?: {
      activeListings?: number;
      averagePrice?: string;
      popularSearches?: string[];
    };
  }[];
}

const BRAZIL_REGIONS: BrazilRegion[] = [
  {
    name: "Centro-Oeste",
    states: [
      {
        name: "Goiás",
        uf: "GO",
        capital: "Goiânia",
        cities: [
          "Goiânia",
          "Aparecida de Goiânia",
          "Anápolis",
          "Rio Verde",
          "Luziânia",
          "Caldas Novas",
          "Buriti Alegre",
          "Pirenópolis",
          "Alto Paraíso",
        ],
        stats: {
          activeListings: 247,
          averagePrice: "R$ 850.000",
          popularSearches: ["Sítios Carcará", "Lago das Brisas", "Propriedades rurais"],
        },
      },
      {
        name: "Distrito Federal",
        uf: "DF",
        capital: "Brasília",
        cities: ["Brasília", "Taguatinga", "Ceilândia", "Samambaia"],
        stats: {
          activeListings: 156,
          averagePrice: "R$ 1.2M",
        },
      },
      {
        name: "Mato Grosso",
        uf: "MT",
        capital: "Cuiabá",
        cities: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop"],
      },
      {
        name: "Mato Grosso do Sul",
        uf: "MS",
        capital: "Campo Grande",
        cities: ["Campo Grande", "Dourados", "Três Lagoas"],
      },
    ],
  },
  {
    name: "Sudeste",
    states: [
      {
        name: "São Paulo",
        uf: "SP",
        capital: "São Paulo",
        cities: [
          "São Paulo",
          "Campinas",
          "Santos",
          "São José dos Campos",
          "Ribeirão Preto",
          "Sorocaba",
        ],
        stats: {
          activeListings: 1450,
          averagePrice: "R$ 2.1M",
        },
      },
      {
        name: "Rio de Janeiro",
        uf: "RJ",
        capital: "Rio de Janeiro",
        cities: ["Rio de Janeiro", "Niterói", "São Gonçalo", "Duque de Caxias"],
        stats: {
          activeListings: 890,
          averagePrice: "R$ 1.8M",
        },
      },
      {
        name: "Minas Gerais",
        uf: "MG",
        capital: "Belo Horizonte",
        cities: [
          "Belo Horizonte",
          "Uberlândia",
          "Contagem",
          "Juiz de Fora",
          "Betim",
        ],
        stats: {
          activeListings: 678,
          averagePrice: "R$ 950.000",
        },
      },
      {
        name: "Espírito Santo",
        uf: "ES",
        capital: "Vitória",
        cities: ["Vitória", "Vila Velha", "Serra", "Cariacica"],
      },
    ],
  },
  {
    name: "Sul",
    states: [
      {
        name: "Paraná",
        uf: "PR",
        capital: "Curitiba",
        cities: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"],
      },
      {
        name: "Santa Catarina",
        uf: "SC",
        capital: "Florianópolis",
        cities: ["Florianópolis", "Joinville", "Blumenau", "São José"],
      },
      {
        name: "Rio Grande do Sul",
        uf: "RS",
        capital: "Porto Alegre",
        cities: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas"],
      },
    ],
  },
  {
    name: "Nordeste",
    states: [
      {
        name: "Bahia",
        uf: "BA",
        capital: "Salvador",
        cities: ["Salvador", "Feira de Santana", "Vitória da Conquista"],
      },
      {
        name: "Pernambuco",
        uf: "PE",
        capital: "Recife",
        cities: ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru"],
      },
      {
        name: "Ceará",
        uf: "CE",
        capital: "Fortaleza",
        cities: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú"],
      },
    ],
  },
  {
    name: "Norte",
    states: [
      {
        name: "Amazonas",
        uf: "AM",
        capital: "Manaus",
        cities: ["Manaus", "Parintins", "Itacoatiara"],
      },
      {
        name: "Pará",
        uf: "PA",
        capital: "Belém",
        cities: ["Belém", "Ananindeua", "Santarém", "Marabá"],
      },
    ],
  },
];

export default function WorldRegionsSidebar() {
  return (
    <aside
      aria-label="Regiões do Brasil e Relógio"
      className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-80 bg-gradient-to-b from-[#0c0c0f]/95 to-[#1a1a1a]/95 backdrop-blur-md border-l-2 border-[#CD7F32]/30 p-5 overflow-y-auto z-40 shadow-2xl"
    >
      {/* Real-Time Clock */}
      <div className="mb-6">
        <BrazilTimeClock />
      </div>

      {/* Brazil Regions Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-3xl">🇧🇷</div>
          <h3 className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#CD7F32]">
            Regiões do Brasil
          </h3>
        </div>
        <p className="text-xs text-[#8B9B6E]">
          Encontre propriedades e anúncios em todo o país
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#0a0a0a] rounded-lg p-3 border border-[#2a2a1a]">
          <Home className="w-5 h-5 text-[#A8C97F] mb-1" />
          <div className="text-2xl font-black text-[#D4AF37]">3.4K+</div>
          <div className="text-[10px] text-[#676767] uppercase">Anúncios Ativos</div>
        </div>
        <div className="bg-[#0a0a0a] rounded-lg p-3 border border-[#2a2a1a]">
          <Users className="w-5 h-5 text-[#CD7F32] mb-1" />
          <div className="text-2xl font-black text-[#B87333]">127</div>
          <div className="text-[10px] text-[#676767] uppercase">Cidades</div>
        </div>
      </div>

      {/* Regions List */}
      <div className="space-y-3 text-sm">
        {BRAZIL_REGIONS.map((region, idx) => (
          <details key={idx} className="group" open={idx === 0}>
            <summary className="cursor-pointer text-[#E6C98B] font-bold hover:text-[#D4AF37] transition-colors list-none flex items-center gap-2 mb-2 py-2 px-3 bg-[#0a0a0a] rounded-lg border border-[#2a2a1a] hover:border-[#CD7F32]/50">
              <MapPin className="w-4 h-4 text-[#A8C97F]" />
              {region.name}
            </summary>
            <div className="ml-2 mt-2 space-y-2">
              {region.states.map((state, sidx) => (
                <details key={sidx} className="group/state" open={sidx === 0 && idx === 0}>
                  <summary className="cursor-pointer text-[#B7791F] hover:text-[#D4AF37] transition-colors py-2 px-3 rounded-lg hover:bg-[#1a1a1a]">
                    <span className="font-semibold">{state.name}</span>
                    <span className="ml-2 text-xs text-[#676767]">({state.uf})</span>
                  </summary>
                  
                  {/* State Stats */}
                  {state.stats && (
                    <div className="ml-4 mt-2 mb-3 p-3 bg-[#0a0a0a] rounded-lg border border-[#2a2a1a]/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#8B9B6E]">📊 Anúncios:</span>
                        <span className="text-xs font-bold text-[#A8C97F]">
                          {state.stats.activeListings}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#8B9B6E]">💰 Preço médio:</span>
                        <span className="text-xs font-bold text-[#B7791F]">
                          {state.stats.averagePrice}
                        </span>
                      </div>
                      {state.stats.popularSearches && (
                        <div className="mt-2 pt-2 border-t border-[#2a2a1a]">
                          <span className="text-[10px] text-[#676767] uppercase block mb-1">
                            🔥 Mais Buscados:
                          </span>
                          {state.stats.popularSearches.map((search, i) => (
                            <span
                              key={i}
                              className="inline-block text-[10px] bg-[#1a1a1a] text-[#8B9B6E] px-2 py-1 rounded-full mr-1 mb-1 hover:bg-[#CD7F32] hover:text-[#0a0a0a] cursor-pointer transition-colors"
                            >
                              {search}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cities */}
                  <ul className="ml-4 mt-2 space-y-1 text-xs">
                    {state.cities.map((city, cidx) => (
                      <li
                        key={cidx}
                        className="py-1.5 px-3 text-[#8B9B6E] hover:text-[#E6C98B] hover:bg-[#1a1a1a] rounded-lg cursor-pointer transition-colors flex items-center gap-2 group/city"
                      >
                        <span className="text-[10px] opacity-50 group-hover/city:opacity-100">📍</span>
                        {city}
                        {city === state.capital && (
                          <span className="ml-auto text-[10px] bg-[#CD7F32] text-[#0a0a0a] px-1.5 py-0.5 rounded font-bold">
                            CAPITAL
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </details>
        ))}
      </div>

      {/* Bottom Info */}
      <div className="mt-6 pt-6 border-t border-[#2a2a1a]">
        <div className="p-4 bg-gradient-to-br from-[#CD7F32]/10 to-[#B87333]/5 rounded-xl border border-[#CD7F32]/20">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-sm font-bold text-[#E6C98B] mb-1">
                🔥 Em Alta Agora
              </h4>
              <p className="text-xs text-[#8B9B6E] leading-relaxed">
                <strong className="text-[#D4AF37]">Sítios Carcará</strong> em Buriti Alegre, GO. 
                6 propriedades de <strong className="text-[#B7791F]">2 hectares</strong> próximas 
                ao <strong className="text-[#A8C97F]">Lago das Brisas</strong>. 
                Sistema transparente de propostas.
              </p>
              <button className="mt-3 w-full px-3 py-2 bg-gradient-to-r from-[#CD7F32] to-[#B87333] text-[#0a0a0a] text-xs font-bold rounded-lg hover:scale-105 transition-all shadow-lg">
                Ver Propriedades
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
