"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Upload, X, MapPin, Home, DollarSign, Bed, Bath, Square, Calendar } from 'lucide-react';

const PROPERTY_TYPES = [
  { value: 'sitio', label: 'Sítio' },
  { value: 'chacara', label: 'Chácara' },
  { value: 'fazenda', label: 'Fazenda' },
  { value: 'terreno_rural', label: 'Terreno Rural' },
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'industrial', label: 'Industrial' },
];

export default function PostarPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Form state
  const [propertyType, setPropertyType] = useState('sitio');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  
  // Property details
  const [areaTotal, setAreaTotal] = useState('');
  const [quartos, setQuartos] = useState('');
  const [banheiros, setBanheiros] = useState('');
  const [vagas, setVagas] = useState('');
  const [anosConstrucao, setAnosConstrucao] = useState('');
  
  // Photos
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/entrar?redirect=/postar');
        return;
      }
      
      setUser(user);
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/entrar?redirect=/postar');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPhotos([...photos, ...newFiles]);
      
      // Create previews
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (!user) {
        setError('Você precisa estar logado para anunciar');
        setSubmitting(false);
        return;
      }

      if (photos.length === 0) {
        setError('Adicione pelo menos uma foto da propriedade');
        setSubmitting(false);
        return;
      }

      // Insert property
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          user_id: user.id,
          title: nome,
          description: descricao,
          price: parseFloat(preco.replace(/\D/g, '')),
          address: localizacao,
          city: cidade,
          state: estado,
          zip_code: cep,
          property_type: propertyType,
          transaction_type: 'sale', // Default to sale
          total_area: areaTotal ? parseFloat(areaTotal) : null,
          bedrooms: quartos ? parseInt(quartos) : null,
          bathrooms: banheiros ? parseInt(banheiros) : null,
          parking_spaces: vagas ? parseInt(vagas) : null,
          year_built: anosConstrucao ? parseInt(anosConstrucao) : null,
          status: 'active',
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // Upload photos
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const fileExt = photo.name.split('.').pop();
        const fileName = `${property.id}/${Date.now()}_${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('property-photos')
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-photos')
          .getPublicUrl(fileName);

        // Insert photo record
        await supabase
          .from('property_photos')
          .insert({
            property_id: property.id,
            url: publicUrl,
            is_cover: i === 0,
            display_order: i,
          });
      }

      setSuccess('Propriedade anunciada com sucesso!');
      
      // Redirect to property page
      setTimeout(() => {
        router.push(`/imoveis/${property.id}`);
      }, 2000);

    } catch (error: any) {
      console.error('Error posting property:', error);
      setError(error.message || 'Erro ao anunciar propriedade. Tente novamente.');
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#A8C97F] to-[#0D7377] mb-4">
            Anunciar Propriedade
          </h1>
          <p className="text-[#676767]">Preencha os dados para anunciar sua propriedade gratuitamente</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#2a2a2a] border-2 border-[#3a3a3a] rounded-2xl p-8 space-y-6">
          {/* Property Type */}
          <div>
            <label className="block text-[#D4A574] font-semibold mb-2">Tipo de Propriedade *</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
              required
            >
              {PROPERTY_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[#D4A574] font-semibold mb-2">
              <Home className="w-4 h-4 inline mr-2" />
              Nome da Propriedade *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Sítio Recanto das Águas"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#D4A574] font-semibold mb-2">Descrição *</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva sua propriedade, destacando suas características principais..."
              rows={5}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-[#D4A574] font-semibold mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Preço (R$) *
            </label>
            <input
              type="text"
              value={preco}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setPreco(value ? parseInt(value).toLocaleString('pt-BR') : '');
              }}
              placeholder="Ex: 850.000"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
              required
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#D4A574] font-semibold mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Cidade *
              </label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: Planaltina"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
                required
              />
            </div>
            <div>
              <label className="block text-[#D4A574] font-semibold mb-2">Estado *</label>
              <input
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                placeholder="Ex: Goiás"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#D4A574] font-semibold mb-2">Endereço/Localização *</label>
            <input
              type="text"
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              placeholder="Ex: Rodovia GO-118, Km 25"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
              required
            />
          </div>

          <div>
            <label className="block text-[#D4A574] font-semibold mb-2">CEP</label>
            <input
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              placeholder="Ex: 73000-000"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
            />
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[#D4A574] font-semibold mb-2">
                <Square className="w-4 h-4 inline mr-2" />
                Área (m²)
              </label>
              <input
                type="number"
                value={areaTotal}
                onChange={(e) => setAreaTotal(e.target.value)}
                placeholder="Ex: 50000"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
              />
            </div>
            <div>
              <label className="block text-[#D4A574] font-semibold mb-2">
                <Bed className="w-4 h-4 inline mr-2" />
                Quartos
              </label>
              <input
                type="number"
                value={quartos}
                onChange={(e) => setQuartos(e.target.value)}
                placeholder="Ex: 4"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
              />
            </div>
            <div>
              <label className="block text-[#D4A574] font-semibold mb-2">
                <Bath className="w-4 h-4 inline mr-2" />
                Banheiros
              </label>
              <input
                type="number"
                value={banheiros}
                onChange={(e) => setBanheiros(e.target.value)}
                placeholder="Ex: 3"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
              />
            </div>
            <div>
              <label className="block text-[#D4A574] font-semibold mb-2">Vagas</label>
              <input
                type="number"
                value={vagas}
                onChange={(e) => setVagas(e.target.value)}
                placeholder="Ex: 2"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#D4A574] font-semibold mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Ano de Construção
            </label>
            <input
              type="number"
              value={anosConstrucao}
              onChange={(e) => setAnosConstrucao(e.target.value)}
              placeholder="Ex: 2015"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
            />
          </div>

          {/* Photos */}
          <div>
            <label className="block text-[#D4A574] font-semibold mb-2">
              <Upload className="w-4 h-4 inline mr-2" />
              Fotos da Propriedade * (mínimo 1)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#676767] rounded-lg focus:outline-none focus:border-[#A8C97F]"
            />
            
            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-24 object-cover rounded-lg border border-[#3a3a3a]"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 bg-[#A8C97F] text-[#0a0a0a] text-xs px-2 py-1 rounded">
                        Capa
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-900/20 border border-green-500/50 text-green-400 rounded-lg">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-8 py-4 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white font-bold rounded-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {submitting ? 'Publicando...' : 'Publicar Anúncio'}
          </button>
        </form>
      </div>
    </main>
  );
}
