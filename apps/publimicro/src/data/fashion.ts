// Fashion Database - Clothing, Footwear, Accessories
// Smart auto-fill data for Tudo marketplace

export interface FashionBrand {
  id: string;
  name: string;
  country: string;
  categories: string[];
  priceRange: 'budget' | 'mid' | 'premium' | 'luxury';
  style: 'casual' | 'formal' | 'sport' | 'streetwear' | 'luxury' | 'basics';
}

export interface FashionProduct {
  id: string;
  brandId: string;
  name: string;
  category: string;
  subcategory: string;
  gender: 'men' | 'women' | 'unisex' | 'kids';
  specs: {
    material?: string[];
    sizes?: string[];
    colors?: string[];
    fit?: string;
    occasion?: string[];
    season?: string[];
    care?: string[];
  };
  estimatedPrice?: {
    min: number;
    max: number;
    currency: string;
  };
}

// ==================== BRANDS ====================

export const fashionBrands: FashionBrand[] = [
  // Brazilian Brands
  { id: 'havaianas', name: 'Havaianas', country: 'Brazil', categories: ['footwear', 'accessories'], priceRange: 'budget', style: 'casual' },
  { id: 'hering', name: 'Hering', country: 'Brazil', categories: ['clothing'], priceRange: 'budget', style: 'basics' },
  { id: 'farm', name: 'Farm Rio', country: 'Brazil', categories: ['clothing', 'accessories'], priceRange: 'mid', style: 'casual' },
  { id: 'osklen', name: 'Osklen', country: 'Brazil', categories: ['clothing', 'footwear'], priceRange: 'premium', style: 'casual' },
  { id: 'animale', name: 'Animale', country: 'Brazil', categories: ['clothing'], priceRange: 'premium', style: 'formal' },
  { id: 'arezzo', name: 'Arezzo', country: 'Brazil', categories: ['footwear', 'bags'], priceRange: 'mid', style: 'formal' },
  { id: 'melissa', name: 'Melissa', country: 'Brazil', categories: ['footwear'], priceRange: 'mid', style: 'casual' },
  { id: 'reserva', name: 'Reserva', country: 'Brazil', categories: ['clothing'], priceRange: 'mid', style: 'casual' },
  { id: 'riachuelo', name: 'Riachuelo', country: 'Brazil', categories: ['clothing', 'footwear', 'accessories'], priceRange: 'budget', style: 'basics' },
  { id: 'renner', name: 'Renner', country: 'Brazil', categories: ['clothing', 'footwear', 'accessories'], priceRange: 'budget', style: 'basics' },
  { id: 'cea', name: 'C&A', country: 'Brazil', categories: ['clothing', 'footwear', 'accessories'], priceRange: 'budget', style: 'basics' },
  { id: 'marisa', name: 'Marisa', country: 'Brazil', categories: ['clothing', 'lingerie'], priceRange: 'budget', style: 'basics' },
  { id: 'olympikus', name: 'Olympikus', country: 'Brazil', categories: ['footwear', 'sportswear'], priceRange: 'budget', style: 'sport' },
  { id: 'schutz', name: 'Schutz', country: 'Brazil', categories: ['footwear', 'bags'], priceRange: 'premium', style: 'formal' },
  { id: 'dumond', name: 'Dumond', country: 'Brazil', categories: ['footwear', 'bags'], priceRange: 'mid', style: 'formal' },
  { id: 'santa-lolla', name: 'Santa Lolla', country: 'Brazil', categories: ['footwear', 'bags'], priceRange: 'mid', style: 'casual' },
  { id: 'morena-rosa', name: 'Morena Rosa', country: 'Brazil', categories: ['clothing'], priceRange: 'mid', style: 'casual' },
  { id: 'colcci', name: 'Colcci', country: 'Brazil', categories: ['clothing', 'jeans'], priceRange: 'mid', style: 'casual' },
  { id: 'ellus', name: 'Ellus', country: 'Brazil', categories: ['clothing', 'jeans'], priceRange: 'mid', style: 'casual' },
  { id: 'levis-brazil', name: "Levi's", country: 'USA', categories: ['clothing', 'jeans'], priceRange: 'mid', style: 'casual' },
  
  // International Sports/Casual
  { id: 'nike', name: 'Nike', country: 'USA', categories: ['footwear', 'sportswear', 'accessories'], priceRange: 'mid', style: 'sport' },
  { id: 'adidas', name: 'Adidas', country: 'Germany', categories: ['footwear', 'sportswear', 'accessories'], priceRange: 'mid', style: 'sport' },
  { id: 'puma', name: 'Puma', country: 'Germany', categories: ['footwear', 'sportswear'], priceRange: 'mid', style: 'sport' },
  { id: 'new-balance', name: 'New Balance', country: 'USA', categories: ['footwear', 'sportswear'], priceRange: 'mid', style: 'sport' },
  { id: 'asics', name: 'ASICS', country: 'Japan', categories: ['footwear', 'sportswear'], priceRange: 'mid', style: 'sport' },
  { id: 'reebok', name: 'Reebok', country: 'USA', categories: ['footwear', 'sportswear'], priceRange: 'mid', style: 'sport' },
  { id: 'under-armour', name: 'Under Armour', country: 'USA', categories: ['sportswear', 'footwear'], priceRange: 'mid', style: 'sport' },
  { id: 'mizuno', name: 'Mizuno', country: 'Japan', categories: ['footwear', 'sportswear'], priceRange: 'mid', style: 'sport' },
  { id: 'fila', name: 'Fila', country: 'Italy', categories: ['footwear', 'sportswear'], priceRange: 'budget', style: 'sport' },
  { id: 'vans', name: 'Vans', country: 'USA', categories: ['footwear', 'clothing'], priceRange: 'mid', style: 'streetwear' },
  { id: 'converse', name: 'Converse', country: 'USA', categories: ['footwear'], priceRange: 'mid', style: 'casual' },
  
  // Fast Fashion International
  { id: 'zara', name: 'Zara', country: 'Spain', categories: ['clothing', 'footwear', 'accessories'], priceRange: 'mid', style: 'casual' },
  { id: 'hm', name: 'H&M', country: 'Sweden', categories: ['clothing', 'accessories'], priceRange: 'budget', style: 'basics' },
  { id: 'forever21', name: 'Forever 21', country: 'USA', categories: ['clothing', 'accessories'], priceRange: 'budget', style: 'casual' },
  { id: 'shein', name: 'SHEIN', country: 'China', categories: ['clothing', 'accessories'], priceRange: 'budget', style: 'casual' },
  { id: 'uniqlo', name: 'Uniqlo', country: 'Japan', categories: ['clothing'], priceRange: 'budget', style: 'basics' },
  { id: 'gap', name: 'GAP', country: 'USA', categories: ['clothing'], priceRange: 'mid', style: 'casual' },
  
  // Premium/Luxury
  { id: 'lacoste', name: 'Lacoste', country: 'France', categories: ['clothing', 'footwear', 'accessories'], priceRange: 'premium', style: 'casual' },
  { id: 'tommy-hilfiger', name: 'Tommy Hilfiger', country: 'USA', categories: ['clothing', 'footwear', 'accessories'], priceRange: 'premium', style: 'casual' },
  { id: 'calvin-klein', name: 'Calvin Klein', country: 'USA', categories: ['clothing', 'underwear', 'accessories'], priceRange: 'premium', style: 'casual' },
  { id: 'ralph-lauren', name: 'Ralph Lauren', country: 'USA', categories: ['clothing', 'accessories'], priceRange: 'premium', style: 'casual' },
  { id: 'hugo-boss', name: 'Hugo Boss', country: 'Germany', categories: ['clothing', 'footwear', 'accessories'], priceRange: 'premium', style: 'formal' },
  { id: 'armani', name: 'Armani', country: 'Italy', categories: ['clothing', 'accessories'], priceRange: 'luxury', style: 'formal' },
  { id: 'gucci', name: 'Gucci', country: 'Italy', categories: ['clothing', 'footwear', 'bags', 'accessories'], priceRange: 'luxury', style: 'luxury' },
  { id: 'louis-vuitton', name: 'Louis Vuitton', country: 'France', categories: ['bags', 'clothing', 'footwear', 'accessories'], priceRange: 'luxury', style: 'luxury' },
  { id: 'prada', name: 'Prada', country: 'Italy', categories: ['bags', 'clothing', 'footwear'], priceRange: 'luxury', style: 'luxury' },
  { id: 'burberry', name: 'Burberry', country: 'UK', categories: ['clothing', 'bags', 'accessories'], priceRange: 'luxury', style: 'luxury' },
  { id: 'balenciaga', name: 'Balenciaga', country: 'Spain', categories: ['clothing', 'footwear', 'bags'], priceRange: 'luxury', style: 'luxury' },
  { id: 'versace', name: 'Versace', country: 'Italy', categories: ['clothing', 'accessories'], priceRange: 'luxury', style: 'luxury' },
  { id: 'dolce-gabbana', name: 'Dolce & Gabbana', country: 'Italy', categories: ['clothing', 'accessories'], priceRange: 'luxury', style: 'luxury' },
  
  // Watches
  { id: 'rolex', name: 'Rolex', country: 'Switzerland', categories: ['watches'], priceRange: 'luxury', style: 'luxury' },
  { id: 'omega', name: 'Omega', country: 'Switzerland', categories: ['watches'], priceRange: 'luxury', style: 'luxury' },
  { id: 'tag-heuer', name: 'TAG Heuer', country: 'Switzerland', categories: ['watches'], priceRange: 'premium', style: 'luxury' },
  { id: 'casio', name: 'Casio', country: 'Japan', categories: ['watches'], priceRange: 'budget', style: 'casual' },
  { id: 'fossil', name: 'Fossil', country: 'USA', categories: ['watches', 'bags'], priceRange: 'mid', style: 'casual' },
  { id: 'orient', name: 'Orient', country: 'Japan', categories: ['watches'], priceRange: 'mid', style: 'formal' },
  { id: 'technos', name: 'Technos', country: 'Brazil', categories: ['watches'], priceRange: 'mid', style: 'casual' },
  { id: 'mondaine', name: 'Mondaine', country: 'Brazil', categories: ['watches'], priceRange: 'budget', style: 'casual' },
  
  // Eyewear
  { id: 'ray-ban', name: 'Ray-Ban', country: 'Italy', categories: ['eyewear'], priceRange: 'mid', style: 'casual' },
  { id: 'oakley', name: 'Oakley', country: 'USA', categories: ['eyewear', 'sportswear'], priceRange: 'mid', style: 'sport' },
  { id: 'chilli-beans', name: 'Chilli Beans', country: 'Brazil', categories: ['eyewear', 'watches'], priceRange: 'budget', style: 'casual' },
  
  // Lingerie & Underwear
  { id: 'hope', name: 'Hope', country: 'Brazil', categories: ['lingerie', 'underwear'], priceRange: 'mid', style: 'basics' },
  { id: 'loungerie', name: 'Loungerie', country: 'Brazil', categories: ['lingerie'], priceRange: 'mid', style: 'casual' },
  { id: 'lupo', name: 'Lupo', country: 'Brazil', categories: ['underwear', 'socks'], priceRange: 'budget', style: 'basics' },
  { id: 'victorias-secret', name: "Victoria's Secret", country: 'USA', categories: ['lingerie', 'beauty'], priceRange: 'mid', style: 'casual' },
  { id: 'la-perla', name: 'La Perla', country: 'Italy', categories: ['lingerie'], priceRange: 'luxury', style: 'luxury' },
];

