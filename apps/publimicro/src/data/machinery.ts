// Machinery database for smart auto-fill specifications
// Covers agricultural, construction, and industrial equipment

export interface MachineryBrand {
  id: string;
  name: string;
  country: string;
  types: ("agricultural" | "construction" | "industrial" | "forestry")[];
}

export interface MachineryModel {
  id: string;
  brandId: string;
  name: string;
  type: "tractor" | "harvester" | "excavator" | "loader" | "crane" | "forklift" | "implement";
  category: string;
  specs: {
    power?: string;
    engine?: string;
    weight?: string;
    capacity?: string;
    operatingHours?: string;
    transmission?: string;
    hydraulicSystem?: string;
    cabType?: string;
    tireType?: string;
    dimensions?: string;
  };
  years?: number[];
}

// Popular machinery brands in Brazil
export const machineryBrands: MachineryBrand[] = [
  // Agricultural
  { id: "john-deere", name: "John Deere", country: "USA", types: ["agricultural", "construction", "forestry"] },
  { id: "new-holland", name: "New Holland", country: "Italy", types: ["agricultural", "construction"] },
  { id: "massey-ferguson", name: "Massey Ferguson", country: "USA", types: ["agricultural"] },
  { id: "case-ih", name: "Case IH", country: "USA", types: ["agricultural", "construction"] },
  { id: "valtra", name: "Valtra", country: "Finland", types: ["agricultural"] },
  { id: "ls-tractor", name: "LS Tractor", country: "South Korea", types: ["agricultural"] },
  { id: "stara", name: "Stara", country: "Brazil", types: ["agricultural"] },
  { id: "jacto", name: "Jacto", country: "Brazil", types: ["agricultural"] },
  { id: "agrale", name: "Agrale", country: "Brazil", types: ["agricultural"] },
  { id: "yanmar", name: "Yanmar", country: "Japan", types: ["agricultural"] },

  // Construction
  { id: "caterpillar", name: "Caterpillar", country: "USA", types: ["construction", "industrial"] },
  { id: "komatsu", name: "Komatsu", country: "Japan", types: ["construction", "industrial"] },
  { id: "volvo-ce", name: "Volvo CE", country: "Sweden", types: ["construction"] },
  { id: "liebherr", name: "Liebherr", country: "Germany", types: ["construction", "industrial"] },
  { id: "jcb", name: "JCB", country: "UK", types: ["construction", "agricultural"] },
  { id: "hitachi", name: "Hitachi", country: "Japan", types: ["construction"] },
  { id: "hyundai-ce", name: "Hyundai CE", country: "South Korea", types: ["construction"] },
  { id: "sany", name: "SANY", country: "China", types: ["construction"] },
  { id: "xcmg", name: "XCMG", country: "China", types: ["construction"] },
  { id: "bobcat", name: "Bobcat", country: "USA", types: ["construction"] },

  // Industrial/Forklifts
  { id: "toyota-industrial", name: "Toyota Material Handling", country: "Japan", types: ["industrial"] },
  { id: "hyster", name: "Hyster", country: "USA", types: ["industrial"] },
  { id: "yale", name: "Yale", country: "USA", types: ["industrial"] },
  { id: "clark", name: "Clark", country: "USA", types: ["industrial"] },
  { id: "still", name: "Still", country: "Germany", types: ["industrial"] },
  { id: "linde", name: "Linde", country: "Germany", types: ["industrial"] },

  // Implements
  { id: "kuhn", name: "Kuhn", country: "France", types: ["agricultural"] },
  { id: "baldan", name: "Baldan", country: "Brazil", types: ["agricultural"] },
  { id: "marchesan", name: "Marchesan", country: "Brazil", types: ["agricultural"] },
  { id: "tatu", name: "Tatu", country: "Brazil", types: ["agricultural"] },
];

