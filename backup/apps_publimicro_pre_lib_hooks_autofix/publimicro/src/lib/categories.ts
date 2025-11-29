// Lightweight categories manifest used by the SearchTab and other UI pieces
// Keep this small and serializable so it can be easily moved to DB/API later.

export type Subcategory = {
  id: string;
  label: string;
};

export type Category = {
  id: string;
  label: string;
  icon?: string; // optional emoji or icon key
  subcategories?: Subcategory[];
};

// Sections follow AnnouncementCategory in the codebase: items, properties, vehicles, machinery, marine, outdoor, travel, global, shared
export const CATEGORIES_BY_SECTION: Record<string, Category[]> = {
  properties: [
    { id: "fazendas", label: "Fazendas", icon: "🌾", subcategories: [{ id: "sítios", label: "Sítios" }, { id: "fazendas-de-pecuária", label: "Pecuária" }] },
    { id: "casas", label: "Casas", icon: "🏠", subcategories: [{ id: "urbana", label: "Urbana" }, { id: "rural", label: "Rural" }] },
    { id: "terrenos", label: "Terrenos", icon: "📐" },
  ],

  vehicles: [
    { id: "carros", label: "Carros", icon: "🚗", subcategories: [{ id: "sedan", label: "Sedan" }, { id: "suv", label: "SUV" }] },
    { id: "motos", label: "Motos", icon: "🏍️" },
    { id: "caminhoes", label: "Caminhões", icon: "🚚" },
  ],

  machinery: [
    { id: "tratores", label: "Tratores", icon: "🚜" },
    { id: "implementos", label: "Implementos", icon: "⚙️" },
  ],

  items: [
    { id: "agro", label: "Agro & Ferramentas", icon: "🧰" },
    { id: "eletronicos", label: "Eletrônicos", icon: "💻" },
    { id: "moveis", label: "Móveis", icon: "🛋️" },
  ],

  marine: [
    { id: "lancha", label: "Lanchas", icon: "⛵" },
    { id: "barcos", label: "Barcos", icon: "🚤" },
  ],

  outdoor: [
    { id: "outdoor-geral", label: "Outdoor & Serviços", icon: "📣" },
  ],

  travel: [
    { id: "pacotes", label: "Pacotes de Viagem", icon: "✈️" },
    { id: "hospedagem", label: "Hospedagem", icon: "🏨" },
  ],

  global: [
    { id: "importacao", label: "Importação/Exportação", icon: "🌍" },
  ],

  shared: [
    { id: "compartilhamento", label: "Compartilhados", icon: "🔗" },
  ],
};

export const DEFAULT_SECTION = "properties";

export default CATEGORIES_BY_SECTION;
