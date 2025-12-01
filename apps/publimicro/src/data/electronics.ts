// Electronics Database - TVs, Laptops, Tablets, Smartphones, Audio, Gaming
// Smart auto-fill data for Tudo marketplace

export interface ElectronicsBrand {
  id: string;
  name: string;
  country: string;
  categories: string[];
  priceRange: 'budget' | 'mid' | 'premium' | 'luxury';
}

export interface ElectronicsModel {
  id: string;
  brandId: string;
  name: string;
  category: string;
  year?: number;
  specs: {
    // Common specs
    weight?: string;
    dimensions?: string;
    color?: string[];
    warranty?: string;
    // TV specs
    screenSize?: string;
    resolution?: string;
    panelType?: string;
    refreshRate?: string;
    smartTV?: boolean;
    hdmiPorts?: number;
    // Laptop/Computer specs
    processor?: string;
    ram?: string;
    storage?: string;
    graphicsCard?: string;
    displaySize?: string;
    batteryLife?: string;
    os?: string;
    // Smartphone/Tablet specs
    camera?: string;
    battery?: string;
    network?: string;
    // Audio specs
    power?: string;
    connectivity?: string[];
    drivers?: string;
    noiseCancellation?: boolean;
    // Gaming specs
    platform?: string;
    storageCapacity?: string;
  };
  estimatedPrice?: {
    min: number;
    max: number;
    currency: string;
  };
}

// ==================== BRANDS ====================

export const electronicsBrands: ElectronicsBrand[] = [
  // TVs & Displays
  { id: 'samsung', name: 'Samsung', country: 'South Korea', categories: ['tv', 'smartphone', 'tablet', 'audio', 'appliances'], priceRange: 'mid' },
  { id: 'lg', name: 'LG', country: 'South Korea', categories: ['tv', 'audio', 'appliances'], priceRange: 'mid' },
  { id: 'sony', name: 'Sony', country: 'Japan', categories: ['tv', 'audio', 'gaming', 'camera'], priceRange: 'premium' },
  { id: 'tcl', name: 'TCL', country: 'China', categories: ['tv'], priceRange: 'budget' },
  { id: 'hisense', name: 'Hisense', country: 'China', categories: ['tv', 'appliances'], priceRange: 'budget' },
  { id: 'philips', name: 'Philips', country: 'Netherlands', categories: ['tv', 'audio', 'appliances'], priceRange: 'mid' },
  { id: 'aoc', name: 'AOC', country: 'Taiwan', categories: ['tv', 'monitor'], priceRange: 'budget' },
  
  // Computers & Laptops
  { id: 'apple', name: 'Apple', country: 'USA', categories: ['laptop', 'smartphone', 'tablet', 'audio', 'watch'], priceRange: 'luxury' },
  { id: 'dell', name: 'Dell', country: 'USA', categories: ['laptop', 'desktop', 'monitor'], priceRange: 'mid' },
  { id: 'hp', name: 'HP', country: 'USA', categories: ['laptop', 'desktop', 'printer'], priceRange: 'mid' },
  { id: 'lenovo', name: 'Lenovo', country: 'China', categories: ['laptop', 'desktop', 'tablet'], priceRange: 'mid' },
  { id: 'asus', name: 'ASUS', country: 'Taiwan', categories: ['laptop', 'desktop', 'components', 'monitor'], priceRange: 'mid' },
  { id: 'acer', name: 'Acer', country: 'Taiwan', categories: ['laptop', 'desktop', 'monitor'], priceRange: 'budget' },
  { id: 'msi', name: 'MSI', country: 'Taiwan', categories: ['laptop', 'desktop', 'components'], priceRange: 'premium' },
  { id: 'razer', name: 'Razer', country: 'USA', categories: ['laptop', 'peripherals', 'audio'], priceRange: 'premium' },
  { id: 'alienware', name: 'Alienware', country: 'USA', categories: ['laptop', 'desktop'], priceRange: 'luxury' },
  { id: 'positivo', name: 'Positivo', country: 'Brazil', categories: ['laptop', 'desktop', 'tablet'], priceRange: 'budget' },
  { id: 'multilaser', name: 'Multilaser', country: 'Brazil', categories: ['laptop', 'tablet', 'audio', 'accessories'], priceRange: 'budget' },
  
  // Smartphones
  { id: 'xiaomi', name: 'Xiaomi', country: 'China', categories: ['smartphone', 'tablet', 'audio', 'accessories'], priceRange: 'budget' },
  { id: 'motorola', name: 'Motorola', country: 'USA', categories: ['smartphone'], priceRange: 'mid' },
  { id: 'realme', name: 'Realme', country: 'China', categories: ['smartphone', 'audio'], priceRange: 'budget' },
  { id: 'oppo', name: 'Oppo', country: 'China', categories: ['smartphone', 'audio'], priceRange: 'mid' },
  { id: 'oneplus', name: 'OnePlus', country: 'China', categories: ['smartphone', 'audio'], priceRange: 'premium' },
  { id: 'google', name: 'Google', country: 'USA', categories: ['smartphone', 'audio', 'smart-home'], priceRange: 'premium' },
  { id: 'nothing', name: 'Nothing', country: 'UK', categories: ['smartphone', 'audio'], priceRange: 'mid' },
  
  // Audio
  { id: 'jbl', name: 'JBL', country: 'USA', categories: ['audio'], priceRange: 'mid' },
  { id: 'bose', name: 'Bose', country: 'USA', categories: ['audio'], priceRange: 'premium' },
  { id: 'sennheiser', name: 'Sennheiser', country: 'Germany', categories: ['audio'], priceRange: 'premium' },
  { id: 'audio-technica', name: 'Audio-Technica', country: 'Japan', categories: ['audio'], priceRange: 'mid' },
  { id: 'edifier', name: 'Edifier', country: 'China', categories: ['audio'], priceRange: 'budget' },
  { id: 'harman-kardon', name: 'Harman Kardon', country: 'USA', categories: ['audio'], priceRange: 'premium' },
  { id: 'bang-olufsen', name: 'Bang & Olufsen', country: 'Denmark', categories: ['audio', 'tv'], priceRange: 'luxury' },
  { id: 'marshall', name: 'Marshall', country: 'UK', categories: ['audio'], priceRange: 'mid' },
  { id: 'beats', name: 'Beats', country: 'USA', categories: ['audio'], priceRange: 'premium' },
  
  // Gaming
  { id: 'nintendo', name: 'Nintendo', country: 'Japan', categories: ['gaming'], priceRange: 'mid' },
  { id: 'microsoft', name: 'Microsoft', country: 'USA', categories: ['gaming', 'laptop', 'tablet', 'accessories'], priceRange: 'mid' },
  { id: 'logitech', name: 'Logitech', country: 'Switzerland', categories: ['peripherals', 'audio'], priceRange: 'mid' },
  { id: 'steelseries', name: 'SteelSeries', country: 'Denmark', categories: ['peripherals', 'audio'], priceRange: 'mid' },
  { id: 'corsair', name: 'Corsair', country: 'USA', categories: ['peripherals', 'components'], priceRange: 'mid' },
  { id: 'hyperx', name: 'HyperX', country: 'USA', categories: ['peripherals', 'audio'], priceRange: 'mid' },
  
  // Cameras
  { id: 'canon', name: 'Canon', country: 'Japan', categories: ['camera', 'printer'], priceRange: 'mid' },
  { id: 'nikon', name: 'Nikon', country: 'Japan', categories: ['camera'], priceRange: 'mid' },
  { id: 'fujifilm', name: 'Fujifilm', country: 'Japan', categories: ['camera'], priceRange: 'premium' },
  { id: 'gopro', name: 'GoPro', country: 'USA', categories: ['camera'], priceRange: 'mid' },
  { id: 'dji', name: 'DJI', country: 'China', categories: ['camera', 'drone'], priceRange: 'premium' },
  { id: 'insta360', name: 'Insta360', country: 'China', categories: ['camera'], priceRange: 'mid' },
];

