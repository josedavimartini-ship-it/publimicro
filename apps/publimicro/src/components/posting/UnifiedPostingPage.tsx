'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabaseBrowser';
import { 
  X, DollarSign, MapPin, ArrowLeft, ArrowRight, 
  Check, AlertCircle, Image as ImageIcon, Crown
} from 'lucide-react';
import CategorySelector, { PostingCategory, CATEGORIES } from '@/components/posting/CategorySelector';
import VehicleForm, { VehicleFormData } from '@/components/posting/VehicleForm';
import MarineForm, { MarineFormData } from '@/components/posting/MarineForm';
import MachineryForm, { MachineryFormData } from '@/components/posting/MachineryForm';
import TierSelector from '@/components/posting/TierSelector';
import { getTierLimits, validatePhotoCount, canPostFreeListing } from '@/lib/listingTiers';

// Property types for real estate category
const PROPERTY_TYPES = [
  { value: 'sitio', label: 'Sítio' },
  { value: 'chacara', label: 'Chácara' },
  { value: 'fazenda', label: 'Fazenda' },
  { value: 'rancho', label: 'Rancho' },
  { value: 'casa-de-campo', label: 'Casa de Campo' },
  { value: 'terreno', label: 'Terreno' },
];

// Steps for the posting wizard
type PostingStep = 'category' | 'tier' | 'details' | 'photos' | 'location' | 'pricing' | 'review';

const STEPS: { id: PostingStep; label: string }[] = [
  { id: 'category', label: 'Categoria' },
  { id: 'tier', label: 'Plano' },
  { id: 'details', label: 'Detalhes' },
  { id: 'photos', label: 'Fotos' },
  { id: 'location', label: 'Localização' },
  { id: 'pricing', label: 'Preço' },
  { id: 'review', label: 'Revisão' },
];

