/**
 * AcheMe Product Database - Smartphones
 * 
 * A comprehensive database of popular smartphones with auto-fill specifications.
 * Users can search and select a model, and the system auto-fills common specs,
 * only asking for variable options like storage capacity and color.
 */

export interface SmartphoneSpec {
  id: string;
  brand: string;
  model: string;
  fullName: string;
  releaseYear: number;
  
  // Display
  displaySize: string;
  displayType: string;
  displayResolution: string;
  refreshRate: string;
  
  // Performance
  processor: string;
  ram: string[]; // Available RAM options
  storage: string[]; // Available storage options
  
  // Camera
  mainCamera: string;
  frontCamera: string;
  cameraFeatures: string[];
  
  // Battery
  battery: string;
  charging: string;
  
  // Connectivity
  connectivity: string[];
  simType: string;
  
  // Physical
  dimensions: string;
  weight: string;
  colors: string[];
  
  // OS
  os: string;
  
  // Other features
  features: string[];
  
  // Reference price range (BRL)
  priceRangeMin?: number;
  priceRangeMax?: number;
  
  // Image URL for reference
  imageUrl?: string;
}

// Popular Smartphone Database (2022-2025)
export const smartphoneDatabase: SmartphoneSpec[] = [
  // Apple iPhones
  {
    id: "iphone-15-pro-max",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    fullName: "Apple iPhone 15 Pro Max",
    releaseYear: 2023,
    displaySize: "6.7 polegadas",
    displayType: "Super Retina XDR OLED",
    displayResolution: "2796 x 1290 pixels",
    refreshRate: "120Hz ProMotion",
    processor: "A17 Pro",
    ram: ["8GB"],
    storage: ["256GB", "512GB", "1TB"],
    mainCamera: "48MP + 12MP + 12MP (Teleobjetiva 5x)",
    frontCamera: "12MP TrueDepth",
    cameraFeatures: ["ProRAW", "ProRes 4K", "Modo Cinema", "Night Mode", "Deep Fusion"],
    battery: "4422mAh",
    charging: "USB-C, MagSafe 15W, Qi wireless",
    connectivity: ["5G", "Wi-Fi 6E", "Bluetooth 5.3", "NFC", "Ultra Wideband"],
    simType: "Nano-SIM + eSIM",
    dimensions: "159.9 x 76.7 x 8.25 mm",
    weight: "221g",
    colors: ["Titânio Natural", "Titânio Azul", "Titânio Branco", "Titânio Preto"],
    os: "iOS 17",
    features: ["Face ID", "Dynamic Island", "Action Button", "Botão de Ação", "Titanium Design", "USB 3.0"],
    priceRangeMin: 9500,
    priceRangeMax: 13000,
  },
  {
    id: "iphone-15-pro",
    brand: "Apple",
    model: "iPhone 15 Pro",
    fullName: "Apple iPhone 15 Pro",
    releaseYear: 2023,
    displaySize: "6.1 polegadas",
    displayType: "Super Retina XDR OLED",
    displayResolution: "2556 x 1179 pixels",
    refreshRate: "120Hz ProMotion",
    processor: "A17 Pro",
    ram: ["8GB"],
    storage: ["128GB", "256GB", "512GB", "1TB"],
    mainCamera: "48MP + 12MP + 12MP (Teleobjetiva 3x)",
    frontCamera: "12MP TrueDepth",
    cameraFeatures: ["ProRAW", "ProRes 4K", "Modo Cinema", "Night Mode"],
    battery: "3274mAh",
    charging: "USB-C, MagSafe 15W",
    connectivity: ["5G", "Wi-Fi 6E", "Bluetooth 5.3", "NFC"],
    simType: "Nano-SIM + eSIM",
    dimensions: "146.6 x 70.6 x 8.25 mm",
    weight: "187g",
    colors: ["Titânio Natural", "Titânio Azul", "Titânio Branco", "Titânio Preto"],
    os: "iOS 17",
    features: ["Face ID", "Dynamic Island", "Action Button", "Titanium Design"],
    priceRangeMin: 8500,
    priceRangeMax: 12000,
  },
  {
    id: "iphone-15",
    brand: "Apple",
    model: "iPhone 15",
    fullName: "Apple iPhone 15",
    releaseYear: 2023,
    displaySize: "6.1 polegadas",
    displayType: "Super Retina XDR OLED",
    displayResolution: "2556 x 1179 pixels",
    refreshRate: "60Hz",
    processor: "A16 Bionic",
    ram: ["6GB"],
    storage: ["128GB", "256GB", "512GB"],
    mainCamera: "48MP + 12MP",
    frontCamera: "12MP TrueDepth",
    cameraFeatures: ["Modo Cinema", "Night Mode", "Deep Fusion"],
    battery: "3349mAh",
    charging: "USB-C, MagSafe 15W",
    connectivity: ["5G", "Wi-Fi 6", "Bluetooth 5.3", "NFC"],
    simType: "Nano-SIM + eSIM",
    dimensions: "147.6 x 71.6 x 7.8 mm",
    weight: "171g",
    colors: ["Preto", "Azul", "Verde", "Amarelo", "Rosa"],
    os: "iOS 17",
    features: ["Face ID", "Dynamic Island", "USB-C"],
    priceRangeMin: 6500,
    priceRangeMax: 8500,
  },
  {
    id: "iphone-14",
    brand: "Apple",
    model: "iPhone 14",
    fullName: "Apple iPhone 14",
    releaseYear: 2022,
    displaySize: "6.1 polegadas",
    displayType: "Super Retina XDR OLED",
    displayResolution: "2532 x 1170 pixels",
    refreshRate: "60Hz",
    processor: "A15 Bionic",
    ram: ["6GB"],
    storage: ["128GB", "256GB", "512GB"],
    mainCamera: "12MP + 12MP",
    frontCamera: "12MP TrueDepth",
    cameraFeatures: ["Modo Cinema", "Action Mode"],
    battery: "3279mAh",
    charging: "Lightning, MagSafe 15W",
    connectivity: ["5G", "Wi-Fi 6", "Bluetooth 5.3", "NFC"],
    simType: "Nano-SIM + eSIM",
    dimensions: "146.7 x 71.5 x 7.8 mm",
    weight: "172g",
    colors: ["Meia-noite", "Estelar", "Azul", "Roxo", "Vermelho"],
    os: "iOS 16",
    features: ["Face ID", "Emergency SOS via satélite", "Detecção de Acidente"],
    priceRangeMin: 5000,
    priceRangeMax: 7000,
  },

  // Samsung Galaxy S Series
  {
    id: "samsung-s24-ultra",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    fullName: "Samsung Galaxy S24 Ultra",
    releaseYear: 2024,
    displaySize: "6.8 polegadas",
    displayType: "Dynamic AMOLED 2X",
    displayResolution: "3088 x 1440 pixels (QHD+)",
    refreshRate: "120Hz LTPO",
    processor: "Snapdragon 8 Gen 3",
    ram: ["12GB"],
    storage: ["256GB", "512GB", "1TB"],
    mainCamera: "200MP + 12MP + 50MP + 10MP (Teleobjetiva 5x)",
    frontCamera: "12MP",
    cameraFeatures: ["8K Video", "100x Space Zoom", "Nightography", "AI Photo Edit"],
    battery: "5000mAh",
    charging: "45W com fio, 15W wireless",
    connectivity: ["5G", "Wi-Fi 7", "Bluetooth 5.3", "NFC", "Ultra Wideband"],
    simType: "Nano-SIM + eSIM",
    dimensions: "162.3 x 79.0 x 8.6 mm",
    weight: "233g",
    colors: ["Titanium Gray", "Titanium Black", "Titanium Violet", "Titanium Yellow"],
    os: "Android 14 / One UI 6.1",
    features: ["S Pen", "Galaxy AI", "Titanium Frame", "Gorilla Armor"],
    priceRangeMin: 9000,
    priceRangeMax: 13000,
  },
  {
    id: "samsung-s24-plus",
    brand: "Samsung",
    model: "Galaxy S24+",
    fullName: "Samsung Galaxy S24+",
    releaseYear: 2024,
    displaySize: "6.7 polegadas",
    displayType: "Dynamic AMOLED 2X",
    displayResolution: "3088 x 1440 pixels (QHD+)",
    refreshRate: "120Hz LTPO",
    processor: "Snapdragon 8 Gen 3 / Exynos 2400",
    ram: ["12GB"],
    storage: ["256GB", "512GB"],
    mainCamera: "50MP + 12MP + 10MP",
    frontCamera: "12MP",
    cameraFeatures: ["4K Video", "30x Space Zoom", "Nightography"],
    battery: "4900mAh",
    charging: "45W com fio, 15W wireless",
    connectivity: ["5G", "Wi-Fi 7", "Bluetooth 5.3", "NFC"],
    simType: "Nano-SIM + eSIM",
    dimensions: "158.5 x 75.9 x 7.7 mm",
    weight: "196g",
    colors: ["Onyx Black", "Marble Gray", "Cobalt Violet", "Amber Yellow"],
    os: "Android 14 / One UI 6.1",
    features: ["Galaxy AI", "Gorilla Victus 2"],
    priceRangeMin: 6500,
    priceRangeMax: 8500,
  },
  {
    id: "samsung-s24",
    brand: "Samsung",
    model: "Galaxy S24",
    fullName: "Samsung Galaxy S24",
    releaseYear: 2024,
    displaySize: "6.2 polegadas",
    displayType: "Dynamic AMOLED 2X",
    displayResolution: "2340 x 1080 pixels (FHD+)",
    refreshRate: "120Hz LTPO",
    processor: "Snapdragon 8 Gen 3 / Exynos 2400",
    ram: ["8GB"],
    storage: ["128GB", "256GB"],
    mainCamera: "50MP + 12MP + 10MP",
    frontCamera: "12MP",
    cameraFeatures: ["4K Video", "30x Space Zoom", "Nightography"],
    battery: "4000mAh",
    charging: "25W com fio, 15W wireless",
    connectivity: ["5G", "Wi-Fi 6E", "Bluetooth 5.3", "NFC"],
    simType: "Nano-SIM + eSIM",
    dimensions: "147.0 x 70.6 x 7.6 mm",
    weight: "167g",
    colors: ["Onyx Black", "Marble Gray", "Cobalt Violet", "Amber Yellow"],
    os: "Android 14 / One UI 6.1",
    features: ["Galaxy AI", "Gorilla Victus 2"],
    priceRangeMin: 5000,
    priceRangeMax: 6500,
  },
  {
    id: "samsung-s23-ultra",
    brand: "Samsung",
    model: "Galaxy S23 Ultra",
    fullName: "Samsung Galaxy S23 Ultra",
    releaseYear: 2023,
    displaySize: "6.8 polegadas",
    displayType: "Dynamic AMOLED 2X",
    displayResolution: "3088 x 1440 pixels (QHD+)",
    refreshRate: "120Hz LTPO",
    processor: "Snapdragon 8 Gen 2",
    ram: ["8GB", "12GB"],
    storage: ["256GB", "512GB", "1TB"],
    mainCamera: "200MP + 12MP + 10MP + 10MP",
    frontCamera: "12MP",
    cameraFeatures: ["8K Video", "100x Space Zoom", "Nightography"],
    battery: "5000mAh",
    charging: "45W com fio, 15W wireless",
    connectivity: ["5G", "Wi-Fi 6E", "Bluetooth 5.3", "NFC", "Ultra Wideband"],
    simType: "Nano-SIM + eSIM",
    dimensions: "163.4 x 78.1 x 8.9 mm",
    weight: "234g",
    colors: ["Phantom Black", "Cream", "Green", "Lavender"],
    os: "Android 13 / One UI 5.1",
    features: ["S Pen", "Gorilla Victus 2"],
    priceRangeMin: 6500,
    priceRangeMax: 9500,
  },

  // Samsung Galaxy A Series (Mid-range)
  {
    id: "samsung-a54",
    brand: "Samsung",
    model: "Galaxy A54 5G",
    fullName: "Samsung Galaxy A54 5G",
    releaseYear: 2023,
    displaySize: "6.4 polegadas",
    displayType: "Super AMOLED",
    displayResolution: "2340 x 1080 pixels (FHD+)",
    refreshRate: "120Hz",
    processor: "Exynos 1380",
    ram: ["8GB"],
    storage: ["128GB", "256GB"],
    mainCamera: "50MP + 12MP + 5MP",
    frontCamera: "32MP",
    cameraFeatures: ["4K Video", "OIS", "Night Mode"],
    battery: "5000mAh",
    charging: "25W com fio",
    connectivity: ["5G", "Wi-Fi 6", "Bluetooth 5.3", "NFC"],
    simType: "Dual SIM",
    dimensions: "158.2 x 76.7 x 8.2 mm",
    weight: "202g",
    colors: ["Preto", "Branco", "Violeta", "Verde-limão"],
    os: "Android 13 / One UI 5.1",
    features: ["IP67", "Gorilla Victus+", "4 anos de atualizações"],
    priceRangeMin: 2200,
    priceRangeMax: 3000,
  },
  {
    id: "samsung-a34",
    brand: "Samsung",
    model: "Galaxy A34 5G",
    fullName: "Samsung Galaxy A34 5G",
    releaseYear: 2023,
    displaySize: "6.6 polegadas",
    displayType: "Super AMOLED",
    displayResolution: "2340 x 1080 pixels (FHD+)",
    refreshRate: "120Hz",
    processor: "Dimensity 1080",
    ram: ["6GB", "8GB"],
    storage: ["128GB", "256GB"],
    mainCamera: "48MP + 8MP + 5MP",
    frontCamera: "13MP",
    cameraFeatures: ["4K Video", "OIS"],
    battery: "5000mAh",
    charging: "25W com fio",
    connectivity: ["5G", "Wi-Fi 5", "Bluetooth 5.3", "NFC"],
    simType: "Dual SIM",
    dimensions: "161.3 x 78.1 x 8.2 mm",
    weight: "199g",
    colors: ["Preto", "Prata", "Violeta", "Verde-limão"],
    os: "Android 13 / One UI 5.1",
    features: ["IP67", "4 anos de atualizações"],
    priceRangeMin: 1800,
    priceRangeMax: 2500,
  },

  // Xiaomi
  {
    id: "xiaomi-14-ultra",
    brand: "Xiaomi",
    model: "14 Ultra",
    fullName: "Xiaomi 14 Ultra",
    releaseYear: 2024,
    displaySize: "6.73 polegadas",
    displayType: "LTPO AMOLED",
    displayResolution: "3200 x 1440 pixels (QHD+)",
    refreshRate: "120Hz",
    processor: "Snapdragon 8 Gen 3",
    ram: ["12GB", "16GB"],
    storage: ["256GB", "512GB", "1TB"],
    mainCamera: "50MP Leica + 50MP + 50MP + 50MP",
    frontCamera: "32MP",
    cameraFeatures: ["8K Video", "Leica Optics", "Variable Aperture f/1.63-4.0"],
    battery: "5000mAh",
    charging: "90W com fio, 50W wireless",
    connectivity: ["5G", "Wi-Fi 7", "Bluetooth 5.4", "NFC", "IR Blaster"],
    simType: "Dual SIM",
    dimensions: "161.4 x 75.3 x 9.2 mm",
    weight: "220g",
    colors: ["Preto", "Branco"],
    os: "Android 14 / HyperOS",
    features: ["Leica Camera", "IP68", "Ceramic Back"],
    priceRangeMin: 7500,
    priceRangeMax: 10000,
  },
  {
    id: "xiaomi-14",
    brand: "Xiaomi",
    model: "14",
    fullName: "Xiaomi 14",
    releaseYear: 2024,
    displaySize: "6.36 polegadas",
    displayType: "LTPO AMOLED",
    displayResolution: "2670 x 1200 pixels",
    refreshRate: "120Hz",
    processor: "Snapdragon 8 Gen 3",
    ram: ["12GB"],
    storage: ["256GB", "512GB"],
    mainCamera: "50MP Leica + 50MP + 50MP",
    frontCamera: "32MP",
    cameraFeatures: ["8K Video", "Leica Optics", "OIS"],
    battery: "4610mAh",
    charging: "90W com fio, 50W wireless",
    connectivity: ["5G", "Wi-Fi 7", "Bluetooth 5.4", "NFC"],
    simType: "Dual SIM",
    dimensions: "152.8 x 71.5 x 8.2 mm",
    weight: "193g",
    colors: ["Preto", "Branco", "Verde Jade"],
    os: "Android 14 / HyperOS",
    features: ["Leica Camera", "IP68", "Compacto"],
    priceRangeMin: 5500,
    priceRangeMax: 7500,
  },
  {
    id: "poco-f5",
    brand: "Xiaomi",
    model: "POCO F5",
    fullName: "Xiaomi POCO F5",
    releaseYear: 2023,
    displaySize: "6.67 polegadas",
    displayType: "AMOLED",
    displayResolution: "2400 x 1080 pixels (FHD+)",
    refreshRate: "120Hz",
    processor: "Snapdragon 7+ Gen 2",
    ram: ["8GB", "12GB"],
    storage: ["256GB", "512GB"],
    mainCamera: "64MP + 8MP + 2MP",
    frontCamera: "16MP",
    cameraFeatures: ["4K Video", "OIS"],
    battery: "5000mAh",
    charging: "67W com fio",
    connectivity: ["5G", "Wi-Fi 6", "Bluetooth 5.3", "NFC", "IR Blaster"],
    simType: "Dual SIM",
    dimensions: "161.1 x 74.9 x 7.9 mm",
    weight: "181g",
    colors: ["Preto", "Branco", "Azul"],
    os: "Android 13 / MIUI 14",
    features: ["Gorilla Victus", "Hi-Res Audio"],
    priceRangeMin: 2000,
    priceRangeMax: 2800,
  },
  {
    id: "redmi-note-13-pro",
    brand: "Xiaomi",
    model: "Redmi Note 13 Pro 5G",
    fullName: "Xiaomi Redmi Note 13 Pro 5G",
    releaseYear: 2024,
    displaySize: "6.67 polegadas",
    displayType: "AMOLED",
    displayResolution: "2712 x 1220 pixels",
    refreshRate: "120Hz",
    processor: "Snapdragon 7s Gen 2",
    ram: ["8GB", "12GB"],
    storage: ["256GB", "512GB"],
    mainCamera: "200MP + 8MP + 2MP",
    frontCamera: "16MP",
    cameraFeatures: ["4K Video", "OIS", "200MP modo Ultra HD"],
    battery: "5100mAh",
    charging: "67W com fio",
    connectivity: ["5G", "Wi-Fi 6", "Bluetooth 5.2", "NFC", "IR Blaster"],
    simType: "Dual SIM",
    dimensions: "161.1 x 74.2 x 8 mm",
    weight: "187g",
    colors: ["Preto Meia-noite", "Roxo Aurora", "Branco Alpino"],
    os: "Android 13 / MIUI 14",
    features: ["Gorilla Victus", "IP54"],
    priceRangeMin: 1800,
    priceRangeMax: 2500,
  },

  // Motorola
  {
    id: "motorola-edge-40-pro",
    brand: "Motorola",
    model: "Edge 40 Pro",
    fullName: "Motorola Edge 40 Pro",
    releaseYear: 2023,
    displaySize: "6.67 polegadas",
    displayType: "P-OLED",
    displayResolution: "2400 x 1080 pixels (FHD+)",
    refreshRate: "165Hz",
    processor: "Snapdragon 8 Gen 2",
    ram: ["12GB"],
    storage: ["256GB", "512GB"],
    mainCamera: "50MP + 50MP + 12MP",
    frontCamera: "60MP",
    cameraFeatures: ["8K Video", "OIS"],
    battery: "4600mAh",
    charging: "125W com fio, 15W wireless",
    connectivity: ["5G", "Wi-Fi 7", "Bluetooth 5.3", "NFC"],
    simType: "Dual SIM",
    dimensions: "161.2 x 74 x 8.6 mm",
    weight: "199g",
    colors: ["Preto Interstellar", "Azul Nebula"],
    os: "Android 13 / My UX",
    features: ["IP68", "Curved Display"],
    priceRangeMin: 4500,
    priceRangeMax: 6000,
  },
  {
    id: "moto-g84",
    brand: "Motorola",
    model: "Moto G84 5G",
    fullName: "Motorola Moto G84 5G",
    releaseYear: 2023,
    displaySize: "6.55 polegadas",
    displayType: "P-OLED",
    displayResolution: "2400 x 1080 pixels (FHD+)",
    refreshRate: "120Hz",
    processor: "Snapdragon 695",
    ram: ["12GB"],
    storage: ["256GB"],
    mainCamera: "50MP + 8MP",
    frontCamera: "16MP",
    cameraFeatures: ["4K Video", "OIS"],
    battery: "5000mAh",
    charging: "33W TurboPower",
    connectivity: ["5G", "Wi-Fi 5", "Bluetooth 5.1", "NFC"],
    simType: "Dual SIM",
    dimensions: "160.5 x 74.4 x 7.6 mm",
    weight: "168g",
    colors: ["Preto Marshmallow", "Magenta"],
    os: "Android 13 / My UX",
    features: ["IP52", "Dolby Atmos"],
    priceRangeMin: 1500,
    priceRangeMax: 2200,
  },

  // Google Pixel
  {
    id: "pixel-8-pro",
    brand: "Google",
    model: "Pixel 8 Pro",
    fullName: "Google Pixel 8 Pro",
    releaseYear: 2023,
    displaySize: "6.7 polegadas",
    displayType: "LTPO OLED",
    displayResolution: "2992 x 1344 pixels (QHD+)",
    refreshRate: "120Hz LTPO",
    processor: "Google Tensor G3",
    ram: ["12GB"],
    storage: ["128GB", "256GB", "512GB", "1TB"],
    mainCamera: "50MP + 48MP + 48MP (Teleobjetiva 5x)",
    frontCamera: "10.5MP",
    cameraFeatures: ["8K Video", "Photo Unblur", "Magic Eraser", "Best Take", "Night Sight"],
    battery: "5050mAh",
    charging: "30W com fio, 23W wireless",
    connectivity: ["5G", "Wi-Fi 7", "Bluetooth 5.3", "NFC", "Ultra Wideband"],
    simType: "Nano-SIM + eSIM",
    dimensions: "162.6 x 76.5 x 8.8 mm",
    weight: "213g",
    colors: ["Obsidian", "Porcelain", "Bay"],
    os: "Android 14",
    features: ["7 anos de atualizações", "IP68", "Temperature Sensor", "AI Features"],
    priceRangeMin: 6000,
    priceRangeMax: 8500,
  },
  {
    id: "pixel-8",
    brand: "Google",
    model: "Pixel 8",
    fullName: "Google Pixel 8",
    releaseYear: 2023,
    displaySize: "6.2 polegadas",
    displayType: "OLED",
    displayResolution: "2400 x 1080 pixels (FHD+)",
    refreshRate: "120Hz",
    processor: "Google Tensor G3",
    ram: ["8GB"],
    storage: ["128GB", "256GB"],
    mainCamera: "50MP + 12MP",
    frontCamera: "10.5MP",
    cameraFeatures: ["4K Video", "Photo Unblur", "Magic Eraser", "Night Sight"],
    battery: "4575mAh",
    charging: "27W com fio, 18W wireless",
    connectivity: ["5G", "Wi-Fi 6E", "Bluetooth 5.3", "NFC"],
    simType: "Nano-SIM + eSIM",
    dimensions: "150.5 x 70.8 x 8.9 mm",
    weight: "187g",
    colors: ["Obsidian", "Hazel", "Rose"],
    os: "Android 14",
    features: ["7 anos de atualizações", "IP68", "AI Features"],
    priceRangeMin: 4500,
    priceRangeMax: 6000,
  },

  // OnePlus
  {
    id: "oneplus-12",
    brand: "OnePlus",
    model: "12",
    fullName: "OnePlus 12",
    releaseYear: 2024,
    displaySize: "6.82 polegadas",
    displayType: "LTPO AMOLED",
    displayResolution: "3168 x 1440 pixels (QHD+)",
    refreshRate: "120Hz LTPO",
    processor: "Snapdragon 8 Gen 3",
    ram: ["12GB", "16GB"],
    storage: ["256GB", "512GB"],
    mainCamera: "50MP + 64MP + 48MP Hasselblad",
    frontCamera: "32MP",
    cameraFeatures: ["8K Video", "Hasselblad Color", "OIS"],
    battery: "5400mAh",
    charging: "100W SuperVOOC, 50W wireless",
    connectivity: ["5G", "Wi-Fi 7", "Bluetooth 5.4", "NFC"],
    simType: "Dual SIM",
    dimensions: "164.3 x 75.8 x 9.2 mm",
    weight: "220g",
    colors: ["Silky Black", "Flowy Emerald"],
    os: "Android 14 / OxygenOS 14",
    features: ["Hasselblad Camera", "IP65", "Alert Slider"],
    priceRangeMin: 5500,
    priceRangeMax: 7500,
  },

  // Realme
  {
    id: "realme-gt5-pro",
    brand: "Realme",
    model: "GT5 Pro",
    fullName: "Realme GT5 Pro",
    releaseYear: 2023,
    displaySize: "6.78 polegadas",
    displayType: "LTPO AMOLED",
    displayResolution: "2780 x 1264 pixels",
    refreshRate: "144Hz LTPO",
    processor: "Snapdragon 8 Gen 3",
    ram: ["12GB", "16GB"],
    storage: ["256GB", "512GB", "1TB"],
    mainCamera: "50MP + 8MP + 50MP Periscope",
    frontCamera: "32MP",
    cameraFeatures: ["8K Video", "OIS", "3x Optical Zoom"],
    battery: "5400mAh",
    charging: "100W SuperVOOC, 50W wireless",
    connectivity: ["5G", "Wi-Fi 7", "Bluetooth 5.4", "NFC"],
    simType: "Dual SIM",
    dimensions: "163.3 x 75.2 x 9.2 mm",
    weight: "218g",
    colors: ["Rock Grey", "Pioneer Green"],
    os: "Android 14 / Realme UI 5",
    features: ["Curved Display", "X-axis Linear Motor"],
    priceRangeMin: 4000,
    priceRangeMax: 5500,
  },
];