// ==================== MODELS ====================

export const electronicsModels: ElectronicsModel[] = [
  // ===== TVs =====
  // Samsung TVs
  { id: 'samsung-neo-qled-8k-qn900c', brandId: 'samsung', name: 'Neo QLED 8K QN900C', category: 'tv', year: 2023, specs: { screenSize: '65"', resolution: '8K', panelType: 'Neo QLED', refreshRate: '120Hz', smartTV: true, hdmiPorts: 4 }, estimatedPrice: { min: 15000, max: 25000, currency: 'BRL' } },
  { id: 'samsung-neo-qled-4k-qn90c', brandId: 'samsung', name: 'Neo QLED 4K QN90C', category: 'tv', year: 2023, specs: { screenSize: '55"', resolution: '4K', panelType: 'Neo QLED', refreshRate: '144Hz', smartTV: true, hdmiPorts: 4 }, estimatedPrice: { min: 5000, max: 9000, currency: 'BRL' } },
  { id: 'samsung-crystal-uhd-cu7000', brandId: 'samsung', name: 'Crystal UHD CU7000', category: 'tv', year: 2023, specs: { screenSize: '50"', resolution: '4K', panelType: 'LED', refreshRate: '60Hz', smartTV: true, hdmiPorts: 3 }, estimatedPrice: { min: 2000, max: 3500, currency: 'BRL' } },
  { id: 'samsung-the-frame-2023', brandId: 'samsung', name: 'The Frame 2023', category: 'tv', year: 2023, specs: { screenSize: '55"', resolution: '4K', panelType: 'QLED', refreshRate: '120Hz', smartTV: true, hdmiPorts: 4 }, estimatedPrice: { min: 5500, max: 8000, currency: 'BRL' } },
  
  // LG TVs
  { id: 'lg-oled-c3', brandId: 'lg', name: 'OLED evo C3', category: 'tv', year: 2023, specs: { screenSize: '55"', resolution: '4K', panelType: 'OLED', refreshRate: '120Hz', smartTV: true, hdmiPorts: 4 }, estimatedPrice: { min: 6000, max: 10000, currency: 'BRL' } },
  { id: 'lg-oled-g3', brandId: 'lg', name: 'OLED evo G3 Gallery', category: 'tv', year: 2023, specs: { screenSize: '65"', resolution: '4K', panelType: 'OLED', refreshRate: '120Hz', smartTV: true, hdmiPorts: 4 }, estimatedPrice: { min: 12000, max: 18000, currency: 'BRL' } },
  { id: 'lg-nanocell-nano76', brandId: 'lg', name: 'NanoCell NANO76', category: 'tv', year: 2023, specs: { screenSize: '50"', resolution: '4K', panelType: 'NanoCell', refreshRate: '60Hz', smartTV: true, hdmiPorts: 3 }, estimatedPrice: { min: 2500, max: 4000, currency: 'BRL' } },
  { id: 'lg-qned-mini-led', brandId: 'lg', name: 'QNED Mini LED', category: 'tv', year: 2023, specs: { screenSize: '65"', resolution: '4K', panelType: 'Mini LED', refreshRate: '120Hz', smartTV: true, hdmiPorts: 4 }, estimatedPrice: { min: 7000, max: 12000, currency: 'BRL' } },
  
  // Sony TVs
  { id: 'sony-bravia-xr-a95l', brandId: 'sony', name: 'BRAVIA XR A95L QD-OLED', category: 'tv', year: 2023, specs: { screenSize: '65"', resolution: '4K', panelType: 'QD-OLED', refreshRate: '120Hz', smartTV: true, hdmiPorts: 4 }, estimatedPrice: { min: 15000, max: 22000, currency: 'BRL' } },
  { id: 'sony-bravia-xr-x90l', brandId: 'sony', name: 'BRAVIA XR X90L', category: 'tv', year: 2023, specs: { screenSize: '55"', resolution: '4K', panelType: 'Full Array LED', refreshRate: '120Hz', smartTV: true, hdmiPorts: 4 }, estimatedPrice: { min: 5000, max: 8000, currency: 'BRL' } },
  
  // Budget TVs
  { id: 'tcl-p635', brandId: 'tcl', name: 'P635 4K Google TV', category: 'tv', year: 2023, specs: { screenSize: '50"', resolution: '4K', panelType: 'LED', refreshRate: '60Hz', smartTV: true, hdmiPorts: 3 }, estimatedPrice: { min: 1800, max: 2800, currency: 'BRL' } },
  { id: 'hisense-a6k', brandId: 'hisense', name: 'A6K 4K Smart TV', category: 'tv', year: 2023, specs: { screenSize: '55"', resolution: '4K', panelType: 'LED', refreshRate: '60Hz', smartTV: true, hdmiPorts: 3 }, estimatedPrice: { min: 2000, max: 3000, currency: 'BRL' } },
  
  // ===== Laptops =====
  // Apple Laptops
  { id: 'macbook-air-m3', brandId: 'apple', name: 'MacBook Air M3', category: 'laptop', year: 2024, specs: { processor: 'Apple M3', ram: '8GB/16GB/24GB', storage: '256GB/512GB/1TB', displaySize: '13.6"/15.3"', batteryLife: '18 hours', os: 'macOS Sonoma' }, estimatedPrice: { min: 8000, max: 16000, currency: 'BRL' } },
  { id: 'macbook-pro-14-m3-pro', brandId: 'apple', name: 'MacBook Pro 14" M3 Pro', category: 'laptop', year: 2023, specs: { processor: 'Apple M3 Pro', ram: '18GB/36GB', storage: '512GB/1TB/2TB', graphicsCard: 'Integrated 14-core GPU', displaySize: '14.2"', batteryLife: '17 hours', os: 'macOS Sonoma' }, estimatedPrice: { min: 15000, max: 28000, currency: 'BRL' } },
  { id: 'macbook-pro-16-m3-max', brandId: 'apple', name: 'MacBook Pro 16" M3 Max', category: 'laptop', year: 2023, specs: { processor: 'Apple M3 Max', ram: '36GB/48GB/128GB', storage: '1TB/2TB/4TB/8TB', graphicsCard: 'Integrated 40-core GPU', displaySize: '16.2"', batteryLife: '22 hours', os: 'macOS Sonoma' }, estimatedPrice: { min: 25000, max: 50000, currency: 'BRL' } },
  
  // Dell Laptops
  { id: 'dell-xps-15', brandId: 'dell', name: 'XPS 15 9530', category: 'laptop', year: 2023, specs: { processor: 'Intel Core i7-13700H', ram: '16GB/32GB', storage: '512GB/1TB', graphicsCard: 'NVIDIA RTX 4060', displaySize: '15.6"', batteryLife: '13 hours', os: 'Windows 11' }, estimatedPrice: { min: 10000, max: 18000, currency: 'BRL' } },
  { id: 'dell-inspiron-15', brandId: 'dell', name: 'Inspiron 15 3520', category: 'laptop', year: 2023, specs: { processor: 'Intel Core i5-1235U', ram: '8GB/16GB', storage: '256GB/512GB', displaySize: '15.6"', batteryLife: '8 hours', os: 'Windows 11' }, estimatedPrice: { min: 2500, max: 4500, currency: 'BRL' } },
  { id: 'dell-g15-gaming', brandId: 'dell', name: 'G15 Gaming', category: 'laptop', year: 2023, specs: { processor: 'AMD Ryzen 7 7840HS', ram: '16GB', storage: '512GB/1TB', graphicsCard: 'NVIDIA RTX 4060', displaySize: '15.6"', refreshRate: '165Hz', os: 'Windows 11' }, estimatedPrice: { min: 6000, max: 10000, currency: 'BRL' } },
  
  // Lenovo Laptops
  { id: 'lenovo-thinkpad-x1-carbon', brandId: 'lenovo', name: 'ThinkPad X1 Carbon Gen 11', category: 'laptop', year: 2023, specs: { processor: 'Intel Core i7-1365U', ram: '16GB/32GB', storage: '512GB/1TB', displaySize: '14"', batteryLife: '15 hours', os: 'Windows 11 Pro' }, estimatedPrice: { min: 12000, max: 20000, currency: 'BRL' } },
  { id: 'lenovo-ideapad-gaming-3', brandId: 'lenovo', name: 'IdeaPad Gaming 3', category: 'laptop', year: 2023, specs: { processor: 'AMD Ryzen 5 7535HS', ram: '8GB/16GB', storage: '512GB', graphicsCard: 'NVIDIA RTX 3050', displaySize: '15.6"', refreshRate: '120Hz', os: 'Windows 11' }, estimatedPrice: { min: 3500, max: 5500, currency: 'BRL' } },
  { id: 'lenovo-legion-5-pro', brandId: 'lenovo', name: 'Legion 5 Pro Gen 8', category: 'laptop', year: 2023, specs: { processor: 'AMD Ryzen 7 7745HX', ram: '16GB/32GB', storage: '1TB', graphicsCard: 'NVIDIA RTX 4070', displaySize: '16"', refreshRate: '240Hz', os: 'Windows 11' }, estimatedPrice: { min: 9000, max: 14000, currency: 'BRL' } },
  
  // ASUS Laptops
  { id: 'asus-rog-strix-g16', brandId: 'asus', name: 'ROG Strix G16', category: 'laptop', year: 2023, specs: { processor: 'Intel Core i9-13980HX', ram: '16GB/32GB', storage: '1TB', graphicsCard: 'NVIDIA RTX 4070', displaySize: '16"', refreshRate: '240Hz', os: 'Windows 11' }, estimatedPrice: { min: 10000, max: 16000, currency: 'BRL' } },
  { id: 'asus-zenbook-14', brandId: 'asus', name: 'ZenBook 14 OLED', category: 'laptop', year: 2023, specs: { processor: 'Intel Core i7-1360P', ram: '16GB', storage: '512GB/1TB', displaySize: '14"', batteryLife: '13 hours', os: 'Windows 11' }, estimatedPrice: { min: 6000, max: 9000, currency: 'BRL' } },
  { id: 'asus-vivobook-15', brandId: 'asus', name: 'VivoBook 15', category: 'laptop', year: 2023, specs: { processor: 'AMD Ryzen 5 5500U', ram: '8GB', storage: '256GB/512GB', displaySize: '15.6"', batteryLife: '8 hours', os: 'Windows 11' }, estimatedPrice: { min: 2200, max: 3500, currency: 'BRL' } },
  
  // Gaming Laptops
  { id: 'msi-katana-15', brandId: 'msi', name: 'Katana 15', category: 'laptop', year: 2023, specs: { processor: 'Intel Core i7-13620H', ram: '16GB', storage: '512GB/1TB', graphicsCard: 'NVIDIA RTX 4060', displaySize: '15.6"', refreshRate: '144Hz', os: 'Windows 11' }, estimatedPrice: { min: 6500, max: 9500, currency: 'BRL' } },
  { id: 'razer-blade-15', brandId: 'razer', name: 'Blade 15', category: 'laptop', year: 2023, specs: { processor: 'Intel Core i7-13800H', ram: '16GB/32GB', storage: '1TB', graphicsCard: 'NVIDIA RTX 4070', displaySize: '15.6"', refreshRate: '360Hz', os: 'Windows 11' }, estimatedPrice: { min: 15000, max: 22000, currency: 'BRL' } },
  { id: 'alienware-m16', brandId: 'alienware', name: 'M16 Gaming', category: 'laptop', year: 2023, specs: { processor: 'Intel Core i9-13900HX', ram: '32GB', storage: '1TB/2TB', graphicsCard: 'NVIDIA RTX 4080', displaySize: '16"', refreshRate: '240Hz', os: 'Windows 11' }, estimatedPrice: { min: 18000, max: 28000, currency: 'BRL' } },
  
  // Budget Laptops (Brazil)
  { id: 'positivo-motion-q4128c', brandId: 'positivo', name: 'Motion Q4128C', category: 'laptop', year: 2023, specs: { processor: 'Intel Celeron N4020', ram: '4GB', storage: '128GB eMMC', displaySize: '14"', batteryLife: '6 hours', os: 'Windows 11' }, estimatedPrice: { min: 1200, max: 1800, currency: 'BRL' } },
  { id: 'multilaser-legacy-pc130', brandId: 'multilaser', name: 'Legacy PC130', category: 'laptop', year: 2023, specs: { processor: 'Intel Celeron N3350', ram: '4GB', storage: '64GB eMMC', displaySize: '14.1"', batteryLife: '5 hours', os: 'Windows 11' }, estimatedPrice: { min: 1000, max: 1500, currency: 'BRL' } },
  
  // ===== Smartphones =====
  // Apple iPhones
  { id: 'iphone-15-pro-max', brandId: 'apple', name: 'iPhone 15 Pro Max', category: 'smartphone', year: 2023, specs: { displaySize: '6.7"', processor: 'A17 Pro', ram: '8GB', storage: '256GB/512GB/1TB', camera: '48MP + 12MP + 12MP', battery: '4422mAh', network: '5G' }, estimatedPrice: { min: 9000, max: 14000, currency: 'BRL' } },
  { id: 'iphone-15', brandId: 'apple', name: 'iPhone 15', category: 'smartphone', year: 2023, specs: { displaySize: '6.1"', processor: 'A16 Bionic', ram: '6GB', storage: '128GB/256GB/512GB', camera: '48MP + 12MP', battery: '3349mAh', network: '5G' }, estimatedPrice: { min: 5500, max: 8000, currency: 'BRL' } },
  { id: 'iphone-14', brandId: 'apple', name: 'iPhone 14', category: 'smartphone', year: 2022, specs: { displaySize: '6.1"', processor: 'A15 Bionic', ram: '6GB', storage: '128GB/256GB/512GB', camera: '12MP + 12MP', battery: '3279mAh', network: '5G' }, estimatedPrice: { min: 4500, max: 6500, currency: 'BRL' } },
  
  // Samsung Smartphones
  { id: 'samsung-galaxy-s24-ultra', brandId: 'samsung', name: 'Galaxy S24 Ultra', category: 'smartphone', year: 2024, specs: { displaySize: '6.8"', processor: 'Snapdragon 8 Gen 3', ram: '12GB', storage: '256GB/512GB/1TB', camera: '200MP + 50MP + 12MP + 10MP', battery: '5000mAh', network: '5G' }, estimatedPrice: { min: 8000, max: 12000, currency: 'BRL' } },
  { id: 'samsung-galaxy-s24', brandId: 'samsung', name: 'Galaxy S24', category: 'smartphone', year: 2024, specs: { displaySize: '6.2"', processor: 'Exynos 2400', ram: '8GB', storage: '128GB/256GB', camera: '50MP + 12MP + 10MP', battery: '4000mAh', network: '5G' }, estimatedPrice: { min: 4500, max: 6500, currency: 'BRL' } },
  { id: 'samsung-galaxy-a54', brandId: 'samsung', name: 'Galaxy A54 5G', category: 'smartphone', year: 2023, specs: { displaySize: '6.4"', processor: 'Exynos 1380', ram: '8GB', storage: '128GB/256GB', camera: '50MP + 12MP + 5MP', battery: '5000mAh', network: '5G' }, estimatedPrice: { min: 2000, max: 3000, currency: 'BRL' } },
  { id: 'samsung-galaxy-z-fold5', brandId: 'samsung', name: 'Galaxy Z Fold5', category: 'smartphone', year: 2023, specs: { displaySize: '7.6" (folded: 6.2")', processor: 'Snapdragon 8 Gen 2', ram: '12GB', storage: '256GB/512GB/1TB', camera: '50MP + 12MP + 10MP', battery: '4400mAh', network: '5G' }, estimatedPrice: { min: 9000, max: 14000, currency: 'BRL' } },
  
  // Xiaomi Smartphones
  { id: 'xiaomi-14-ultra', brandId: 'xiaomi', name: '14 Ultra', category: 'smartphone', year: 2024, specs: { displaySize: '6.73"', processor: 'Snapdragon 8 Gen 3', ram: '16GB', storage: '512GB/1TB', camera: '50MP + 50MP + 50MP + 50MP (Leica)', battery: '5300mAh', network: '5G' }, estimatedPrice: { min: 7000, max: 10000, currency: 'BRL' } },
  { id: 'xiaomi-redmi-note-13-pro', brandId: 'xiaomi', name: 'Redmi Note 13 Pro', category: 'smartphone', year: 2024, specs: { displaySize: '6.67"', processor: 'Snapdragon 7s Gen 2', ram: '8GB/12GB', storage: '256GB/512GB', camera: '200MP + 8MP + 2MP', battery: '5100mAh', network: '5G' }, estimatedPrice: { min: 1800, max: 2800, currency: 'BRL' } },
  { id: 'xiaomi-poco-x6-pro', brandId: 'xiaomi', name: 'POCO X6 Pro', category: 'smartphone', year: 2024, specs: { displaySize: '6.67"', processor: 'Dimensity 8300 Ultra', ram: '8GB/12GB', storage: '256GB/512GB', camera: '64MP + 8MP + 2MP', battery: '5000mAh', network: '5G' }, estimatedPrice: { min: 2000, max: 3000, currency: 'BRL' } },
  
  // Motorola Smartphones
  { id: 'motorola-edge-40-pro', brandId: 'motorola', name: 'Edge 40 Pro', category: 'smartphone', year: 2023, specs: { displaySize: '6.67"', processor: 'Snapdragon 8 Gen 2', ram: '12GB', storage: '256GB', camera: '50MP + 50MP + 12MP', battery: '4600mAh', network: '5G' }, estimatedPrice: { min: 4000, max: 5500, currency: 'BRL' } },
  { id: 'motorola-moto-g84', brandId: 'motorola', name: 'Moto G84 5G', category: 'smartphone', year: 2023, specs: { displaySize: '6.55"', processor: 'Snapdragon 695', ram: '8GB', storage: '256GB', camera: '50MP + 8MP', battery: '5000mAh', network: '5G' }, estimatedPrice: { min: 1500, max: 2200, currency: 'BRL' } },
  
  // ===== Tablets =====
  // Apple iPads
  { id: 'ipad-pro-12.9-m2', brandId: 'apple', name: 'iPad Pro 12.9" M2', category: 'tablet', year: 2022, specs: { displaySize: '12.9"', processor: 'Apple M2', ram: '8GB/16GB', storage: '128GB/256GB/512GB/1TB/2TB', camera: '12MP + 10MP', battery: '10 hours', network: 'WiFi/5G' }, estimatedPrice: { min: 9000, max: 18000, currency: 'BRL' } },
  { id: 'ipad-air-m1', brandId: 'apple', name: 'iPad Air M1', category: 'tablet', year: 2022, specs: { displaySize: '10.9"', processor: 'Apple M1', ram: '8GB', storage: '64GB/256GB', camera: '12MP', battery: '10 hours', network: 'WiFi/5G' }, estimatedPrice: { min: 4500, max: 7000, currency: 'BRL' } },
  { id: 'ipad-10th-gen', brandId: 'apple', name: 'iPad 10th Generation', category: 'tablet', year: 2022, specs: { displaySize: '10.9"', processor: 'A14 Bionic', ram: '4GB', storage: '64GB/256GB', camera: '12MP', battery: '10 hours', network: 'WiFi/5G' }, estimatedPrice: { min: 3500, max: 5500, currency: 'BRL' } },
  
  // Samsung Tablets
  { id: 'samsung-galaxy-tab-s9-ultra', brandId: 'samsung', name: 'Galaxy Tab S9 Ultra', category: 'tablet', year: 2023, specs: { displaySize: '14.6"', processor: 'Snapdragon 8 Gen 2', ram: '12GB/16GB', storage: '256GB/512GB/1TB', camera: '13MP + 8MP', battery: '11200mAh', network: 'WiFi/5G' }, estimatedPrice: { min: 8000, max: 13000, currency: 'BRL' } },
  { id: 'samsung-galaxy-tab-s9', brandId: 'samsung', name: 'Galaxy Tab S9', category: 'tablet', year: 2023, specs: { displaySize: '11"', processor: 'Snapdragon 8 Gen 2', ram: '8GB/12GB', storage: '128GB/256GB', camera: '13MP', battery: '8400mAh', network: 'WiFi/5G' }, estimatedPrice: { min: 5000, max: 7500, currency: 'BRL' } },
  { id: 'samsung-galaxy-tab-a9-plus', brandId: 'samsung', name: 'Galaxy Tab A9+', category: 'tablet', year: 2023, specs: { displaySize: '11"', processor: 'Snapdragon 695', ram: '4GB/8GB', storage: '64GB/128GB', camera: '8MP', battery: '7040mAh', network: 'WiFi/LTE' }, estimatedPrice: { min: 1500, max: 2500, currency: 'BRL' } },
  
  // ===== Audio =====
  // Headphones
  { id: 'apple-airpods-pro-2', brandId: 'apple', name: 'AirPods Pro (2nd Gen)', category: 'audio', year: 2023, specs: { connectivity: ['Bluetooth 5.3'], noiseCancellation: true, batteryLife: '6 hours (30h with case)' }, estimatedPrice: { min: 1800, max: 2500, currency: 'BRL' } },
  { id: 'apple-airpods-max', brandId: 'apple', name: 'AirPods Max', category: 'audio', year: 2020, specs: { connectivity: ['Bluetooth 5.0'], drivers: '40mm', noiseCancellation: true, batteryLife: '20 hours' }, estimatedPrice: { min: 4500, max: 6000, currency: 'BRL' } },
  { id: 'sony-wh-1000xm5', brandId: 'sony', name: 'WH-1000XM5', category: 'audio', year: 2022, specs: { connectivity: ['Bluetooth 5.2', '3.5mm'], drivers: '30mm', noiseCancellation: true, batteryLife: '30 hours' }, estimatedPrice: { min: 2500, max: 3500, currency: 'BRL' } },
  { id: 'bose-qc-ultra', brandId: 'bose', name: 'QuietComfort Ultra', category: 'audio', year: 2023, specs: { connectivity: ['Bluetooth 5.3', '3.5mm'], noiseCancellation: true, batteryLife: '24 hours' }, estimatedPrice: { min: 3000, max: 4000, currency: 'BRL' } },
  { id: 'sennheiser-momentum-4', brandId: 'sennheiser', name: 'Momentum 4 Wireless', category: 'audio', year: 2022, specs: { connectivity: ['Bluetooth 5.2', '3.5mm'], drivers: '42mm', noiseCancellation: true, batteryLife: '60 hours' }, estimatedPrice: { min: 2800, max: 3800, currency: 'BRL' } },
  
  // Speakers
  { id: 'jbl-flip-6', brandId: 'jbl', name: 'Flip 6', category: 'audio', year: 2022, specs: { power: '30W', connectivity: ['Bluetooth 5.1'], weight: '550g', batteryLife: '12 hours' }, estimatedPrice: { min: 600, max: 900, currency: 'BRL' } },
  { id: 'jbl-charge-5', brandId: 'jbl', name: 'Charge 5', category: 'audio', year: 2021, specs: { power: '40W', connectivity: ['Bluetooth 5.1'], weight: '960g', batteryLife: '20 hours' }, estimatedPrice: { min: 800, max: 1200, currency: 'BRL' } },
  { id: 'jbl-partybox-310', brandId: 'jbl', name: 'PartyBox 310', category: 'audio', year: 2020, specs: { power: '240W', connectivity: ['Bluetooth', 'USB', 'AUX', 'Mic'], weight: '17.4kg', batteryLife: '18 hours' }, estimatedPrice: { min: 3000, max: 4500, currency: 'BRL' } },
  { id: 'marshall-stanmore-iii', brandId: 'marshall', name: 'Stanmore III', category: 'audio', year: 2023, specs: { power: '80W', connectivity: ['Bluetooth 5.2', 'RCA', '3.5mm'], weight: '4.65kg' }, estimatedPrice: { min: 2800, max: 3800, currency: 'BRL' } },
  
  // ===== Gaming =====
  // Consoles
  { id: 'ps5-standard', brandId: 'sony', name: 'PlayStation 5 Standard', category: 'gaming', year: 2020, specs: { storageCapacity: '825GB SSD', platform: 'PS5' }, estimatedPrice: { min: 3500, max: 5000, currency: 'BRL' } },
  { id: 'ps5-digital', brandId: 'sony', name: 'PlayStation 5 Digital', category: 'gaming', year: 2020, specs: { storageCapacity: '825GB SSD', platform: 'PS5' }, estimatedPrice: { min: 3000, max: 4000, currency: 'BRL' } },
  { id: 'xbox-series-x', brandId: 'microsoft', name: 'Xbox Series X', category: 'gaming', year: 2020, specs: { storageCapacity: '1TB SSD', platform: 'Xbox' }, estimatedPrice: { min: 3500, max: 5000, currency: 'BRL' } },
  { id: 'xbox-series-s', brandId: 'microsoft', name: 'Xbox Series S', category: 'gaming', year: 2020, specs: { storageCapacity: '512GB SSD', platform: 'Xbox' }, estimatedPrice: { min: 2000, max: 3000, currency: 'BRL' } },
  { id: 'nintendo-switch-oled', brandId: 'nintendo', name: 'Switch OLED', category: 'gaming', year: 2021, specs: { displaySize: '7"', storageCapacity: '64GB', platform: 'Nintendo Switch' }, estimatedPrice: { min: 2500, max: 3500, currency: 'BRL' } },
  { id: 'nintendo-switch-lite', brandId: 'nintendo', name: 'Switch Lite', category: 'gaming', year: 2019, specs: { displaySize: '5.5"', storageCapacity: '32GB', platform: 'Nintendo Switch' }, estimatedPrice: { min: 1500, max: 2200, currency: 'BRL' } },
  
  // ===== Cameras =====
  { id: 'canon-eos-r6-ii', brandId: 'canon', name: 'EOS R6 Mark II', category: 'camera', year: 2022, specs: { resolution: '24.2MP', processor: 'DIGIC X', displaySize: '3"' }, estimatedPrice: { min: 15000, max: 20000, currency: 'BRL' } },
  { id: 'sony-a7-iv', brandId: 'sony', name: 'Alpha 7 IV', category: 'camera', year: 2021, specs: { resolution: '33MP', processor: 'BIONZ XR', displaySize: '3"' }, estimatedPrice: { min: 14000, max: 18000, currency: 'BRL' } },
  { id: 'nikon-z8', brandId: 'nikon', name: 'Z8', category: 'camera', year: 2023, specs: { resolution: '45.7MP', processor: 'EXPEED 7', displaySize: '3.2"' }, estimatedPrice: { min: 25000, max: 32000, currency: 'BRL' } },
  { id: 'fujifilm-x-t5', brandId: 'fujifilm', name: 'X-T5', category: 'camera', year: 2022, specs: { resolution: '40.2MP', processor: 'X-Processor 5', displaySize: '3"' }, estimatedPrice: { min: 12000, max: 16000, currency: 'BRL' } },
  { id: 'gopro-hero12', brandId: 'gopro', name: 'HERO12 Black', category: 'camera', year: 2023, specs: { resolution: '27MP (5.3K video)', weight: '154g' }, estimatedPrice: { min: 2500, max: 3500, currency: 'BRL' } },
  { id: 'dji-osmo-action-4', brandId: 'dji', name: 'Osmo Action 4', category: 'camera', year: 2023, specs: { resolution: '4K 120fps', weight: '145g' }, estimatedPrice: { min: 2800, max: 3800, currency: 'BRL' } },
  { id: 'dji-mavic-3-pro', brandId: 'dji', name: 'Mavic 3 Pro', category: 'drone', year: 2023, specs: { camera: 'Hasselblad 4/3 CMOS', batteryLife: '43 min' }, estimatedPrice: { min: 12000, max: 18000, currency: 'BRL' } },
];

