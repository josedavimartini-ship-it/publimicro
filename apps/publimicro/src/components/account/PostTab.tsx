
import { useState } from "react";

const TABS = [
  { key: "detalhes", label: "Detalhes" },
  { key: "fotos", label: "Fotos" },
  { key: "localizacao", label: "Localização" },
  { key: "preco", label: "Preço/Sugestão" },
  { key: "resumo", label: "Resumo" },
];

export default function PostTab({ user }: { user: any }) {
  const [tab, setTab] = useState("detalhes");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [suggestedPrice, setSuggestedPrice] = useState("R$ 350.000");
  const [preview, setPreview] = useState(false);
  // ...add more fields as needed

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Postar Novo Anúncio</h2>
      <div className="flex gap-2 mb-6 border-b pb-2">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`px-3 py-1 rounded-t font-bold transition-all ${tab === t.key ? 'bg-[#FFD700] text-black shadow' : 'bg-gray-100 text-gray-500 hover:bg-[#E6C98B]'}`}
            onClick={() => setTab(t.key)}
            type="button"
            aria-selected={tab === t.key}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form className="space-y-6">
        {tab === "detalhes" && (
          <div>
            <label className="block font-bold mb-1">Título <span className="text-xs text-[#A8C97F]">(Seja poético!)</span></label>
            <input className="w-full border rounded p-2 mb-2" placeholder="Ex: Sítio dos Sonhos à Beira do Lago" value={title} onChange={e => setTitle(e.target.value)} />
            <label className="block font-bold mb-1">Descrição <span className="text-xs text-[#A8C97F]">(Conte uma história, inspire!)</span></label>
            <textarea className="w-full border rounded p-2" placeholder="Descreva seu sítio como se fosse um poema..." value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        )}

        {tab === "fotos" && (
          <div>
            <label className="block font-bold mb-1">Fotos</label>
            <input type="file" multiple accept="image/*" className="mb-2" onChange={e => {
              const files = Array.from(e.target.files || []);
              setPhotos(files.map(f => URL.createObjectURL(f)));
            }} />
            <div className="flex gap-2 flex-wrap">
              {photos.map((src, i) => (
                <img key={i} src={src} alt="Prévia" className="w-24 h-24 object-cover rounded shadow" />
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">Arraste para reordenar (em breve)</div>
          </div>
        )}

        {tab === "localizacao" && (
          <div>
            <label className="block font-bold mb-1">Localização</label>
            <input className="w-full border rounded p-2 mb-2" placeholder="Ex: Zona Rural, Lagoa Azul, MG" value={location} onChange={e => setLocation(e.target.value)} />
            <div className="text-xs text-gray-500">(Em breve: autocomplete e mapa)</div>
          </div>
        )}

        {tab === "preco" && (
          <div>
            <label className="block font-bold mb-1">Preço</label>
            <input className="w-full border rounded p-2 mb-2" placeholder="Ex: R$ 350.000" value={price} onChange={e => setPrice(e.target.value)} />
            <div className="text-xs text-[#A8C97F] mb-2">Sugestão de preço: <span className="font-bold">{suggestedPrice}</span> <span title="Baseado em imóveis similares na região">ℹ️</span></div>
            <div className="text-xs text-gray-500">(Em breve: sugestão automática baseada em IA e região)</div>
          </div>
        )}

        {tab === "resumo" && (
          <div className="space-y-2">
            <div className="font-bold">Prévia do anúncio:</div>
            <div className="p-4 bg-gray-100 rounded shadow">
              <div className="font-bold text-lg mb-1">{title || <span className="text-gray-400">Título</span>}</div>
              <div className="mb-2 text-sm text-gray-600">{location || <span className="text-gray-400">Localização</span>}</div>
              <div className="mb-2">{description || <span className="text-gray-400">Descrição</span>}</div>
              <div className="mb-2 font-bold text-[#B87333]">{price || suggestedPrice}</div>
              <div className="flex gap-2 flex-wrap">
                {photos.length > 0 ? photos.map((src, i) => (
                  <img key={i} src={src} alt="Prévia" className="w-16 h-16 object-cover rounded" />
                )) : <span className="text-gray-400">Sem fotos</span>}
              </div>
            </div>
            <button type="submit" className="mt-4 px-4 py-2 bg-[#FFD700] text-black rounded font-bold hover:bg-[#B87333] transition">Publicar</button>
          </div>
        )}
      </form>
      {tab !== "resumo" && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-[#A8C97F] text-white rounded font-bold hover:bg-[#B87333] transition"
            onClick={() => setTab(TABS[TABS.findIndex(t => t.key === tab) + 1]?.key || "resumo")}
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  );
}
