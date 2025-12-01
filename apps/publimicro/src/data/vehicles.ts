// Vehicle database for smart auto-fill specifications
// Covers cars, motorcycles, trucks, and utility vehicles

export interface VehicleBrand {
  id: string;
  name: string;
  country: string;
  logo?: string;
  types: ("car" | "motorcycle" | "truck" | "utility")[];
}

export interface VehicleModel {
  id: string;
  brandId: string;
  name: string;
  type: "car" | "motorcycle" | "truck" | "utility";
  years: number[];
  category: string; // sedan, suv, hatch, pickup, sport, etc.
  specs: {
    engine?: string;
    transmission?: string[];
    fuel?: string[];
    power?: string;
    doors?: number;
    seats?: number;
    trunkCapacity?: string;
    fuelConsumption?: string;
  };
  variants?: {
    name: string;
    specs: Partial<VehicleModel["specs"]>;
  }[];
}

// Popular vehicle brands in Brazil
export const vehicleBrands: VehicleBrand[] = [
  // Cars - Brazilian Market Leaders
  { id: "fiat", name: "Fiat", country: "Italy", types: ["car", "utility"] },
  { id: "volkswagen", name: "Volkswagen", country: "Germany", types: ["car", "truck", "utility"] },
  { id: "chevrolet", name: "Chevrolet", country: "USA", types: ["car", "truck", "utility"] },
  { id: "hyundai", name: "Hyundai", country: "South Korea", types: ["car"] },
  { id: "toyota", name: "Toyota", country: "Japan", types: ["car", "truck", "utility"] },
  { id: "honda", name: "Honda", country: "Japan", types: ["car", "motorcycle"] },
  { id: "renault", name: "Renault", country: "France", types: ["car", "utility"] },
  { id: "jeep", name: "Jeep", country: "USA", types: ["car", "utility"] },
  { id: "nissan", name: "Nissan", country: "Japan", types: ["car", "utility"] },
  { id: "ford", name: "Ford", country: "USA", types: ["car", "truck", "utility"] },
  { id: "peugeot", name: "Peugeot", country: "France", types: ["car"] },
  { id: "citroen", name: "Citroën", country: "France", types: ["car"] },
  { id: "bmw", name: "BMW", country: "Germany", types: ["car", "motorcycle"] },
  { id: "mercedes", name: "Mercedes-Benz", country: "Germany", types: ["car", "truck"] },
  { id: "audi", name: "Audi", country: "Germany", types: ["car"] },
  { id: "volvo", name: "Volvo", country: "Sweden", types: ["car", "truck"] },
  { id: "mitsubishi", name: "Mitsubishi", country: "Japan", types: ["car", "utility"] },
  { id: "kia", name: "Kia", country: "South Korea", types: ["car"] },
  { id: "ram", name: "RAM", country: "USA", types: ["truck", "utility"] },
  { id: "caoa-chery", name: "CAOA Chery", country: "China", types: ["car"] },
  { id: "byd", name: "BYD", country: "China", types: ["car"] },
  { id: "gwm", name: "GWM", country: "China", types: ["car", "utility"] },
  
  // Motorcycles
  { id: "yamaha", name: "Yamaha", country: "Japan", types: ["motorcycle"] },
  { id: "honda-motos", name: "Honda Motos", country: "Japan", types: ["motorcycle"] },
  { id: "suzuki", name: "Suzuki", country: "Japan", types: ["motorcycle"] },
  { id: "kawasaki", name: "Kawasaki", country: "Japan", types: ["motorcycle"] },
  { id: "harley", name: "Harley-Davidson", country: "USA", types: ["motorcycle"] },
  { id: "ducati", name: "Ducati", country: "Italy", types: ["motorcycle"] },
  { id: "triumph", name: "Triumph", country: "UK", types: ["motorcycle"] },
  { id: "royal-enfield", name: "Royal Enfield", country: "India", types: ["motorcycle"] },
  
  // Trucks
  { id: "scania", name: "Scania", country: "Sweden", types: ["truck"] },
  { id: "man", name: "MAN", country: "Germany", types: ["truck"] },
  { id: "iveco", name: "Iveco", country: "Italy", types: ["truck"] },
  { id: "daf", name: "DAF", country: "Netherlands", types: ["truck"] },
];

