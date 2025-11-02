"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Carcara3D } from "@publimicro/ui";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import VisitModal from "@/components/VisitModal";
import FavoritesButton from "@/components/FavoritesButton";
import SearchBar from "@/components/SearchBar";
import WelcomeModal from "@/components/WelcomeModal";
import RecentlyViewed from "@/components/RecentlyViewed";
import { LiveCounter, ActivityFeed, Testimonials, TrustBadges } from "@/components/SocialProof";
import { 
  Home, Car, Tractor, Ship, Globe, 
  Plane, Share2, ShoppingBag, Sparkles, Calendar, Info
} from "lucide-react";

// Dynamic import to avoid SSR issues with Leaflet
const LeafletMapKML = dynamic(() => import("@/components/LeafletMapKML"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-[#1a1a1a] rounded-2xl flex items-center justify-center">
      <div className="text-[#D4A574] text-xl">Carregando mapa gratuito...</div>
    </div>
  ),
});

// Sections with concept phrases
// Index 0: PubliProper (displayed separately)
// Index 1-3: Row 1 (Motors, Machina, Marine)
// Index 4-6: Row 2 (Global, Share, Tudo)
// PubliJourney displayed separately on top
const sections = [
  { name: "PubliProper", icon: Home, href: "/proper", unsplashQuery: "modern+luxury+house+exterior", concept: "Seu lar dos sonhos" },
  { name: "PubliMotors", icon: Car, href: "/motors", unsplashQuery: "luxury+sports+car+dealership", concept: "Mobilidade com estilo" },
  { name: "PubliMachina", icon: Tractor, href: "/machina", unsplashQuery: "john+deere+tractor+farm+equipment", concept: "Força para produzir" },
  { name: "PubliMarine", icon: Ship, href: "/marine", unsplashQuery: "luxury+yacht+marina+boat", concept: "Navegue seus sonhos" },
  { name: "PubliGlobal", icon: Globe, href: "/global", unsplashQuery: "world+map+global+business+airport", concept: "Negócios sem fronteiras" },
  { name: "PubliShare", icon: Share2, href: "/share", unsplashQuery: "car+sharing+bike+sharing+community", concept: "Compartilhe e economize" },
  { name: "PubliTudo", icon: ShoppingBag, href: "/tudo", unsplashQuery: "shopping+mall+retail+marketplace", concept: "Tudo em um só lugar" },
];

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
  localizacao?: string;
  preco?: number;
  fotos: string[];
  destaque?: boolean;
  zona?: string;
  lance_inicial?: number;
}