// Helper functions
export const getElectronicsBrandsByCategory = (category: string): ElectronicsBrand[] => {
  return electronicsBrands.filter(brand => brand.categories.includes(category));
};

export const getElectronicsModelsByBrand = (brandId: string): ElectronicsModel[] => {
  return electronicsModels.filter(model => model.brandId === brandId);
};

export const getElectronicsModelsByCategory = (category: string): ElectronicsModel[] => {
  return electronicsModels.filter(model => model.category === category);
};

export const getElectronicsModelById = (modelId: string): ElectronicsModel | undefined => {
  return electronicsModels.find(model => model.id === modelId);
};

export const getElectronicsBrandById = (brandId: string): ElectronicsBrand | undefined => {
  return electronicsBrands.find(brand => brand.id === brandId);
};

// Category labels for UI
export const electronicsCategories = [
  { id: 'tv', name: 'TVs & Monitors', icon: 'Monitor' },
  { id: 'laptop', name: 'Laptops', icon: 'Laptop' },
  { id: 'desktop', name: 'Desktops', icon: 'Monitor' },
  { id: 'smartphone', name: 'Smartphones', icon: 'Smartphone' },
  { id: 'tablet', name: 'Tablets', icon: 'Tablet' },
  { id: 'audio', name: 'Audio', icon: 'Headphones' },
  { id: 'gaming', name: 'Gaming', icon: 'Gamepad2' },
  { id: 'camera', name: 'Cameras', icon: 'Camera' },
  { id: 'drone', name: 'Drones', icon: 'Plane' },
  { id: 'peripherals', name: 'Peripherals', icon: 'Keyboard' },
  { id: 'components', name: 'Components', icon: 'Cpu' },
  { id: 'smart-home', name: 'Smart Home', icon: 'Home' },
];
