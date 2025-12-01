"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabaseBrowser';
import { Mail, Lock, User, Phone, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function EntrarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserSupabaseClient();
  
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    void checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push(redirectTo);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push(redirectTo);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao entrar. Verifique suas credenciais.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (error) throw error;
      setSuccess('Conta criada! Verifique seu email para confirmar.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar conta.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError('');

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao entrar com Google.';
      setError(msg);
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#D4A574] text-xl flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          Verificando...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-6">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C9A87C] to-[#B8904D]">
              PubliMicro
            </h1>
          </Link>
          <p className="text-[#B8A890] mt-2">
            {mode === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-[#2a2a2a] border-2 border-[#3a3a3a] rounded-2xl p-8">
          {/* Mode Toggle */}
          <div className="flex mb-6 bg-[#1a1a1a] rounded-lg p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-md font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-[#6B7F5C] text-white'
                  : 'text-[#8B9B6E] hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-md font-semibold transition-all ${
                mode === 'register'
                  ? 'bg-[#6B7F5C] text-white'
                  : 'text-[#8B9B6E] hover:text-white'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 mb-6"
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            Continuar com Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#3a3a3a]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#2a2a2a] text-[#8B9B6E]">ou</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={mode === 'login' ? handleSignIn : handleSignUp} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-[#D4C4A8] font-semibold mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#D4C4A8] font-semibold mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[#D4C4A8] font-semibold mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-[#D4C4A8] font-semibold mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#6B7F5C] to-[#2C5F6F] hover:from-[#7A8F6B] hover:to-[#3A6F7F] text-[#D4C4A8] font-bold rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Entrar' : 'Criar Conta'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {mode === 'login' && (
            <p className="mt-4 text-center text-[#8B9B6E] text-sm">
              <Link href="/recuperar-senha" className="hover:text-[#A8C97F] underline">
                Esqueceu sua senha?
              </Link>
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-[#676767] text-sm">
          Ao continuar, você concorda com nossos{' '}
          <Link href="/termos" className="text-[#8B9B6E] hover:underline">
            Termos de Uso
          </Link>{' '}
          e{' '}
          <Link href="/privacidade" className="text-[#8B9B6E] hover:underline">
            Política de Privacidade
          </Link>
        </p>
      </div>
    </main>
  );
}
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
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C9A87C] to-[#B8904D] mb-4">
            Anunciar Propriedade
          </h1>
          <p className="text-[#B8A890]">Preencha os dados para anunciar sua propriedade gratuitamente</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#2a2a2a] border-2 border-[#3a3a3a] rounded-2xl p-8 space-y-6">
          {/* Property Type */}
          <div>
            <label className="block text-[#D4C4A8] font-semibold mb-2">Tipo de Propriedade *</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
              required
            >
              {PROPERTY_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[#D4C4A8] font-semibold mb-2">
              <Home className="w-4 h-4 inline mr-2" />
              Nome da Propriedade *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Sítio Recanto das Águas"
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4C4A8] placeholder-[#8B8B8B] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#D4C4A8] font-semibold mb-2">Descrição *</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva sua propriedade, destacando suas características principais..."
              rows={5}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4C4A8] placeholder-[#8B8B8B] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-[#D4C4A8] font-semibold mb-2">
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
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4C4A8] placeholder-[#8B8B8B] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
              required
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#D4C4A8] font-semibold mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Cidade *
              </label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: Planaltina"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4C4A8] placeholder-[#8B8B8B] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
                required
              />
            </div>
            <div>
              <label className="block text-[#D4C4A8] font-semibold mb-2">Estado *</label>
              <input
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                placeholder="Ex: Goiás"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4C4A8] placeholder-[#8B8B8B] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#D4C4A8] font-semibold mb-2">Endereço/Localização *</label>
            <input
              type="text"
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              placeholder="Ex: Rodovia GO-118, Km 25"
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4C4A8] placeholder-[#8B8B8B] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
              required
            />
          </div>

          <div>
            <label className="block text-[#D4C4A8] font-semibold mb-2">CEP</label>
            <input
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              placeholder="Ex: 73000-000"
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4C4A8] placeholder-[#8B8B8B] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
            />
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[#D4C4A8] font-semibold mb-2">
                <Square className="w-4 h-4 inline mr-2" />
                Área (m²)
              </label>
              <input
                type="number"
                value={areaTotal}
                onChange={(e) => setAreaTotal(e.target.value)}
                placeholder="Ex: 50000"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4C4A8] placeholder-[#8B8B8B] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
              />
            </div>
            <div>
              <label className="block text-[#D4C4A8] font-semibold mb-2">
                <Bed className="w-4 h-4 inline mr-2" />
                Quartos
              </label>
              <input
                type="number"
                value={quartos}
                onChange={(e) => setQuartos(e.target.value)}
                placeholder="Ex: 4"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4C4A8] placeholder-[#8B8B8B] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
              />
            </div>
            <div>
              <label className="block text-[#D4C4A8] font-semibold mb-2">
                <Bath className="w-4 h-4 inline mr-2" />
                Banheiros
              </label>
              <input
                type="number"
                value={banheiros}
                onChange={(e) => setBanheiros(e.target.value)}
                placeholder="Ex: 3"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4C4A8] placeholder-[#8B8B8B] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
              />
            </div>
            <div>
              <label className="block text-[#D4C4A8] font-semibold mb-2">Vagas</label>
              <input
                type="number"
                value={vagas}
                onChange={(e) => setVagas(e.target.value)}
                placeholder="Ex: 2"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4C4A8] placeholder-[#8B8B8B] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#D4C4A8] font-semibold mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Ano de Construção
            </label>
            <input
              type="number"
              value={anosConstrucao}
              onChange={(e) => setAnosConstrucao(e.target.value)}
              placeholder="Ex: 2015"
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4C4A8] placeholder-[#8B8B8B] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
            />
          </div>

          {/* Photos */}
          <div>
            <label className="block text-[#D4C4A8] font-semibold mb-2">
              <Upload className="w-4 h-4 inline mr-2" />
              Fotos da Propriedade * (mínimo 1)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#8B8B8B] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
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
                      <span className="absolute bottom-1 left-1 bg-[#6B7F5C] text-[#D4C4A8] text-xs px-2 py-1 rounded">
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
            className="w-full px-8 py-4 bg-gradient-to-r from-[#6B7F5C] to-[#7A8F6B] hover:from-[#7A8F6B] hover:to-[#6B7F5C] text-[#D4C4A8] font-bold rounded-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
          >
            {submitting ? 'Publicando...' : 'Publicar Anúncio'}
          </button>
        </form>
      </div>
    </main>
  );
}





















