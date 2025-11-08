"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Carcara3D, PropertyCard } from "@publimicro/ui";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import VisitModal from "@/components/VisitModal";
import FavoritesButton from "@/components/FavoritesButton";
import SearchBar from "@/components/SearchBar";
import SwipeGallery from "@/components/SwipeGallery";
import WelcomeModal from "@/components/WelcomeModal";
import RecentlyViewed from "@/components/RecentlyViewed";
import BrazilTimeClock from "@/components/BrazilTimeClock";
import { LiveCounter, ActivityFeed, Testimonials, TrustBadges } from "@/components/SocialProof";
import { PropertyCardSkeleton } from "@/components/Skeleton";
import { useUnsplashImages } from "@/hooks/useUnsplashImages";
import { getFirstPhoto } from "@/lib/photoUtils";
import { 
  Home, Car, Tractor, Ship, Globe, 
  Plane, Share2, ShoppingBag, Sparkles, Calendar, Info, Handshake
} from "lucide-react";

// Dynamic import to avoid SSR issues with Leaflet
const LeafletMapKML = dynamic(() => import("@/components/LeafletMapKML"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-[#5A5E5D] rounded-2xl flex items-center justify-center">
      <div className="text-[#D4A574] text-xl">Carregando mapa gratuito...</div>
    </div>
  ),
});

// Sections with concept phrases and category keys for Unsplash
// Index 0: AcheMeProper (displayed separately)
// Index 1-3: Row 1 (Motors, Machina, Marine)
// Index 4-6: Row 2 (Global, Share, Tudo)
// AcheMeJour displayed separately on top
const sections = [
  { name: "AcheMeProper", icon: Home, href: "/proper", category: "proper" as const, concept: "Seu lar dos sonhos" },
  { name: "AcheMeMotors", icon: Car, href: "/motors", category: "motors" as const, concept: "Mobilidade com estilo" },
  { name: "AcheMeMachina", icon: Tractor, href: "/machina", category: "machina" as const, concept: "Força para produzir" },
  { name: "AcheMeMarine", icon: Ship, href: "/marine", category: "marine" as const, concept: "Navegue seus sonhos" },
  { name: "AcheMeGlobal", icon: Globe, href: "/global", category: "global" as const, concept: "Negócios sem fronteiras" },
  { name: "AcheMeShare", icon: Share2, href: "/share", category: "share" as const, concept: "Sharangas - Compartilhe e economize" },
  { name: "AcheMeTudo", icon: ShoppingBag, href: "/tudo", category: "tudo" as const, concept: "Tudo em um só lugar" },
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
  current_bid?: number; // Current highest proposal value
  tamanho?: number; // Total area in hectares or m²
  area_total?: number; // Alternative field name for area
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  photos: string[];
  city: string;
  state: string;
  slug: string;
  is_featured: boolean;
  condition: string;
  categories: {
    name: string;
    icon: string;
  } | null;
}

