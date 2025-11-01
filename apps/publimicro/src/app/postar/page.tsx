"use client";

import { useState } from "react";
import Image from "next/image";

export default function PostarPage() {
  const [posts, setPosts] = useState([
    { nome: "", localizacao: "", preco: "", descricao: "", fotos: [] },
    { nome: "", localizacao: "", preco: "", descricao: "", fotos: [] },
  ]);
  const [activePost, setActivePost] = useState(0);

  function handleChange(e) {
    const { name, value } = e.target;
    setPosts((prev) => {
      const updated = [...prev];
      updated[activePost][name] = value;
      return updated;
    });
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setPosts((prev) => {
      const updated = [...prev];
      updated[activePost].fotos = files.map((file) => URL.createObjectURL(file));
      return updated;
    });
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-[#B7791F]">Publique sua propriedade grátis</h1>
      <div className="flex gap-4 mb-8">
        {[0, 1].map((idx) => (
          <button
            key={idx}
            className={`px-4 py-2 rounded-full font-bold border-2 ${activePost === idx ? "bg-[#FF6B35] text-black border-[#FF6B35]" : "bg-[#0D7377]/10 text-[#0D7377] border-[#0D7377]"}`}
            onClick={() => setActivePost(idx)}
          >
            {`Postagem ${idx + 1}`}
          </button>
        ))}
      </div>
      <form className="space-y-4">
        <input
          type="text"
          name="nome"
          placeholder="Título do anúncio"
          value={posts[activePost].nome}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="localizacao"
          placeholder="Localização (cidade, estado, bairro)"
          value={posts[activePost].localizacao}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="number"
          name="preco"
          placeholder="Preço (R$)"
          value={posts[activePost].preco}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <textarea
          name="descricao"
          placeholder="Descrição detalhada"
          value={posts[activePost].descricao}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          rows={4}
        />
        <div>
          <label className="block font-bold mb-2">Fotos da propriedade</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="mb-2"
          />
          <div className="flex gap-2 flex-wrap">
            {posts[activePost].fotos.map((foto, idx) => (
              <Image key={idx} src={foto} alt="Foto" width={100} height={80} className="rounded shadow" />
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#B7791F] text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all"
        >
          Publicar anúncio
        </button>
      </form>
      <p className="mt-6 text-[#676767] text-sm">Você pode publicar até 2 anúncios gratuitamente.</p>
    </div>
  );
}