export default function HomePage() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<{ id: string; title: string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id || null);
    });

    async function fetchSitios() {
      try {
        let { data, error } = await supabase
          .from("sitios")
          .select("*")
          .eq("destaque", true)
          .limit(6);

        if (error) {
          console.error("Supabase error:", error);
          setErrorMsg("Erro ao buscar propriedades em destaque.");
        }
        if (!data || data.length === 0) {
          const fallback = await supabase.from("sitios").select("*").limit(6);
          data = fallback.data;
        }
        console.log("Sitios loaded:", data);
        console.log("First sitio photos:", data?.[0]?.fotos);
        setSitios(data || []);
      } catch (err) {
        console.error("Error fetching sitios:", err);
        setErrorMsg("Erro inesperado ao buscar propriedades.");
        setSitios([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSitios();
  }, []);

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]" role="main">
      <div className="max-w-7xl mx-auto px-6">
        {/* SEARCH SECTION */}
        <section className="py-12">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E6C98B] to-[#B7791F] mb-3">
                Encontre sua Propriedade Ideal
              </h2>
              <p className="text-[#A8C97F] text-center max-w-2xl">
                Use filtros avançados para buscar por preço, área, localização e muito mais
              </p>
            </div>
            <div className="flex justify-center">
              <SearchBar />
            </div>
          </div>
        </section>

        {/* SUPER HIGHLIGHT - Sítios Carcará */}
        <section className="py-16">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#A8C97F]/40 min-h-[600px] group">
            <Image
              src="https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg"
              alt="Sítios Carcará"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/95 via-[#0a0a0a]/80 to-transparent" />
            {/* Bird */}
            <div className="absolute top-8 left-8 w-[220px] h-[220px] z-30 hidden lg:block">
              <Carcara3D scale={1.1} />
            </div>
            <div className="relative p-12 lg:pl-64 z-20">
              <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-[#78350f]/90 border-2 border-[#92400e] rounded-full backdrop-blur-md shadow-lg">
                <Sparkles className="w-5 h-5 text-[#fbbf24] animate-pulse" />
                <span className="text-[#fbbf24] font-bold text-lg tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Super Destaque</span>
              </div>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#1a1a1a] mb-6 drop-shadow-[0_2px_4px_rgba(255,255,255,0.5)] leading-tight">
                Sítios Carcará
              </h2>
              <p className="text-[#1a1a1a] text-xl md:text-2xl mb-8 max-w-2xl leading-relaxed font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]">
                6 propriedades exclusivas às margens da represa de Corumbaíba, GO. 
                Natureza preservada, infraestrutura completa. 
                Lances a partir de <span className="text-[#B7791F] font-bold">R$ 1.050.000</span>
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/projetos/carcara"
                  className="px-10 py-5 bg-gradient-to-r from-[#A8C97F] to-[#8B9B6E] hover:from-[#8B9B6E] hover:to-[#A8C97F] text-[#0a0a0a] text-lg font-bold rounded-full transition-all hover:scale-105 shadow-2xl"
                >
                  Conhecer
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CENTRAL PUBLIMICRO TITLE WITH SECTIONS - 3 PER ROW LAYOUT */}
        <section className="py-20">
          {/* Top Row: PubliProper + Title + PubliJourney */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-center mb-6">
            {/* LEFT - PubliProper */}
            <div className="flex justify-end">
              <Link
                href="/proper"
                className="group relative w-full max-w-sm h-48 rounded-xl overflow-hidden shadow-xl hover:shadow-[#A8C97F]/50 transition-all duration-300 hover:scale-105 block border-2 border-[#2a2a1a] hover:border-[#A8C97F]"
              >
                <Image
                  src="https://source.unsplash.com/random/600x400/?modern+luxury+house+exterior"
                  alt="PubliProper"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/80 to-[#0a0a0a]/30" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                  <Home className="w-16 h-16 text-[#A8C97F] mb-3 group-hover:scale-125 transition-all duration-300" strokeWidth={1.5} />
                  <h3 className="text-2xl font-bold text-[#E6C98B] group-hover:text-[#A8C97F] transition-colors mb-2">
                    PubliProper
                  </h3>
                  <p className="text-sm text-[#A8C97F] font-medium italic">
                    Seu lar dos sonhos
                  </p>
                </div>
              </Link>
            </div>

            {/* CENTER - PubliMicro Title */}
            <div className="flex items-center justify-center px-4 lg:px-12">
              <div className="text-center">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                  <span className="text-[#B7791F]">Publi</span>
                  <span className="text-[#CD7F32]">Micr</span>
                  <span className="relative inline-block">
                    <span className="text-[#B87333]">o</span>
                    <svg
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35px] h-[35px] md:w-[40px] md:h-[40px] text-[#A8C97F]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <line x1="12" y1="2" x2="12" y2="7" />
                      <line x1="12" y1="17" x2="12" y2="22" />
                      <line x1="2" y1="12" x2="7" y2="12" />
                      <line x1="17" y1="12" x2="22" y2="12" />
                    </svg>
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-[#A8C97F] font-light tracking-wide mb-6">
                  Conectando pessoas, negócios e oportunidades
                </p>
                <div className="bg-gradient-to-r from-[#A8C97F]/20 to-[#E6C98B]/20 border-2 border-[#A8C97F]/40 rounded-xl p-5 backdrop-blur-sm max-w-md">
                  <p className="text-[#E6C98B] text-base font-medium leading-relaxed">
                    Do campo à cidade, do local ao global. Sua plataforma completa de negócios.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT - PubliJourney */}
            <div className="flex justify-start">
              <Link
                href="/journey"
                className="group relative w-full max-w-sm h-48 rounded-xl overflow-hidden shadow-xl hover:shadow-[#E6C98B]/50 transition-all duration-300 hover:scale-105 block border-2 border-[#2a2a1a] hover:border-[#E6C98B]"
              >
                <Image
                  src="https://source.unsplash.com/random/600x400/?travel+adventure+vacation+destination"
                  alt="PubliJourney"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/80 to-[#0a0a0a]/30" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                  <Plane className="w-16 h-16 text-[#E6C98B] mb-3 group-hover:scale-125 transition-all duration-300" strokeWidth={1.5} />
                  <h3 className="text-2xl font-bold text-[#E6C98B] group-hover:text-[#B7791F] transition-colors mb-2">
                    PubliJourney
                  </h3>
                  <p className="text-sm text-[#A8C97F] font-medium italic">
                    Viva experiências únicas
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Row 1: 3 Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {sections.slice(1, 4).map((section) => {
              const IconComponent = section.icon;
              return (
                <Link
                  key={section.name}
                  href={section.href}
                  className="group relative h-44 rounded-xl overflow-hidden shadow-xl hover:shadow-[#A8C97F]/50 transition-all duration-300 hover:scale-105 block border-2 border-[#2a2a1a] hover:border-[#A8C97F]"
                >
                  <Image
                    src={`https://source.unsplash.com/random/600x400/?${section.unsplashQuery}`}
                    alt={section.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/80 to-[#0a0a0a]/30" />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
                    <IconComponent className="w-14 h-14 text-[#E6C98B] mb-2 group-hover:scale-125 transition-all duration-300" strokeWidth={1.5} />
                    <h3 className="text-xl font-bold text-[#E6C98B] group-hover:text-[#A8C97F] transition-colors mb-1">
                      {section.name}
                    </h3>
                    <p className="text-xs text-[#A8C97F] font-medium italic">
                      {section.concept}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Row 2: 3 Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sections.slice(4, 7).map((section) => {
              const IconComponent = section.icon;
              return (
                <Link
                  key={section.name}
                  href={section.href}
                  className="group relative h-44 rounded-xl overflow-hidden shadow-xl hover:shadow-[#E6C98B]/50 transition-all duration-300 hover:scale-105 block border-2 border-[#2a2a1a] hover:border-[#E6C98B]"
                >
                  <Image
                    src={`https://source.unsplash.com/random/600x400/?${section.unsplashQuery}`}
                    alt={section.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/80 to-[#0a0a0a]/30" />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
                    <IconComponent className="w-14 h-14 text-[#B7791F] mb-2 group-hover:scale-125 transition-all duration-300" strokeWidth={1.5} />
                    <h3 className="text-xl font-bold text-[#E6C98B] group-hover:text-[#B7791F] transition-colors mb-1">
                      {section.name}
                    </h3>
                    <p className="text-xs text-[#A8C97F] font-medium italic">
                      {section.concept}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Properties with Bidding Schema */}
        {!loading && sitios.length > 0 && (
          <section className="py-16">
            <h2 className="text-4xl font-bold text-[#E6C98B] mb-12 text-center">
              Sítios Disponíveis - Lances Abertos
            </h2>
            {errorMsg && (
              <div className="text-center text-[#E6C98B] font-semibold mb-8">
                {errorMsg}
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {sitios.map((sitio) => {
                const fotoUrl = sitio.fotos && sitio.fotos.length > 0 ? sitio.fotos[0] : "/images/fallback-rancho.jpg";
                console.log(`Sitio ${sitio.nome} photo URL:`, fotoUrl);
                return (
                  <Link 
                    key={sitio.id} 
                    href={`/imoveis/${sitio.id}`}
                    className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl overflow-hidden hover:border-[#A8C97F] transition-all hover:scale-105 shadow-xl cursor-pointer block"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={fotoUrl}
                        alt={sitio.nome || "Sítio"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/fallback-rancho.jpg";
                        }}
                      />
                      {sitio.zona && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-[#1a1a1a]/90 text-[#A8C97F] font-bold rounded-lg text-sm border border-[#A8C97F]/30">
                          {sitio.zona}
                        </div>
                      )}
                      {/* Favorites Heart Button - Moved to top right */}
                      <div className="absolute top-3 right-3">
                        <FavoritesButton propertyId={sitio.id} userId={userId} size="md" />
                      </div>
                    </div>
                    
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="text-lg font-bold text-[#D4A574] line-clamp-1">{sitio.nome}</h3>
                      {sitio.localizacao && <p className="text-[#8B9B6E] text-xs line-clamp-1">{sitio.localizacao}</p>}
                      
                      {/* Bidding Schema Box */}
                      {typeof sitio.lance_inicial === "number" && (
                        <div className="bg-[#0a0a0a] rounded-lg p-3 border border-[#A8C97F]/40">
                          <div className="text-[#E6C98B] text-xs font-semibold mb-1">Lance Inicial</div>
                          <div className="text-[#A8C97F] font-bold text-xl">
                            R$ {sitio.lance_inicial.toLocaleString("pt-BR")}
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Free Leaflet Map with KML Property Boundaries */}
        <section className="py-16">
          <h2 className="text-4xl font-bold text-[#E6C98B] mb-8 text-center">
            Mapa Interativo das Propriedades
          </h2>
          <p className="text-[#A8C97F] text-center mb-12 max-w-3xl mx-auto text-lg">
            Visualize em mapa de satélite a localização exata dos 6 sítios Carcará às margens da represa de Corumbaíba, GO. 
            Clique nas áreas coloridas para ver informações detalhadas de cada propriedade.
          </p>
          <div className="h-[700px]">
            <LeafletMapKML kmlData={KML_DATA} />
          </div>
        </section>

        {/* Recently Viewed Properties */}
        <RecentlyViewed />

        {/* Social Proof Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            {/* Live Activity */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
              <LiveCounter />
              <ActivityFeed />
            </div>

            {/* Trust Badges */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E6C98B] to-[#A8C97F] text-center mb-8">
                Por que confiar no PubliMicro?
              </h2>
              <TrustBadges />
            </div>

            {/* Testimonials */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E6C98B] to-[#A8C97F] text-center mb-8">
                O que nossos clientes dizem
              </h2>
              <Testimonials />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 mt-20 border-t-2 border-[#2a2a1a]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-[#E6C98B] mb-4">Imóveis</h4>
              <ul className="space-y-2 text-[#A8C97F]">
                <li><Link href="/proper/urban" className="hover:text-[#B7791F]">Urbanos</Link></li>
                <li><Link href="/proper/rural" className="hover:text-[#B7791F]">Rurais</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#E6C98B] mb-4">Veículos</h4>
              <ul className="space-y-2 text-[#A8C97F]">
                <li><Link href="/motors" className="hover:text-[#B7791F]">Carros</Link></li>
                <li><Link href="/motors" className="hover:text-[#B7791F]">Motos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#E6C98B] mb-4">Serviços</h4>
              <ul className="space-y-2 text-[#A8C97F]">
                <li><Link href="/tudo" className="hover:text-[#B7791F]">Marketplace</Link></li>
                <li><Link href="/share" className="hover:text-[#B7791F]">Compartilhado</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#E6C98B] mb-4">Conta</h4>
              <ul className="space-y-2 text-[#A8C97F]">
                <li><Link href="/entrar" className="hover:text-[#B7791F]">Entrar</Link></li>
                <li><Link href="/postar" className="hover:text-[#B7791F]">Postar</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-[#A8C97F] text-sm pt-8 border-t border-[#2a2a1a]">
            2025 PubliMicro Ecosystem. Todos os direitos reservados.
          </div>
        </footer>
      </div>

      {/* Visit Modal */}
      {selectedProperty && (
        <VisitModal
          adId={selectedProperty.id}
          adTitle={selectedProperty.title}
          open={visitModalOpen}
          onClose={() => {
            setVisitModalOpen(false);
            setSelectedProperty(null);
          }}
        />
      )}

      {/* Welcome Modal for First-Time Users */}
      <WelcomeModal />
    </main>
  );
}
