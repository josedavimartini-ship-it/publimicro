'use client';

import { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from '@/lib/i18n';
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

// Internationalized fables, taglines, and property data for each Sítio
const PROPERTY_FABLES: Record<string, Record<'pt'|'en'|'es', {
  subtitle: string;
  tagline: string;
  fable: string;
  symbols: string;
  color: string;
  estimated: string;
  opening: string;
  mood: string;
  purpose: string;
}>> = {
  abare: {
    pt: {
      subtitle: 'A companheira do rio',
      tagline: 'Onde a amizade encontra a brisa do rio.',
      fable: 'Conta-se que nas veredas antigas, uma ave de penas cor de alvorada acompanhava os viajantes pelas margens do rio Corumbá. Diziam que seu canto trazia boas novas e proteção para quem respeitasse a terra e as águas. Chamavam-na Abaré — a "amiga", em tupi. E assim, o Sítio Abaré se tornou refúgio para quem busca harmonia com o fluxo natural da vida: onde o rio fala, e a terra responde.',
      symbols: '🕊️ Amizade • Espiritualidade • Equilíbrio com a água',
      color: 'from-[#5F9EA0] to-[#A8C97F]',
      estimated: '£270.000',
      opening: '£185.000',
      mood: 'Reflexos d’água, ouro do entardecer, verdes suaves.',
      purpose: 'Viver à beira do rio, meditação, eco-retreat.'
    },
    en: {
      subtitle: 'The River’s Companion',
      tagline: 'Where friendship meets the river breeze.',
      fable: 'Once upon a time, Abaré was the bird who befriended every current. She followed the winding waters, helping those who lost their way back to the source. Her home lies where the forest bends to the river — a place of communion and inner peace.',
      symbols: '🕊️ Friendship • Spirituality • Water balance',
      color: 'from-[#5F9EA0] to-[#A8C97F]',
      estimated: '£270,000',
      opening: '£185,000',
      mood: 'Water reflections, late afternoon gold, soft greens.',
      purpose: 'Riverside living, meditation, eco-retreat.'
    },
    es: {
      subtitle: 'La compañera del río',
      tagline: 'Donde la amistad encuentra la brisa del río.',
      fable: 'Se cuenta que en los antiguos senderos, un ave de plumas color alba acompañaba a los viajeros por las orillas del río Corumbá. Decían que su canto traía buenas nuevas y protección a quienes respetaban la tierra y las aguas. La llamaban Abaré — la "amiga", en tupi. Así, el Sítio Abaré se volvió refugio para quienes buscan armonía con el flujo natural de la vida: donde el río habla y la tierra responde.',
      symbols: '🕊️ Amistad • Espiritualidad • Equilibrio con el agua',
      color: 'from-[#5F9EA0] to-[#A8C97F]',
      estimated: '£270,000',
      opening: '£185,000',
      mood: 'Reflejos de agua, oro del atardecer, verdes suaves.',
      purpose: 'Vida junto al río, meditación, eco-retreat.'
    }
  },
  bigua: {
    pt: {
      subtitle: 'O mergulhador incansável',
      tagline: 'Resiliência em movimento — onde a água encontra a vontade.',
      fable: 'Certa vez, um pescador observou um Biguá que mergulhava e emergia repetidas vezes, sem desistir. Intrigado, perguntou-lhe o segredo. O Biguá respondeu: "A persistência é o que faz da água minha casa." O pescador entendeu — e nunca mais abandonou seus sonhos. Assim é o Sítio Biguá: para quem mergulha de corpo e alma na vida, encontrando beleza na constância e na profundidade.',
      symbols: '🐟 Resiliência • Foco • Trabalho com propósito',
      color: 'from-[#4682B4] to-[#0D7377]',
      estimated: '£300.000',
      opening: '£210.000',
      mood: 'Azul-esverdeado do lago ao amanhecer, reflexos, ondulações sutis.',
      purpose: 'Ecoturismo, recreação aquática sustentável.'
    },
    en: {
      subtitle: 'The Tireless Diver',
      tagline: 'Resilience in motion — where water meets will.',
      fable: 'Biguá dives deep, not for sport but for wisdom. He knows that clarity lies below the surface — in the still silence of purpose. This site belongs to those who embrace the challenge of living deeply and truly.',
      symbols: '🐟 Resilience • Focus • Purposeful work',
      color: 'from-[#4682B4] to-[#0D7377]',
      estimated: '£300,000',
      opening: '£210,000',
      mood: 'Blue-green hues of the lake at dawn, reflections, subtle ripples.',
      purpose: 'Eco-tourism, sustainable aquatic recreation.'
    },
    es: {
      subtitle: 'El buceador incansable',
      tagline: 'Resiliencia en movimiento — donde el agua encuentra la voluntad.',
      fable: 'Biguá se sumerge profundo, no por deporte sino por sabiduría. Sabe que la claridad está bajo la superficie — en el silencio quieto del propósito. Este sitio es para quienes abrazan el desafío de vivir profunda y verdaderamente.',
      symbols: '🐟 Resiliencia • Enfoque • Trabajo con propósito',
      color: 'from-[#4682B4] to-[#0D7377]',
      estimated: '£300,000',
      opening: '£210,000',
      mood: 'Tonos azul-verde del lago al amanecer, reflejos, ondas sutiles.',
      purpose: 'Ecoturismo, recreación acuática sostenible.'
    }
  },
  mergulhao: {
    pt: {
      subtitle: 'O guardião das águas profundas',
      tagline: 'O espírito da contemplação e coragem.',
      fable: 'Dizem que o Mergulhão, ave arisca e silenciosa, conhece todos os segredos do fundo da represa. Ele mergulha em silêncio e retorna apenas quando as águas estão calmas. Quem o vê entende: sabedoria é saber o momento certo de agir e o momento certo de esperar. O Sítio Mergulhão é assim — um abrigo para quem busca profundidade e contemplação.',
      symbols: '🌊 Introspecção • Sabedoria • Serenidade',
      color: 'from-[#2F4F4F] to-[#5F7161]',
      estimated: '£420.000',
      opening: '£275.000',
      mood: 'Azul profundo, reflexos prateados, texturas de pedra.',
      purpose: 'Retiro espiritual, residência criativa, turismo ecológico.'
    },
    en: {
      subtitle: 'The Guardian of Deep Waters',
      tagline: 'The spirit of contemplation and courage.',
      fable: 'When danger nears, the Mergulhão dives — not to flee, but to listen. He disappears beneath the calm, and when he resurfaces, he brings new strength. This site is a refuge for those who seek depth, solitude, and timeless horizons.',
      symbols: '🌊 Introspection • Wisdom • Serenity',
      color: 'from-[#2F4F4F] to-[#5F7161]',
      estimated: '£420,000',
      opening: '£275,000',
      mood: 'Deep blue tones, silver reflections, stone textures.',
      purpose: 'Spiritual retreats, creative residencies, eco-conscious tourism.'
    },
    es: {
      subtitle: 'El guardián de las aguas profundas',
      tagline: 'El espíritu de la contemplación y el coraje.',
      fable: 'Dicen que el Mergulhão, ave arisca y silenciosa, conoce todos los secretos del fondo de la represa. Se sumerge en silencio y solo regresa cuando las aguas están calmas. Quien lo ve entiende: la sabiduría es saber cuándo actuar y cuándo esperar. El Sítio Mergulhão es así — un refugio para quienes buscan profundidad y contemplación.',
      symbols: '🌊 Introspección • Sabiduría • Serenidad',
      color: 'from-[#2F4F4F] to-[#5F7161]',
      estimated: '£420,000',
      opening: '£275,000',
      mood: 'Azul profundo, reflejos plateados, texturas de piedra.',
      purpose: 'Retiro espiritual, residencia creativa, turismo ecológico.'
    }
  },
  seriema: {
    pt: {
      subtitle: 'A voz do Cerrado',
      tagline: 'Onde a coragem caminha com elegância.',
      fable: 'Certa manhã, quando o sol tocava as serras, a Seriema soltou seu grito. Foi um chamado à vida — e todos os animais despertaram. Desde então, dizem que quem escuta o grito da Seriema sente renascer o desejo de recomeçar. O Sítio Seriema é a morada dos que buscam reerguer-se, falar alto seus sonhos e deixar ecoar a liberdade.',
      symbols: '🪶 Coragem • Liderança • Renascimento',
      color: 'from-[#B7791F] to-[#D4A574]',
      estimated: '£450.000',
      opening: '£300.000',
      mood: 'Campos dourados, gramíneas secas, terracota.',
      purpose: 'Agrofloresta, silvipastoril, residência rural.'
    },
    en: {
      subtitle: 'The Voice of the Cerrado',
      tagline: 'Where courage walks with elegance.',
      fable: 'The Seriema stands tall upon the open field — her song echoes across the horizon. She is both strength and grace, reminding the land to be proud of its roots. This site invites visionaries — those who lead by quiet example.',
      symbols: '🪶 Courage • Leadership • Renewal',
      color: 'from-[#B7791F] to-[#D4A574]',
      estimated: '£450,000',
      opening: '£300,000',
      mood: 'Golden fields, dry grasses, terracotta.',
      purpose: 'Agroforestry, silvopastoral, rural residence.'
    },
    es: {
      subtitle: 'La voz del Cerrado',
      tagline: 'Donde el coraje camina con elegancia.',
      fable: 'Una mañana, cuando el sol tocaba las sierras, la Seriema lanzó su grito. Fue un llamado a la vida — y todos los animales despertaron. Desde entonces, dicen que quien escucha el grito de la Seriema siente renacer el deseo de recomenzar. El Sítio Seriema es el hogar de quienes buscan levantarse, decir en voz alta sus sueños y dejar que la libertad resuene.',
      symbols: '🪶 Coraje • Liderazgo • Renacimiento',
      color: 'from-[#B7791F] to-[#D4A574]',
      estimated: '£450,000',
      opening: '£300,000',
      mood: 'Campos dorados, pastos secos, terracota.',
      purpose: 'Agroforestería, silvopastoril, residencia rural.'
    }
  },
  juriti: {
    pt: {
      subtitle: 'A canção da alma rural',
      tagline: 'Paz, tradição e a música da simplicidade.',
      fable: 'No entardecer, quando o céu se cobre de ouro, ouve-se o canto suave da Juriti. Reza a lenda que é a voz da saudade, lembrando aos homens o valor das raízes e da simplicidade. O Sítio Juriti é o lar da paz: um canto de aconchego, onde o tempo desacelera e o coração volta a escutar.',
      symbols: '🕊️ Paz • Tradição • Amor pelo interior',
      color: 'from-[#E6C98B] to-[#DDA15E]',
      estimated: '£380.000',
      opening: '£230.000',
      mood: 'Tons de entardecer, madeira quente, luz âmbar.',
      purpose: 'Refúgio familiar, horta orgânica, produção artesanal.'
    },
    en: {
      subtitle: 'The Song of the Countryside Soul',
      tagline: 'Peace, tradition, and the music of simplicity.',
      fable: 'At dusk, the Juriti sings. Her song is the memory of the first settlers — of hands that sowed with faith and hearts that listened. This site holds the warmth of home and the patience of time.',
      symbols: '🕊️ Peace • Tradition • Love for the countryside',
      color: 'from-[#E6C98B] to-[#DDA15E]',
      estimated: '£380,000',
      opening: '£230,000',
      mood: 'Dusk tones, warm wood, amber light.',
      purpose: 'Family refuge, organic gardens, artisanal production.'
    },
    es: {
      subtitle: 'La canción del alma rural',
      tagline: 'Paz, tradición y la música de la sencillez.',
      fable: 'Al atardecer, la Juriti canta. Su canción es la memoria de los primeros colonos — de manos que sembraron con fe y corazones que escucharon. Este sitio guarda el calor del hogar y la paciencia del tiempo.',
      symbols: '🕊️ Paz • Tradición • Amor por el interior',
      color: 'from-[#E6C98B] to-[#DDA15E]',
      estimated: '£380,000',
      opening: '£230,000',
      mood: 'Tonos de atardecer, madera cálida, luz ámbar.',
      purpose: 'Refugio familiar, huerta orgánica, producción artesanal.'
    }
  },
  surucua: {
    pt: {
      subtitle: 'A joia discreta da floresta',
      tagline: 'Cor, calma e o ritmo sagrado da natureza.',
      fable: 'No meio da mata, vive o Surucuá — ave de cores vivas, mas que raramente se mostra. Dizem que quem o encontra é abençoado com o dom de enxergar a beleza nas pequenas coisas. O Sítio Surucuá é um convite à vida simples, à contemplação e ao encanto que existe no silêncio da natureza.',
      symbols: '🌺 Beleza interior • Simplicidade • Elegância natural',
      color: 'from-[#9B59B6] to-[#A8C97F]',
      estimated: '£325.000',
      opening: '£200.000',
      mood: 'Esmeralda, madeira escura, luz filtrada.',
      purpose: 'Rewilding, conservação, eco-luxo.'
    },
    en: {
      subtitle: 'The Hidden Jewel of the Forest',
      tagline: 'Colour, calm, and the sacred rhythm of nature.',
      fable: 'Surucuá wears the colours of dreams — unseen until the forest chooses to reveal him. He lives where shade and silence meet. His land is for those who value beauty in discretion and peace in abundance.',
      symbols: '🌺 Inner beauty • Simplicity • Natural elegance',
      color: 'from-[#9B59B6] to-[#A8C97F]',
      estimated: '£325,000',
      opening: '£200,000',
      mood: 'Emerald, dark wood, filtered sunlight.',
      purpose: 'Rewilding, conservation, luxury eco-homes.'
    },
    es: {
      subtitle: 'La joya discreta del bosque',
      tagline: 'Color, calma y el ritmo sagrado de la naturaleza.',
      fable: 'Surucuá viste los colores de los sueños — invisible hasta que el bosque decide revelarlo. Vive donde la sombra y el silencio se encuentran. Su tierra es para quienes valoran la belleza en la discreción y la paz en la abundancia.',
      symbols: '🌺 Belleza interior • Sencillez • Elegancia natural',
      color: 'from-[#9B59B6] to-[#A8C97F]',
      estimated: '£325,000',
      opening: '£200,000',
      mood: 'Esmeralda, madera oscura, luz filtrada.',
      purpose: 'Rewilding, conservación, eco-lujo.'
    }
  }
};

function CarcaraProjectPageContent() {
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
          .in('id', ['buriti', 'cedro', 'ipe', 'jatoba', 'pequi', 'sucupira'])
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

  const { lang, setLang, t } = useI18n();
  return (
  <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]" role="main" aria-label="Página Sítios Carcará">
      {/* Language Switcher & Back to Home */}
      <div className="max-w-7xl mx-auto px-6 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-[#676767] hover:text-[#A8C97F] transition-colors focus:outline-none focus:ring-4 focus:ring-[#A8C97F]"
          aria-label={t('Voltar para página inicial')}
          tabIndex={0}
          role="button"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('Voltar para página inicial')}
        </Link>
        <div className="flex gap-2 items-center">
          <button onClick={() => setLang('pt')} className={`px-3 py-1 rounded ${lang==='pt' ? 'bg-[#A8C97F] text-black font-bold' : 'bg-[#232323] text-[#A8C97F]'}`}>PT</button>
          <button onClick={() => setLang('en')} className={`px-3 py-1 rounded ${lang==='en' ? 'bg-[#A8C97F] text-black font-bold' : 'bg-[#232323] text-[#A8C97F]'}`}>EN</button>
          <button onClick={() => setLang('es')} className={`px-3 py-1 rounded ${lang==='es' ? 'bg-[#A8C97F] text-black font-bold' : 'bg-[#232323] text-[#A8C97F]'}`}>ES</button>
        </div>
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
        
        {/* 3D Carcará Bird Overlay - Modular, always above overlays, easy to swap model */}
        <div
          className="absolute top-10 w-64 h-64 md:w-96 md:h-96 pointer-events-none z-[300] animate-fly-continuous"
          style={{ pointerEvents: 'none' }}
          aria-label="Carcará 3D voando"
          data-overlay="carcara-bird"
        >
          {/* To swap the 3D model, replace <Carcara3D ... /> below */}
          <Carcara3D
            scale={2.5}
            onSoundTrigger={() => {
              const audio = document.getElementById('carcara-sound') as HTMLAudioElement;
              if (audio && audio.paused) {
                audio.volume = 0.8;
                audio.play().catch(() => {});
              }
            }}
          />
        </div>
        {/*
          Overlay structure:
          - z-[300]: Carcará bird (always on top)
          - z-[200]: Audio button, badges
          - z-[5]: Main dark overlay for text contrast
          - z-0: Background image
          To swap the 3D bird, edit the <Carcara3D> import and usage above.
        */}

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
              transform: translateX(110vw) translateY(0) scale(1.1) rotate(-2deg);
            }
            10% {
              transform: translateX(90vw) translateY(-30px) scale(1.15) rotate(2deg);
            }
            20% {
              transform: translateX(75vw) translateY(-60px) scale(1.2) rotate(-4deg);
            }
            30% {
              transform: translateX(60vw) translateY(-20px) scale(1.25) rotate(3deg);
            }
            40% {
              transform: translateX(50vw) translateY(-80px) scale(1.3) rotate(-3deg);
            }
            50% {
              transform: translateX(40vw) translateY(-10px) scale(1.35) rotate(2deg);
            }
            60% {
              transform: translateX(30vw) translateY(-60px) scale(1.3) rotate(-2deg);
            }
            70% {
              transform: translateX(20vw) translateY(-30px) scale(1.25) rotate(2deg);
            }
            80% {
              transform: translateX(10vw) translateY(-70px) scale(1.2) rotate(-2deg);
            }
            90% {
              transform: translateX(-10vw) translateY(-20px) scale(1.15) rotate(2deg);
            }
            100% {
              transform: translateX(-400px) translateY(0) scale(1.1) rotate(-2deg);
            }
          }
          .animate-fly-continuous {
            animation: fly-continuous 12s cubic-bezier(0.7,0.2,0.3,1) infinite;
            will-change: transform;
            z-index: 300 !important;
            filter: drop-shadow(0 8px 32px #FFD700cc) drop-shadow(0 0 12px #fff8) drop-shadow(0 0 2px #0008);
          }
        `}</style>

        <div className="relative z-[30] text-center px-6 max-w-6xl">
          {/* Exclusive Launch Badge - Elegant with minimal background */}
          <div className="inline-flex items-center gap-2 mb-6 px-8 py-4 bg-gradient-to-r from-[#1a1a1a]/60 to-[#2a2a2a]/60 border-2 border-[#D4A574] rounded-full backdrop-blur-xl animate-pulse shadow-2xl">
            <span className="text-[#D4A574] font-bold text-xl tracking-widest uppercase drop-shadow-[0_4px_12px_rgba(212,165,116,0.8)]" style={{textShadow: '0 0 20px rgba(212,165,116,0.6), 0 4px 8px rgba(0,0,0,1)'}}>
               LANÇAMENTO EXCLUSIVO
            </span>
          </div>
          
          {/* Main Title - Poetic, animated gold accent */}
          <div className="relative inline-block mb-8 px-8 py-6 rounded-2xl border border-[#B7791F]/30 bg-gradient-to-b from-[#0D0D0D]/60 via-[#1a1a1a]/40 to-transparent backdrop-blur-md shadow-[0_8px_32px_rgba(212,165,116,0.10)]">
            <h1 className="font-serif text-7xl md:text-9xl font-extrabold bg-gradient-to-b from-[#FFFBEA] via-[#FFD700] to-[#B7791F] bg-clip-text text-transparent leading-tight drop-shadow-[0_8px_24px_rgba(0,0,0,1)] animate-title-glow" style={{textShadow: '0 0 40px #FFD70055, 0 8px 32px #B7791F44'}}>
              {t('sitioscarcara.title')}
            </h1>
            <span className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-[#FFD700]/60 via-[#FFFBEA]/80 to-[#FFD700]/60 rounded-full blur-md animate-gold-pulse" aria-hidden="true"></span>
          </div>
          {/* Subtitle - Poetic, gold-accented */}
          <div className="bg-gradient-to-r from-transparent via-[#0D0D0D]/40 to-transparent backdrop-blur-sm px-6 py-4 rounded-xl max-w-5xl mx-auto mb-6 border-l-4 border-[#FFD700]/30">
            <p className="font-serif text-3xl md:text-4xl text-[#FFFBEA] leading-relaxed font-light drop-shadow-[0_6px_20px_rgba(0,0,0,1)] italic animate-fadein" style={{textShadow: '0 0 30px #FFD70033, 0 4px 12px #000'}}>
              {t('sitioscarcara.headline')}
            </p>
          </div>
          {/* Poetic microcopy */}
          <div className="mb-4 text-[#FFD700]/80 text-lg italic font-serif animate-fadein-slow">
            <span>Onde o voo do Carcará encontra o horizonte do seu sonho.</span>
          </div>
          <style jsx>{`
            @keyframes gold-pulse {
              0%, 100% { opacity: 0.7; filter: blur(4px); }
              50% { opacity: 1; filter: blur(0); }
            }
            .animate-gold-pulse { animation: gold-pulse 2.5s ease-in-out infinite; }
            @keyframes title-glow {
              0%, 100% { text-shadow: 0 0 40px #FFD70055, 0 8px 32px #B7791F44; }
              50% { text-shadow: 0 0 80px #FFD70099, 0 16px 64px #B7791F88; }
            }
            .animate-title-glow { animation: title-glow 3.5s ease-in-out infinite; }
            @keyframes fadein {
              from { opacity: 0; transform: translateY(24px); }
              to { opacity: 1; transform: none; }
            }
            .animate-fadein { animation: fadein 1.2s cubic-bezier(.4,0,.2,1) both; }
            .animate-fadein-slow { animation: fadein 2.2s cubic-bezier(.4,0,.2,1) both; }
          `}</style>
          
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
              {t('sitioscarcara.about')}
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
              aria-label={t('sitioscarcara.see_more')}
              tabIndex={0}
              role="button"
            >
               {t('sitioscarcara.see_more')}
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
              aria-label={t('sitioscarcara.request_visit')}
              onClick={() => setShowVisitModal(true)}
              tabIndex={0}
            >
              <Calendar className="w-7 h-7" />
              {t('sitioscarcara.request_visit')}
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
          {t('Propriedades Disponíveis')}
        </h2>
        <p className="text-center text-[#E6C98B] text-xl mb-16 max-w-2xl mx-auto">
          {t('Escolha sua propriedade ideal. Agende uma visita presencial ou por videoconferência.')}
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#A8C97F] border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {sitios.map((sitio) => {
              const fable = PROPERTY_FABLES[sitio.id.toLowerCase()]?.[lang] || PROPERTY_FABLES[sitio.id.toLowerCase()]?.pt;
              return (
                <article
                  key={sitio.id}
                  id={sitio.id}
                  className={`group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-3 border-[#2a2a1a] rounded-3xl overflow-hidden hover:border-[#A8C97F] hover:shadow-2xl hover:shadow-[#A8C97F]/40 transition-all`}
                  style={{ backgroundImage: 'url(/textures/linen-light.png), linear-gradient(135deg, #232323 60%, #0a0a0a 100%)' }}
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
                      {/* Name and Poetic Subtitle */}
                      <div className="mb-6">
                        <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#A8C97F] to-[#E6C98B] mb-2">
                          Sítio {sitio.title}
                        </h3>
                        {fable && (
                          <p className="text-[#D4A574] text-lg font-semibold italic">
                            {fable.subtitle}
                          </p>
                        )}
                        {fable && (
                          <p className="text-[#A8C97F] text-base font-medium italic mt-1">
                            {fable.tagline}
                          </p>
                        )}
                      </div>
                      {/* Fable - Poetic Card */}
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
                      {/* Moodboard & Purpose */}
                      {fable && (
                        <div className="mb-4 flex flex-col md:flex-row gap-4 text-[#A8C97F] text-xs">
                          <div className="flex-1"><span className="font-bold">Mood:</span> {fable.mood}</div>
                          <div className="flex-1"><span className="font-bold">Purpose:</span> {fable.purpose}</div>
                        </div>
                      )}
                      {/* Area */}
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
                            {sitio.current_bid ? t('sitioscarcara.current_bid') : t('sitioscarcara.starting_price')}
                          </div>
                          <div className={`font-bold text-2xl ${sitio.current_bid ? 'text-[#B7791F]' : 'text-[#A8C97F]'}`}>
                            {fable?.opening}
                          </div>
                          {sitio.current_bid && (
                            <div className="text-xs text-[#676767] mt-1">
                              {t('sitioscarcara.starting_price')}: {fable?.opening}
                            </div>
                          )}
                          {!sitio.current_bid && (
                            <div className="text-xs text-[#A8C97F] mt-1 font-semibold">
                              {t('Aberto a ofertas')}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-xs text-white mb-2 uppercase tracking-wide font-semibold opacity-80">{t('sitioscarcara.estimated_value')}</div>
                          <div className="font-bold text-[#E6C98B] text-2xl">
                            {fable?.estimated}
                          </div>
                          <div className="text-xs text-[#676767] mt-1">
                            ⭐⭐⭐⭐⭐ {t('Potencial')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {/* Action Buttons - Visit and Proposal */}
                  <div className="px-8 pb-8 grid grid-cols-2 gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScheduleVisit(sitio);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0D7377] to-[#5F7161] hover:from-[#5F7161] hover:to-[#0D7377] text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                      aria-label={t('sitioscarcara.request_visit') + ' ' + sitio.title}
                    >
                      <Calendar className="w-5 h-5" />
                      <span>{t('sitioscarcara.request_visit')}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMakeProposal(sitio);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#B87333] to-[#FFD700] hover:from-[#FFD700] hover:to-[#B87333] text-[#0a0a0a] font-bold rounded-xl transition-all hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                      aria-label={t('sitioscarcara.submit_offer') + ' ' + sitio.title}
                      disabled={!userId}
                    >
                      <TrendingUp className="w-5 h-5" />
                      <span>{t('sitioscarcara.submit_offer')}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 3D Interactive Map Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto bg-gradient-to-b from-[#0a0a0a] to-[#0d0d0d]">
        <h2 className="text-5xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#A8C97F] to-[#E6C98B] mb-4">
          {t('Propriedades Disponíveis')}
        </h2>
        <div className="flex justify-center">
          <a
            href="mailto:contato@publimicro.com.br"
            className="block px-8 py-5 border-2 border-[#E6C98B] text-[#E6C98B] hover:bg-[#E6C98B]/10 font-bold rounded-xl transition-all text-center flex items-center justify-center gap-3"
          >
            <Mail className="w-6 h-6" />
            contato@publimicro.com.br
          </a>
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

  // Wrapper to provide i18n context for the page
  export default function CarcaraProjectPage() {
    return (
      <I18nProvider>
        <CarcaraProjectPageContent />
      </I18nProvider>
    );
  }
