
"use client";


import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, MapPin, Ruler, Bed, Bath, Car, Phone, ExternalLink, Video, Heart, Calendar, TrendingUp } from "lucide-react";
import { getKMLForProperty, fetchKMLContent } from "@/lib/kmlMapping";
import FavoritesButton from "@/components/FavoritesButton";
import { WhatsAppLink } from "@publimicro/ui";
import Breadcrumbs from "@/components/Breadcrumbs";
import { addToRecentlyViewed } from "@/components/RecentlyViewed";
import { useToast } from "@/components/ToastNotification";
import VisitScheduler from "@/components/scheduling/VisitScheduler";
import SwipeGallery from "@/components/SwipeGallery";
import StickyMobileAction, { ActionButton } from "@/components/StickyMobileAction";
import FocusLock from "react-focus-lock";
import ProposalModal from "@/components/ProposalModal";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/components/AuthProvider";

// Dynamic import to avoid SSR issues with Leaflet
const LeafletMapKML = dynamic(() => import("@/components/LeafletMapKML"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-[#1a1a1a] rounded-2xl flex items-center justify-center">
      <div className="text-[#D4A574] text-xl">Carregando mapa interativo...</div>
    </div>
  ),
});

// Fallback KML data for all Sitios Carcara properties (if individual file not found)
const KML_DATA_FALLBACK = `<?xml version="1.0" encoding="UTF-8"?>
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
  fabula?: string;
  descricao?: string;
  localizacao?: string;
  preco?: number;
  fotos: string[];
  lance_inicial?: number;
  zona?: string;
  area_total?: number;
  area_construida?: number;
  quartos?: number;
  banheiros?: number;
  vagas?: number;
  coordenadas?: any;
}

export default function PropertyPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { t, lang } = useI18n();
  const { user, profile, loading: authLoading } = useAuth();
  const [sitio, setSitio] = useState<Sitio | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bidValue, setBidValue] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [bidSubmitting, setBidSubmitting] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);
  const [bidError, setBidError] = useState("");
  const [currentHighestBid, setCurrentHighestBid] = useState<number | null>(null);
  const [kmlData, setKmlData] = useState<string>(KML_DATA_FALLBACK);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  // User flow enforcement state
  const [visitBlockedReason, setVisitBlockedReason] = useState<string | null>(null);
  const [proposalBlockedReason, setProposalBlockedReason] = useState<string | null>(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visitModalOpen) {
        setVisitModalOpen(false);
        if (previouslyFocusedElement.current) {
          previouslyFocusedElement.current.focus();
        }
      }
    };

    if (visitModalOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [visitModalOpen]);

  useEffect(() => {
    if (!params?.id) return;

    async function fetchSitio() {
      try {
        const { data, error } = await supabase
          .from("sitios")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) {
          console.error("Error fetching sitio:", error);
          return;
        }

        console.log("Sitio data loaded:", data);
        console.log("Photos array:", data?.fotos);
        setSitio(data);
        if (data?.lance_inicial) {
          setBidValue(data.lance_inicial.toString());
        }

        // Add to recently viewed
        addToRecentlyViewed({
          id: data.id,
          nome: data.nome,
          localizacao: data.localizacao || "",
          preco: data.preco || 0,
          area_total: data.area_total || 0,
          fotos: data.fotos || []
        });

        // Load individual KML file for this property
        if (data?.nome || data?.id) {
          const kmlPath = getKMLForProperty(data.nome || data.id);
          if (kmlPath) {
            const kmlContent = await fetchKMLContent(kmlPath);
            if (kmlContent) {
              console.log(`Loaded individual KML for ${data.nome}`);
              setKmlData(kmlContent);
            } else {
              console.log('Using fallback KML (all properties)');
            }
          }
        }

        // Fetch current highest bid
        const { data: bidsData } = await supabase
          .from("bids")
          .select("bid_amount")
          .eq("property_id", params.id)
          .neq("status", "rejected")
          .order("bid_amount", { ascending: false })
          .limit(1);

        if (bidsData && bidsData.length > 0) {
          setCurrentHighestBid(bidsData[0].bid_amount);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSitio();
  }, [params?.id]);

  const handleSubmitBid = async () => {
    setBidError("");
    setBidSuccess(false);
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setBidError("Por favor, faça login para enviar um lance.");
      setTimeout(() => router.push("/entrar"), 2000);
      return;
    }

    const bidAmount = parseFloat(bidValue);
    const minBid = currentHighestBid || sitio?.lance_inicial || 0;

    // Validation
    if (isNaN(bidAmount) || bidAmount <= 0) {
      setBidError("Digite um valor válido para o lance.");
      return;
    }

    if (bidAmount < minBid) {
      setBidError(`Seu lance deve ser maior ou igual a R$ ${minBid.toLocaleString("pt-BR")}`);
      return;
    }

    setBidSubmitting(true);

    try {
      const { error } = await supabase
        .from("bids")
        .insert({
          property_id: params.id,
          user_id: user.id,
          bid_amount: bidAmount,
          message: bidMessage || null,
          status: "pending",
        });

      if (error) throw error;

      setBidSuccess(true);
      setBidMessage("");
      
      // Show success toast
      showToast({
        type: "success",
        title: "Lance enviado com sucesso!",
        message: `Seu lance de R$ ${bidAmount.toLocaleString("pt-BR")} foi registrado.`
      });
      
      // Update highest bid display
      setCurrentHighestBid(bidAmount);
      
      // Optionally reload the property to get updated lance_inicial
      const { data } = await supabase
        .from("sitios")
        .select("lance_inicial")
        .eq("id", params.id)
        .single();
      
      if (data) {
        setSitio(prev => prev ? { ...prev, lance_inicial: data.lance_inicial } : null);
      }

      setTimeout(() => {
        setBidSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error("Error submitting bid:", error);
      setBidError(error.message || "Erro ao enviar lance. Tente novamente.");
      
      // Show error toast
      showToast({
        type: "error",
        title: "Erro ao enviar lance",
        message: error.message || "Tente novamente mais tarde."
      });
    } finally {
      setBidSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#D4A574] text-xl">{t('sitioscarcara.loading_property') || 'Carregando propriedade...'}</div>
      </main>
    );
  }

  if (!sitio) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#E6C98B] mb-4">{t('sitioscarcara.not_found') || 'Propriedade não encontrada'}</h1>
          <Link href="/" className="text-[#A8C97F] hover:underline">
            {t('sitioscarcara.back_home') || 'Voltar para a página inicial'}
          </Link>
        </div>
      </main>
    );
  }

  const photos = sitio.fotos && sitio.fotos.length > 0 ? sitio.fotos : ["/images/fallback-rancho.jpg"];
  const currentPhoto = photos[currentImageIndex];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs />
        
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#E6C98B] hover:text-[#A8C97F] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('sitioscarcara.back_home') || 'Voltar para início'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Swipeable Gallery with Fullscreen */}
            <div className="relative">
              <SwipeGallery
                images={photos}
                alt={sitio.nome}
                aspectRatio="video"
                showThumbnails={true}
                showCounter={true}
                enableFullscreen={true}
              />
              {/* Favorite Button - Always visible */}
              <div className="absolute top-4 right-4 z-30">
                <FavoritesButton propertyId={sitio.id} size="lg" />
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8">
              <h1 className="text-4xl font-bold text-[#E6C98B] mb-4">{sitio.nome}</h1>
              {/* Poetic tagline / fable / mood section */}
              <div className="mb-4 text-[#A8C97F] italic text-lg">
                {/* Example: Replace with dynamic poetic content per property if available */}
                {sitio.fabula || t('sitioscarcara.poetic_tagline') || 'Onde a terra conta sua própria história.'}
              </div>
              
              {sitio.localizacao && (
                <div className="flex items-center gap-2 text-[#A8C97F] mb-6">
                  <MapPin className="w-5 h-5 text-[#A8C97F]" />
                  <span className="text-lg">{sitio.localizacao}</span>
                </div>
              )}

              {sitio.zona && (
                <div className="inline-block px-4 py-2 bg-[#A8C97F]/20 text-[#A8C97F] font-bold rounded-lg mb-6 border border-[#A8C97F]/30">
                  {sitio.zona}
                </div>
              )}

              {/* Characteristics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {sitio.area_total && (
                  <div className="flex items-center gap-3 bg-[#0a0a0a] rounded-lg p-4 border border-[#2a2a1a]">
                    <Ruler className="w-6 h-6 text-[#A8C97F]" />
                    <div>
                      <div className="text-[#A8C97F] text-xs">{t('sitioscarcara.total_area') || 'Área Total'}</div>
                      <div className="text-[#E6C98B] font-bold">{sitio.area_total} m²</div>
                    </div>
                  </div>
                )}
                {sitio.area_construida && (
                  <div className="flex items-center gap-3 bg-[#0a0a0a] rounded-lg p-4 border border-[#2a2a1a]">
                    <Ruler className="w-6 h-6 text-[#A8C97F]" />
                    <div>
                      <div className="text-[#A8C97F] text-xs">{t('sitioscarcara.built_area') || 'Área Construída'}</div>
                      <div className="text-[#E6C98B] font-bold">{sitio.area_construida} m²</div>
                    </div>
                  </div>
                )}
                {sitio.quartos && (
                  <div className="flex items-center gap-3 bg-[#0a0a0a] rounded-lg p-4 border border-[#2a2a1a]">
                    <Bed className="w-6 h-6 text-[#A8C97F]" />
                    <div>
                      <div className="text-[#A8C97F] text-xs">{t('sitioscarcara.bedrooms') || 'Quartos'}</div>
                      <div className="text-[#E6C98B] font-bold">{sitio.quartos}</div>
                    </div>
                  </div>
                )}
                {sitio.banheiros && (
                  <div className="flex items-center gap-3 bg-[#0a0a0a] rounded-lg p-4 border border-[#2a2a1a]">
                    <Bath className="w-6 h-6 text-[#A8C97F]" />
                    <div>
                      <div className="text-[#A8C97F] text-xs">{t('sitioscarcara.bathrooms') || 'Banheiros'}</div>
                      <div className="text-[#E6C98B] font-bold">{sitio.banheiros}</div>
                    </div>
                  </div>
                )}
                {sitio.vagas && (
                  <div className="flex items-center gap-3 bg-[#0a0a0a] rounded-lg p-4 border border-[#2a2a1a]">
                    <Car className="w-6 h-6 text-[#A8C97F]" />
                    <div>
                      <div className="text-[#A8C97F] text-xs">{t('sitioscarcara.parking') || 'Vagas'}</div>
                      <div className="text-[#E6C98B] font-bold">{sitio.vagas}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {sitio.descricao && (
                <div>
                  <h2 className="text-2xl font-bold text-[#E6C98B] mb-4">{t('sitioscarcara.description') || 'Descrição'}</h2>
                  <p className="text-[#A8C97F] leading-relaxed whitespace-pre-line">
                    {sitio.descricao}
                  </p>
                </div>
              )}
            </div>

            {/* Videos Section */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Video className="w-8 h-8 text-[#A8C97F]" />
                <h2 className="text-2xl font-bold text-[#D4A574]">{t('sitioscarcara.property_videos') || 'Vídeos da Propriedade'}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl overflow-hidden bg-[#0a0a0a] border border-[#2a2a1a] aspect-video flex items-center justify-center">
                  <div className="text-center p-6">
                    <Video className="w-12 h-12 text-[#D4A574] mx-auto mb-3" />
                    <p className="text-[#8B9B6E] text-sm">Vídeo Drone - Navegação Aérea</p>
                    <p className="text-[#D4A574]/50 text-xs mt-2">(Em breve)</p>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden bg-[#0a0a0a] border border-[#2a2a1a] aspect-video flex items-center justify-center">
                  <div className="text-center p-6">
                    <Video className="w-12 h-12 text-[#D4A574] mx-auto mb-3" />
                    <p className="text-[#8B9B6E] text-sm">Tour Virtual - Caminhos e Trilhas</p>
                    <p className="text-[#D4A574]/50 text-xs mt-2">(Em breve)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Interactive Map */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#D4A574] mb-4">{t('sitioscarcara.interactive_map') || 'Mapa Interativo 3D'}</h2>
              <p className="text-[#8B9B6E] mb-6">
                {t('sitioscarcara.map_hint') || 'Visualize a localização exata desta propriedade em mapa de satélite. Clique nas áreas para mais detalhes.'}
              </p>
              <div className="h-[500px] rounded-xl overflow-hidden">
                <LeafletMapKML kmlData={kmlData} />
              </div>
            </div>
          </div>

          {/* Right Column - Proposal Information Box (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#CD7F32]/40 rounded-2xl p-6 space-y-6">
              {/* Current Proposal Display */}
              <div className="text-center">
                <h3 className="text-[#E6C98B] font-semibold mb-3 text-sm uppercase tracking-wide">
                  {currentHighestBid ? t('sitioscarcara.current_bid') : t('sitioscarcara.starting_price')}
                </h3>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] font-bold text-5xl mb-2">
                  R$ {(currentHighestBid || sitio.lance_inicial || sitio.preco || 0).toLocaleString("pt-BR")}
                </div>
                {currentHighestBid && sitio.lance_inicial && (
                  <p className="text-[#8B9B6E] text-sm">
                    {t('sitioscarcara.starting_price')}: R$ {sitio.lance_inicial.toLocaleString("pt-BR")}
                  </p>
                )}
                <p className="text-[#8B9B6E] text-xs mt-2">
                  {currentHighestBid && currentHighestBid > (sitio.lance_inicial || 0) 
                    ? '🔥 ' + (t('sitioscarcara.active_bid') || 'Lance ativo')
                    : `${t('sitioscarcara.starting_price')}: R$ ${sitio.lance_inicial?.toLocaleString("pt-BR")}`}
                </p>
              </div>

              {/* Simplified Bid Button */}
              {/* Bid button removed for i18n/flow update. Use ProposalModal for offers. */}

              {bidSuccess && (
                <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4 animate-pulse">
                  <p className="text-green-400 text-sm font-semibold text-center">
                    ✓ Lance enviado com sucesso!
                  </p>
                </div>
              )}

              {bidError && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 text-sm text-center">{bidError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#2a2a1a] space-y-3">
                {/* Details Button */}
                <a
                  href="https://www.sitioscarcara.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#E6C98B]/20 border-2 border-[#E6C98B] text-[#E6C98B] font-bold rounded-full hover:bg-[#E6C98B]/30 hover:scale-105 transition-all text-lg"
                >
                  <ExternalLink className="w-5 h-5" />
                  Ver Detalhes Completos
                </a>

                {/* WhatsApp Contact - centralized helper */}
                <WhatsAppLink
                  number="5534992610004"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 border-2 border-[#25D366] text-[#25D366] font-bold rounded-full hover:bg-[#25D366]/10 hover:scale-105 transition-all text-lg"
                  aria-label={t('sitioscarcara.contact_whatsapp') || 'Contato via WhatsApp'}
                >
                  <Phone className="w-5 h-5" />
                  Contato WhatsApp
                </WhatsAppLink>

                {/* Schedule Visit */}
                <button
                  onClick={() => {
                    // User flow enforcement for visit scheduling
                    if (!user) {
                      setVisitBlockedReason(t('sitioscarcara.login_required'));
                      showToast({ type: 'error', title: t('sitioscarcara.login_required'), message: '' });
                      setTimeout(() => router.push('/entrar?redirect=' + encodeURIComponent(window.location.pathname)), 1200);
                      return;
                    }
                    if (profile && !profile.profile_completed) {
                      setVisitBlockedReason(t('sitioscarcara.profile_required'));
                      showToast({ type: 'error', title: t('sitioscarcara.profile_required'), message: '' });
                      setTimeout(() => router.push('/conta'), 1200);
                      return;
                    }
                    if (profile && !profile.verified) {
                      setVisitBlockedReason(t('sitioscarcara.verified_required'));
                      showToast({ type: 'error', title: t('sitioscarcara.verified_required'), message: '' });
                      return;
                    }
                    previouslyFocusedElement.current = document.activeElement as HTMLElement;
                    setVisitModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#A8C97F]/20 border-2 border-[#A8C97F] text-[#A8C97F] font-bold rounded-full hover:bg-[#A8C97F]/30 hover:scale-105 transition-all text-lg"
                >
                  <Calendar className="w-5 h-5" />
                  {t('sitioscarcara.request_visit') || 'Agendar Visita'}
                </button>

                {/* Make Proposal - Only after visit */}
                <button
                  onClick={() => {
                    // User flow enforcement for proposal
                    if (!user) {
                      setProposalBlockedReason(t('sitioscarcara.login_required'));
                      showToast({ type: 'error', title: t('sitioscarcara.login_required'), message: '' });
                      setTimeout(() => router.push('/entrar?redirect=' + encodeURIComponent(window.location.pathname)), 1200);
                      return;
                    }
                    if (profile && !profile.profile_completed) {
                      setProposalBlockedReason(t('sitioscarcara.profile_required'));
                      showToast({ type: 'error', title: t('sitioscarcara.profile_required'), message: '' });
                      setTimeout(() => router.push('/conta'), 1200);
                      return;
                    }
                    if (profile && !profile.verified) {
                      setProposalBlockedReason(t('sitioscarcara.verified_required'));
                      showToast({ type: 'error', title: t('sitioscarcara.verified_required'), message: '' });
                      return;
                    }
                    previouslyFocusedElement.current = document.activeElement as HTMLElement;
                    setProposalModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-[#CD7F32] to-[#B87333] hover:from-[#D4AF37] hover:to-[#CD7F32] text-[#0a0a0a] font-bold rounded-full hover:scale-105 transition-all text-lg shadow-lg"
                  title={t('sitioscarcara.visit_required') || 'Agende uma visita antes de fazer sua proposta'}
                >
                  <TrendingUp className="w-5 h-5" />
                  {t('sitioscarcara.submit_offer') || 'Fazer Proposta'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Action Bar - Bottom Sticky */}
      <StickyMobileAction position="bottom">
        <div className="flex gap-2">
          <ActionButton
            variant="secondary"
            icon={<Calendar className="w-5 h-5" />}
            onClick={() => {
              // User flow enforcement for visit scheduling (mobile)
              if (!user) {
                setVisitBlockedReason(t('sitioscarcara.login_required'));
                showToast({ type: 'error', title: t('sitioscarcara.login_required'), message: '' });
                setTimeout(() => router.push('/entrar?redirect=' + encodeURIComponent(window.location.pathname)), 1200);
                return;
              }
              if (profile && !profile.profile_completed) {
                setVisitBlockedReason(t('sitioscarcara.profile_required'));
                showToast({ type: 'error', title: t('sitioscarcara.profile_required'), message: '' });
                setTimeout(() => router.push('/conta'), 1200);
                return;
              }
              if (profile && !profile.verified) {
                setVisitBlockedReason(t('sitioscarcara.verified_required'));
                showToast({ type: 'error', title: t('sitioscarcara.verified_required'), message: '' });
                return;
              }
              previouslyFocusedElement.current = document.activeElement as HTMLElement;
              setVisitModalOpen(true);
            }}
          >
            {t('sitioscarcara.request_visit') || 'Agendar'}
          </ActionButton>
          <ActionButton
            variant="primary"
            icon={<TrendingUp className="w-5 h-5" />}
            onClick={() => {
              // User flow enforcement for proposal (mobile)
              if (!user) {
                setProposalBlockedReason(t('sitioscarcara.login_required'));
                showToast({ type: 'error', title: t('sitioscarcara.login_required'), message: '' });
                setTimeout(() => router.push('/entrar?redirect=' + encodeURIComponent(window.location.pathname)), 1200);
                return;
              }
              if (profile && !profile.profile_completed) {
                setProposalBlockedReason(t('sitioscarcara.profile_required'));
                showToast({ type: 'error', title: t('sitioscarcara.profile_required'), message: '' });
                setTimeout(() => router.push('/conta'), 1200);
                return;
              }
              if (profile && !profile.verified) {
                setProposalBlockedReason(t('sitioscarcara.verified_required'));
                showToast({ type: 'error', title: t('sitioscarcara.verified_required'), message: '' });
                return;
              }
              previouslyFocusedElement.current = document.activeElement as HTMLElement;
              setProposalModalOpen(true);
            }}
          >
            {t('sitioscarcara.submit_offer') || 'Fazer Proposta'}
          </ActionButton>
        </div>
      </StickyMobileAction>

      {/* Visit Scheduler Modal */}
      {visitModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
          <FocusLock returnFocus>
            <div className="relative max-w-3xl w-full my-8">
              <button
                onClick={() => {
                  setVisitModalOpen(false);
                  if (previouslyFocusedElement.current) {
                    previouslyFocusedElement.current.focus();
                  }
                }}
                className="absolute -top-12 right-0 text-white hover:text-[#A8C97F] text-2xl font-bold"
                aria-label={t('sitioscarcara.close_modal') || 'Fechar modal de agendamento'}
              >
                ✕ {t('sitioscarcara.close') || 'Fechar'}
              </button>
              <VisitScheduler 
                propertyId={sitio.id}
                propertyTitle={sitio.nome}
                propertyPhoto={sitio.fotos?.[0]} 
                onClose={() => {
                  setVisitModalOpen(false);
                  if (previouslyFocusedElement.current) {
                    previouslyFocusedElement.current.focus();
                  }
                }}
              />
            </div>
          </FocusLock>
        </div>
      )}

      {/* Proposal Modal */}
      {proposalModalOpen && (
        <ProposalModal
          adId={sitio.id}
          adTitle={sitio.nome}
          currentBid={currentHighestBid || sitio.preco || sitio.lance_inicial || 0}
          minBid={sitio.preco || sitio.lance_inicial || 0}
          open={proposalModalOpen}
          onClose={() => {
            setProposalModalOpen(false);
            if (previouslyFocusedElement.current) {
              previouslyFocusedElement.current.focus();
            }
          }}
        />
      )}
    </main>
  );
}
