'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MapPin, Home, Trees, Droplets, Zap, ShieldCheck, Calendar, TrendingUp, Phone, Mail, ArrowLeft, Info } from 'lucide-react';
import VisitModal from '@/components/VisitModal';
import ProposalModal from '@/components/ProposalModal';
import FavoritesButton from '@/components/FavoritesButton';
import NeighborhoodInfo from '@/components/NeighborhoodInfo';
import SwipeGallery from '@/components/SwipeGallery';
import StickyMobileAction, { ActionButton } from '@/components/StickyMobileAction';
import { Carcara3D } from '@publimicro/ui';
import { getFirstPhoto } from '@/lib/photoUtils';

// Note: Metadata must be exported from a Server Component or page.tsx file in the same directory
// For client components, SEO is handled via layout.tsx or a parallel route

// Dynamic import to avoid SSR issues with Leaflet
const LeafletMapKML = dynamic(() => import("@/components/LeafletMapKML"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-[#1a1a1a] rounded-2xl flex items-center justify-center">
      <div className="text-[#D4A574] text-xl">Carregando mapa interativo 3D...</div>
    </div>
  ),
});

// KML data from the attached file (Sítios Carcará property boundaries)
const KML_DATA = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">
<Document>
<Style id="yellowLineGreenPoly"><LineStyle><color>ff00ffff</color><width>3</width></LineStyle><PolyStyle><fill>0</fill></PolyStyle></Style>
<Placemark><name>Sítio 1</name><description>Área atualizada 07/10/2025</description><styleUrl>#yellowLineGreenPoly</styleUrl><Polygon><outerBoundaryIs><LinearRing><coordinates>-48.8309658761111,-18.2791310466666,0.0000 -48.8311521866667,-18.2789991091667,0.0000 -48.8316000280556,-18.2784205472222,0.0000 -48.8318697491667,-18.2778220261111,0.0000 -48.8318225852778,-18.2770297208333,0.0000 -48.8313982461111,-18.2768524644444,0.0000 -48.8310029291667,-18.2768355133334,0.0000 -48.8305601961111,-18.2769513525,0.0000 -48.8306879502778,-18.2770874866667,0.0000 -48.8308773930556,-18.2773574691666,0.0000 -48.8309702280556,-18.2776251811111,0.0000 -48.8310171208334,-18.2779679788889,0.0000 -48.8310052302778,-18.2783083030556,0.0000 -48.8309207216667,-18.2786332597222,0.0000 -48.8306829322222,-18.2790877283333,0.0000 -48.8306690877778,-18.2791136769444,0.0000 -48.8308164294444,-18.2790967411111,0.0000 -48.8308902525,-18.2790988436111,0.0000 -48.8309658761111,-18.2791310466666,0.0000</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>
<Placemark><name>Sítio 2</name><description>Área atualizada 07/10/2025</description><styleUrl>#yellowLineGreenPoly</styleUrl><Polygon><outerBoundaryIs><LinearRing><coordinates>-48.8327465708333,-18.2775029677778,0.0000 -48.8322471186111,-18.2772066172222,0.0000 -48.8318225852778,-18.2770297208333,0.0000 -48.8318697491667,-18.2778220261111,0.0000 -48.8316000280556,-18.2784205472222,0.0000 -48.8311521866667,-18.2789991091667,0.0000 -48.8309658761111,-18.2791310466666,0.0000 -48.8310930494445,-18.2791936430556,0.0000 -48.8312266816666,-18.2792817886111,0.0000 -48.83210991,-18.2788152086111,0.0000 -48.8325389336111,-18.2783794794445,0.0000 -48.8329451138889,-18.2776876883333,0.0000 -48.8327657183333,-18.2775143858333,0.0000 -48.8327465708333,-18.2775029677778,0.0000</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>
<Placemark><name>Sítio 3</name><description>Área atualizada 07/10/2025</description><styleUrl>#yellowLineGreenPoly</styleUrl><Polygon><outerBoundaryIs><LinearRing><coordinates>-48.8325552202778,-18.2793276161111,0.0000 -48.8330399102778,-18.2791414813889,0.0000 -48.8337399583333,-18.2786697497222,0.0000 -48.8336174313889,-18.278576855,0.0000 -48.8333424019445,-18.2783683236111,0.0000 -48.8329888416667,-18.2777299172222,0.0000 -48.8329451138889,-18.2776876883333,0.0000 -48.8325389336111,-18.2783794794445,0.0000 -48.83210991,-18.2788152086111,0.0000 -48.8312266816666,-18.2792817886111,0.0000 -48.8312863683333,-18.2793257344444,0.0000 -48.8313740388889,-18.2794917647222,0.0000 -48.8314057625,-18.2795184111111,0.0000 -48.8325552202778,-18.2793276161111,0.0000</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>
<Placemark><name>Sítio 4</name><description>Área atualizada 07/10/2025</description><styleUrl>#yellowLineGreenPoly</styleUrl><Polygon><outerBoundaryIs><LinearRing><coordinates>-48.8317861494444,-18.2800180394444,0.0000 -48.8317851827778,-18.2799931619445,0.0000 -48.8316496055556,-18.2797482711111,0.0000 -48.8328965380556,-18.2797281341667,0.0000 -48.8339221247222,-18.2797241766667,0.0000 -48.8346095472222,-18.2796946594444,0.0000 -48.8347149680556,-18.2798935897222,0.0000 -48.8349791241667,-18.2802851886111,0.0000 -48.8350143791667,-18.2804463783334,0.0000 -48.8350354855556,-18.2805438141667,0.0000 -48.8350226908333,-18.2807669830556,0.0000 -48.8342720736111,-18.2805717286111,0.0000 -48.8341638780555,-18.2804835255555,0.0000 -48.8335170183334,-18.2802813402778,0.0000 -48.832784795,-18.2801206688889,0.0000 -48.8317861494444,-18.2800180394444,0.0000</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>
<Placemark><name>Sítio 5</name><description>Área atualizada 07/10/2025</description><styleUrl>#yellowLineGreenPoly</styleUrl><Polygon><outerBoundaryIs><LinearRing><coordinates>-48.8341412847223,-18.2814622908333,0.0000 -48.8333120561111,-18.2807681288889,0.0000 -48.8325418397222,-18.2804750411111,0.0000 -48.8316138744445,-18.2802721494444,0.0000 -48.8317257563889,-18.2802324986111,0.0000 -48.8317912708334,-18.2801499561111,0.0000 -48.8317861494444,-18.2800180394444,0.0000 -48.832784795,-18.2801206688889,0.0000 -48.8335170183334,-18.2802813402778,0.0000 -48.8341638780555,-18.2804835255555,0.0000 -48.8342720736111,-18.2805717286111,0.0000 -48.8350226908333,-18.2807669830556,0.0000 -48.8350154511111,-18.2808932608333,0.0000 -48.8349961972222,-18.2809284527778,0.0000 -48.8349165680556,-18.2810740683333,0.0000 -48.8347674525,-18.2812185355555,0.0000 -48.8346321658333,-18.2812849322222,0.0000 -48.8344365627778,-18.2813808158333,0.0000 -48.8341412847223,-18.2814622908333,0.0000</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>
<Placemark><name>Sítio 6</name><description>Área atualizada 07/10/2025</description><styleUrl>#yellowLineGreenPoly</styleUrl><Polygon><outerBoundaryIs><LinearRing><coordinates>-48.8319018936111,-18.2810795708333,0.0000 -48.8325154361111,-18.2814857719445,0.0000 -48.8326001802778,-18.2814233202778,0.0000 -48.8328860472222,-18.2813763377778,0.0000 -48.8332779916666,-18.2813916216667,0.0000 -48.833742715,-18.2815007713889,0.0000 -48.8340632902778,-18.2814838091667,0.0000 -48.8341412847223,-18.2814622908333,0.0000 -48.8333120561111,-18.2807681288889,0.0000 -48.8325418397222,-18.2804750411111,0.0000 -48.8316138744445,-18.2802721494444,0.0000 -48.8315430208334,-18.2802973608334,0.0000 -48.8312603930556,-18.2803273055556,0.0000 -48.8319018936111,-18.2810795708333,0.0000</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>
</Document>
</kml>`;

interface Sitio {
  id: string;
  title: string;
  location: string;
  price: number;
  fotos: string[];
  description?: string;
  total_area?: number;
  current_bid?: number; // Current highest proposal value
}

// Fábulas e descrições poéticas para cada sítio
const PROPERTY_FABLES: Record<string, {
  subtitle: string;
  fable: string;
  symbols: string;
  color: string;
}> = {
  'abare': {
    subtitle: "A companheira do rio",
    fable: "Conta-se que nas veredas antigas, uma ave de penas cor de alvorada acompanhava os viajantes pelas margens do rio Corumbá. Diziam que seu canto trazia boas novas e proteção para quem respeitasse a terra e as águas. Chamavam-na Abaré — a \"amiga\", em tupi. E assim, o Sítio Abaré se tornou refúgio para quem busca harmonia com o fluxo natural da vida: onde o rio fala, e a terra responde.",
    symbols: "🕊️ Amizade • Espiritualidade • Equilíbrio com a água",
    color: "from-[#5F9EA0] to-[#A8C97F]"
  },
  'bigua': {
    subtitle: "O mergulhador incansável",
    fable: "Certa vez, um pescador observou um Biguá que mergulhava e emergia repetidas vezes, sem desistir. Intrigado, perguntou-lhe o segredo. O Biguá respondeu: \"A persistência é o que faz da água minha casa.\" O pescador entendeu — e nunca mais abandonou seus sonhos. Assim é o Sítio Biguá: para quem mergulha de corpo e alma na vida, encontrando beleza na constância e na profundidade.",
    symbols: "🐟 Resiliência • Foco • Trabalho com propósito",
    color: "from-[#4682B4] to-[#0D7377]"
  },
  'mergulhao': {
    subtitle: "O guardião das águas profundas",
    fable: "Dizem que o Mergulhão, ave arisca e silenciosa, conhece todos os segredos do fundo da represa. Ele mergulha em silêncio e retorna apenas quando as águas estão calmas. Quem o vê entende: sabedoria é saber o momento certo de agir e o momento certo de esperar. O Sítio Mergulhão é assim — um abrigo para quem busca profundidade e contemplação.",
    symbols: "🌊 Introspecção • Sabedoria • Serenidade",
    color: "from-[#2F4F4F] to-[#5F7161]"
  },
  'seriema': {
    subtitle: "A voz do Cerrado",
    fable: "Certa manhã, quando o sol tocava as serras, a Seriema soltou seu grito. Foi um chamado à vida — e todos os animais despertaram. Desde então, dizem que quem escuta o grito da Seriema sente renascer o desejo de recomeçar. O Sítio Seriema é a morada dos que buscam reerguer-se, falar alto seus sonhos e deixar ecoar a liberdade.",
    symbols: "🪶 Coragem • Liderança • Renascimento",
    color: "from-[#B7791F] to-[#D4A574]"
  },
  'juriti': {
    subtitle: "A canção da alma rural",
    fable: "No entardecer, quando o céu se cobre de ouro, ouve-se o canto suave da Juriti. Reza a lenda que é a voz da saudade, lembrando aos homens o valor das raízes e da simplicidade. O Sítio Juriti é o lar da paz: um canto de aconchego, onde o tempo desacelera e o coração volta a escutar.",
    symbols: "🕊️ Paz • Tradição • Amor pelo interior",
    color: "from-[#E6C98B] to-[#DDA15E]"
  },
  'surucua': {
    subtitle: "A joia discreta da floresta",
    fable: "No meio da mata, vive o Surucuá — ave de cores vivas, mas que raramente se mostra. Dizem que quem o encontra é abençoado com o dom de enxergar a beleza nas pequenas coisas. O Sítio Surucuá é um convite à vida simples, à contemplação e ao encanto que existe no silêncio da natureza.",
    symbols: "🌺 Beleza interior • Simplicidade • Elegância natural",
    color: "from-[#9B59B6] to-[#A8C97F]"
  }
};

export default function CarcaraProjectPage() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [selectedSitio, setSelectedSitio] = useState<Sitio | null>(null);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSitios() {
      // Fetch all properties from Sítios Carcará project
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('projeto', 'Sítios Carcará') // Filter by project name
        .order('price', { ascending: true });

      // If no properties found with project filter, try the specific IDs as fallback
      if (!data || data.length === 0) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('properties')
          .select('*')
          .in('id', ['surucua', 'juriti', 'seriema', 'mergulhao', 'bigua', 'abare'])
          .order('price', { ascending: true });
        
        if (fallbackData && fallbackData.length > 0) {
          console.log('Fallback properties loaded:', fallbackData);
          const sitiosWithBids = await Promise.all(
            fallbackData.map(async (sitio) => {
              const { data: bids } = await supabase
                .from('proposals')
                .select('amount')
                .eq('property_id', sitio.id)
                .order('amount', { ascending: false })
                .limit(1);
              
              // Debug photo data
              console.log(`Sítio ${sitio.id} photos:`, sitio.fotos);
              
              return {
                ...sitio,
                current_bid: bids && bids.length > 0 ? bids[0].amount : null
              };
            })
          );
          setSitios(sitiosWithBids);
        }
      } else if (data) {
        console.log('Project properties loaded:', data);
        // Fetch current highest bid for each property
        const sitiosWithBids = await Promise.all(
          data.map(async (sitio) => {
            const { data: bids } = await supabase
              .from('proposals')
              .select('amount')
              .eq('property_id', sitio.id)
              .order('amount', { ascending: false })
              .limit(1);
            
            // Debug photo data
            console.log(`Sítio ${sitio.id} photos:`, sitio.fotos);
            
            return {
              ...sitio,
              current_bid: bids && bids.length > 0 ? bids[0].amount : null
            };
          })
        );
        setSitios(sitiosWithBids);
      }
      setLoading(false);
    }
    fetchSitios();
    // Get current user from Supabase auth
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) setUserId(data.user.id);
    });
  }, []);

  const features = [
    { icon: <Trees className="w-8 h-8" />, title: 'Natureza Preservada', desc: 'Mata nativa e biodiversidade', color: 'text-[#A8C97F]' },
    { icon: <Droplets className="w-8 h-8" />, title: 'Acesso à Água', desc: 'Margem da represa Corumbaíba', color: 'text-[#0D7377]' },
    { icon: <Zap className="w-8 h-8" />, title: 'Infraestrutura', desc: 'Energia elétrica e estrada', color: 'text-[#E6C98B]' },
    { icon: <ShieldCheck className="w-8 h-8" />, title: 'Documentação', desc: 'Totalmente regularizado', color: 'text-[#6A1B9A]' },
  ];

  const handleScheduleVisit = (sitio: Sitio) => {
    setSelectedSitio(sitio);
    setShowVisitModal(true);
  };

  const handleMakeProposal = (sitio: Sitio) => {
    setSelectedSitio(sitio);
    setShowProposalModal(true);
  };

  return (
  <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]" role="main" aria-label="Página Sítios Carcará">
      {/* Back to Home Button */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-[#676767] hover:text-[#A8C97F] transition-colors focus:outline-none focus:ring-4 focus:ring-[#A8C97F]"
          aria-label="Voltar para página inicial"
          tabIndex={0}
          role="button"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para página inicial
        </Link>
      </div>

      {/* Hero Section - ENHANCED WITH BETTER CONTRAST */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-visible">
        <Image
          src="https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg"
          alt="Sítios Carcará"
          fill
          className="object-cover z-0"
          priority
          unoptimized
        />
        {/* Maximum dark overlay for perfect text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/98 via-[#0a0a0a]/95 to-[#0a0a0a] z-[5]" />
        
        {/* 3D Carcará Bird - Continuous Flying Animation from Right to Left - HIGHEST Z-INDEX */}
        <div className="absolute top-10 w-64 h-64 md:w-96 md:h-96 pointer-events-none z-[200] animate-fly-continuous">
          <Carcara3D scale={2.5} />
        </div>

        {/* Audio control for Carcará sound - HIGHEST Z-INDEX */}
        <audio id="carcara-sound" loop preload="metadata">
          <source src="/sounds/carcara.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <button
          onClick={() => {
            const audio = document.getElementById('carcara-sound') as HTMLAudioElement;
            if (audio) {
              if (audio.paused) {
                audio.volume = 0.7; // Set volume
                audio.play().catch(err => {
                  console.log('Audio play failed (normal for first click):', err);
                  // Show friendly message
                  const btn = document.querySelector('[aria-label="Reproduzir som do Carcará"]');
                  if (btn) {
                    const originalText = btn.textContent;
                    btn.textContent = '🔊 Clique novamente';
                    setTimeout(() => {
                      btn.textContent = originalText;
                    }, 2000);
                  }
                });
              } else {
                audio.pause();
              }
            }
          }}
          className="absolute top-10 right-10 px-6 py-3 bg-[#A8C97F]/90 border-2 border-[#E6C98B] rounded-full backdrop-blur-md text-[#0a0a0a] hover:bg-[#A8C97F] transition-all z-[200] flex items-center gap-2 font-bold shadow-2xl hover:scale-110"
          aria-label="Reproduzir som do Carcará"
        >
          🔊 Som do Carcará
        </button>
        
        <style jsx>{`
          @keyframes fly-continuous {
            0% {
              transform: translateX(100vw) translateY(0);
            }
            25% {
              transform: translateX(75vw) translateY(-20px);
            }
            50% {
              transform: translateX(50vw) translateY(0);
            }
            75% {
              transform: translateX(25vw) translateY(-15px);
            }
            100% {
              transform: translateX(-400px) translateY(0);
            }
          }
          
          .animate-fly-continuous {
            animation: fly-continuous 20s linear infinite;
          }
        `}</style>

        <div className="relative z-[30] text-center px-6 max-w-6xl">
          {/* Exclusive Launch Badge - Elegant with minimal background */}
          <div className="inline-flex items-center gap-2 mb-6 px-8 py-4 bg-gradient-to-r from-[#1a1a1a]/60 to-[#2a2a2a]/60 border-2 border-[#D4A574] rounded-full backdrop-blur-xl animate-pulse shadow-2xl">
            <span className="text-[#D4A574] font-bold text-xl tracking-widest uppercase drop-shadow-[0_4px_12px_rgba(212,165,116,0.8)]" style={{textShadow: '0 0 20px rgba(212,165,116,0.6), 0 4px 8px rgba(0,0,0,1)'}}>
               LANÇAMENTO EXCLUSIVO
            </span>
          </div>
          
          {/* Main Title - Minimal elegant box */}
          <div className="bg-gradient-to-b from-[#0D0D0D]/50 via-[#1a1a1a]/40 to-transparent backdrop-blur-md px-8 py-6 rounded-2xl border border-[#B7791F]/30 inline-block mb-8">
            <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-b from-white via-[#E6C98B] to-[#B7791F] bg-clip-text text-transparent leading-tight drop-shadow-[0_8px_24px_rgba(0,0,0,1)]" style={{textShadow: '0 0 40px rgba(230,201,139,0.3)'}}>
              Sítios Carcará
            </h1>
          </div>
          
          {/* Subtitle - Refined semi-transparent */}
          <div className="bg-gradient-to-r from-transparent via-[#0D0D0D]/40 to-transparent backdrop-blur-sm px-6 py-4 rounded-xl max-w-5xl mx-auto mb-6">
            <p className="text-3xl md:text-4xl text-white leading-relaxed font-light drop-shadow-[0_6px_20px_rgba(0,0,0,1)]" style={{textShadow: '0 0 30px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,1)'}}>
              6 Propriedades Exclusivas às Margens da Represa
            </p>
          </div>
          
          {/* Location - Sleek minimal background */}
          <div className="bg-[#0D0D0D]/30 backdrop-blur-sm px-6 py-3 rounded-lg inline-block mb-4 border border-[#A8C97F]/20">
            <p className="text-xl text-[#E6C98B] drop-shadow-[0_4px_12px_rgba(0,0,0,1)]" style={{textShadow: '0 0 20px rgba(230,201,139,0.4), 0 2px 8px rgba(0,0,0,1)'}}>
              <MapPin className="inline w-5 h-5 mr-2" />
              Corumbaíba, Goiás - Último Pontal do Rio Corumbá antes do Paranaíba
            </p>
          </div>

          {/* Description - Very subtle background */}
          <div className="bg-gradient-to-b from-[#0D0D0D]/25 to-transparent backdrop-blur-sm px-6 py-4 rounded-lg max-w-3xl mx-auto mb-10">
            <p className="text-lg text-white leading-relaxed drop-shadow-[0_4px_12px_rgba(0,0,0,1)]" style={{textShadow: '0 2px 8px rgba(0,0,0,1), 0 0 20px rgba(255,255,255,0.1)'}}>
              Natureza preservada, infraestrutura completa e localização privilegiada. 
              Perfeito para descanso, agricultura sustentável e investimento de longo prazo.
            </p>
          </div>

          {/* Price Badge - Elegant premium look */}
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-[#B7791F]/30 via-[#D4A574]/20 to-[#B7791F]/30 border-2 border-[#D4A574] rounded-full mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(212,165,116,0.4)]">
            <span className="text-[#E6C98B] font-bold text-2xl drop-shadow-[0_4px_12px_rgba(0,0,0,1)]" style={{textShadow: '0 0 25px rgba(230,201,139,0.5), 0 4px 8px rgba(0,0,0,1)'}}>
              Lances a partir de R$ 1.050.000
            </span>
          </div>

          <div className="flex gap-6 justify-center flex-wrap">
            <a
              href="#sitios"
              className="px-16 py-8 bg-gradient-to-r from-[#A8C97F] to-[#8B9B6E] hover:from-[#8B9B6E] hover:to-[#A8C97F] text-black text-2xl font-bold rounded-full transition-all hover:scale-110 shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#A8C97F]"
              aria-label="Ver propriedades disponíveis"
              tabIndex={0}
              role="button"
            >
               Ver Propriedades
            </a>
            <button
              type="button"
              className="px-16 py-8 bg-gradient-to-r from-[#0D7377] to-[#5F7161] text-[#E6C98B] text-2xl font-bold rounded-full shadow-lg transition-all hover:scale-110 flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-[#0D7377]"
              aria-label="Solicitar mais informações"
              onClick={() => window.open('https://www.sitioscarcara.com.br', '_blank')}
              tabIndex={0}
            >
              <Mail className="w-7 h-7" />
              Mais Informações
            </button>
            <button
              type="button"
              className="px-16 py-8 border-2 border-[#0D7377] text-[#0D7377] hover:bg-[#0D7377]/10 text-2xl font-bold rounded-full transition-all flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-[#0D7377]"
              aria-label="Agendar visita"
              onClick={() => setShowVisitModal(true)}
              tabIndex={0}
            >
              <Calendar className="w-7 h-7" />
              Agendar Visita
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced Contrast */}
      <section className="py-16 bg-gradient-to-b from-[#0D7377]/20 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-[#A8C97F] mb-2">6</div>
              <div className="text-white uppercase tracking-wide font-semibold">Propriedades</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#50C878] mb-2">~2.5km²</div>
              <div className="text-white uppercase tracking-wide font-semibold">Área Média</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#B7791F] mb-2">100%</div>
              <div className="text-white uppercase tracking-wide font-semibold">Regularizado</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#A8C97F] mb-2">15km²</div>
              <div className="text-white uppercase tracking-wide font-semibold">Área Total</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - ENHANCED */}
      <section className="py-20 px-6 max-w-7xl mx-auto" id="sobre">
        <h2 className="text-5xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#B7791F] to-[#CD7F32] mb-4">
          Diferenciais do Projeto
        </h2>
        <p className="text-center text-white text-xl mb-16 max-w-3xl mx-auto font-medium drop-shadow-lg">
          Investimento com propósito: preservação ambiental, qualidade de vida e retorno sustentável.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-3xl p-8 hover:border-[#A8C97F] transition-all hover:scale-105 hover:shadow-2xl"
            >
              <div className={`w-20 h-20 bg-[#A8C97F]/20 rounded-full flex items-center justify-center ${feature.color} mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-[#E6C98B] mb-3">{feature.title}</h3>
              <p className="text-white leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Properties Grid - ENHANCED */}
      <section className="py-20 px-6 max-w-7xl mx-auto bg-[#0a0a0a]/50" id="sitios">
        <h2 className="text-5xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#A8C97F] to-[#E6C98B] mb-4">
          Propriedades Disponíveis
        </h2>
        <p className="text-center text-[#E6C98B] text-xl mb-16 max-w-2xl mx-auto">
          Escolha sua propriedade ideal. Agende uma visita presencial ou por videoconferência.
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#A8C97F] border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {sitios.map((sitio) => {
              const fable = PROPERTY_FABLES[sitio.id.toLowerCase()];
              return (
              <article
                key={sitio.id}
                id={sitio.id}
                className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-3 border-[#2a2a1a] rounded-3xl overflow-hidden hover:border-[#A8C97F] hover:shadow-2xl hover:shadow-[#A8C97F]/40 transition-all"
              >
                {/* Image Gallery with Swipe */}
                <div className="relative">
                  <SwipeGallery
                    images={sitio.fotos && sitio.fotos.length > 0 ? sitio.fotos : ['https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg']}
                    alt={`Sítio ${sitio.title}`}
                    aspectRatio="video"
                    showThumbnails={false}
                    showCounter={sitio.fotos && sitio.fotos.length > 1}
                    enableFullscreen={true}
                  />
                  
                  {userId && (
                    <div className="absolute top-4 right-4 z-30">
                      <FavoritesButton propertyId={sitio.id} userId={userId} />
                    </div>
                  )}
                </div>

                {/* Clickable content area */}
                <Link href={`/imoveis/${sitio.id}`} className="block">
                  <div className="p-8">
                    {/* Nome e Subtítulo Poético */}
                    <div className="mb-6">
                      <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#A8C97F] to-[#E6C98B] mb-2">
                        Sítio {sitio.title}
                      </h3>
                      {fable && (
                        <p className="text-[#D4A574] text-lg font-semibold italic">
                          {fable.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Fábula - Card Poético */}
                    {fable && (
                      <div className={`mb-6 p-6 bg-gradient-to-r ${fable.color} bg-opacity-10 rounded-2xl border-2 border-[#E6C98B]/30 backdrop-blur-sm`}>
                        <p className="text-white/95 text-sm leading-relaxed mb-4 font-light italic">
                          {fable.fable.length > 200 ? fable.fable.substring(0, 200) + '...' : fable.fable}
                        </p>
                        <div className="text-[#E6C98B] text-xs font-semibold">
                          {fable.symbols}
                        </div>
                      </div>
                    )}

                    {sitio.total_area && (
                      <div className="flex items-center gap-2 text-[#E6C98B] mb-6">
                        <Home className="w-5 h-5" />
                        <span className="font-semibold">{sitio.total_area} hectares</span>
                      </div>
                    )}

                    {/* Pricing Section */}
                    <div className="grid grid-cols-2 gap-6 p-6 bg-[#2a2a2a]/50 rounded-2xl mb-6">
                      <div>
                        <div className="text-xs text-white mb-2 uppercase tracking-wide font-semibold opacity-80">
                          {sitio.current_bid ? 'Última Oferta' : 'Lance Inicial'}
                        </div>
                        <div className={`font-bold text-2xl ${sitio.current_bid ? 'text-[#B7791F]' : 'text-[#A8C97F]'}`}>
                          R$ {(sitio.price / 1000000).toFixed(2).replace('.', ',')}M
                        </div>
                        {sitio.current_bid && (
                          <div className="text-xs text-[#676767] mt-1">
                            Inicial: R$ {(sitio.price / 1000000).toFixed(2).replace('.', ',')}M
                          </div>
                        )}
                        {!sitio.current_bid && (
                          <div className="text-xs text-[#A8C97F] mt-1 font-semibold">
                            Aberto a ofertas
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs text-white mb-2 uppercase tracking-wide font-semibold opacity-80">Valorização</div>
                        <div className="font-bold text-[#E6C98B] text-2xl">
                          +25%/ano
                        </div>
                        <div className="text-xs text-[#676767] mt-1">
                          ⭐⭐⭐⭐⭐ Potencial
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                    
                {/* Action Buttons - Two buttons for visit and proposal */}
                <div className="px-8 pb-8 grid grid-cols-2 gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleScheduleVisit(sitio);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0D7377] to-[#5F7161] hover:from-[#5F7161] hover:to-[#0D7377] text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                    aria-label={`Agendar visita ao sítio ${sitio.title}`}
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Agendar Visita</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMakeProposal(sitio);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#B87333] to-[#FFD700] hover:from-[#FFD700] hover:to-[#B87333] text-[#0a0a0a] font-bold rounded-xl transition-all hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                    aria-label={`Fazer proposta para sítio ${sitio.title}`}
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>Fazer Proposta</span>
                  </button>
                </div>
              </article>
            )})}
          </div>
        )}
      </section>

      {/* 3D Interactive Map Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto bg-gradient-to-b from-[#0a0a0a] to-[#0d0d0d]">
        <h2 className="text-5xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#A8C97F] to-[#E6C98B] mb-4">
          Mapa Interativo 3D das Propriedades
        </h2>
        <p className="text-center text-[#A8C97F] text-xl mb-16 max-w-3xl mx-auto">
          Visualize em mapa de satélite a localização exata dos 6 sítios Carcará às margens da represa de Corumbaíba, GO. 
          Clique nas áreas coloridas para ver informações detalhadas de cada propriedade.
        </p>
        <div className="h-[700px] rounded-3xl overflow-hidden border-2 border-[#2a2a1a] shadow-2xl">
          <LeafletMapKML kmlData={KML_DATA} />
        </div>
      </section>

      {/* Neighborhood & Infrastructure Section - NEW */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#B7791F] to-[#E6C98B] mb-4">
          Região & Infraestrutura
        </h2>
        <p className="text-center text-white text-xl mb-16 max-w-3xl mx-auto">
          Localização privilegiada com fácil acesso a serviços essenciais e infraestrutura completa
        </p>
        
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-3xl p-10">
          <NeighborhoodInfo 
            data={{
              nearest_hospital_name: 'Hospital Regional de Planaltina',
              nearest_hospital_distance_km: 45.3,
              nearest_clinic_name: 'UBS Mestre D\'Armas',
              nearest_clinic_distance_km: 38.7,
              nearest_school_name: 'Escola Classe 01 de Planaltina',
              nearest_school_distance_km: 42.1,
              nearest_university_name: 'UnB - Campus Planaltina',
              nearest_university_distance_km: 47.5,
              nearest_supermarket_name: 'Supermercado BH',
              nearest_supermarket_distance_km: 40.2,
              nearest_pharmacy_name: 'Drogaria São Paulo',
              nearest_pharmacy_distance_km: 39.8,
              nearest_gas_station_name: 'Posto Shell BR-020',
              nearest_gas_station_distance_km: 35.4,
              nearest_bank_name: 'Banco do Brasil Planaltina',
              nearest_bank_distance_km: 41.5,
              road_condition: 'paved',
              road_quality: 'good',
              internet_available: true,
              internet_type: 'fiber',
              internet_speed_mbps: 100,
              mobile_signal_quality: 'good',
              distance_to_city_center_km: 45.0,
              nearest_city_name: 'Planaltina',
              rural_area: true,
              urban_area: false
            }}
            showTitle={false}
          />
        </div>
      </section>

      {/* Location & Contact - ENHANCED */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-3xl p-10">
            <h3 className="text-3xl font-bold text-[#E6C98B] mb-6 flex items-center gap-3">
              <MapPin className="w-8 h-8" />
              Localização Privilegiada
            </h3>
            <p className="text-white mb-6 text-lg leading-relaxed font-medium">
              Zona Rural de Corumbaíba, GO - Último pontal do Rio Corumbá antes de encontrar o Rio Paranaíba. 
              Acesso por estrada asfaltada e infraestrutura completa.
            </p>
            <ul className="space-y-3 text-white font-medium">
              <li className="flex items-start gap-3">
                <span className="text-[#A8C97F] text-xl">✓</span>
                <span>45 minutos do centro de Corumbaíba</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#A8C97F] text-xl">✓</span>
                <span>Acesso por estrada pavimentada</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#A8C97F] text-xl">✓</span>
                <span>Vista panorâmica da represa</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#A8C97F] text-xl">✓</span>
                <span>Área de preservação ambiental</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-3xl p-10">
            <h3 className="text-3xl font-bold text-[#E6C98B] mb-6">
              Fale Conosco
            </h3>
            <p className="text-white mb-8 text-lg font-medium">
              Nossa equipe está pronta para esclarecer todas as suas dúvidas e agendar sua visita.
            </p>
            <div className="space-y-4">
              <a
                href="https://wa.me/5534992610004?text=Olá! Gostaria de saber mais sobre os Sítios Carcará"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-8 py-5 bg-[#25D366] hover:bg-[#20BD5A] text-[#0a0a0a] font-bold rounded-xl transition-all hover:scale-105 text-center flex items-center justify-center gap-3"
              >
                <Phone className="w-6 h-6" />
                WhatsApp: (34) 99261-0004
              </a>
              <a
                href="mailto:contato@publimicro.com.br"
                className="block px-8 py-5 border-2 border-[#E6C98B] text-[#E6C98B] hover:bg-[#E6C98B]/10 font-bold rounded-xl transition-all text-center flex items-center justify-center gap-3"
              >
                <Mail className="w-6 h-6" />
                contato@publimicro.com.br
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <VisitModal
        adId={selectedSitio?.id || 'sitios-carcara'}
        adTitle={selectedSitio ? `Sítio ${selectedSitio.title}` : 'Sítios Carcará'}
        open={showVisitModal}
        onClose={() => setShowVisitModal(false)}
      />
      {selectedSitio && (
        <ProposalModal
          adId={selectedSitio.id}
          adTitle={`Sítio ${selectedSitio.title}`}
          currentBid={selectedSitio.price}
          minBid={selectedSitio.price}
          open={showProposalModal}
          onClose={() => setShowProposalModal(false)}
        />
      )}

      {/* Floating WhatsApp Button - Desktop Only */}
      <a
        href="https://wa.me/5534992610004?text=Olá! Gostaria de conhecer os Sítios Carcará"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-8 right-8 z-50 px-8 py-6 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xl font-bold rounded-full shadow-2xl transition-all hover:scale-110 items-center gap-3 animate-bounce hover:animate-none focus:outline-none focus:ring-4 focus:ring-[#25D366]"
        aria-label="Fale conosco no WhatsApp"
      >
        <Phone className="w-8 h-8" />
        <span>WhatsApp</span>
      </a>

      {/* Mobile Action Bar - Bottom Sticky */}
      <StickyMobileAction position="bottom">
        <div className="flex gap-3">
          <ActionButton
            variant="primary"
            icon={<Phone className="w-5 h-5" />}
            onClick={() => window.open('https://wa.me/5534992610004?text=Olá! Gostaria de conhecer os Sítios Carcará', '_blank')}
          >
            WhatsApp
          </ActionButton>
          <ActionButton
            variant="secondary"
            icon={<Calendar className="w-5 h-5" />}
            onClick={() => setShowVisitModal(true)}
          >
            Agendar Visita
          </ActionButton>
        </div>
      </StickyMobileAction>
    </main>
  );
}