// Popular vehicle models with specs
export const vehicleModels: VehicleModel[] = [
  // Fiat
  {
    id: "fiat-strada",
    brandId: "fiat",
    name: "Strada",
    type: "utility",
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    category: "pickup",
    specs: {
      engine: "1.3 Firefly / 1.4 Turbo",
      transmission: ["Manual 5v", "CVT"],
      fuel: ["Flex"],
      power: "107cv / 130cv",
      doors: 2,
      seats: 2,
    },
    variants: [
      { name: "Endurance", specs: { engine: "1.3 Firefly", power: "107cv" } },
      { name: "Freedom", specs: { engine: "1.3 Firefly", power: "107cv" } },
      { name: "Volcano", specs: { engine: "1.3 Firefly Turbo", power: "130cv" } },
      { name: "Ranch", specs: { engine: "1.3 Firefly Turbo", power: "130cv" } },
      { name: "Ultra", specs: { engine: "1.3 Firefly Turbo", power: "130cv" } },
    ],
  },
  {
    id: "fiat-argo",
    brandId: "fiat",
    name: "Argo",
    type: "car",
    years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    category: "hatch",
    specs: {
      engine: "1.0 Firefly / 1.3 Firefly / 1.8 E.torQ",
      transmission: ["Manual 5v", "Automático 6v"],
      fuel: ["Flex"],
      power: "75cv / 109cv / 139cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "fiat-pulse",
    brandId: "fiat",
    name: "Pulse",
    type: "car",
    years: [2022, 2023, 2024, 2025],
    category: "suv",
    specs: {
      engine: "1.0 Turbo / 1.3 Turbo",
      transmission: ["Manual 5v", "CVT", "Automático 6v"],
      fuel: ["Flex"],
      power: "130cv / 185cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "fiat-fastback",
    brandId: "fiat",
    name: "Fastback",
    type: "car",
    years: [2023, 2024, 2025],
    category: "suv-coupe",
    specs: {
      engine: "1.0 Turbo / 1.3 Turbo",
      transmission: ["CVT", "Automático 6v"],
      fuel: ["Flex"],
      power: "130cv / 185cv",
      doors: 4,
      seats: 5,
    },
  },
  
  // Volkswagen
  {
    id: "vw-polo",
    brandId: "volkswagen",
    name: "Polo",
    type: "car",
    years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    category: "hatch",
    specs: {
      engine: "1.0 MPI / 1.0 TSI / 1.4 TSI",
      transmission: ["Manual 5v", "Automático 6v"],
      fuel: ["Flex"],
      power: "84cv / 116cv / 150cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "vw-virtus",
    brandId: "volkswagen",
    name: "Virtus",
    type: "car",
    years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    category: "sedan",
    specs: {
      engine: "1.0 TSI / 1.4 TSI",
      transmission: ["Manual 6v", "Automático 6v"],
      fuel: ["Flex"],
      power: "116cv / 150cv",
      doors: 4,
      seats: 5,
      trunkCapacity: "521L",
    },
  },
  {
    id: "vw-nivus",
    brandId: "volkswagen",
    name: "Nivus",
    type: "car",
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    category: "suv-coupe",
    specs: {
      engine: "1.0 TSI",
      transmission: ["Automático 6v"],
      fuel: ["Flex"],
      power: "116cv / 128cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "vw-taos",
    brandId: "volkswagen",
    name: "Taos",
    type: "car",
    years: [2021, 2022, 2023, 2024, 2025],
    category: "suv",
    specs: {
      engine: "1.4 TSI",
      transmission: ["Automático 6v"],
      fuel: ["Flex"],
      power: "150cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "vw-tcross",
    brandId: "volkswagen",
    name: "T-Cross",
    type: "car",
    years: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
    category: "suv",
    specs: {
      engine: "1.0 TSI / 1.4 TSI",
      transmission: ["Manual 6v", "Automático 6v"],
      fuel: ["Flex"],
      power: "116cv / 150cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "vw-saveiro",
    brandId: "volkswagen",
    name: "Saveiro",
    type: "utility",
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    category: "pickup",
    specs: {
      engine: "1.6 MSI",
      transmission: ["Manual 5v"],
      fuel: ["Flex"],
      power: "110cv",
      doors: 2,
      seats: 2,
    },
  },
  {
    id: "vw-amarok",
    brandId: "volkswagen",
    name: "Amarok",
    type: "utility",
    years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    category: "pickup",
    specs: {
      engine: "2.0 TDI / 3.0 V6 TDI",
      transmission: ["Automático 8v"],
      fuel: ["Diesel"],
      power: "180cv / 258cv",
      doors: 4,
      seats: 5,
    },
  },
  
  // Chevrolet
  {
    id: "gm-onix",
    brandId: "chevrolet",
    name: "Onix",
    type: "car",
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    category: "hatch",
    specs: {
      engine: "1.0 Aspirado / 1.0 Turbo",
      transmission: ["Manual 6v", "Automático 6v"],
      fuel: ["Flex"],
      power: "82cv / 116cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "gm-onix-plus",
    brandId: "chevrolet",
    name: "Onix Plus",
    type: "car",
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    category: "sedan",
    specs: {
      engine: "1.0 Aspirado / 1.0 Turbo",
      transmission: ["Manual 6v", "Automático 6v"],
      fuel: ["Flex"],
      power: "82cv / 116cv",
      doors: 4,
      seats: 5,
      trunkCapacity: "470L",
    },
  },
  {
    id: "gm-tracker",
    brandId: "chevrolet",
    name: "Tracker",
    type: "car",
    years: [2021, 2022, 2023, 2024, 2025],
    category: "suv",
    specs: {
      engine: "1.0 Turbo / 1.2 Turbo",
      transmission: ["Manual 6v", "Automático 6v"],
      fuel: ["Flex"],
      power: "116cv / 133cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "gm-s10",
    brandId: "chevrolet",
    name: "S10",
    type: "utility",
    years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    category: "pickup",
    specs: {
      engine: "2.5 Flex / 2.8 Diesel",
      transmission: ["Manual 6v", "Automático 6v"],
      fuel: ["Flex", "Diesel"],
      power: "206cv / 200cv",
      doors: 4,
      seats: 5,
    },
  },
  
  // Toyota
  {
    id: "toyota-corolla",
    brandId: "toyota",
    name: "Corolla",
    type: "car",
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    category: "sedan",
    specs: {
      engine: "2.0 Dynamic Force / 1.8 Hybrid",
      transmission: ["CVT"],
      fuel: ["Flex", "Híbrido"],
      power: "177cv / 122cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "toyota-corolla-cross",
    brandId: "toyota",
    name: "Corolla Cross",
    type: "car",
    years: [2021, 2022, 2023, 2024, 2025],
    category: "suv",
    specs: {
      engine: "2.0 Dynamic Force / 1.8 Hybrid",
      transmission: ["CVT"],
      fuel: ["Flex", "Híbrido"],
      power: "177cv / 122cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "toyota-hilux",
    brandId: "toyota",
    name: "Hilux",
    type: "utility",
    years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    category: "pickup",
    specs: {
      engine: "2.7 Flex / 2.8 Diesel",
      transmission: ["Manual 6v", "Automático 6v"],
      fuel: ["Flex", "Diesel"],
      power: "163cv / 204cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "toyota-sw4",
    brandId: "toyota",
    name: "SW4",
    type: "car",
    years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    category: "suv",
    specs: {
      engine: "2.7 Flex / 2.8 Diesel",
      transmission: ["Automático 6v"],
      fuel: ["Flex", "Diesel"],
      power: "163cv / 204cv",
      doors: 4,
      seats: 7,
    },
  },
  
  // Honda
  {
    id: "honda-civic",
    brandId: "honda",
    name: "Civic",
    type: "car",
    years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    category: "sedan",
    specs: {
      engine: "2.0 i-VTEC / 1.5 Turbo",
      transmission: ["CVT"],
      fuel: ["Flex"],
      power: "155cv / 173cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "honda-city",
    brandId: "honda",
    name: "City",
    type: "car",
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    category: "sedan",
    specs: {
      engine: "1.5 i-VTEC",
      transmission: ["CVT"],
      fuel: ["Flex"],
      power: "126cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "honda-hrv",
    brandId: "honda",
    name: "HR-V",
    type: "car",
    years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    category: "suv",
    specs: {
      engine: "1.5 i-VTEC / 1.5 Turbo",
      transmission: ["CVT"],
      fuel: ["Flex"],
      power: "126cv / 177cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "honda-crv",
    brandId: "honda",
    name: "CR-V",
    type: "car",
    years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    category: "suv",
    specs: {
      engine: "1.5 Turbo / Híbrido",
      transmission: ["CVT"],
      fuel: ["Flex", "Híbrido"],
      power: "190cv",
      doors: 4,
      seats: 5,
    },
  },
  
  // Jeep
  {
    id: "jeep-renegade",
    brandId: "jeep",
    name: "Renegade",
    type: "car",
    years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    category: "suv",
    specs: {
      engine: "1.3 Turbo / 1.8 E.torQ / 2.0 Diesel",
      transmission: ["Manual 5v", "Automático 6v", "Automático 9v"],
      fuel: ["Flex", "Diesel"],
      power: "185cv / 139cv / 170cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "jeep-compass",
    brandId: "jeep",
    name: "Compass",
    type: "car",
    years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    category: "suv",
    specs: {
      engine: "1.3 Turbo / 2.0 Diesel",
      transmission: ["Automático 6v", "Automático 9v"],
      fuel: ["Flex", "Diesel"],
      power: "185cv / 170cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "jeep-commander",
    brandId: "jeep",
    name: "Commander",
    type: "car",
    years: [2022, 2023, 2024, 2025],
    category: "suv",
    specs: {
      engine: "1.3 Turbo / 2.0 Diesel",
      transmission: ["Automático 6v", "Automático 9v"],
      fuel: ["Flex", "Diesel"],
      power: "185cv / 170cv",
      doors: 4,
      seats: 7,
    },
  },
  
  // Hyundai
  {
    id: "hyundai-hb20",
    brandId: "hyundai",
    name: "HB20",
    type: "car",
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    category: "hatch",
    specs: {
      engine: "1.0 Aspirado / 1.0 Turbo",
      transmission: ["Manual 5v", "Automático 6v"],
      fuel: ["Flex"],
      power: "80cv / 120cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "hyundai-hb20s",
    brandId: "hyundai",
    name: "HB20S",
    type: "car",
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    category: "sedan",
    specs: {
      engine: "1.0 Aspirado / 1.0 Turbo",
      transmission: ["Manual 5v", "Automático 6v"],
      fuel: ["Flex"],
      power: "80cv / 120cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "hyundai-creta",
    brandId: "hyundai",
    name: "Creta",
    type: "car",
    years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    category: "suv",
    specs: {
      engine: "1.0 Turbo / 2.0 Aspirado",
      transmission: ["Automático 6v", "Automático CVT"],
      fuel: ["Flex"],
      power: "120cv / 167cv",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "hyundai-tucson",
    brandId: "hyundai",
    name: "Tucson",
    type: "car",
    years: [2022, 2023, 2024, 2025],
    category: "suv",
    specs: {
      engine: "1.6 Turbo / Híbrido",
      transmission: ["Automático 7v DCT"],
      fuel: ["Flex", "Híbrido"],
      power: "180cv / 265cv",
      doors: 4,
      seats: 5,
    },
  },

  // Honda Motorcycles
  {
    id: "honda-cg160",
    brandId: "honda-motos",
    name: "CG 160",
    type: "motorcycle",
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    category: "street",
    specs: {
      engine: "162.7cc",
      transmission: ["Manual 5v"],
      fuel: ["Flex"],
      power: "14.9cv",
    },
    variants: [
      { name: "Fan", specs: {} },
      { name: "Start", specs: {} },
      { name: "Titan", specs: {} },
    ],
  },
  {
    id: "honda-cb500",
    brandId: "honda-motos",
    name: "CB 500F",
    type: "motorcycle",
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    category: "naked",
    specs: {
      engine: "471cc Bicilíndrico",
      transmission: ["Manual 6v"],
      fuel: ["Gasolina"],
      power: "50cv",
    },
  },
  {
    id: "honda-xre300",
    brandId: "honda-motos",
    name: "XRE 300",
    type: "motorcycle",
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    category: "trail",
    specs: {
      engine: "291cc Monocilíndrico",
      transmission: ["Manual 5v"],
      fuel: ["Flex"],
      power: "26.2cv",
    },
  },
  {
    id: "honda-pcx",
    brandId: "honda-motos",
    name: "PCX 160",
    type: "motorcycle",
    years: [2022, 2023, 2024, 2025],
    category: "scooter",
    specs: {
      engine: "156.9cc",
      transmission: ["CVT"],
      fuel: ["Gasolina"],
      power: "16.2cv",
    },
  },

  // Yamaha Motorcycles
  {
    id: "yamaha-fazer",
    brandId: "yamaha",
    name: "Fazer 250",
    type: "motorcycle",
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    category: "street",
    specs: {
      engine: "249cc Monocilíndrico",
      transmission: ["Manual 6v"],
      fuel: ["Flex"],
      power: "21.5cv",
    },
  },
  {
    id: "yamaha-mt03",
    brandId: "yamaha",
    name: "MT-03",
    type: "motorcycle",
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    category: "naked",
    specs: {
      engine: "321cc Bicilíndrico",
      transmission: ["Manual 6v"],
      fuel: ["Gasolina"],
      power: "42cv",
    },
  },
  {
    id: "yamaha-xtz",
    brandId: "yamaha",
    name: "XTZ 250 Lander",
    type: "motorcycle",
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    category: "trail",
    specs: {
      engine: "249cc Monocilíndrico",
      transmission: ["Manual 5v"],
      fuel: ["Flex"],
      power: "21.3cv",
    },
  },
  {
    id: "yamaha-nmax",
    brandId: "yamaha",
    name: "NMAX 160",
    type: "motorcycle",
    years: [2022, 2023, 2024, 2025],
    category: "scooter",
    specs: {
      engine: "155cc",
      transmission: ["CVT"],
      fuel: ["Gasolina"],
      power: "16cv",
    },
  },
];

// Vehicle categories for filtering
export const vehicleCategories = {
  car: [
    { id: "hatch", name: "Hatch", icon: "🚗" },
    { id: "sedan", name: "Sedan", icon: "🚙" },
    { id: "suv", name: "SUV", icon: "🚙" },
    { id: "suv-coupe", name: "SUV Coupé", icon: "🚙" },
    { id: "minivan", name: "Minivan", icon: "🚐" },
    { id: "coupe", name: "Coupé", icon: "🚗" },
    { id: "convertible", name: "Conversível", icon: "🏎️" },
    { id: "wagon", name: "Perua", icon: "🚙" },
  ],
  motorcycle: [
    { id: "street", name: "Street", icon: "🏍️" },
    { id: "naked", name: "Naked", icon: "🏍️" },
    { id: "sport", name: "Esportiva", icon: "🏍️" },
    { id: "trail", name: "Trail/Off-road", icon: "🏍️" },
    { id: "scooter", name: "Scooter", icon: "🛵" },
    { id: "custom", name: "Custom", icon: "🏍️" },
    { id: "touring", name: "Touring", icon: "🏍️" },
    { id: "adventure", name: "Adventure", icon: "🏍️" },
  ],
  utility: [
    { id: "pickup", name: "Picape", icon: "🛻" },
    { id: "van", name: "Van/Furgão", icon: "🚐" },
    { id: "chassis", name: "Chassis/Cab", icon: "🚚" },
  ],
  truck: [
    { id: "light", name: "Leve (até 8t)", icon: "🚚" },
    { id: "medium", name: "Médio (8-15t)", icon: "🚚" },
    { id: "heavy", name: "Pesado (15-30t)", icon: "🚛" },
    { id: "extra-heavy", name: "Extra-Pesado (+30t)", icon: "🚛" },
    { id: "tractor", name: "Cavalo Mecânico", icon: "🚛" },
  ],
};

// Fuel types
export const fuelTypes = [
  { id: "flex", name: "Flex (Álcool/Gasolina)" },
  { id: "gasoline", name: "Gasolina" },
  { id: "ethanol", name: "Etanol" },
  { id: "diesel", name: "Diesel" },
  { id: "hybrid", name: "Híbrido" },
  { id: "electric", name: "Elétrico" },
  { id: "plugin-hybrid", name: "Híbrido Plug-in" },
  { id: "gnv", name: "GNV (Gás Natural)" },
];

// Transmission types
export const transmissionTypes = [
  { id: "manual-5", name: "Manual 5 marchas" },
  { id: "manual-6", name: "Manual 6 marchas" },
  { id: "auto-6", name: "Automático 6 marchas" },
  { id: "auto-8", name: "Automático 8 marchas" },
  { id: "auto-9", name: "Automático 9 marchas" },
  { id: "cvt", name: "CVT" },
  { id: "dct", name: "Automatizado (DCT)" },
];

// Colors
export const vehicleColors = [
  { id: "white", name: "Branco", hex: "#FFFFFF" },
  { id: "black", name: "Preto", hex: "#000000" },
  { id: "silver", name: "Prata", hex: "#C0C0C0" },
  { id: "gray", name: "Cinza", hex: "#808080" },
  { id: "red", name: "Vermelho", hex: "#FF0000" },
  { id: "blue", name: "Azul", hex: "#0066CC" },
  { id: "green", name: "Verde", hex: "#008000" },
  { id: "beige", name: "Bege", hex: "#F5F5DC" },
  { id: "brown", name: "Marrom", hex: "#8B4513" },
  { id: "yellow", name: "Amarelo", hex: "#FFD700" },
  { id: "orange", name: "Laranja", hex: "#FF8C00" },
  { id: "wine", name: "Vinho", hex: "#722F37" },
];

// Helper functions
export function getBrandById(id: string): VehicleBrand | undefined {
  return vehicleBrands.find(b => b.id === id);
}

export function getModelsByBrand(brandId: string): VehicleModel[] {
  return vehicleModels.filter(m => m.brandId === brandId);
}

export function getModelById(id: string): VehicleModel | undefined {
  return vehicleModels.find(m => m.id === id);
}

export function searchModels(query: string): VehicleModel[] {
  const lowerQuery = query.toLowerCase();
  return vehicleModels.filter(
    m => m.name.toLowerCase().includes(lowerQuery) ||
         getBrandById(m.brandId)?.name.toLowerCase().includes(lowerQuery)
  );
}
