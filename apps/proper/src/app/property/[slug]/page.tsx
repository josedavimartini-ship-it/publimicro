"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Ruler, BedDouble, Bath, Car, DollarSign, Heart,
  Phone, Mail, Calendar, Check, X, Home, Trees, Droplet,
  Zap, Wifi, ChevronLeft, ChevronRight, Share2, AlertCircle,
  Building2, Waves, Gavel
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  description: string;
  property_type: string;
  transaction_type: string;
  price: number;
  condominium_fee: number | null;
  iptu_annual: number | null;
  accepts_financing: boolean;
  accepts_exchange: boolean;
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  address: string | null;
  total_area: number;
  built_area: number | null;
  land_area: number | null;
  bedrooms: number;
  bathrooms: number;
  suites: number;
  parking_spaces: number;
  water_source: string | null;
  has_electricity: boolean;
  has_internet: boolean;
  soil_quality: string | null;
  topography: string | null;
  vegetation_type: string | null;
  near_water: boolean;
  water_distance_meters: number | null;
  year_built: number | null;
  floors: number;
  furnished: boolean;
  has_deed: boolean;
  has_registration: boolean;
  featured: boolean;
  video_url: string | null;
  virtual_tour_url: string | null;
  views_count: number;
  favorites_count: number;
  user_id: string;
  created_at: string;
  property_photos: { url: string; caption: string; is_cover: boolean; display_order: number }[];
  property_amenities: { amenity_type: string }[];
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: "Apartment",
  house: "House",
  chacara: "Chácara",
  sitio: "Sítio",
  fazenda: "Fazenda",
  rancho: "Rancho",
  commercial: "Commercial",
  land: "Land",
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCheckingVisit, setIsCheckingVisit] = useState(false);
  
  const slug = params.slug as string;

  useEffect(() => {
    fetchProperty();
    trackView();
  }, [slug]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_photos(url, caption, is_cover, display_order),
          property_amenities(amenity_type)
        `)
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      
      if (data) {
        // Sort photos by display_order
        data.property_photos.sort((a: any, b: any) => a.display_order - b.display_order);
        setProperty(data);
        
        // Check if favorited
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: fav } = await supabase
            .from('property_favorites')
            .select('id')
            .eq('property_id', data.id)
            .eq('user_id', user.id)
            .single();
          
          setIsFavorite(!!fav);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Property not found');
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('property_views').insert({
        property_id: property?.id,
        user_id: user?.id || null,
      });
    } catch (err) {
      // Silent fail for analytics
      console.error('View tracking error:', err);
    }
  };

  const handleFazerProposta = async () => {
    setIsCheckingVisit(true);
    
    try {
      // Step 1: Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Not logged in - redirect to sign in
        router.push(`/entrar?redirect=/property/${slug}`);
        return;
      }

      // Step 2: Check if user has completed a visit for this property
      const { data: visits, error: visitError } = await supabase
        .from('visits')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('property_id', property?.id)
        .in('status', ['confirmed', 'completed']);

      if (visitError) throw visitError;

      if (!visits || visits.length === 0) {
        // No visit scheduled/completed - redirect to visit form
        router.push(`/schedule-visit?propertyId=${property?.id}`);
        return;
      }

      // Step 3: User is authorized - play auction sound and redirect to proposal
      playAuctionSound();
      
      setTimeout(() => {
        router.push(`/proposta?propId=${property?.id}`);
      }, 500);

    } catch (err: any) {
      alert('Error checking authorization: ' + err.message);
    } finally {
      setIsCheckingVisit(false);
    }
  };

  const playAuctionSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const toggleFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/entrar');
        return;
      }

      if (isFavorite) {
        await supabase
          .from('property_favorites')
          .delete()
          .eq('property_id', property?.id)
          .eq('user_id', user.id);
        setIsFavorite(false);
      } else {
        await supabase
          .from('property_favorites')
          .insert({
            property_id: property?.id,
            user_id: user.id,
          });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Favorite error:', err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const nextPhoto = () => {
    if (property && property.property_photos.length > 0) {
      setCurrentPhotoIndex((prev) => 
        prev === property.property_photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (property && property.property_photos.length > 0) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? property.property_photos.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#B87333] border-t-transparent mb-4"></div>
          <p className="text-[#d8c68e]">Loading property...</p>
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-[#B87333] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#d8c68e] mb-2">Property Not Found</h1>
          <p className="text-[#676767] mb-6">{error || 'This property may have been removed or is no longer available.'}</p>
          <Link
            href="/proper/search"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#B87333] to-[#DAA520] text-white font-semibold rounded-lg hover:from-[#DAA520] hover:to-[#FFD700] transition"
          >
            Browse Properties
          </Link>
        </div>
      </main>
    );
  }

  const photos = property.property_photos.length > 0 
    ? property.property_photos 
    : [{ url: '/images/placeholder-property.jpg', caption: '', is_cover: true, display_order: 0 }];

  const isRural = ['chacara', 'sitio', 'fazenda', 'rancho'].includes(property.property_type);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <Link
          href="/proper/search"
          className="inline-flex items-center gap-2 text-[#676767] hover:text-[#B87333] transition mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Search
        </Link>

        {/* Photo Gallery */}
        <div className="relative h-[500px] rounded-2xl overflow-hidden mb-8 group">
          <Image
            src={photos[currentPhotoIndex].url}
            alt={photos[currentPhotoIndex].caption || property.title}
            fill
            className="object-cover"
            unoptimized
          />
          
          {/* Photo Navigation */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Photo Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentPhotoIndex + 1} / {photos.length}
              </div>
            </>
          )}

          {/* Featured Badge */}
          {property.featured && (
            <div className="absolute top-4 left-4 px-4 py-2 bg-[#FFD700] text-[#0a0a0a] font-bold rounded-full">
              ⭐ Featured
            </div>
          )}

          {/* Transaction Type Badge */}
          <div className="absolute top-4 right-4 px-4 py-2 bg-[#B87333] text-white font-semibold rounded-full capitalize">
            {property.transaction_type}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Price */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-[#B87333]/20 border border-[#B87333] rounded-full text-[#B87333] text-sm font-semibold capitalize">
                  {PROPERTY_TYPE_LABELS[property.property_type] || property.property_type}
                </span>
                {isRural && (
                  <span className="px-3 py-1 bg-[#6B8E23]/20 border border-[#6B8E23] rounded-full text-[#6B8E23] text-sm font-semibold">
                    Rural Property
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-[#e6c86b] mb-4">
                {property.title}
              </h1>

              <div className="flex items-center gap-2 text-[#676767] mb-6">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">
                  {property.neighborhood && `${property.neighborhood}, `}
                  {property.city}, {property.state}, {property.country}
                </span>
              </div>

              <div className="text-5xl font-bold text-[#B87333]">
                {formatPrice(property.price)}
              </div>

              {property.condominium_fee && (
                <p className="text-[#676767] mt-2">
                  + {formatPrice(property.condominium_fee)}/month condominium fee
                </p>
              )}
            </div>

            {/* Key Features */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-[#B87333] mb-4">Key Features</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.bedrooms > 0 && (
                  <div className="text-center p-4 bg-[#0a0a0a] rounded-lg">
                    <BedDouble className="w-8 h-8 text-[#B87333] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#e6c86b]">{property.bedrooms}</div>
                    <div className="text-sm text-[#676767]">Bedrooms</div>
                  </div>
                )}
                
                {property.bathrooms > 0 && (
                  <div className="text-center p-4 bg-[#0a0a0a] rounded-lg">
                    <Bath className="w-8 h-8 text-[#B87333] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#e6c86b]">{property.bathrooms}</div>
                    <div className="text-sm text-[#676767]">Bathrooms</div>
                  </div>
                )}
                
                {property.parking_spaces > 0 && (
                  <div className="text-center p-4 bg-[#0a0a0a] rounded-lg">
                    <Car className="w-8 h-8 text-[#B87333] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#e6c86b]">{property.parking_spaces}</div>
                    <div className="text-sm text-[#676767]">Parking</div>
                  </div>
                )}
                
                {property.total_area > 0 && (
                  <div className="text-center p-4 bg-[#0a0a0a] rounded-lg">
                    <Ruler className="w-8 h-8 text-[#B87333] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#e6c86b]">{property.total_area}</div>
                    <div className="text-sm text-[#676767]">{isRural ? 'Hectares' : 'm²'}</div>
                  </div>
                )}
              </div>

              {/* Additional Urban Features */}
              {!isRural && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {property.built_area && (
                    <div className="px-4 py-2 bg-[#0a0a0a] rounded-lg text-sm">
                      <span className="text-[#676767]">Built:</span>{' '}
                      <span className="text-[#d8c68e] font-semibold">{property.built_area}m²</span>
                    </div>
                  )}
                  {property.year_built && (
                    <div className="px-4 py-2 bg-[#0a0a0a] rounded-lg text-sm">
                      <span className="text-[#676767]">Year:</span>{' '}
                      <span className="text-[#d8c68e] font-semibold">{property.year_built}</span>
                    </div>
                  )}
                  {property.furnished && (
                    <div className="px-4 py-2 bg-[#0a0a0a] rounded-lg text-sm text-[#6B8E23] font-semibold">
                      ✓ Furnished
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Rural Features */}
            {isRural && (
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-[#B87333] mb-4 flex items-center gap-2">
                  <Trees className="w-6 h-6" />
                  Rural Features
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {property.water_source && (
                    <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-lg">
                      <Droplet className="w-5 h-5 text-[#4A90E2]" />
                      <div>
                        <div className="text-sm text-[#676767]">Water Source</div>
                        <div className="text-[#d8c68e] font-semibold capitalize">{property.water_source}</div>
                      </div>
                    </div>
                  )}

                  {property.has_electricity && (
                    <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-lg">
                      <Zap className="w-5 h-5 text-[#FFD700]" />
                      <div className="text-[#d8c68e] font-semibold">Electricity Available</div>
                    </div>
                  )}

                  {property.has_internet && (
                    <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-lg">
                      <Wifi className="w-5 h-5 text-[#4A90E2]" />
                      <div className="text-[#d8c68e] font-semibold">Internet Available</div>
                    </div>
                  )}

                  {property.soil_quality && (
                    <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-lg">
                      <div>
                        <div className="text-sm text-[#676767]">Soil Quality</div>
                        <div className="text-[#d8c68e] font-semibold capitalize">{property.soil_quality}</div>
                      </div>
                    </div>
                  )}

                  {property.topography && (
                    <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-lg">
                      <div>
                        <div className="text-sm text-[#676767]">Topography</div>
                        <div className="text-[#d8c68e] font-semibold capitalize">{property.topography}</div>
                      </div>
                    </div>
                  )}

                  {property.vegetation_type && (
                    <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-lg">
                      <div>
                        <div className="text-sm text-[#676767]">Vegetation</div>
                        <div className="text-[#d8c68e] font-semibold">{property.vegetation_type}</div>
                      </div>
                    </div>
                  )}

                  {property.near_water && (
                    <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-lg">
                      <Waves className="w-5 h-5 text-[#4A90E2]" />
                      <div>
                        <div className="text-[#d8c68e] font-semibold">Near Water</div>
                        {property.water_distance_meters && (
                          <div className="text-sm text-[#676767]">{property.water_distance_meters}m away</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-[#B87333] mb-4">Description</h2>
              <p className="text-[#d8c68e] whitespace-pre-line leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.property_amenities.length > 0 && (
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-[#B87333] mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.property_amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-[#d8c68e]">
                      <Check className="w-4 h-4 text-[#6B8E23]" />
                      <span className="capitalize">{amenity.amenity_type.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legal Documents */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-[#B87333] mb-4">Legal Documents</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {property.has_deed ? (
                    <Check className="w-5 h-5 text-[#6B8E23]" />
                  ) : (
                    <X className="w-5 h-5 text-[#676767]" />
                  )}
                  <span className={property.has_deed ? 'text-[#d8c68e]' : 'text-[#676767]'}>
                    Property Deed (Escritura)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {property.has_registration ? (
                    <Check className="w-5 h-5 text-[#6B8E23]" />
                  ) : (
                    <X className="w-5 h-5 text-[#676767]" />
                  )}
                  <span className={property.has_registration ? 'text-[#d8c68e]' : 'text-[#676767]'}>
                    Property Registration (Matrícula)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Contact & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Fazer Proposta Button */}
              <button
                onClick={handleFazerProposta}
                disabled={isCheckingVisit}
                className="w-full bg-gradient-to-r from-[#B87333] to-[#DAA520] hover:from-[#DAA520] hover:to-[#FFD700] text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <Gavel className="w-5 h-5" />
                {isCheckingVisit ? 'Checking...' : 'Fazer Proposta'}
              </button>

              {/* Schedule Visit */}
              <Link
                href={`/schedule-visit?propertyId=${property.id}`}
                className="w-full bg-[#1a1a1a] hover:bg-[#2a2a1a] border-2 border-[#B87333] text-[#B87333] font-semibold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Schedule Visit
              </Link>

              {/* Favorite */}
              <button
                onClick={toggleFavorite}
                className={`w-full ${
                  isFavorite
                    ? 'bg-[#B87333] text-white'
                    : 'bg-[#1a1a1a] border-2 border-[#2a2a1a] text-[#d8c68e]'
                } hover:bg-[#B87333] hover:text-white font-semibold py-4 rounded-lg transition-all flex items-center justify-center gap-2`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Saved' : 'Save Property'}
              </button>

              {/* Share */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: property.title,
                      text: property.description,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="w-full bg-[#1a1a1a] hover:bg-[#2a2a1a] border-2 border-[#2a2a1a] text-[#d8c68e] font-semibold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>

              {/* Contact Info */}
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
                <h3 className="text-xl font-bold text-[#B87333] mb-4">Contact Seller</h3>
                
                <div className="space-y-3">
                  <a
                    href={`https://wa.me/5534992610004?text=Hi, I'm interested in ${property.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-lg transition"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-semibold">WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:contact@acheme.com?subject=Property Inquiry: ${property.title}`}
                    className="flex items-center gap-3 p-3 bg-[#0a0a0a] hover:bg-[#1a1a1a] border border-[#2a2a1a] text-[#d8c68e] rounded-lg transition"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="font-semibold">Email</span>
                  </a>
                </div>
              </div>

              {/* Property Stats */}
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#676767]">Views</span>
                    <span className="text-[#d8c68e] font-semibold">{property.views_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#676767]">Favorites</span>
                    <span className="text-[#d8c68e] font-semibold">{property.favorites_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#676767]">Listed</span>
                    <span className="text-[#d8c68e] font-semibold">
                      {new Date(property.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financing & Exchange */}
              {(property.accepts_financing || property.accepts_exchange) && (
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-[#B87333] mb-3">Payment Options</h3>
                  <div className="space-y-2">
                    {property.accepts_financing && (
                      <div className="flex items-center gap-2 text-[#d8c68e]">
                        <Check className="w-4 h-4 text-[#6B8E23]" />
                        <span>Accepts Financing</span>
                      </div>
                    )}
                    {property.accepts_exchange && (
                      <div className="flex items-center gap-2 text-[#d8c68e]">
                        <Check className="w-4 h-4 text-[#6B8E23]" />
                        <span>Accepts Exchange</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