export default function UnifiedPostingPage() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  // Auth state
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Wizard state
  const [currentStep, setCurrentStep] = useState<PostingStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<PostingCategory | null>(null);

  // Tier selection state
  const [selectedTier, setSelectedTier] = useState<string>('free');
  const [canUseFree, setCanUseFree] = useState(true);

  // Form data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [acceptsTrade, setAcceptsTrade] = useState(false);
  
  // Location
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [cep, setCep] = useState('');

  // Photos
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  // Category-specific data
  const [propertyType, setPropertyType] = useState('sitio');
   
  const [propertyData, _setPropertyData] = useState<Record<string, unknown>>({});
  const [vehicleData, setVehicleData] = useState<VehicleFormData | null>(null);
  const [marineData, setMarineData] = useState<MarineFormData | null>(null);
  const [machineryData, setMachineryFormData] = useState<MachineryFormData | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check auth and free tier eligibility on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (!user) {
        router.push('/entrar?redirect=/postar');
        return;
      }
      
      // Check if user can still use free tier
      const canFree = await canPostFreeListing(user.id, supabase);
      setCanUseFree(canFree);
      if (!canFree) {
        setSelectedTier('standard'); // Default to standard if free is used
      }
      
      setLoading(false);
    };
    void checkUser();
  }, [router, supabase]);

  // Get current tier limits
  const tierLimits = getTierLimits(selectedTier);

  // Photo handling with tier limits
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const maxPhotos = tierLimits?.maxPhotos || 3;
      
      // Check if adding these photos would exceed the limit
      if (photos.length + newFiles.length > maxPhotos) {
        setError(`Máximo de ${maxPhotos} fotos permitidas no plano selecionado`);
        return;
      }
      
      setPhotos(prev => [...prev, ...newFiles]);
      
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  // CEP auto-fill
  const handleCepChange = async (value: string) => {
    const cleanCep = value.replace(/\D/g, '');
    setCep(cleanCep);
    
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setCity(data.localidade);
          setState(data.uf);
          setNeighborhood(data.bairro);
        }
      } catch (error) {
        console.error('Error fetching CEP:', error);
      }
    }
  };

  // Navigation
  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  
  const canProceed = () => {
    const _minPhotos = tierLimits?.minPhotos || 1;
    
    switch (currentStep) {
      case 'category':
        return selectedCategory !== null;
      case 'tier':
        return selectedTier !== '';
      case 'details':
        return title.trim() !== '' && description.trim() !== '';
      case 'photos':
        const validation = validatePhotoCount(photos.length, selectedTier);
        return validation.valid;
      case 'location':
        return city.trim() !== '' && state.trim() !== '';
      case 'pricing':
        return price.trim() !== '';
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const goToNextStep = () => {
    if (currentStepIndex < STEPS.length - 1 && canProceed()) {
      setCurrentStep(STEPS[currentStepIndex + 1].id);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    }
  };

  // Callbacks for category-specific forms
  const handleVehicleDataChange = useCallback((data: VehicleFormData) => {
    setVehicleData(data);
    // Auto-fill title from vehicle data
    if (data.brand && data.model && data.year) {
      setTitle(`${data.brand} ${data.model} ${data.year}`);
    }
  }, []);

  const handleMarineDataChange = useCallback((data: MarineFormData) => {
    setMarineData(data);
    if (data.brand && data.model && data.year) {
      setTitle(`${data.brand} ${data.model} ${data.year}`);
    }
  }, []);

  const handleMachineryDataChange = useCallback((data: MachineryFormData) => {
    setMachineryFormData(data);
    if (data.brand && data.model && data.year) {
      setTitle(`${data.brand} ${data.model} ${data.year}`);
    }
  }, []);

  // Submit handler
  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      // Determine which table to insert into based on category
      let tableName = 'listings'; // generic listings table
      let additionalData: Record<string, unknown> = {};

      switch (selectedCategory) {
        case 'property':
          tableName = 'sitios';
          additionalData = {
            tipo: propertyType,
            ...propertyData
          };
          break;
        case 'vehicle':
          additionalData = {
            category: 'vehicle',
            ...vehicleData
          };
          break;
        case 'marine':
          additionalData = {
            category: 'marine',
            ...marineData
          };
          break;
        case 'machinery':
          additionalData = {
            category: 'machinery',
            ...machineryData
          };
          break;
        default:
          additionalData = {
            category: selectedCategory
          };
      }

      // Insert the listing
      const { data: listing, error: listingError } = await supabase
        .from(tableName)
        .insert({
          user_id: user.id,
          nome: title,
          descricao: description,
          preco: parseFloat(price.replace(/\D/g, '')),
          localizacao: `${neighborhood ? neighborhood + ', ' : ''}${city}, ${state}`,
          zona: city,
          ativo: true,
          negociavel: negotiable,
          aceita_troca: acceptsTrade,
          ...additionalData
        })
        .select()
        .single();

      if (listingError) throw listingError;

      // Upload photos
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const fileExt = photo.name.split('.').pop();
        const fileName = `${listing.id}/${Date.now()}_${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('property-photos')
          .upload(fileName, photo);

        if (uploadError) {
          console.error('Photo upload error:', uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('property-photos')
          .getPublicUrl(fileName);

        // For sitios table, update the fotos array
        if (tableName === 'sitios') {
          const currentPhotos = listing.fotos || [];
          await supabase
            .from('sitios')
            .update({ fotos: [...currentPhotos, publicUrl] })
            .eq('id', listing.id);
        } else {
          // For generic listings, use a photos junction table or JSON field
          await supabase
            .from('listing_photos')
            .insert({
              listing_id: listing.id,
              url: publicUrl,
              is_cover: i === 0,
              display_order: i
            });
        }
      }

      setSuccess('Anúncio publicado com sucesso!');
      
      // Redirect based on category
      setTimeout(() => {
        if (selectedCategory === 'property') {
          router.push(`/imoveis/${listing.id}`);
        } else {
          router.push(`/anuncios/${listing.id}`);
        }
      }, 2000);

    } catch (error: unknown) {
      console.error('Submission error:', error);
      const message = typeof error === 'string' ? error : error instanceof Error ? error.message : 'Erro ao publicar anúncio. Tente novamente.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#D4A574] text-xl">Carregando...</div>
      </div>
    );
  }

  const selectedCategoryInfo = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#B8904D] to-[#C9A87C] mb-2">
            Publicar Anúncio
          </h1>
          <p className="text-[#676767]">
            {selectedCategoryInfo 
              ? `Anunciando em: ${selectedCategoryInfo.label}` 
              : 'Escolha a categoria e preencha os detalhes'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-4">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStepIndex > index 
                      ? 'bg-[#A8C97F] text-[#0a0a0a]'
                      : currentStepIndex === index
                        ? 'bg-[#D4A574] text-[#0a0a0a]'
                        : 'bg-[#3a3a3a] text-[#676767]'
                  }`}
                >
                  {currentStepIndex > index ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <span className={`text-xs mt-1 hidden sm:block ${
                  currentStepIndex >= index ? 'text-[#D4A574]' : 'text-[#676767]'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded ${
                  currentStepIndex > index ? 'bg-[#A8C97F]' : 'bg-[#3a3a3a]'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-[#2a2a2a] border-2 border-[#3a3a3a] rounded-2xl p-6 md:p-8">
          {/* Step: Category Selection */}
          {currentStep === 'category' && (
            <CategorySelector 
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          )}

          {/* Step: Tier Selection */}
          {currentStep === 'tier' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#CD7F32]/20 rounded-full mb-4">
                  <Crown className="w-5 h-5 text-[#CD7F32]" />
                  <span className="text-[#CD7F32] font-semibold">Escolha seu Plano</span>
                </div>
                <h2 className="text-2xl font-bold text-[#D4A574]">Selecione o melhor plano para seu anúncio</h2>
                <p className="text-[#8B9B6E] mt-2">
                  {canUseFree 
                    ? 'Você tem direito a 1 anúncio gratuito!' 
                    : 'Você já utilizou seu anúncio gratuito. Escolha um plano pago.'}
                </p>
              </div>
              
              <TierSelector
                selectedTier={selectedTier}
                onSelectTier={setSelectedTier}
                canUseFree={canUseFree}
                showComparison={true}
              />
            </div>
          )}

          {/* Step: Details */}
          {currentStep === 'details' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#D4A574] mb-4">Detalhes do Anúncio</h2>
              
              {/* Category-specific forms */}
              {selectedCategory === 'vehicle' && (
                <VehicleForm onDataChange={handleVehicleDataChange} />
              )}
              
              {selectedCategory === 'marine' && (
                <MarineForm onDataChange={handleMarineDataChange} />
              )}
              
              {selectedCategory === 'machinery' && (
                <MachineryForm onDataChange={handleMachineryDataChange} />
              )}

              {/* Property-specific fields */}
              {selectedCategory === 'property' && (
                <div>
                  <label className="block text-[#D4A574] font-semibold mb-2">Tipo de Propriedade *</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
                  >
                    {PROPERTY_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Common fields - Title */}
              <div>
                <label className="block text-[#D4A574] font-semibold mb-2">Título do Anúncio *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Toyota Hilux 2022 SRX"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
                  required
                />
                {title && (
                  <p className="text-xs text-[#676767] mt-1">
                    Caracteres: {title.length}/100
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-[#D4A574] font-semibold mb-2">Descrição *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva seu anúncio com detalhes importantes para os compradores..."
                  rows={5}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
                  required
                />
                <p className="text-xs text-[#676767] mt-1">
                  Caracteres: {description.length}/2000
                </p>
              </div>
            </div>
          )}

          {/* Step: Photos */}
          {currentStep === 'photos' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#D4A574] mb-4">Fotos do Anúncio</h2>
              
              {/* Tier limits info */}
              <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-[#8B9B6E] text-sm">
                    Fotos: <span className="text-[#E6C98B] font-bold">{photos.length}</span> / {tierLimits?.maxPhotos || 3}
                  </p>
                  <p className="text-[#676767] text-xs mt-1">
                    Mínimo: {tierLimits?.minPhotos || 1} foto{(tierLimits?.minPhotos || 1) > 1 ? 's' : ''}
                  </p>
                </div>
                {photos.length >= (tierLimits?.maxPhotos || 3) && (
                  <span className="text-yellow-400 text-xs bg-yellow-400/10 px-3 py-1 rounded-full">
                    Limite atingido
                  </span>
                )}
              </div>
              
              <div className="border-2 border-dashed border-[#3a3a3a] rounded-xl p-8 text-center hover:border-[#A8C97F] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-input"
                  disabled={photos.length >= (tierLimits?.maxPhotos || 3)}
                />
                <label htmlFor="photo-input" className={`cursor-pointer ${photos.length >= (tierLimits?.maxPhotos || 3) ? 'opacity-50' : ''}`}>
                  <ImageIcon className="w-12 h-12 text-[#676767] mx-auto mb-4" />
                  <p className="text-[#D4A574] font-semibold mb-2">
                    {photos.length >= (tierLimits?.maxPhotos || 3) 
                      ? 'Limite de fotos atingido' 
                      : 'Clique para adicionar fotos'}
                  </p>
                  <p className="text-[#676767] text-sm">
                    PNG, JPG ou WEBP. Máximo {tierLimits?.maxPhotos || 3} fotos, 5MB cada.
                  </p>
                </label>
              </div>

              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-full object-cover rounded-lg border border-[#3a3a3a]"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 bg-[#A8C97F] text-[#0a0a0a] text-xs font-bold px-2 py-1 rounded">
                          Capa
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[#676767] text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                A primeira foto será usada como capa do anúncio
              </p>
              
              {/* Photo validation message */}
              {photos.length < (tierLimits?.minPhotos || 1) && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">
                    ⚠️ Adicione pelo menos {tierLimits?.minPhotos || 1} foto{(tierLimits?.minPhotos || 1) > 1 ? 's' : ''} para continuar
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step: Location */}
          {currentStep === 'location' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#D4A574] mb-4">
                <MapPin className="w-6 h-6 inline mr-2" />
                Localização
              </h2>

              {/* CEP with auto-fill */}
              <div>
                <label className="block text-[#D4A574] font-semibold mb-2">CEP</label>
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
                />
                <p className="text-xs text-[#676767] mt-1">
                  Digite o CEP para preencher automaticamente
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#D4A574] font-semibold mb-2">Cidade *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Brasília"
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#D4A574] font-semibold mb-2">Estado *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Ex: DF"
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#D4A574] font-semibold mb-2">Bairro</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Asa Sul"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
                />
              </div>
            </div>
          )}

          {/* Step: Pricing */}
          {currentStep === 'pricing' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#D4A574] mb-4">
                <DollarSign className="w-6 h-6 inline mr-2" />
                Preço
              </h2>

              <div>
                <label className="block text-[#D4A574] font-semibold mb-2">Valor (R$) *</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setPrice(value ? parseInt(value).toLocaleString('pt-BR') : '');
                  }}
                  placeholder="Ex: 150.000"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F] text-2xl font-bold"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={negotiable}
                    onChange={(e) => setNegotiable(e.target.checked)}
                    className="w-5 h-5 rounded border-[#3a3a3a] text-[#A8C97F] focus:ring-[#A8C97F]"
                  />
                  <span className="text-[#D4A574]">Preço negociável</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptsTrade}
                    onChange={(e) => setAcceptsTrade(e.target.checked)}
                    className="w-5 h-5 rounded border-[#3a3a3a] text-[#A8C97F] focus:ring-[#A8C97F]"
                  />
                  <span className="text-[#D4A574]">Aceito troca</span>
                </label>
              </div>
            </div>
          )}

          {/* Step: Review */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#D4A574] mb-4">Revisão do Anúncio</h2>
              
              {/* Preview Card */}
              <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
                {photoPreviews.length > 0 && (
                  <img 
                    src={photoPreviews[0]} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${
                    CATEGORIES.find(c => c.id === selectedCategory)?.color || 'from-gray-500 to-gray-700'
                  } text-white`}>
                    {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#D4A574]">{title || 'Sem título'}</h3>
                
                <p className="text-[#676767] line-clamp-3">{description || 'Sem descrição'}</p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#A8C97F]">
                    R$ {price || '0'}
                  </span>
                  <span className="text-[#676767] text-sm">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {city}, {state}
                  </span>
                </div>

                {(negotiable || acceptsTrade) && (
                  <div className="flex gap-2">
                    {negotiable && (
                      <span className="text-xs bg-[#D4A574]/20 text-[#D4A574] px-2 py-1 rounded">
                        Negociável
                      </span>
                    )}
                    {acceptsTrade && (
                      <span className="text-xs bg-[#D4A574]/20 text-[#D4A574] px-2 py-1 rounded">
                        Aceita troca
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <span className="text-[#676767]">Fotos</span>
                  <p className="text-[#D4A574] font-bold">{photos.length} imagens</p>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <span className="text-[#676767]">Categoria</span>
                  <p className="text-[#D4A574] font-bold">
                    {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 p-4 bg-green-900/20 border border-green-500/50 text-green-400 rounded-lg flex items-center gap-2">
              <Check className="w-5 h-5 flex-shrink-0" />
              {success}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-[#3a3a3a]">
            <button
              type="button"
              onClick={goToPreviousStep}
              disabled={currentStepIndex === 0}
              className="px-6 py-3 flex items-center gap-2 text-[#676767] hover:text-[#D4A574] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>

            {currentStep === 'review' ? (
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={submitting}
                className="px-8 py-3 bg-gradient-to-r from-[#6B7F5C] to-[#2C5F6F] hover:from-[#7A8F6B] hover:to-[#3A6F7F] text-white font-bold rounded-lg flex items-center gap-2 disabled:opacity-50 transition"
              >
                {submitting ? 'Publicando...' : 'Publicar Anúncio'}
                <Check className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={goToNextStep}
                disabled={!canProceed()}
                className="px-8 py-3 bg-gradient-to-r from-[#D4A574] to-[#B8904D] hover:from-[#C9A87C] hover:to-[#A8804D] text-[#0a0a0a] font-bold rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Continuar
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
