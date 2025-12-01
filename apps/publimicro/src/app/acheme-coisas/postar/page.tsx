"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabaseBrowser';
import { Upload, X, Tag, DollarSign, Package, Truck, Loader2 } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

const LISTING_TYPES = [
  { value: 'sell', label: 'Vender' },
  { value: 'buy', label: 'Comprar' },
  { value: 'trade', label: 'Trocar' },
  { value: 'free', label: 'Doar' },
  { value: 'wanted', label: 'Procurando' },
];

const CONDITIONS = [
  { value: 'new', label: 'Novo' },
  { value: 'good', label: 'Usado - Bom estado' },
  { value: 'fair', label: 'Usado - Regular' },
];

export default function PostarCoisasPage() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Form state
  const [listingType, setListingType] = useState('sell');
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('good');
  const [brand, setBrand] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [shippingAvailable, setShippingAvailable] = useState(false);
  const [acceptsTrade, setAcceptsTrade] = useState(false);
  
  // Photos
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    void checkAuth();
    void loadCategories();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/entrar?redirect=/acheme-coisas/postar');
        return;
      }
      
      setUser(user);
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/entrar?redirect=/acheme-coisas/postar');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('name');
    
    setCategories(data || []);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPhotos([...photos, ...newFiles]);
      
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

      // Generate slug
      const slug = `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

      // Insert listing
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert({
          user_id: user.id,
          category_id: categoryId || null,
          title,
          description,
          listing_type: listingType,
          price: price ? parseFloat(price.replace(/\D/g, '')) : null,
          condition,
          brand: brand || null,
          quantity: parseInt(quantity) || 1,
          city,
          state,
          shipping_available: shippingAvailable,
          accepts_trade: acceptsTrade,
          slug,
          status: 'active',
        })
        .select()
        .single();

      if (listingError) throw listingError;

      // Upload photos if any
      if (photos.length > 0 && listing) {
        const photoUrls: string[] = [];
        
        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i];
          const fileExt = photo.name.split('.').pop();
          const fileName = `listings/${listing.id}/${Date.now()}_${i}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('listing-photos')
            .upload(fileName, photo);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('listing-photos')
              .getPublicUrl(fileName);
            photoUrls.push(publicUrl);
          }
        }

        // Update listing with photo URLs
        if (photoUrls.length > 0) {
          await supabase
            .from('listings')
            .update({ photos: photoUrls })
            .eq('id', listing.id);
        }
      }

      setSuccess('Anúncio publicado com sucesso!');
      
      setTimeout(() => {
        router.push('/acheme-coisas/publicado');
      }, 2000);

    } catch (error: any) {
      console.error('Error posting listing:', error);
      setError(error.message || 'Erro ao publicar anúncio. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#D4A574] text-xl flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          Carregando...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />
        
        <div className="text-center mb-8 mt-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C9A87C] to-[#B8904D] mb-4">
            Anunciar no AcheMeCoisas
          </h1>
          <p className="text-[#B8A890]">Venda, troque ou doe seus itens de forma simples</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#2a2a2a] border-2 border-[#3a3a3a] rounded-2xl p-8 space-y-6">
          {/* Listing Type */}
          <div>
            <label className="block text-[#D4C4A8] font-semibold mb-2">Tipo de Anúncio *</label>
            <div className="flex flex-wrap gap-2">
              {LISTING_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setListingType(type.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    listingType === type.value
                      ? 'bg-[#6B7F5C] text-white'
                      : 'bg-[#1a1a1a] text-[#8B9B6E] hover:bg-[#2a2a2a]'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[#D4C4A8] font-semibold mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Título do Anúncio *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: iPhone 14 Pro Max 256GB"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#D4C4A8] font-semibold mb-2">Descrição *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva seu item em detalhes..."
              rows={4}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
              required
            />
          </div>

          {/* Price and Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#D4C4A8] font-semibold mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Preço (R$)
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setPrice(value ? parseInt(value).toLocaleString('pt-BR') : '');
                }}
                placeholder={listingType === 'free' ? 'Grátis' : 'Ex: 2.500'}
                disabled={listingType === 'free'}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C] disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-[#D4C4A8] font-semibold mb-2">
                <Package className="w-4 h-4 inline mr-2" />
                Condição
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
              >
                {CONDITIONS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Brand and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#D4C4A8] font-semibold mb-2">Marca</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ex: Apple, Samsung..."
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
              />
            </div>
            <div>
              <label className="block text-[#D4C4A8] font-semibold mb-2">Quantidade</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#D4C4A8] font-semibold mb-2">Cidade *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Brasília"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
                required
              />
            </div>
            <div>
              <label className="block text-[#D4C4A8] font-semibold mb-2">Estado *</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Ex: DF"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
                required
              />
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={shippingAvailable}
                onChange={(e) => setShippingAvailable(e.target.checked)}
                className="w-5 h-5 rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#6B7F5C]"
              />
              <Truck className="w-4 h-4 text-[#8B9B6E]" />
              <span className="text-[#D4C4A8]">Envio disponível</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptsTrade}
                onChange={(e) => setAcceptsTrade(e.target.checked)}
                className="w-5 h-5 rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#6B7F5C]"
              />
              <span className="text-[#D4C4A8]">Aceito troca</span>
            </label>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-[#D4C4A8] font-semibold mb-2">
              <Upload className="w-4 h-4 inline mr-2" />
              Fotos do Item
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#8B8B8B] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
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
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Messages */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-8 py-4 bg-gradient-to-r from-[#6B7F5C] to-[#2C5F6F] hover:from-[#7A8F6B] hover:to-[#3A6F7F] text-[#D4C4A8] font-bold rounded-lg transition disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Publicando...
              </span>
            ) : (
              'Publicar Anúncio'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}





