// Helper functions

/**
 * Search smartphones by brand, model, or full name
 */
export function searchSmartphones(query: string): SmartphoneSpec[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];
  
  return smartphoneDatabase.filter(phone => 
    phone.fullName.toLowerCase().includes(lowerQuery) ||
    phone.brand.toLowerCase().includes(lowerQuery) ||
    phone.model.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get smartphones by brand
 */
export function getSmartphonesByBrand(brand: string): SmartphoneSpec[] {
  return smartphoneDatabase.filter(phone => 
    phone.brand.toLowerCase() === brand.toLowerCase()
  );
}

/**
 * Get unique brands
 */
export function getSmartphoneBrands(): string[] {
  return [...new Set(smartphoneDatabase.map(phone => phone.brand))].sort();
}

/**
 * Get smartphone by ID
 */
export function getSmartphoneById(id: string): SmartphoneSpec | undefined {
  return smartphoneDatabase.find(phone => phone.id === id);
}

/**
 * Get recent smartphones (last 2 years)
 */
export function getRecentSmartphones(): SmartphoneSpec[] {
  const currentYear = new Date().getFullYear();
  return smartphoneDatabase.filter(phone => 
    phone.releaseYear >= currentYear - 1
  ).sort((a, b) => b.releaseYear - a.releaseYear);
}

/**
 * Get smartphones by price range
 */
export function getSmartphonesByPriceRange(min: number, max: number): SmartphoneSpec[] {
  return smartphoneDatabase.filter(phone => 
    phone.priceRangeMin && phone.priceRangeMax &&
    phone.priceRangeMin >= min && phone.priceRangeMax <= max
  );
}
