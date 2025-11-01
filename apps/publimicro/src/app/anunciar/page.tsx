"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Upload, X, MapPin, DollarSign, Home, Ruler, Bed, Bath, Car, FileText, Camera } from "lucide-react";

export default function AnunciarPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [categoria, setCategoria] = useState("proper-urban");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [zona, setZona] = useState("");
  const [preco, setPreco] = useState("");
  const [lanceInicial, setLanceInicial] = useState("");
  const [areaTotal, setAreaTotal] = useState("");
  const [areaConstruida, setAreaConstruida] = useState("");
  const [quartos, setQuartos] = useState("");
  const [banheiros, setBanheiros] = useState("");
  const [vagas, setVagas] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [fotoPreviews, setFotoPreviews] = useState<string[]>([]);

  useEffect(() => {
    // Check authentication
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        alert("Por favor, faça login para anunciar.");
        router.push("/entrar");
      } else {
        setUserId(data.user.id);
      }
    });
  }, [router]);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setFotos((prev) => [...prev, ...newFiles]);

    // Create previews
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFoto = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
    setFotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      alert("Você precisa estar logado para anunciar.");
      return;
    }

    setLoading(true);

    try {
      // Upload photos to Supabase Storage
      const fotoUrls: string[] = [];
      
      for (const foto of fotos) {
        const fileName = `${Date.now()}-${foto.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("imagens-sitios")
          .upload(fileName, foto);

        if (uploadError) {
          console.error("Error uploading photo:", uploadError);
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("imagens-sitios")
          .getPublicUrl(fileName);
        
        fotoUrls.push(urlData.publicUrl);
      }

      // Insert property into database
      const { data, error } = await supabase.from("sitios").insert([
        {
          nome,
          descricao,
          localizacao,
          zona,
          preco: parseFloat(preco) || null,
          lance_inicial: parseFloat(lanceInicial) || null,
          area_total: parseFloat(areaTotal) || null,
          area_construida: parseFloat(areaConstruida) || null,
          quartos: parseInt(quartos) || null,
          banheiros: parseInt(banheiros) || null,
          vagas: parseInt(vagas) || null,
          fotos: fotoUrls,
          destaque: false,
          user_id: userId,
        },
      ]);

      if (error) {
        console.error("Error creating property:", error);
        alert("Erro ao criar anúncio. Por favor, tente novamente.");
        return;
      }

      alert("Anúncio criado com sucesso!");
      router.push("/");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Erro inesperado. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const categorias = [
    { value: "proper-urban", label: "PubliProper - Urbano", icon: Home },
    { value: "proper-rural", label: "PubliProper - Rural", icon: Home },
    { value: "motors-auto", label: "PubliMotors - Automóveis", icon: Car },
    { value: "motors-moto", label: "PubliMotors - Motos", icon: Car },
    { value: "motors-cargo", label: "PubliMotors - Caminhões", icon: Car },
    { value: "machina", label: "PubliMachina - Máquinas", icon: Ruler },
    { value: "marine", label: "PubliMarine - Embarcações", icon: Ruler },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#D4A574] hover:text-[#FF6B35] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Link>

        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-[#D4A574] mb-4">Anunciar Propriedade</h1>
          <p className="text-[#8B9B6E] text-lg">
            Preencha os dados abaixo para criar seu anúncio. Todos os campos marcados com * são obrigatórios.
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-[#D4A574] mb-4">Anunciar Propriedade</h1>
          <p className="text-[#8B9B6E] text-lg">
            Preencha os dados abaixo para criar seu anúncio. Todos os campos marcados com * são obrigatórios.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8">
            <label className="flex items-center gap-2 text-[#D4A574] font-semibold text-lg mb-4">
              <Home className="w-6 h-6 text-[#FF6B35]" />
              Categoria *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categorias.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategoria(cat.value)}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    categoria === cat.value
                      ? "border-[#FF6B35] bg-[#FF6B35]/10"
                      : "border-[#2a2a1a] hover:border-[#D4A574]"
                  }`}
                >
                  <cat.icon className={`w-5 h-5 ${categoria === cat.value ? "text-[#FF6B35]" : "text-[#D4A574]"}`} />
                  <span className={categoria === cat.value ? "text-[#FF6B35] font-bold" : "text-[#8B9B6E]"}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-[#D4A574] mb-4">Informações Básicas</h2>

            <div>
              <label className="text-[#8B9B6E] font-semibold mb-2 block">Título do Anúncio *</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Ex: Casa em condomínio com 3 quartos"
                className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#2a2a1a] rounded-lg text-[#D4A574] focus:border-[#FF6B35] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[#8B9B6E] font-semibold mb-2 block flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF6B35]" />
                Localização *
              </label>
              <input
                type="text"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                required
                placeholder="Ex: Ipameri, GO - Zona Rural"
                className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#2a2a1a] rounded-lg text-[#D4A574] focus:border-[#FF6B35] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[#8B9B6E] font-semibold mb-2 block">Zona</label>
              <input
                type="text"
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                placeholder="Ex: Zona Rural, Centro, Residencial"
                className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#2a2a1a] rounded-lg text-[#D4A574] focus:border-[#FF6B35] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[#8B9B6E] font-semibold mb-2 block flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FF6B35]" />
                Descrição *
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                rows={6}
                placeholder="Descreva os detalhes da propriedade, características especiais, infraestrutura..."
                className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#2a2a1a] rounded-lg text-[#D4A574] focus:border-[#FF6B35] focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-[#D4A574] mb-4">Valores</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[#8B9B6E] font-semibold mb-2 block flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#FF6B35]" />
                  Preço (R$)
                </label>
                <input
                  type="number"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#2a2a1a] rounded-lg text-[#D4A574] focus:border-[#FF6B35] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#8B9B6E] font-semibold mb-2 block">Lance Inicial (R$)</label>
                <input
                  type="number"
                  value={lanceInicial}
                  onChange={(e) => setLanceInicial(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#2a2a1a] rounded-lg text-[#D4A574] focus:border-[#FF6B35] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-[#D4A574] mb-4">Características</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[#8B9B6E] font-semibold mb-2 block flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-[#FF6B35]" />
                  Área Total (m²)
                </label>
                <input
                  type="number"
                  value={areaTotal}
                  onChange={(e) => setAreaTotal(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#2a2a1a] rounded-lg text-[#D4A574] focus:border-[#FF6B35] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#8B9B6E] font-semibold mb-2 block flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-[#FF6B35]" />
                  Área Construída (m²)
                </label>
                <input
                  type="number"
                  value={areaConstruida}
                  onChange={(e) => setAreaConstruida(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#2a2a1a] rounded-lg text-[#D4A574] focus:border-[#FF6B35] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#8B9B6E] font-semibold mb-2 block flex items-center gap-2">
                  <Bed className="w-4 h-4 text-[#FF6B35]" />
                  Quartos
                </label>
                <input
                  type="number"
                  value={quartos}
                  onChange={(e) => setQuartos(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#2a2a1a] rounded-lg text-[#D4A574] focus:border-[#FF6B35] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#8B9B6E] font-semibold mb-2 block flex items-center gap-2">
                  <Bath className="w-4 h-4 text-[#FF6B35]" />
                  Banheiros
                </label>
                <input
                  type="number"
                  value={banheiros}
                  onChange={(e) => setBanheiros(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#2a2a1a] rounded-lg text-[#D4A574] focus:border-[#FF6B35] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#8B9B6E] font-semibold mb-2 block flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#FF6B35]" />
                  Vagas
                </label>
                <input
                  type="number"
                  value={vagas}
                  onChange={(e) => setVagas(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#2a2a1a] rounded-lg text-[#D4A574] focus:border-[#FF6B35] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#D4A574] mb-4 flex items-center gap-2">
              <Camera className="w-7 h-7 text-[#FF6B35]" />
              Fotos *
            </h2>
            <p className="text-[#8B9B6E] mb-6">Adicione fotos de alta qualidade da propriedade (mínimo 1 foto)</p>

            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[#2a2a1a] rounded-lg cursor-pointer hover:border-[#FF6B35] transition-colors bg-[#0a0a0a]/50">
                <Upload className="w-12 h-12 text-[#D4A574] mb-2" />
                <span className="text-[#8B9B6E] font-semibold">Clique para adicionar fotos</span>
                <span className="text-[#8B9B6E]/70 text-sm mt-1">JPG, PNG até 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFotoChange}
                  className="hidden"
                />
              </label>

              {/* Photo Previews */}
              {fotoPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {fotoPreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden border-2 border-[#2a2a1a] group">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFoto(index)}
                        className="absolute top-2 right-2 bg-[#FF6B35] text-[#0a0a0a] rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || fotos.length === 0}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a] font-bold text-lg rounded-full shadow-xl hover:from-[#FF8C42] hover:to-[#FF6B35] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Publicando..." : "Publicar Anúncio"}
            </button>
            <Link
              href="/"
              className="px-8 py-4 border-2 border-[#D4A574] text-[#D4A574] font-bold text-lg rounded-full hover:bg-[#D4A574]/10 transition-all text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
