// Marine/Nautical database for smart auto-fill specifications
// Covers boats, jet skis, yachts, and nautical equipment

export interface MarineBrand {
  id: string;
  name: string;
  country: string;
  types: ("boat" | "jetski" | "yacht" | "equipment" | "fishing" | "inflatable" | "sailboat")[];
}

export interface MarineModel {
  id: string;
  brandId: string;
  name: string;
  type: "boat" | "jetski" | "yacht" | "sailboat" | "inflatable" | "fishing";
  category: string;
  specs: {
    length?: string;
    beam?: string; // largura
    draft?: string; // calado
    engine?: string;
    power?: string;
    fuelCapacity?: string;
    passengers?: number;
    material?: string;
    weight?: string;
  };
  years?: number[];
}

// Popular marine brands in Brazil
export const marineBrands: MarineBrand[] = [
  // Boats/Lanchas
  { id: "focker", name: "Focker", country: "Brazil", types: ["boat"] },
  { id: "ventura", name: "Ventura", country: "Brazil", types: ["boat"] },
  { id: "real", name: "Real", country: "Brazil", types: ["boat", "yacht"] },
  { id: "phantom", name: "Phantom", country: "Brazil", types: ["boat", "yacht"] },
  { id: "nx-boats", name: "NX Boats", country: "Brazil", types: ["boat"] },
  { id: "fibrafort", name: "Fibrafort", country: "Brazil", types: ["boat"] },
  { id: "triton", name: "Triton", country: "Brazil", types: ["boat", "fishing"] },
  { id: "tecnoboat", name: "Tecnoboat", country: "Brazil", types: ["boat", "fishing"] },
  { id: "fly-fish", name: "Fly Fish", country: "Brazil", types: ["boat", "fishing"] },
  { id: "bayliner", name: "Bayliner", country: "USA", types: ["boat"] },
  { id: "sea-ray", name: "Sea Ray", country: "USA", types: ["boat", "yacht"] },
  { id: "boston-whaler", name: "Boston Whaler", country: "USA", types: ["boat", "fishing"] },
  { id: "chris-craft", name: "Chris-Craft", country: "USA", types: ["boat", "yacht"] },

  // Jet Skis
  { id: "yamaha-marine", name: "Yamaha WaveRunner", country: "Japan", types: ["jetski"] },
  { id: "sea-doo", name: "Sea-Doo", country: "Canada", types: ["jetski"] },
  { id: "kawasaki-marine", name: "Kawasaki Jet Ski", country: "Japan", types: ["jetski"] },

  // Yachts
  { id: "azimut", name: "Azimut", country: "Italy", types: ["yacht"] },
  { id: "sunseeker", name: "Sunseeker", country: "UK", types: ["yacht"] },
  { id: "princess", name: "Princess", country: "UK", types: ["yacht"] },
  { id: "ferretti", name: "Ferretti", country: "Italy", types: ["yacht"] },
  { id: "schaefer", name: "Schaefer Yachts", country: "Brazil", types: ["yacht"] },

  // Sailboats
  { id: "beneteau", name: "Bénéteau", country: "France", types: ["boat"] },
  { id: "jeanneau", name: "Jeanneau", country: "France", types: ["boat"] },

  // Inflatables
  { id: "flexboat", name: "Flexboat", country: "Brazil", types: ["inflatable"] },
  { id: "zefir", name: "Zefir", country: "Brazil", types: ["inflatable"] },
  { id: "zodiac", name: "Zodiac", country: "France", types: ["inflatable"] },

  // Engines
  { id: "mercury", name: "Mercury", country: "USA", types: ["equipment"] },
  { id: "yamaha-marine-engines", name: "Yamaha Marine", country: "Japan", types: ["equipment"] },
  { id: "suzuki-marine", name: "Suzuki Marine", country: "Japan", types: ["equipment"] },
  { id: "evinrude", name: "Evinrude", country: "USA", types: ["equipment"] },
  { id: "honda-marine", name: "Honda Marine", country: "Japan", types: ["equipment"] },
];

