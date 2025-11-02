'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MapPin, Home, Trees, Droplets, Zap, ShieldCheck, Calendar, TrendingUp, Phone, Mail, ArrowLeft } from 'lucide-react';
import VisitModal from '@/components/VisitModal';
import ProposalModal from '@/components/ProposalModal';
import FavoritesButton from '@/components/FavoritesButton';

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
  nome: string;
  zona: string;
  preco: number;
  lance_inicial: number;
  fotos: string[];
  descricao?: string;
  area_total?: number;
}

export default function CarcaraProjectPage() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [selectedSitio, setSelectedSitio] = useState<Sitio | null>(null);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSitios() {
      const { data, error } = await supabase
        .from('sitios')
        .select('*')
        .in('id', ['surucua', 'juriti', 'seriema', 'mergulhao', 'bigua', 'abare'])
        .order('preco', { ascending: true });

      if (!error && data) {
        setSitios(data);
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

      {/* Hero Section - ENHANCED */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg"
          alt="Sítios Carcará"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/70 to-[#0a0a0a]" />
        {/* Animated birds and nature effects */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* Example: 3 animated SVG birds, can be replaced with 3D or Lottie later */}
          <svg className="absolute left-10 top-20 animate-bird-fly" width="60" height="40" viewBox="0 0 60 40"><path d="M10 20 Q30 0 50 20 Q30 40 10 20" stroke="#A8C97F" strokeWidth="2" fill="none"/></svg>
          <svg className="absolute right-20 top-32 animate-bird-fly" width="40" height="30" viewBox="0 0 40 30"><path d="M5 15 Q20 0 35 15 Q20 30 5 15" stroke="#B7791F" strokeWidth="2" fill="none"/></svg>
          <svg className="absolute left-1/2 top-10 animate-bird-fly" width="50" height="35" viewBox="0 0 50 35"><path d="M8 17 Q25 2 42 17 Q25 32 8 17" stroke="#0D7377" strokeWidth="2" fill="none"/></svg>
          {/* Add more effects as needed */}
        </div>
        <style jsx>{`
          @keyframes bird-fly {
            0% { transform: translateY(0) scale(1); opacity: 0.7; }
            50% { transform: translateY(-20px) scale(1.1); opacity: 1; }
            100% { transform: translateY(0) scale(1); opacity: 0.7; }
          }
          .animate-bird-fly { animation: bird-fly 6s infinite ease-in-out; }
        `}</style>
        <div className="relative z-30 text-center px-6 max-w-6xl">
          <div className="inline-flex items-center gap-2 mb-6 px-8 py-4 bg-[#A8C97F]/30 border-2 border-[#A8C97F] rounded-full backdrop-blur-md animate-pulse">
            <span className="text-[#A8C97F] font-bold text-xl tracking-widest uppercase">
               LANÇAMENTO EXCLUSIVO
            </span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E6C98B] via-[#A8C97F] to-[#B7791F] mb-8 leading-tight">
            Sítios Carcará
          </h1>
          
          <p className="text-3xl md:text-4xl text-[#E6C98B] mb-6 leading-relaxed font-light">
            6 Propriedades Exclusivas às Margens da Represa
          </p>
          
          <p className="text-xl text-[#A8C97F] mb-4 max-w-4xl mx-auto">
            <MapPin className="inline w-5 h-5 mr-2" />
            Corumbaíba, Goiás - Último Pontal do Rio Corumbá antes do Paranaíba
          </p>

          <p className="text-lg text-[#E6C98B] mb-10 max-w-3xl mx-auto leading-relaxed">
            Natureza preservada, infraestrutura completa e localização privilegiada. 
            Perfeito para descanso, agricultura sustentável e investimento de longo prazo.
          </p>

          <div className="inline-block px-6 py-3 bg-[#0D7377]/20 border-2 border-[#0D7377] rounded-full mb-8">
            <span className="text-[#0D7377] font-bold text-2xl">
              Lances a partir de R$ 1.050.000
            </span>
          </div>

          <div className="flex gap-6 justify-center flex-wrap">
            <a
              href="#sitios"
              className="px-12 py-6 bg-gradient-to-r from-[#A8C97F] to-[#8B9B6E] hover:from-[#8B9B6E] hover:to-[#A8C97F] text-black text-xl font-bold rounded-full transition-all hover:scale-110 shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#A8C97F]"
              aria-label="Ver propriedades disponíveis"
              tabIndex={0}
              role="button"
            >
               Ver Propriedades
            </a>
            <a
              href="https://wa.me/5534992610004?text=Olá! Gostaria de conhecer os Sítios Carcará"
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-6 border-4 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 text-xl font-bold rounded-full transition-all hover:scale-110 flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-[#25D366]"
              aria-label="Fale conosco no WhatsApp"
              tabIndex={0}
              role="button"
            >
              <Phone className="w-6 h-6" />
              Contato WhatsApp
            </a>
            <button
              type="button"
              className="px-12 py-6 bg-gradient-to-r from-[#0D7377] to-[#5F7161] text-[#E6C98B] font-bold rounded-full shadow-lg transition-all hover:scale-110 flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-[#0D7377]"
              aria-label="Solicitar mais informações"
              onClick={() => window.location.href = '/contato'}
              tabIndex={0}
            >
              <Mail className="w-6 h-6" />
              Procurando mais informações
            </button>
            <button
              type="button"
              className="px-12 py-6 border-2 border-[#0D7377] text-[#0D7377] hover:bg-[#0D7377]/10 font-bold rounded-full transition-all flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-[#0D7377]"
              aria-label="Agendar visita"
              onClick={() => window.location.href = '/schedule-visit'}
              tabIndex={0}
            >
              <Calendar className="w-6 h-6" />
              Agendar Visita
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#0D7377]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-[#A8C97F] mb-2">6</div>
              <div className="text-[#676767] uppercase tracking-wide">Propriedades</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#0D7377] mb-2">~2.5km²</div>
              <div className="text-[#676767] uppercase tracking-wide">Área Média</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#B7791F] mb-2">100%</div>
              <div className="text-[#676767] uppercase tracking-wide">Regularizado</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#A8C97F] mb-2">15km²</div>
              <div className="text-[#676767] uppercase tracking-wide">Área Total</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - ENHANCED */}
      <section className="py-20 px-6 max-w-7xl mx-auto" id="sobre">
        <h2 className="text-5xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#B7791F] to-[#CD7F32] mb-4">
          Diferenciais do Projeto
        </h2>
        <p className="text-center text-[#676767] text-xl mb-16 max-w-3xl mx-auto">
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
              <p className="text-[#676767] leading-relaxed">{feature.desc}</p>
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
            {sitios.map((sitio) => (
              <article
                id={sitio.id}
                key={sitio.id}
                className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-3 border-[#2a2a1a] rounded-3xl overflow-hidden hover:border-[#A8C97F] hover:shadow-2xl hover:shadow-[#A8C97F]/40 transition-all focus:outline-none focus:ring-4 focus:ring-[#A8C97F]"
                tabIndex={0}
                role="button"
                aria-label={`Ver detalhes do sítio ${sitio.nome}`}
              >
                <div className="relative aspect-video">
                  <Image
                    src={sitio.fotos && sitio.fotos.length > 0 ? sitio.fotos[0] : '/images/fallback-rancho.jpg'}
                    alt={`Sítio ${sitio.nome}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/fallback-rancho.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 px-5 py-2 bg-[#2a2a2a]/95 backdrop-blur-md rounded-full border border-[#3a3a2a]">
                    <span className="text-[#0D7377] text-sm font-bold">{sitio.zona}</span>
                  </div>
                  <div className="absolute top-4 right-4 px-5 py-2 bg-[#0D7377] text-black text-sm font-bold rounded-full shadow-lg">
                     Disponível
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-4xl font-bold text-[#A8C97F] mb-4">Sítio {sitio.nome}</h3>
                  {userId && (
                    <div className="mb-4">
                      <FavoritesButton propertyId={sitio.id} userId={userId} />
                    </div>
                  )}
                  {sitio.descricao && (
                    <p className="text-[#676767] mb-6 leading-relaxed">{sitio.descricao}</p>
                  )}

                  {sitio.area_total && (
                    <div className="flex items-center gap-2 text-[#E6C98B] mb-6">
                      <Home className="w-5 h-5" />
                      <span className="font-semibold">{sitio.area_total} hectares</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-[#2a2a2a]/50 rounded-2xl">
                    <div>
                      <div className="text-xs text-[#676767] mb-2 uppercase tracking-wide">Valor Estimado</div>
                      <div className="font-bold text-[#E6C98B] text-2xl">
                        R$ {(sitio.preco / 1000000).toFixed(1).replace('.', ',')}M
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#676767] mb-2 uppercase tracking-wide">Lance Inicial</div>
                      <div className="font-bold text-[#A8C97F] text-2xl">
                        R$ {(sitio.lance_inicial / 1000000).toFixed(2).replace('.', ',')}M
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleScheduleVisit(sitio)}
                      className="flex-1 px-6 py-4 border-2 border-[#0D7377] text-[#0D7377] hover:bg-[#0D7377]/10 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      Agendar Visita
                    </button>
                    <button
                      onClick={() => handleMakeProposal(sitio)}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-[#A8C97F] to-[#8B9B6E] hover:from-[#8B9B6E] hover:to-[#A8C97F] text-[#0a0a0a] font-bold rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <TrendingUp className="w-5 h-5" />
                      Fazer Proposta
                    </button>
                  </div>
                </div>
              </article>
            ))}
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

      {/* Location & Contact - ENHANCED */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-3xl p-10">
            <h3 className="text-3xl font-bold text-[#E6C98B] mb-6 flex items-center gap-3">
              <MapPin className="w-8 h-8" />
              Localização Privilegiada
            </h3>
            <p className="text-[#676767] mb-6 text-lg leading-relaxed">
              Zona Rural de Corumbaíba, GO - Último pontal do Rio Corumbá antes de encontrar o Rio Paranaíba. 
              Acesso por estrada asfaltada e infraestrutura completa.
            </p>
            <ul className="space-y-3 text-[#676767]">
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
            <p className="text-[#676767] mb-8 text-lg">
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
      {selectedSitio && (
        <>
          <VisitModal
            adId={selectedSitio.id}
            adTitle={`Sítio ${selectedSitio.nome}`}
            open={showVisitModal}
            onClose={() => setShowVisitModal(false)}
          />
          <ProposalModal
            adId={selectedSitio.id}
            adTitle={`Sítio ${selectedSitio.nome}`}
            currentBid={selectedSitio.preco}
            minBid={selectedSitio.lance_inicial}
            open={showProposalModal}
            onClose={() => setShowProposalModal(false)}
          />
        </>
      )}
    </main>
  );
}