// ==================== PRODUCTS ====================

export const fashionProducts: FashionProduct[] = [
  // ===== Footwear - Sneakers =====
  { id: 'nike-air-max-90', brandId: 'nike', name: 'Air Max 90', category: 'footwear', subcategory: 'sneakers', gender: 'unisex', specs: { material: ['Leather', 'Mesh', 'Rubber'], sizes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'], colors: ['White', 'Black', 'Red', 'Blue', 'Multi'], fit: 'Regular', occasion: ['Casual', 'Sport'], season: ['All Year'] }, estimatedPrice: { min: 600, max: 1000, currency: 'BRL' } },
  { id: 'nike-air-force-1', brandId: 'nike', name: 'Air Force 1', category: 'footwear', subcategory: 'sneakers', gender: 'unisex', specs: { material: ['Leather', 'Rubber'], sizes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'], colors: ['White', 'Black', 'Multi'], fit: 'Regular', occasion: ['Casual'], season: ['All Year'] }, estimatedPrice: { min: 700, max: 1200, currency: 'BRL' } },
  { id: 'nike-jordan-1', brandId: 'nike', name: 'Air Jordan 1 Retro', category: 'footwear', subcategory: 'sneakers', gender: 'unisex', specs: { material: ['Leather', 'Rubber'], sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'], colors: ['Chicago', 'Bred', 'Royal', 'Shadow'], fit: 'Regular', occasion: ['Casual', 'Streetwear'], season: ['All Year'] }, estimatedPrice: { min: 1200, max: 2500, currency: 'BRL' } },
  { id: 'nike-dunk-low', brandId: 'nike', name: 'Dunk Low', category: 'footwear', subcategory: 'sneakers', gender: 'unisex', specs: { material: ['Leather', 'Rubber'], sizes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'], colors: ['Panda', 'University Red', 'Georgetown'], fit: 'Regular', occasion: ['Casual'], season: ['All Year'] }, estimatedPrice: { min: 800, max: 1500, currency: 'BRL' } },
  
  { id: 'adidas-ultraboost', brandId: 'adidas', name: 'Ultraboost 23', category: 'footwear', subcategory: 'running', gender: 'unisex', specs: { material: ['Primeknit', 'Boost Foam', 'Continental Rubber'], sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'], colors: ['Black', 'White', 'Blue', 'Multi'], fit: 'Snug', occasion: ['Running', 'Casual'], season: ['All Year'] }, estimatedPrice: { min: 800, max: 1300, currency: 'BRL' } },
  { id: 'adidas-stan-smith', brandId: 'adidas', name: 'Stan Smith', category: 'footwear', subcategory: 'sneakers', gender: 'unisex', specs: { material: ['Leather', 'Rubber'], sizes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'], colors: ['White/Green', 'White/Navy', 'All White'], fit: 'Regular', occasion: ['Casual'], season: ['All Year'] }, estimatedPrice: { min: 500, max: 800, currency: 'BRL' } },
  { id: 'adidas-superstar', brandId: 'adidas', name: 'Superstar', category: 'footwear', subcategory: 'sneakers', gender: 'unisex', specs: { material: ['Leather', 'Rubber Shell Toe'], sizes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'], colors: ['White/Black', 'All White', 'All Black'], fit: 'Regular', occasion: ['Casual'], season: ['All Year'] }, estimatedPrice: { min: 450, max: 700, currency: 'BRL' } },
  
  { id: 'vans-old-skool', brandId: 'vans', name: 'Old Skool', category: 'footwear', subcategory: 'sneakers', gender: 'unisex', specs: { material: ['Canvas', 'Suede', 'Rubber'], sizes: ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44'], colors: ['Black/White', 'Navy', 'Checkerboard'], fit: 'Regular', occasion: ['Casual', 'Skateboarding'], season: ['All Year'] }, estimatedPrice: { min: 350, max: 550, currency: 'BRL' } },
  { id: 'converse-chuck-taylor', brandId: 'converse', name: 'Chuck Taylor All Star', category: 'footwear', subcategory: 'sneakers', gender: 'unisex', specs: { material: ['Canvas', 'Rubber'], sizes: ['33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44'], colors: ['Black', 'White', 'Red', 'Navy'], fit: 'Regular', occasion: ['Casual'], season: ['All Year'] }, estimatedPrice: { min: 300, max: 500, currency: 'BRL' } },
  
  { id: 'new-balance-574', brandId: 'new-balance', name: '574', category: 'footwear', subcategory: 'sneakers', gender: 'unisex', specs: { material: ['Suede', 'Mesh', 'ENCAP Midsole'], sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'], colors: ['Grey', 'Navy', 'Green', 'Burgundy'], fit: 'Regular', occasion: ['Casual'], season: ['All Year'] }, estimatedPrice: { min: 500, max: 900, currency: 'BRL' } },
  
  // ===== Footwear - Sandals =====
  { id: 'havaianas-tradicional', brandId: 'havaianas', name: 'Top', category: 'footwear', subcategory: 'sandals', gender: 'unisex', specs: { material: ['Rubber'], sizes: ['33/34', '35/36', '37/38', '39/40', '41/42', '43/44', '45/46'], colors: ['Black', 'Navy', 'White', 'Red', 'Green', 'Multi'], fit: 'Regular', occasion: ['Beach', 'Casual'], season: ['Summer', 'Spring'] }, estimatedPrice: { min: 25, max: 50, currency: 'BRL' } },
  { id: 'havaianas-brasil', brandId: 'havaianas', name: 'Brasil Logo', category: 'footwear', subcategory: 'sandals', gender: 'unisex', specs: { material: ['Rubber'], sizes: ['35/36', '37/38', '39/40', '41/42', '43/44', '45/46'], colors: ['Green/Yellow', 'Navy', 'Black'], fit: 'Regular', occasion: ['Beach', 'Casual'], season: ['Summer', 'Spring'] }, estimatedPrice: { min: 40, max: 70, currency: 'BRL' } },
  { id: 'havaianas-slim', brandId: 'havaianas', name: 'Slim', category: 'footwear', subcategory: 'sandals', gender: 'women', specs: { material: ['Rubber'], sizes: ['33/34', '35/36', '37/38', '39/40', '41/42'], colors: ['Rose', 'Black', 'Navy', 'Crystal', 'Multi'], fit: 'Slim', occasion: ['Beach', 'Casual'], season: ['Summer', 'Spring'] }, estimatedPrice: { min: 35, max: 80, currency: 'BRL' } },
  
  // ===== Footwear - Formal =====
  { id: 'arezzo-scarpin', brandId: 'arezzo', name: 'Scarpin Salto Alto', category: 'footwear', subcategory: 'heels', gender: 'women', specs: { material: ['Leather', 'Synthetic'], sizes: ['33', '34', '35', '36', '37', '38', '39', '40'], colors: ['Black', 'Nude', 'Red', 'Navy'], fit: 'Regular', occasion: ['Formal', 'Work', 'Party'], season: ['All Year'] }, estimatedPrice: { min: 250, max: 500, currency: 'BRL' } },
  { id: 'schutz-sandalia-festa', brandId: 'schutz', name: 'Sandália Festa', category: 'footwear', subcategory: 'heels', gender: 'women', specs: { material: ['Leather', 'Crystal'], sizes: ['33', '34', '35', '36', '37', '38', '39'], colors: ['Gold', 'Silver', 'Black', 'Rose'], fit: 'Regular', occasion: ['Party', 'Formal'], season: ['All Year'] }, estimatedPrice: { min: 400, max: 800, currency: 'BRL' } },
  
  // ===== Clothing - T-Shirts =====
  { id: 'hering-camiseta-basica', brandId: 'hering', name: 'Camiseta Básica', category: 'clothing', subcategory: 't-shirts', gender: 'unisex', specs: { material: ['100% Cotton'], sizes: ['PP', 'P', 'M', 'G', 'GG', 'XGG'], colors: ['White', 'Black', 'Navy', 'Grey', 'Red', 'Blue'], fit: 'Regular', occasion: ['Casual', 'Home'], season: ['All Year'], care: ['Machine wash cold', 'Tumble dry low'] }, estimatedPrice: { min: 40, max: 80, currency: 'BRL' } },
  { id: 'reserva-camiseta-pima', brandId: 'reserva', name: 'Camiseta Pima', category: 'clothing', subcategory: 't-shirts', gender: 'men', specs: { material: ['Pima Cotton'], sizes: ['P', 'M', 'G', 'GG'], colors: ['White', 'Black', 'Navy', 'Wine', 'Green'], fit: 'Regular', occasion: ['Casual'], season: ['All Year'], care: ['Machine wash cold', 'Do not bleach'] }, estimatedPrice: { min: 150, max: 250, currency: 'BRL' } },
  { id: 'lacoste-polo', brandId: 'lacoste', name: 'Polo Classic Fit', category: 'clothing', subcategory: 'polo', gender: 'unisex', specs: { material: ['Petit Piqué Cotton'], sizes: ['2', '3', '4', '5', '6', '7', '8'], colors: ['White', 'Navy', 'Red', 'Green', 'Yellow', 'Pink'], fit: 'Classic', occasion: ['Casual', 'Sport', 'Work'], season: ['All Year'], care: ['Machine wash 30°', 'Do not tumble dry'] }, estimatedPrice: { min: 500, max: 800, currency: 'BRL' } },
  
  // ===== Clothing - Jeans =====
  { id: 'levis-501', brandId: 'levis-brazil', name: '501 Original Fit', category: 'clothing', subcategory: 'jeans', gender: 'unisex', specs: { material: ['Cotton Denim'], sizes: ['36', '38', '40', '42', '44', '46', '48', '50'], colors: ['Stonewash', 'Dark Blue', 'Black', 'Light Blue'], fit: 'Original (Straight)', occasion: ['Casual'], season: ['All Year'], care: ['Machine wash cold', 'Inside out'] }, estimatedPrice: { min: 300, max: 500, currency: 'BRL' } },
  { id: 'levis-511-slim', brandId: 'levis-brazil', name: '511 Slim Fit', category: 'clothing', subcategory: 'jeans', gender: 'men', specs: { material: ['Cotton Denim with Stretch'], sizes: ['36', '38', '40', '42', '44', '46', '48'], colors: ['Dark Blue', 'Medium Blue', 'Black'], fit: 'Slim', occasion: ['Casual'], season: ['All Year'], care: ['Machine wash cold', 'Inside out'] }, estimatedPrice: { min: 280, max: 450, currency: 'BRL' } },
  { id: 'colcci-jeans-skinny', brandId: 'colcci', name: 'Jeans Skinny', category: 'clothing', subcategory: 'jeans', gender: 'women', specs: { material: ['Cotton Denim with Elastane'], sizes: ['34', '36', '38', '40', '42', '44', '46'], colors: ['Blue', 'Dark Blue', 'Black'], fit: 'Skinny', occasion: ['Casual'], season: ['All Year'], care: ['Machine wash cold'] }, estimatedPrice: { min: 250, max: 400, currency: 'BRL' } },
  
  // ===== Clothing - Dresses =====
  { id: 'farm-vestido-estampado', brandId: 'farm', name: 'Vestido Estampado', category: 'clothing', subcategory: 'dresses', gender: 'women', specs: { material: ['Viscose', 'Cotton'], sizes: ['PP', 'P', 'M', 'G', 'GG'], colors: ['Tropical Print', 'Floral', 'Geometric'], fit: 'Regular', occasion: ['Casual', 'Beach', 'Party'], season: ['Summer', 'Spring'], care: ['Hand wash', 'Do not wring'] }, estimatedPrice: { min: 300, max: 600, currency: 'BRL' } },
  { id: 'animale-vestido-midi', brandId: 'animale', name: 'Vestido Midi', category: 'clothing', subcategory: 'dresses', gender: 'women', specs: { material: ['Crepe', 'Silk'], sizes: ['34', '36', '38', '40', '42', '44'], colors: ['Black', 'Red', 'Navy', 'Emerald'], fit: 'Fitted', occasion: ['Formal', 'Party', 'Work'], season: ['All Year'], care: ['Dry clean only'] }, estimatedPrice: { min: 800, max: 2000, currency: 'BRL' } },
  { id: 'zara-vestido-longo', brandId: 'zara', name: 'Vestido Longo Fluido', category: 'clothing', subcategory: 'dresses', gender: 'women', specs: { material: ['Polyester', 'Viscose'], sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black', 'White', 'Floral', 'Solid Colors'], fit: 'Flowy', occasion: ['Casual', 'Party'], season: ['Summer', 'Spring'], care: ['Machine wash 30°'] }, estimatedPrice: { min: 200, max: 400, currency: 'BRL' } },
  
  // ===== Sportswear =====
  { id: 'nike-legging-dri-fit', brandId: 'nike', name: 'Legging Dri-FIT', category: 'sportswear', subcategory: 'leggings', gender: 'women', specs: { material: ['Polyester', 'Elastane', 'Dri-FIT'], sizes: ['PP', 'P', 'M', 'G', 'GG'], colors: ['Black', 'Navy', 'Grey', 'Pink'], fit: 'Compression', occasion: ['Gym', 'Running', 'Yoga'], season: ['All Year'], care: ['Machine wash cold', 'Do not iron'] }, estimatedPrice: { min: 200, max: 400, currency: 'BRL' } },
  { id: 'adidas-top-esportivo', brandId: 'adidas', name: 'Top Esportivo Aeroready', category: 'sportswear', subcategory: 'tops', gender: 'women', specs: { material: ['Polyester', 'Aeroready'], sizes: ['PP', 'P', 'M', 'G', 'GG'], colors: ['Black', 'White', 'Pink', 'Blue'], fit: 'Regular', occasion: ['Gym', 'Running'], season: ['All Year'], care: ['Machine wash cold'] }, estimatedPrice: { min: 150, max: 300, currency: 'BRL' } },
  { id: 'under-armour-shorts', brandId: 'under-armour', name: 'Shorts Tech', category: 'sportswear', subcategory: 'shorts', gender: 'men', specs: { material: ['Polyester', 'HeatGear'], sizes: ['P', 'M', 'G', 'GG', 'XGG'], colors: ['Black', 'Grey', 'Navy', 'Red'], fit: 'Loose', occasion: ['Gym', 'Running', 'Training'], season: ['All Year'], care: ['Machine wash cold'] }, estimatedPrice: { min: 150, max: 280, currency: 'BRL' } },
  
  // ===== Bags =====
  { id: 'arezzo-bolsa-couro', brandId: 'arezzo', name: 'Bolsa Tote Couro', category: 'bags', subcategory: 'tote', gender: 'women', specs: { material: ['Genuine Leather'], colors: ['Black', 'Camel', 'Burgundy', 'White'], occasion: ['Work', 'Casual'], season: ['All Year'], care: ['Leather conditioner', 'Avoid water'] }, estimatedPrice: { min: 400, max: 800, currency: 'BRL' } },
  { id: 'schutz-clutch', brandId: 'schutz', name: 'Clutch Festa', category: 'bags', subcategory: 'clutch', gender: 'women', specs: { material: ['Leather', 'Crystal'], colors: ['Gold', 'Silver', 'Black', 'Rose'], occasion: ['Party', 'Formal'], season: ['All Year'], care: ['Store in dust bag'] }, estimatedPrice: { min: 300, max: 600, currency: 'BRL' } },
  { id: 'louis-vuitton-neverfull', brandId: 'louis-vuitton', name: 'Neverfull MM', category: 'bags', subcategory: 'tote', gender: 'women', specs: { material: ['Monogram Canvas', 'Leather'], colors: ['Monogram', 'Damier Ebene', 'Damier Azur'], occasion: ['Work', 'Travel', 'Casual'], season: ['All Year'], care: ['Professional cleaning'] }, estimatedPrice: { min: 8000, max: 12000, currency: 'BRL' } },
  { id: 'gucci-marmont', brandId: 'gucci', name: 'GG Marmont', category: 'bags', subcategory: 'crossbody', gender: 'women', specs: { material: ['Matelassé Leather'], colors: ['Black', 'Nude', 'Red', 'White'], occasion: ['Casual', 'Party'], season: ['All Year'], care: ['Professional cleaning'] }, estimatedPrice: { min: 8000, max: 15000, currency: 'BRL' } },
  
  // ===== Watches =====
  { id: 'casio-g-shock', brandId: 'casio', name: 'G-Shock GA-100', category: 'accessories', subcategory: 'watches', gender: 'men', specs: { material: ['Resin', 'Mineral Glass'], colors: ['Black', 'Navy', 'Red', 'Camo'], occasion: ['Sport', 'Casual'], season: ['All Year'], care: ['Water resistant 200m'] }, estimatedPrice: { min: 400, max: 700, currency: 'BRL' } },
  { id: 'fossil-neutra', brandId: 'fossil', name: 'Neutra Chronograph', category: 'accessories', subcategory: 'watches', gender: 'men', specs: { material: ['Stainless Steel', 'Leather Strap'], colors: ['Silver/Brown', 'Black', 'Gold'], occasion: ['Casual', 'Work'], season: ['All Year'], care: ['Water resistant 50m'] }, estimatedPrice: { min: 800, max: 1500, currency: 'BRL' } },
  { id: 'rolex-submariner', brandId: 'rolex', name: 'Submariner Date', category: 'accessories', subcategory: 'watches', gender: 'men', specs: { material: ['Oystersteel', 'Cerachrom Bezel', 'Sapphire Crystal'], colors: ['Black/Steel', 'Blue/Steel', 'Green/Steel'], occasion: ['Formal', 'Diving', 'Casual'], season: ['All Year'], care: ['Water resistant 300m', 'Professional service'] }, estimatedPrice: { min: 60000, max: 90000, currency: 'BRL' } },
  
  // ===== Eyewear =====
  { id: 'ray-ban-aviator', brandId: 'ray-ban', name: 'Aviator Classic', category: 'accessories', subcategory: 'sunglasses', gender: 'unisex', specs: { material: ['Metal Frame', 'Crystal Lens'], colors: ['Gold/Green', 'Gold/Brown', 'Silver/Blue'], occasion: ['Casual', 'Driving'], season: ['All Year'], care: ['Include case', 'Clean with microfiber'] }, estimatedPrice: { min: 600, max: 1000, currency: 'BRL' } },
  { id: 'ray-ban-wayfarer', brandId: 'ray-ban', name: 'Wayfarer Classic', category: 'accessories', subcategory: 'sunglasses', gender: 'unisex', specs: { material: ['Acetate Frame', 'Crystal Lens'], colors: ['Black/Green', 'Tortoise/Brown', 'Black/Blue'], occasion: ['Casual'], season: ['All Year'], care: ['Include case', 'Clean with microfiber'] }, estimatedPrice: { min: 600, max: 900, currency: 'BRL' } },
  { id: 'oakley-holbrook', brandId: 'oakley', name: 'Holbrook', category: 'accessories', subcategory: 'sunglasses', gender: 'unisex', specs: { material: ['O Matter Frame', 'Prizm Lens'], colors: ['Matte Black', 'Polished Black', 'Steel'], occasion: ['Sport', 'Casual'], season: ['All Year'], care: ['Impact resistant', 'Include case'] }, estimatedPrice: { min: 600, max: 1200, currency: 'BRL' } },
  { id: 'chilli-beans-oculos', brandId: 'chilli-beans', name: 'Óculos de Sol', category: 'accessories', subcategory: 'sunglasses', gender: 'unisex', specs: { material: ['Acetate', 'Metal'], colors: ['Various'], occasion: ['Casual'], season: ['All Year'], care: ['Include case'] }, estimatedPrice: { min: 150, max: 400, currency: 'BRL' } },
  
  // ===== Underwear =====
  { id: 'calvin-klein-boxer', brandId: 'calvin-klein', name: 'Boxer Brief', category: 'underwear', subcategory: 'boxer', gender: 'men', specs: { material: ['Cotton', 'Elastane'], sizes: ['P', 'M', 'G', 'GG'], colors: ['Black', 'White', 'Grey', 'Navy'], fit: 'Regular', occasion: ['Daily'], season: ['All Year'], care: ['Machine wash warm'] }, estimatedPrice: { min: 80, max: 180, currency: 'BRL' } },
  { id: 'hope-soutien', brandId: 'hope', name: 'Sutiã Push Up', category: 'lingerie', subcategory: 'bra', gender: 'women', specs: { material: ['Cotton', 'Polyamide', 'Elastane'], sizes: ['36A', '36B', '38B', '38C', '40B', '40C', '42B', '42C'], colors: ['Black', 'White', 'Nude', 'Red', 'Pink'], fit: 'Push Up', occasion: ['Daily'], season: ['All Year'], care: ['Hand wash', 'Do not wring'] }, estimatedPrice: { min: 80, max: 180, currency: 'BRL' } },
  { id: 'victorias-secret-bra', brandId: 'victorias-secret', name: 'Very Sexy Push-Up', category: 'lingerie', subcategory: 'bra', gender: 'women', specs: { material: ['Satin', 'Lace', 'Elastane'], sizes: ['32A', '32B', '34A', '34B', '34C', '36B', '36C', '36D', '38C', '38D'], colors: ['Black', 'Red', 'Pink', 'Nude', 'Blue'], fit: 'Push Up', occasion: ['Daily', 'Special'], season: ['All Year'], care: ['Hand wash cold'] }, estimatedPrice: { min: 200, max: 400, currency: 'BRL' } },
];

// ==================== SIZE CHARTS ====================

export const sizingCharts = {
  clothing: {
    brazil: ['PP', 'P', 'M', 'G', 'GG', 'XGG', '3G'],
    us: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
    eu: ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50'],
    uk: ['4', '6', '8', '10', '12', '14', '16', '18', '20'],
  },
  jeans: {
    waist: ['36', '38', '40', '42', '44', '46', '48', '50', '52', '54'],
    usWaist: ['28', '29', '30', '31', '32', '33', '34', '36', '38', '40'],
    length: ['30', '32', '34', '36'],
  },
  shoes: {
    brazil: ['33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
    us_men: ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
    us_women: ['5', '6', '7', '8', '9', '10', '11', '12'],
    eu: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'],
    uk: ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
  },
  bra: {
    band: ['32', '34', '36', '38', '40', '42', '44'],
    cup: ['A', 'B', 'C', 'D', 'DD', 'E', 'F', 'G'],
    brazil: ['36', '38', '40', '42', '44', '46', '48'],
  },
};

// ==================== MATERIALS ====================

export const materials = {
  fabric: [
    'Cotton', 'Organic Cotton', 'Pima Cotton', 'Linen', 'Silk', 'Wool', 'Cashmere', 'Merino Wool',
    'Polyester', 'Nylon', 'Spandex/Elastane', 'Viscose', 'Rayon', 'Modal', 'Tencel/Lyocell',
    'Denim', 'Tweed', 'Velvet', 'Satin', 'Chiffon', 'Lace', 'Jersey', 'Fleece', 'Corduroy',
  ],
  leather: [
    'Genuine Leather', 'Full Grain Leather', 'Top Grain Leather', 'Suede', 'Nubuck',
    'Patent Leather', 'Vegan Leather', 'PU Leather', 'Bonded Leather',
  ],
  footwear: [
    'Rubber Sole', 'Leather Sole', 'EVA Foam', 'Phylon', 'Boost Foam', 'Air Cushion',
    'Memory Foam', 'Cork', 'Crepe Sole',
  ],
};

// ==================== COLORS ====================

export const colors = {
  basics: ['White', 'Black', 'Grey', 'Navy', 'Beige', 'Brown', 'Nude'],
  warm: ['Red', 'Orange', 'Yellow', 'Pink', 'Coral', 'Burgundy', 'Wine', 'Rose', 'Salmon'],
  cool: ['Blue', 'Green', 'Purple', 'Teal', 'Turquoise', 'Mint', 'Lavender', 'Lilac'],
  neutral: ['Cream', 'Ivory', 'Tan', 'Camel', 'Taupe', 'Charcoal', 'Olive', 'Khaki'],
  metallic: ['Gold', 'Silver', 'Rose Gold', 'Bronze', 'Copper'],
  patterns: ['Stripes', 'Polka Dots', 'Floral', 'Geometric', 'Animal Print', 'Camouflage', 'Tie-Dye', 'Plaid', 'Checkered'],
};

// Helper functions
export const getFashionBrandsByCategory = (category: string): FashionBrand[] => {
  return fashionBrands.filter(brand => brand.categories.includes(category));
};

export const getFashionProductsByBrand = (brandId: string): FashionProduct[] => {
  return fashionProducts.filter(product => product.brandId === brandId);
};

export const getFashionProductsByCategory = (category: string): FashionProduct[] => {
  return fashionProducts.filter(product => product.category === category);
};

export const getFashionProductsByGender = (gender: 'men' | 'women' | 'unisex' | 'kids'): FashionProduct[] => {
  return fashionProducts.filter(product => product.gender === gender || product.gender === 'unisex');
};

export const getFashionBrandById = (brandId: string): FashionBrand | undefined => {
  return fashionBrands.find(brand => brand.id === brandId);
};

export const getFashionProductById = (productId: string): FashionProduct | undefined => {
  return fashionProducts.find(product => product.id === productId);
};

// Category labels for UI
export const fashionCategories = [
  { id: 'clothing', name: 'Clothing', icon: 'Shirt' },
  { id: 'footwear', name: 'Footwear', icon: 'Footprints' },
  { id: 'bags', name: 'Bags', icon: 'ShoppingBag' },
  { id: 'accessories', name: 'Accessories', icon: 'Watch' },
  { id: 'sportswear', name: 'Sportswear', icon: 'Dumbbell' },
  { id: 'lingerie', name: 'Lingerie', icon: 'Heart' },
  { id: 'underwear', name: 'Underwear', icon: 'User' },
  { id: 'eyewear', name: 'Eyewear', icon: 'Glasses' },
  { id: 'watches', name: 'Watches', icon: 'Watch' },
  { id: 'jewelry', name: 'Jewelry', icon: 'Gem' },
];

export const fashionSubcategories = {
  clothing: ['t-shirts', 'polo', 'shirts', 'blouses', 'dresses', 'skirts', 'pants', 'jeans', 'shorts', 'jackets', 'coats', 'sweaters', 'hoodies', 'suits'],
  footwear: ['sneakers', 'running', 'sandals', 'heels', 'boots', 'flats', 'loafers', 'moccasins', 'espadrilles'],
  bags: ['tote', 'crossbody', 'clutch', 'backpack', 'shoulder', 'satchel', 'wallet'],
  accessories: ['belts', 'scarves', 'hats', 'gloves', 'ties', 'sunglasses', 'watches'],
  sportswear: ['leggings', 'tops', 'shorts', 'tracksuits', 'jerseys', 'swimwear'],
};