// Popular machinery models
export const machineryModels: MachineryModel[] = [
  // John Deere Tractors
  {
    id: "jd-5075e",
    brandId: "john-deere",
    name: "5075E",
    type: "tractor",
    category: "utility",
    specs: {
      power: "75cv",
      engine: "3 cilindros PowerTech",
      transmission: "9F/3R ou 12F/12R",
      weight: "2.850kg",
      cabType: "Plataforma / Cabine",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "jd-6130j",
    brandId: "john-deere",
    name: "6130J",
    type: "tractor",
    category: "row-crop",
    specs: {
      power: "130cv",
      engine: "4.5L PowerTech",
      transmission: "12F/12R PowrReverser",
      weight: "5.200kg",
      cabType: "Cabine climatizada",
      hydraulicSystem: "96 L/min",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "jd-7200j",
    brandId: "john-deere",
    name: "7200J",
    type: "tractor",
    category: "row-crop",
    specs: {
      power: "200cv",
      engine: "6.8L PowerTech PSS",
      transmission: "20F/4R AutoPowr IVT",
      weight: "8.500kg",
      cabType: "Cabine ComfortView",
      hydraulicSystem: "180 L/min",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "jd-8r340",
    brandId: "john-deere",
    name: "8R 340",
    type: "tractor",
    category: "4wd",
    specs: {
      power: "340cv",
      engine: "9.0L PowerTech",
      transmission: "e23 PowerShift",
      weight: "14.500kg",
      cabType: "Cabine CommandView III",
      hydraulicSystem: "435 L/min",
    },
    years: [2021, 2022, 2023, 2024, 2025],
  },

  // John Deere Harvesters
  {
    id: "jd-s770",
    brandId: "john-deere",
    name: "S770",
    type: "harvester",
    category: "combine",
    specs: {
      power: "473cv",
      engine: "13.5L PowerTech",
      capacity: "Tanque 14.100L",
      weight: "18.000kg",
      cabType: "Cabine ProDrive",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },

  // New Holland Tractors
  {
    id: "nh-t4-75",
    brandId: "new-holland",
    name: "T4.75",
    type: "tractor",
    category: "utility",
    specs: {
      power: "75cv",
      engine: "FPT Industrial 3.4L",
      transmission: "8F/8R Dual Command",
      weight: "2.600kg",
      cabType: "Plataforma / Cabine",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "nh-t6-130",
    brandId: "new-holland",
    name: "T6.130",
    type: "tractor",
    category: "row-crop",
    specs: {
      power: "130cv",
      engine: "FPT NEF 4.5L",
      transmission: "16F/16R Electro Command",
      weight: "5.500kg",
      cabType: "Cabine Horizon",
      hydraulicSystem: "110 L/min",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "nh-t8-380",
    brandId: "new-holland",
    name: "T8.380",
    type: "tractor",
    category: "4wd",
    specs: {
      power: "380cv",
      engine: "FPT Cursor 9",
      transmission: "19F/4R Ultra Command CVT",
      weight: "15.000kg",
      cabType: "Cabine Ultra",
      hydraulicSystem: "420 L/min",
    },
    years: [2021, 2022, 2023, 2024, 2025],
  },

  // New Holland Harvesters
  {
    id: "nh-cr8-90",
    brandId: "new-holland",
    name: "CR8.90",
    type: "harvester",
    category: "combine",
    specs: {
      power: "450cv",
      engine: "FPT Cursor 13",
      capacity: "Tanque 13.000L",
      weight: "17.500kg",
      cabType: "Cabine Harvest Suite Ultra",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },

  // Massey Ferguson Tractors
  {
    id: "mf-4707",
    brandId: "massey-ferguson",
    name: "MF 4707",
    type: "tractor",
    category: "utility",
    specs: {
      power: "75cv",
      engine: "AGCO Power 3.3L",
      transmission: "12F/12R Dyna-4",
      weight: "3.200kg",
      cabType: "Plataforma / Cabine",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "mf-7719s",
    brandId: "massey-ferguson",
    name: "MF 7719 S",
    type: "tractor",
    category: "row-crop",
    specs: {
      power: "190cv",
      engine: "AGCO Power 6.6L",
      transmission: "24F/24R Dyna-6",
      weight: "7.500kg",
      cabType: "Cabine Global Series",
      hydraulicSystem: "160 L/min",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },

  // Case IH Tractors
  {
    id: "case-farmall-80a",
    brandId: "case-ih",
    name: "Farmall 80A",
    type: "tractor",
    category: "utility",
    specs: {
      power: "80cv",
      engine: "FPT 3.4L",
      transmission: "12F/12R",
      weight: "3.000kg",
      cabType: "Plataforma / Cabine",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "case-puma-165",
    brandId: "case-ih",
    name: "Puma 165",
    type: "tractor",
    category: "row-crop",
    specs: {
      power: "165cv",
      engine: "FPT NEF 6.7L",
      transmission: "18F/6R Full Powershift",
      weight: "7.200kg",
      cabType: "Cabine Surveyor",
      hydraulicSystem: "140 L/min",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "case-magnum-340",
    brandId: "case-ih",
    name: "Magnum 340",
    type: "tractor",
    category: "4wd",
    specs: {
      power: "340cv",
      engine: "FPT Cursor 9",
      transmission: "Full Powershift 18F/4R ou CVT",
      weight: "12.500kg",
      cabType: "Cabine SurroundVision",
      hydraulicSystem: "300 L/min",
    },
    years: [2021, 2022, 2023, 2024, 2025],
  },

  // Caterpillar Construction
  {
    id: "cat-320",
    brandId: "caterpillar",
    name: "320",
    type: "excavator",
    category: "hydraulic-excavator",
    specs: {
      power: "166cv",
      weight: "21.200kg",
      capacity: "Caçamba 1.19m³",
      engine: "Cat C4.4 ACERT",
      hydraulicSystem: "353 L/min",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "cat-336",
    brandId: "caterpillar",
    name: "336",
    type: "excavator",
    category: "hydraulic-excavator",
    specs: {
      power: "309cv",
      weight: "37.000kg",
      capacity: "Caçamba 2.15m³",
      engine: "Cat C9.3B ACERT",
      hydraulicSystem: "524 L/min",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "cat-950m",
    brandId: "caterpillar",
    name: "950M",
    type: "loader",
    category: "wheel-loader",
    specs: {
      power: "214cv",
      weight: "17.700kg",
      capacity: "Caçamba 3.4m³",
      engine: "Cat C7.1 ACERT",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "cat-d6",
    brandId: "caterpillar",
    name: "D6",
    type: "tractor",
    category: "dozer",
    specs: {
      power: "215cv",
      weight: "22.000kg",
      engine: "Cat C9.3 ACERT",
      transmission: "Power Shift",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },

  // Komatsu Construction
  {
    id: "komatsu-pc200",
    brandId: "komatsu",
    name: "PC200-8M0",
    type: "excavator",
    category: "hydraulic-excavator",
    specs: {
      power: "155cv",
      weight: "20.900kg",
      capacity: "Caçamba 0.91m³",
      engine: "SAA6D107E-1",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "komatsu-wa320",
    brandId: "komatsu",
    name: "WA320-8",
    type: "loader",
    category: "wheel-loader",
    specs: {
      power: "175cv",
      weight: "13.400kg",
      capacity: "Caçamba 2.7m³",
      engine: "SAA6D107E-2",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },

  // JCB
  {
    id: "jcb-3cx",
    brandId: "jcb",
    name: "3CX",
    type: "loader",
    category: "backhoe-loader",
    specs: {
      power: "92cv",
      weight: "8.070kg",
      engine: "JCB EcoMax",
      transmission: "Powershift 4 marchas",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "jcb-4cx",
    brandId: "jcb",
    name: "4CX",
    type: "loader",
    category: "backhoe-loader",
    specs: {
      power: "100cv",
      weight: "9.300kg",
      engine: "JCB EcoMax",
      transmission: "Powershift 4 marchas",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },

  // Bobcat
  {
    id: "bobcat-s650",
    brandId: "bobcat",
    name: "S650",
    type: "loader",
    category: "skid-steer",
    specs: {
      power: "74cv",
      weight: "3.470kg",
      capacity: "Capacidade 1.180kg",
      engine: "Bobcat Tier 4",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "bobcat-t770",
    brandId: "bobcat",
    name: "T770",
    type: "loader",
    category: "compact-track",
    specs: {
      power: "92cv",
      weight: "5.360kg",
      capacity: "Capacidade 1.723kg",
      engine: "Bobcat Tier 4",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },

  // Toyota Forklifts
  {
    id: "toyota-8fg25",
    brandId: "toyota-industrial",
    name: "8FG25",
    type: "forklift",
    category: "combustao",
    specs: {
      capacity: "2.500kg",
      power: "60cv",
      engine: "GLP/Gasolina",
      weight: "4.000kg",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },
  {
    id: "toyota-8fbe15",
    brandId: "toyota-industrial",
    name: "8FBE15",
    type: "forklift",
    category: "eletrico",
    specs: {
      capacity: "1.500kg",
      power: "Elétrico 48V",
      weight: "3.200kg",
    },
    years: [2020, 2021, 2022, 2023, 2024, 2025],
  },
];

// Machinery categories
export const machineryCategories = {
  tractor: [
    { id: "utility", name: "Utilitário (até 100cv)", icon: "🚜" },
    { id: "row-crop", name: "Linha (100-200cv)", icon: "🚜" },
    { id: "4wd", name: "4x4 Pesado (+200cv)", icon: "🚜" },
    { id: "orchard", name: "Fruticultura", icon: "🚜" },
    { id: "compact", name: "Compacto", icon: "🚜" },
  ],
  harvester: [
    { id: "combine", name: "Colheitadeira de Grãos", icon: "🌾" },
    { id: "sugarcane", name: "Colheitadeira de Cana", icon: "🌾" },
    { id: "cotton", name: "Colheitadeira de Algodão", icon: "🌾" },
    { id: "coffee", name: "Colheitadeira de Café", icon: "☕" },
  ],
  excavator: [
    { id: "hydraulic-excavator", name: "Escavadeira Hidráulica", icon: "🏗️" },
    { id: "mini-excavator", name: "Mini Escavadeira", icon: "🏗️" },
    { id: "long-reach", name: "Long Reach", icon: "🏗️" },
  ],
  loader: [
    { id: "wheel-loader", name: "Pá Carregadeira", icon: "🏗️" },
    { id: "backhoe-loader", name: "Retroescavadeira", icon: "🏗️" },
    { id: "skid-steer", name: "Mini Carregadeira", icon: "🏗️" },
    { id: "compact-track", name: "Carregadeira de Esteira", icon: "🏗️" },
  ],
  forklift: [
    { id: "combustao", name: "Combustão (GLP/Diesel)", icon: "🏭" },
    { id: "eletrico", name: "Elétrico", icon: "🏭" },
    { id: "reach-truck", name: "Retrátil", icon: "🏭" },
    { id: "order-picker", name: "Order Picker", icon: "🏭" },
  ],
  implement: [
    { id: "plantadeira", name: "Plantadeira/Semeadora", icon: "🌱" },
    { id: "pulverizador", name: "Pulverizador", icon: "💧" },
    { id: "arado", name: "Arado/Grade", icon: "🔧" },
    { id: "cultivador", name: "Cultivador", icon: "🔧" },
    { id: "roçadeira", name: "Roçadeira", icon: "🌿" },
    { id: "distribuidor", name: "Distribuidor de Fertilizantes", icon: "🌾" },
  ],
};

// Condition types
export const machineryConditions = [
  { id: "new", name: "Novo (0 horas)" },
  { id: "like-new", name: "Seminovo (até 500 horas)" },
  { id: "good", name: "Bom Estado (500-2000 horas)" },
  { id: "used", name: "Usado (2000-5000 horas)" },
  { id: "heavy-use", name: "Uso Intenso (+5000 horas)" },
  { id: "needs-repair", name: "Necessita Reparos" },
];

// Helper functions
export function getMachineryBrandById(id: string): MachineryBrand | undefined {
  return machineryBrands.find(b => b.id === id);
}

export function getMachineryModelsByBrand(brandId: string): MachineryModel[] {
  return machineryModels.filter(m => m.brandId === brandId);
}

export function getMachineryModelById(id: string): MachineryModel | undefined {
  return machineryModels.find(m => m.id === id);
}

export function searchMachineryModels(query: string): MachineryModel[] {
  const lowerQuery = query.toLowerCase();
  return machineryModels.filter(
    m => m.name.toLowerCase().includes(lowerQuery) ||
         getMachineryBrandById(m.brandId)?.name.toLowerCase().includes(lowerQuery)
  );
}