// Popular marine models
export const marineModels: MarineModel[] = [
  // Focker
  {
    id: "focker-242",
    brandId: "focker",
    name: "242",
    type: "boat",
    category: "lancha-cabinada",
    specs: {
      length: "24 pés (7.3m)",
      beam: "2.55m",
      passengers: 10,
      engine: "Mercury / Yamaha",
      power: "200-300HP",
      fuelCapacity: "280L",
      material: "Fibra de vidro",
    },
  },
  {
    id: "focker-280",
    brandId: "focker",
    name: "280",
    type: "boat",
    category: "lancha-cabinada",
    specs: {
      length: "28 pés (8.5m)",
      beam: "2.80m",
      passengers: 12,
      engine: "Mercury / Yamaha",
      power: "300-400HP",
      fuelCapacity: "400L",
      material: "Fibra de vidro",
    },
  },
  {
    id: "focker-310",
    brandId: "focker",
    name: "310",
    type: "boat",
    category: "lancha-cabinada",
    specs: {
      length: "31 pés (9.5m)",
      beam: "3.00m",
      passengers: 14,
      engine: "Duplo Mercury / Yamaha",
      power: "2x 200-300HP",
      fuelCapacity: "600L",
      material: "Fibra de vidro",
    },
  },

  // Ventura
  {
    id: "ventura-250",
    brandId: "ventura",
    name: "250 Comfort",
    type: "boat",
    category: "lancha-cabinada",
    specs: {
      length: "25 pés (7.6m)",
      beam: "2.59m",
      passengers: 10,
      power: "200-300HP",
      fuelCapacity: "300L",
      material: "Fibra de vidro",
    },
  },
  {
    id: "ventura-330",
    brandId: "ventura",
    name: "330 HT",
    type: "boat",
    category: "lancha-cabinada",
    specs: {
      length: "33 pés (10m)",
      beam: "3.10m",
      passengers: 14,
      power: "2x 300HP",
      fuelCapacity: "700L",
      material: "Fibra de vidro",
    },
  },

  // Sea-Doo Jet Skis
  {
    id: "seadoo-spark",
    brandId: "sea-doo",
    name: "Spark",
    type: "jetski",
    category: "recreativo",
    specs: {
      length: "2.87m",
      beam: "1.15m",
      engine: "900 ACE",
      power: "60-90HP",
      passengers: 2,
      weight: "186kg",
      fuelCapacity: "30L",
    },
    years: [2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "seadoo-gtx",
    brandId: "sea-doo",
    name: "GTX 170",
    type: "jetski",
    category: "touring",
    specs: {
      length: "3.52m",
      beam: "1.26m",
      engine: "1630 ACE",
      power: "170HP",
      passengers: 3,
      weight: "391kg",
      fuelCapacity: "70L",
    },
    years: [2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "seadoo-rxpx",
    brandId: "sea-doo",
    name: "RXP-X 300",
    type: "jetski",
    category: "performance",
    specs: {
      length: "3.21m",
      beam: "1.19m",
      engine: "1630 ACE HO",
      power: "300HP",
      passengers: 2,
      weight: "375kg",
      fuelCapacity: "60L",
    },
    years: [2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "seadoo-fishpro",
    brandId: "sea-doo",
    name: "Fish Pro Trophy",
    type: "jetski",
    category: "pesca",
    specs: {
      length: "3.72m",
      beam: "1.32m",
      engine: "1630 ACE",
      power: "170HP",
      passengers: 3,
      weight: "433kg",
      fuelCapacity: "70L",
    },
    years: [2022, 2023, 2024, 2025],
  },

  // Yamaha WaveRunner
  {
    id: "yamaha-vx",
    brandId: "yamaha-marine",
    name: "VX Cruiser",
    type: "jetski",
    category: "recreativo",
    specs: {
      length: "3.35m",
      beam: "1.22m",
      engine: "TR-1 HO",
      power: "125HP",
      passengers: 3,
      weight: "308kg",
      fuelCapacity: "70L",
    },
    years: [2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "yamaha-fx-svho",
    brandId: "yamaha-marine",
    name: "FX SVHO",
    type: "jetski",
    category: "performance",
    specs: {
      length: "3.56m",
      beam: "1.24m",
      engine: "SVHO",
      power: "250HP",
      passengers: 3,
      weight: "387kg",
      fuelCapacity: "70L",
    },
    years: [2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "yamaha-gp1800r",
    brandId: "yamaha-marine",
    name: "GP1800R SVHO",
    type: "jetski",
    category: "performance",
    specs: {
      length: "3.38m",
      beam: "1.22m",
      engine: "SVHO",
      power: "250HP",
      passengers: 3,
      weight: "355kg",
      fuelCapacity: "70L",
    },
    years: [2021, 2022, 2023, 2024, 2025],
  },

  // Kawasaki Jet Ski
  {
    id: "kawasaki-stx160",
    brandId: "kawasaki-marine",
    name: "STX 160",
    type: "jetski",
    category: "recreativo",
    specs: {
      length: "3.29m",
      beam: "1.24m",
      power: "160HP",
      passengers: 3,
      weight: "350kg",
      fuelCapacity: "60L",
    },
    years: [2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "kawasaki-ultra310",
    brandId: "kawasaki-marine",
    name: "Ultra 310",
    type: "jetski",
    category: "performance",
    specs: {
      length: "3.38m",
      beam: "1.23m",
      power: "310HP",
      passengers: 3,
      weight: "415kg",
      fuelCapacity: "76L",
    },
    years: [2021, 2022, 2023, 2024, 2025],
  },

  // Fishing boats
  {
    id: "triton-230",
    brandId: "triton",
    name: "230 Open",
    type: "fishing",
    category: "pesca-esportiva",
    specs: {
      length: "23 pés (7m)",
      beam: "2.40m",
      passengers: 8,
      power: "150-200HP",
      fuelCapacity: "200L",
      material: "Fibra de vidro",
    },
  },
  {
    id: "triton-275",
    brandId: "triton",
    name: "275 Open",
    type: "fishing",
    category: "pesca-esportiva",
    specs: {
      length: "27.5 pés (8.4m)",
      beam: "2.65m",
      passengers: 10,
      power: "200-300HP",
      fuelCapacity: "350L",
      material: "Fibra de vidro",
    },
  },

  // Inflatables
  {
    id: "flexboat-sr-500",
    brandId: "flexboat",
    name: "SR 500",
    type: "inflatable",
    category: "bote-inflavel",
    specs: {
      length: "5m",
      beam: "2.10m",
      passengers: 8,
      power: "até 60HP",
      weight: "160kg",
      material: "PVC / Hypalon",
    },
  },
  {
    id: "flexboat-sr-620",
    brandId: "flexboat",
    name: "SR 620",
    type: "inflatable",
    category: "bote-inflavel",
    specs: {
      length: "6.2m",
      beam: "2.50m",
      passengers: 12,
      power: "até 150HP",
      weight: "280kg",
      material: "PVC / Hypalon",
    },
  },

  // Yachts
  {
    id: "schaefer-510",
    brandId: "schaefer",
    name: "510",
    type: "yacht",
    category: "iate",
    specs: {
      length: "51 pés (15.5m)",
      beam: "4.50m",
      draft: "1.20m",
      passengers: 12,
      power: "2x 435HP",
      fuelCapacity: "1800L",
      material: "Fibra de vidro",
    },
  },
  {
    id: "phantom-400",
    brandId: "phantom",
    name: "400",
    type: "yacht",
    category: "iate",
    specs: {
      length: "40 pés (12.2m)",
      beam: "3.80m",
      passengers: 12,
      power: "2x 320HP",
      fuelCapacity: "1000L",
      material: "Fibra de vidro",
    },
  },
];

// Marine categories
export const marineCategories = {
  boat: [
    { id: "lancha-aberta", name: "Lancha Aberta (Open)", icon: "🚤" },
    { id: "lancha-cabinada", name: "Lancha Cabinada", icon: "🚤" },
    { id: "lancha-fishing", name: "Lancha de Pesca", icon: "🎣" },
    { id: "bowrider", name: "Bowrider", icon: "🚤" },
    { id: "cuddy-cabin", name: "Cuddy Cabin", icon: "🚤" },
    { id: "day-cruiser", name: "Day Cruiser", icon: "🚤" },
  ],
  jetski: [
    { id: "recreativo", name: "Recreativo", icon: "🏄" },
    { id: "performance", name: "Performance/Esportivo", icon: "🏄" },
    { id: "touring", name: "Touring/Passeio", icon: "🏄" },
    { id: "pesca", name: "Pesca", icon: "🎣" },
    { id: "stand-up", name: "Stand-up", icon: "🏄" },
  ],
  yacht: [
    { id: "iate", name: "Iate Motor", icon: "🛥️" },
    { id: "sport-yacht", name: "Sport Yacht", icon: "🛥️" },
    { id: "flybridge", name: "Flybridge", icon: "🛥️" },
  ],
  sailboat: [
    { id: "veleiro-cruzeiro", name: "Veleiro de Cruzeiro", icon: "⛵" },
    { id: "veleiro-regata", name: "Veleiro de Regata", icon: "⛵" },
    { id: "catamarã", name: "Catamarã", icon: "⛵" },
  ],
  fishing: [
    { id: "pesca-esportiva", name: "Pesca Esportiva", icon: "🎣" },
    { id: "pesca-profissional", name: "Pesca Profissional", icon: "🎣" },
    { id: "bass-boat", name: "Bass Boat", icon: "🎣" },
  ],
  inflatable: [
    { id: "bote-inflavel", name: "Bote Inflável", icon: "🛶" },
    { id: "rib", name: "RIB (Casco Rígido)", icon: "🛶" },
    { id: "tender", name: "Tender", icon: "🛶" },
  ],
};

// Boat materials
export const boatMaterials = [
  { id: "fiberglass", name: "Fibra de Vidro" },
  { id: "aluminum", name: "Alumínio" },
  { id: "wood", name: "Madeira" },
  { id: "pvc", name: "PVC" },
  { id: "hypalon", name: "Hypalon" },
  { id: "carbon", name: "Fibra de Carbono" },
  { id: "steel", name: "Aço" },
];

// Engine types
export const marineEngineTypes = [
  { id: "outboard", name: "Motor de Popa (Outboard)" },
  { id: "inboard", name: "Motor de Centro (Inboard)" },
  { id: "sterndrive", name: "Rabeta (Sterndrive)" },
  { id: "jet", name: "Jet Drive" },
  { id: "sail", name: "Vela" },
  { id: "electric", name: "Elétrico" },
];

// Helper functions
export function getMarineBrandById(id: string): MarineBrand | undefined {
  return marineBrands.find(b => b.id === id);
}

export function getMarineModelsByBrand(brandId: string): MarineModel[] {
  return marineModels.filter(m => m.brandId === brandId);
}

export function getMarineModelById(id: string): MarineModel | undefined {
  return marineModels.find(m => m.id === id);
}

export function searchMarineModels(query: string): MarineModel[] {
  const lowerQuery = query.toLowerCase();
  return marineModels.filter(
    m => m.name.toLowerCase().includes(lowerQuery) ||
         getMarineBrandById(m.brandId)?.name.toLowerCase().includes(lowerQuery)
  );
}