export default function HomePage() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<{ id: string; title: string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Load Unsplash images for section buttons
  const { images: unsplashImages, loading: imagesLoading } = useUnsplashImages();

  // Handler for Fazer Proposta button
  const handleFazerProposta = async (propertyId: string, propertyTitle: string) => {
    // Play auction sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);

    // Check if user is logged in
    if (!userId) {
      // Redirect to login - will open AccountModal via TopNav
      alert('Por favor, faça login para fazer uma proposta.');
      window.location.href = '/entrar';
      return;
    }

    // Check if user has scheduled a visit for this property
    const { data: visits, error } = await supabase
      .from('visits')
      .select('*')
      .eq('ad_id', propertyId)
      .eq('guest_email', (await supabase.auth.getUser()).data.user?.email)
      .or('status.eq.confirmed,status.eq.completed');

    if (error) {
      console.error('Error checking visits:', error);
    }

    if (!visits || visits.length === 0) {
      // User hasn't scheduled a visit yet
      alert('Você precisa agendar e realizar uma visita antes de fazer uma proposta.');
      setSelectedProperty({ id: propertyId, title: propertyTitle });
      setVisitModalOpen(true);
      return;
    }

    // User has visited, redirect to proposal form
    window.location.href = `/proposta?propId=${propertyId}`;
  };

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
          const { data: carcaraData, error: carcaraError } = await supabase
          .from("properties")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(6);

        if (carcaraError) {
          console.error("Error fetching Carcará properties:", carcaraError);
          const fallback = await supabase.from("properties").select("*").limit(6);
          data = fallback.data;
        } else {
          data = carcaraData;
        }
        }
        
        // Fetch current highest bid for each property
        if (data) {
          const sitiosWithBids = await Promise.all(
            data.map(async (sitio) => {
              const { data: bids } = await supabase
                .from('proposals')
                .select('amount')
                .eq('property_id', sitio.id)
                .order('amount', { ascending: false })
                .limit(1);
              
              return {
                ...sitio,
                current_bid: bids && bids.length > 0 ? bids[0].amount : null
              };
            })
          );
          console.log("Sitios loaded:", sitiosWithBids);
          console.log("First sitio photos:", sitiosWithBids?.[0]?.fotos);
          setSitios(sitiosWithBids || []);
        }
      } catch (err) {
        console.error("Error fetching sitios:", err);
        setErrorMsg("Erro inesperado ao buscar propriedades.");
        setSitios([]);
      } finally {
        setLoading(false);
      }
    }

    async function fetchListings() {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select(`
            id,
            title,
            description,
            price,
            photos,
            city,
            state,
            slug,
            is_featured,
            condition,
            categories!inner (name, icon)
          `)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(8);

        if (error) {
          console.error("Error fetching listings:", error);
        } else {
          // Transform the data to match our interface
          const transformedData: Listing[] = (data || []).map((listing: any) => ({
            id: listing.id,
            title: listing.title,
            description: listing.description,
            price: listing.price,
            photos: listing.photos,
            city: listing.city,
            state: listing.state,
            slug: listing.slug,
            is_featured: listing.is_featured,
            condition: listing.condition,
            categories: Array.isArray(listing.categories) ? listing.categories[0] : listing.categories
          }));
          setListings(transformedData);
        }
      } catch (err) {
        console.error("Failed to fetch listings:", err);
      }
    }

    fetchSitios();
    fetchListings();
  }, []);

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-b from-[#4A4E4D] via-[#3A3E3D] to-[#4A4E4D]" role="main">
      <div className="max-w-7xl mx-auto px-6">
        {/* SEARCH SECTION */}
        <section className="py-12">
          <div className="bg-gradient-to-br from-[#5A5E5D] to-[#3A3E3D] border-2 border-[#2a2a1a] rounded-3xl p-8 shadow-2xl">
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
            {/* Bird */}
            <div className="absolute top-8 left-8 w-[220px] h-[220px] z-30 hidden lg:block">
              <Carcara3D scale={1.1} />
            </div>
            <div className="relative p-12 lg:pl-64 z-20">
              <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] rounded-full shadow-lg transform hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-[#0a0a0a] animate-pulse" />
                <span className="text-[#0a0a0a] font-bold text-lg tracking-widest uppercase">Super Destaque</span>
              </div>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#CD7F32] to-[#B87333] mb-6 leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                Sítios Carcará
              </h2>
              <p className="text-[#E6C98B] text-xl md:text-2xl mb-8 max-w-2xl leading-relaxed font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                6 propriedades exclusivas de <span className="text-[#D4AF37] font-bold">2 hectares cada</span>, próximas ao Lago das Brisas e Corumbazu, distritos de <span className="text-[#D4AF37] font-semibold">Buriti Alegre, GO</span> (30km de asfalto após a balsa, 40min de carro). 
                Natureza preservada, rio perene. 
                Lances a partir de <span className="text-[#D4AF37] font-bold text-3xl">R$ 1.050.000</span>
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/projetos/carcara"
                  className="px-10 py-5 bg-gradient-to-r from-[#CD7F32] to-[#B87333] hover:from-[#D4AF37] hover:to-[#CD7F32] text-[#0a0a0a] text-lg font-bold rounded-full transition-all hover:scale-110 shadow-2xl transform hover:-translate-y-1"
                >
                  Conhecer Projeto
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CENTRAL ACHEME TITLE WITH SECTIONS - 3 PER ROW LAYOUT */}
        <section className="py-20">
          {/* Top Row: AcheMeProper + Title + AcheMeJour */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-center mb-6">
            {/* LEFT - AcheMeProper */}
            <div className="flex justify-end">
              <Link
                href="/proper"
                className="group relative w-full max-w-sm h-48 rounded-xl overflow-hidden shadow-xl hover:shadow-[#A8C97F]/50 transition-all duration-300 hover:scale-105 block border-2 border-[#2a2a1a] hover:border-[#A8C97F]"
              >
                {!imagesLoading && unsplashImages.proper ? (
                  <Image
                    src={unsplashImages.proper}
                    alt="AcheMeProper"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a1a] to-[#5A5E5D] animate-pulse" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/40" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                  <Home className="w-16 h-16 text-[#A8C97F] mb-3 group-hover:scale-125 transition-all duration-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]" strokeWidth={1.5} />
                  <div className="bg-black/80 backdrop-blur-sm px-4 py-3 rounded-lg border-2 border-[#A8C97F]/30">
                    <h3 className="text-2xl font-bold text-[#E6C98B] drop-shadow-[0_4px_12px_rgba(0,0,0,1)] group-hover:text-[#D4AF37] transition-colors mb-2">
                      AcheMeProper
                    </h3>
                    <p className="text-sm text-[#E6C98B] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                      Seu lar dos sonhos
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* CENTER - AcheMe Title */}
            <div className="flex items-center justify-center px-4 lg:px-12">
              <div className="text-center">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600">Ache</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600">Me</span>
                    <svg
                      className="inline-block w-[35px] h-[35px] md:w-[40px] md:h-[40px] ml-2 text-[#A8C97F]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <circle cx="12" cy="8" r="3" />
                      <circle cx="12" cy="8" r="6" opacity="0.3" />
                      <path d="M12 2 L12 14 M12 8 L18 8 M12 8 L6 8" opacity="0.5" />
                    </svg>
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

            {/* RIGHT - AcheMeJour */}
            <div className="flex justify-start">
              <Link
                href="/journey"
                className="group relative w-full max-w-sm h-48 rounded-xl overflow-hidden shadow-xl hover:shadow-[#E6C98B]/50 transition-all duration-300 hover:scale-105 block border-2 border-[#2a2a1a] hover:border-[#E6C98B]"
              >
                {!imagesLoading && unsplashImages.journey ? (
                  <Image
                    src={unsplashImages.journey}
                    alt="AcheMeJour"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a1a] to-[#5A5E5D] animate-pulse" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/40" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                  <Plane className="w-16 h-16 text-[#E6C98B] mb-3 group-hover:scale-125 transition-all duration-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]" strokeWidth={1.5} />
                  <div className="bg-black/80 backdrop-blur-sm px-4 py-3 rounded-lg border-2 border-[#E6C98B]/30">
                    <h3 className="text-2xl font-bold text-[#E6C98B] drop-shadow-[0_4px_12px_rgba(0,0,0,1)] group-hover:text-[#CD7F32] transition-colors mb-2">
                      AcheMeJour
                    </h3>
                    <p className="text-sm text-[#E6C98B] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                      Viva experiências únicas
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Row 1: 3 Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {sections.slice(1, 4).map((section) => {
              const IconComponent = section.icon;
              const imageUrl = unsplashImages[section.category];
              
              return (
                <Link
                  key={section.name}
                  href={section.href}
                  className="group relative h-44 rounded-xl overflow-hidden shadow-xl hover:shadow-[#A8C97F]/50 transition-all duration-300 hover:scale-105 block border-2 border-[#2a2a1a] hover:border-[#A8C97F]"
                >
                  {!imagesLoading && imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={section.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a1a] to-[#5A5E5D] animate-pulse" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/40" />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
                    <IconComponent className="w-16 h-16 md:w-14 md:h-14 text-[#E6C98B] mb-3 md:mb-2 group-hover:scale-125 transition-all duration-300 drop-shadow-[0_6px_12px_rgba(0,0,0,0.95)]" strokeWidth={2} />
                    <div className="bg-black/95 backdrop-blur-md px-6 py-4 md:px-5 md:py-3 rounded-xl border-2 border-[#E6C98B]/70 shadow-2xl">
                      <h3 className="text-2xl md:text-2xl font-black text-[#E6C98B] drop-shadow-[0_4px_16px_rgba(0,0,0,1)] group-hover:text-[#D4AF37] transition-colors mb-1">
                        {section.name}
                      </h3>
                      <p className="text-base md:text-xs text-[#E6C98B] font-extrabold drop-shadow-[0_3px_10px_rgba(0,0,0,1)]">
                        {section.concept}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Row 2: 3 Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sections.slice(4, 7).map((section) => {
              const IconComponent = section.icon;
              const imageUrl = unsplashImages[section.category];
              
              return (
                <Link
                  key={section.name}
                  href={section.href}
                  className="group relative h-44 rounded-xl overflow-hidden shadow-xl hover:shadow-[#E6C98B]/50 transition-all duration-300 hover:scale-105 block border-2 border-[#2a2a1a] hover:border-[#E6C98B]"
                >
                  {!imagesLoading && imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={section.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a1a] to-[#5A5E5D] animate-pulse" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/40" />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
                    <IconComponent className="w-16 h-16 md:w-14 md:h-14 text-[#E6C98B] mb-3 md:mb-2 group-hover:scale-125 transition-all duration-300 drop-shadow-[0_6px_12px_rgba(0,0,0,0.95)]" strokeWidth={2} />
                    <div className="bg-black/95 backdrop-blur-md px-6 py-4 md:px-5 md:py-3 rounded-xl border-2 border-[#A8C97F]/70 shadow-2xl">
                      <h3 className="text-2xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E6C98B] via-[#D4AF37] to-[#CD7F32] drop-shadow-[0_4px_16px_rgba(0,0,0,1)] group-hover:from-[#D4AF37] group-hover:via-[#CD7F32] group-hover:to-[#B87333] transition-all mb-1">
                        {section.name}
                      </h3>
                      <p className="text-base md:text-xs text-[#E6C98B] font-extrabold drop-shadow-[0_3px_10px_rgba(0,0,0,1)]">
                        {section.concept}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Properties - Sítios Carcará with Enhanced Cards */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                // Loading skeletons
                <>
                  <PropertyCardSkeleton />
                  <PropertyCardSkeleton />
                  <PropertyCardSkeleton />
                  <PropertyCardSkeleton />
                  <PropertyCardSkeleton />
                  <PropertyCardSkeleton />
                </>
              ) : (
                sitios.map((sitio) => (
                  <PropertyCard
                    key={sitio.id}
                    id={sitio.id}
                    title={sitio.nome}
                    description={`${sitio.zona || 'Zona Rural'} - ${sitio.localizacao || 'Corumbaíba/GO'}`}
                    price={sitio.lance_inicial || sitio.preco || 0}
                    currentBid={sitio.current_bid}
                    featured={sitio.destaque}
                    location={{
                      city: sitio.localizacao || 'Corumbaíba',
                      state: 'GO',
                      neighborhood: sitio.zona
                    }}
                    area={{
                      total: sitio.tamanho || sitio.area_total || 0
                    }}
                    photos={sitio.fotos || []}
                    link={`/imoveis/${sitio.id}`}
                    type="sitio"
                  />
                ))
              )}
            </div>
          </section>
        )}

        {/* AcheMeCoisas - Latest Listings */}
        {listings.length > 0 && (
          <section className="py-16">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
                  🛍️ AcheMeCoisas
                </h2>
                <p className="text-[#A8C97F] text-lg">
                  Últimos anúncios publicados - Compre, venda e troque!
                </p>
              </div>
              <Link
                href="/acheme-coisas"
                className="px-6 py-3 bg-gradient-to-r from-[#CD7F32] to-[#B87333] hover:from-[#D4AF37] hover:to-[#CD7F32] text-[#0a0a0a] rounded-full font-semibold transition-all hover:scale-105 shadow-lg"
              >
                Ver Todos
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/acheme-coisas/${listing.slug}`}
                  className="group bg-gradient-to-br from-[#5A5E5D] to-[#3A3E3D] border-2 border-[#2a2a1a] rounded-xl overflow-hidden hover:border-orange-500 transition-all shadow-xl hover:shadow-orange-500/20 hover:scale-105"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {listing.photos && listing.photos.length > 0 ? (
                      <img
                        src={listing.photos[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <span className="text-6xl">{listing.categories?.icon || '📦'}</span>
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    {listing.is_featured && (
                      <div className="absolute top-2 right-2 px-3 py-1 bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] text-[#0a0a0a] text-xs font-bold rounded-full shadow-lg">
                        ⭐ DESTAQUE
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 px-3 py-1 bg-black/70 text-[#E6C98B] text-xs font-semibold rounded-full backdrop-blur-sm">
                      {listing.categories?.icon} {listing.categories?.name}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-[#E6C98B] mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                      {listing.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {listing.description}
                    </p>

                    {/* Price & Location */}
                    <div className="flex items-center justify-between">
                      {listing.price ? (
                        <div className="text-2xl font-bold text-orange-400">
                          R$ {listing.price.toLocaleString('pt-BR')}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Grátis</div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      📍 {listing.city}, {listing.state}
                    </div>

                    {/* Condition Badge */}
                    {listing.condition && (
                      <div className="mt-3 inline-block px-2 py-1 bg-[#4A4E4D] text-[#A8C97F] text-xs rounded-md">
                        {listing.condition === 'new' && '🆕 Novo'}
                        {listing.condition === 'like_new' && '✨ Seminovo'}
                        {listing.condition === 'good' && '👍 Bom estado'}
                        {listing.condition === 'fair' && '⚠️ Estado regular'}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
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
                Por que confiar no AchaMe?
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

        {/* Brazil Time Clock Widget */}
        <section className="py-12 border-t-2 border-[#2a2a1a]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E6C98B] to-[#A8C97F] text-center mb-8">
              🕐 Horário Oficial do Brasil
            </h2>
            <p className="text-center text-[#A8C97F] mb-8 max-w-2xl mx-auto">
              Acompanhe os fusos horários de todo o Brasil em tempo real
            </p>
            <div className="flex justify-center">
              <BrazilTimeClock />
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
                <li>
                  <Link 
                    href="/postar" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#CD7F32] to-[#B87333] hover:from-[#D4AF37] hover:to-[#CD7F32] text-[#0a0a0a] rounded-lg transition-all font-bold shadow-lg hover:scale-105"
                  >
                    📢 Publique seu anúncio grátis
                  </Link>
                </li>
                <li><Link href="/conta" className="hover:text-[#B7791F]">Minha Conta</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-[#A8C97F] text-sm pt-8 border-t border-[#2a2a1a]">
            2025 AchaMe Ecosystem. Todos os direitos reservados.
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
