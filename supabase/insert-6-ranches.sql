-- ═══════════════════════════════════════════════════════════
-- FAZENDA CARCARÁ - 6 SÍTIOS INSERTION SCRIPT
-- Execute in Supabase SQL Editor
-- Date: November 7, 2025
-- ═══════════════════════════════════════════════════════════

-- Delete existing test data if any
DELETE FROM properties WHERE id IN ('buriti', 'cedro', 'ipe', 'jatoba', 'pequi', 'sucupira');

-- ═══════════════════════════════════════════════════════════
-- SÍTIO 1: BURITI
-- Coordinates from KML: -18.2791310466666, -48.8309658761111
-- ═══════════════════════════════════════════════════════════
INSERT INTO properties (
  id, title, description, location, city, state, country,
  price, area_total, bedrooms, bathrooms,
  property_type, transaction_type, status, published_at,
  featured, projeto, user_id,
  latitude, longitude,
  fotos,
  amenities, nearby_facilities
) VALUES (
  'buriti',
  'Sítio Buriti - Refúgio no Lago das Brisas',
  'Terra onde o buriti cresce forte e livre, símbolo de resistência e fartura. O Sítio Buriti oferece 2 hectares de puro potencial, com solo fértil e acesso privilegiado ao Lago das Brisas. Perfeito para quem busca construir um lar sustentável em harmonia com a natureza. Localizado em área de preservação com fauna rica (capivaras, garças, tucanos) e flora exuberante. Terreno plano facilita construção. Água cristalina do lago a apenas 800m. Ideal para permacultura, criação de pequenos animais ou simplesmente contemplação.',
  'Lago das Brisas, Buriti Alegre, GO',
  'Buriti Alegre',
  'GO',
  'Brasil',
  350000.00,
  20000.00, -- 2 hectares
  0, 0,
  'rural', 'sale', 'active', NOW(),
  true, 'Sítios Carcará', '00000000-0000-0000-0000-000000000000', -- Replace with actual owner user_id
  -18.2791310466666, -48.8309658761111,
  ARRAY[
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    'https://images.unsplash.com/photo-1464297162577-f5295c892194?w=800',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800'
  ],
  '{
    "water_access": true,
    "electricity_available": true,
    "road_type": "gravel",
    "internet_4g": true,
    "internet_5g": false,
    "internet_fiber_available": true,
    "lake_proximity_m": 800,
    "forest_area": true,
    "flat_terrain": true,
    "well_potential": "40m depth",
    "title_deed": "clean"
  }'::jsonb,
  '{
    "hospital_km": 15,
    "hospital_name": "Hospital Municipal Buriti Alegre",
    "school_km": 12,
    "school_name": "Escola Municipal Lago das Brisas",
    "supermarket_km": 14,
    "supermarket_name": "Supermercado São José",
    "gas_station_km": 13,
    "bank_km": 15,
    "pharmacy_km": 14,
    "restaurant_km": 10
  }'::jsonb
);

-- ═══════════════════════════════════════════════════════════
-- SÍTIO 2: CEDRO
-- Coordinates from KML: -18.2791936430556, -48.8310930494445
-- ═══════════════════════════════════════════════════════════
INSERT INTO properties (
  id, title, description, location, city, state, country,
  price, area_total, bedrooms, bathrooms,
  property_type, transaction_type, status, published_at,
  featured, projeto, user_id,
  latitude, longitude,
  fotos,
  amenities, nearby_facilities
) VALUES (
  'cedro',
  'Sítio Cedro - Majestade do Cerrado',
  'Como o cedro que resiste ao tempo, este sítio é sinônimo de solidez e valor duradouro. Com 2 hectares de terreno ondulado, o Sítio Cedro oferece vistas panorâmicas do Lago das Brisas e do pôr do sol que tingem o céu de dourado. Vegetação nativa preservada com cedros centenários. Solo rico para cultivo orgânico. Microclima agradável devido à elevação. Privacidade garantida com cercamento natural. Potencial para eco-turismo ou retiro particular. Acesso por estrada de terra batida bem conservada.',
  'Lago das Brisas, Buriti Alegre, GO',
  'Buriti Alegre',
  'GO',
  'Brasil',
  375000.00,
  20000.00,
  0, 0,
  'rural', 'sale', 'active', NOW(),
  true, 'Sítios Carcará', '00000000-0000-0000-0000-000000000000',
  -18.2791936430556, -48.8310930494445,
  ARRAY[
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800'
  ],
  '{
    "water_access": true,
    "electricity_available": true,
    "road_type": "dirt",
    "internet_4g": true,
    "internet_5g": false,
    "internet_fiber_available": true,
    "lake_proximity_m": 1000,
    "forest_area": true,
    "hilly_terrain": true,
    "panoramic_view": true,
    "well_potential": "35m depth",
    "title_deed": "clean"
  }'::jsonb,
  '{
    "hospital_km": 15,
    "hospital_name": "Hospital Municipal Buriti Alegre",
    "school_km": 12,
    "school_name": "Escola Municipal Lago das Brisas",
    "supermarket_km": 14,
    "gas_station_km": 13,
    "bank_km": 15,
    "pharmacy_km": 14
  }'::jsonb
);

-- ═══════════════════════════════════════════════════════════
-- SÍTIO 3: IPÊ
-- Coordinates from KML: -18.2793276161111, -48.8325552202778
-- ═══════════════════════════════════════════════════════════
INSERT INTO properties (
  id, title, description, location, city, state, country,
  price, area_total, bedrooms, bathrooms,
  property_type, transaction_type, status, published_at,
  featured, projeto, user_id,
  latitude, longitude,
  fotos,
  amenities, nearby_facilities
) VALUES (
  'ipe',
  'Sítio Ipê - Cores da Natureza',
  'Quando o ipê floresce, a paisagem se transforma num espetáculo de amarelo vibrante. O Sítio Ipê celebra a beleza efêmera e intensa da vida no cerrado. 2 hectares de terra fértil com dezenas de ipês-amarelos que florescem entre agosto e setembro. Nascente natural nos fundos da propriedade garante água durante todo o ano. Topografia mista com áreas planas e pequenas elevações. Ideal para agricultura familiar, pomar diversificado ou projeto de permacultura. Cercado por mata ciliar preservada. Avistamento frequente de animais silvestres.',
  'Lago das Brisas, Buriti Alegre, GO',
  'Buriti Alegre',
  'GO',
  'Brasil',
  385000.00,
  20000.00,
  0, 0,
  'rural', 'sale', 'active', NOW(),
  true, 'Sítios Carcará', '00000000-0000-0000-0000-000000000000',
  -18.2793276161111, -48.8325552202778,
  ARRAY[
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'
  ],
  '{
    "water_access": true,
    "natural_spring": true,
    "electricity_available": true,
    "road_type": "gravel",
    "internet_4g": true,
    "internet_fiber_available": true,
    "lake_proximity_m": 750,
    "forest_area": true,
    "mixed_terrain": true,
    "fruit_trees": true,
    "wildlife_sightings": "frequent",
    "title_deed": "clean"
  }'::jsonb,
  '{
    "hospital_km": 15,
    "school_km": 12,
    "supermarket_km": 14,
    "gas_station_km": 13,
    "bank_km": 15
  }'::jsonb
);

-- ═══════════════════════════════════════════════════════════
-- SÍTIO 4: JATOBÁ
-- Coordinates from KML: -18.2800180394444, -48.8317861494444
-- ═══════════════════════════════════════════════════════════
INSERT INTO properties (
  id, title, description, location, city, state, country,
  price, area_total, bedrooms, bathrooms,
  property_type, transaction_type, status, published_at,
  featured, projeto, user_id,
  latitude, longitude,
  fotos,
  amenities, nearby_facilities
) VALUES (
  'jatoba',
  'Sítio Jatobá - Força da Terra',
  'O jatobá, árvore imponente e generosa, representa a conexão profunda com a terra. Este sítio de 2 hectares abriga jatobás centenários cujos frutos alimentam a fauna local. Solo argiloso excelente para retenção de água. Localização estratégica com acesso facilitado e privacidade. Topografia predominantemente plana com leve inclinação natural para drenagem. Potencial apícola com floradas constantes. Área ideal para construção de residência sustentável com captação de água da chuva. Vista desobstruída do nascer do sol.',
  'Lago das Brisas, Buriti Alegre, GO',
  'Buriti Alegre',
  'GO',
  'Brasil',
  360000.00,
  20000.00,
  0, 0,
  'rural', 'sale', 'active', NOW(),
  true, 'Sítios Carcará', '00000000-0000-0000-0000-000000000000',
  -18.2800180394444, -48.8317861494444,
  ARRAY[
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'
  ],
  '{
    "water_access": true,
    "electricity_available": true,
    "road_type": "improved_dirt",
    "internet_4g": true,
    "internet_fiber_available": true,
    "lake_proximity_m": 900,
    "forest_area": true,
    "mostly_flat": true,
    "sunrise_view": true,
    "beekeeping_potential": true,
    "rainwater_harvest_viable": true,
    "title_deed": "clean"
  }'::jsonb,
  '{
    "hospital_km": 15,
    "school_km": 12,
    "supermarket_km": 14,
    "gas_station_km": 13,
    "bank_km": 15
  }'::jsonb
);

-- ═══════════════════════════════════════════════════════════
-- SÍTIO 5: PEQUI
-- Coordinates from KML: -18.2814622908333, -48.8341412847223
-- ═══════════════════════════════════════════════════════════
INSERT INTO properties (
  id, title, description, location, city, state, country,
  price, area_total, bedrooms, bathrooms,
  property_type, transaction_type, status, published_at,
  featured, projeto, user_id,
  latitude, longitude,
  fotos,
  amenities, nearby_facilities
) VALUES (
  'pequi',
  'Sítio Pequi - Essência do Cerrado',
  'O pequi, fruto dourado do cerrado, carrega em si toda a essência desta terra abençoada. Com 2 hectares repletos de pequizeiros nativos, este sítio é um convite à abundância e ao retiro. Colheita anual de pequi garante renda extra sazonal. Solo profundo ideal para fruticultura diversificada. Proximidade ao lago favorece microclima mais ameno. Acesso por via secundária garante tranquilidade absoluta. Terreno com declive suave facilita projetos de agricultura em curva de nível. Potencial para agroflorestas e sistemas agroflorestais. Biodiversidade notável com mais de 50 espécies de aves catalogadas.',
  'Lago das Brisas, Buriti Alegre, GO',
  'Buriti Alegre',
  'GO',
  'Brasil',
  370000.00,
  20000.00,
  0, 0,
  'rural', 'sale', 'active', NOW(),
  true, 'Sítios Carcará', '00000000-0000-0000-0000-000000000000',
  -18.2814622908333, -48.8341412847223,
  ARRAY[
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
    'https://images.unsplash.com/photo-1464297162577-f5295c892194?w=800',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
  ],
  '{
    "water_access": true,
    "electricity_available": true,
    "road_type": "secondary_dirt",
    "internet_4g": true,
    "internet_fiber_available": true,
    "lake_proximity_m": 650,
    "forest_area": true,
    "gentle_slope": true,
    "pequi_trees": "abundant",
    "seasonal_income": true,
    "bird_diversity": "50+ species",
    "agroforestry_viable": true,
    "title_deed": "clean"
  }'::jsonb,
  '{
    "hospital_km": 15,
    "school_km": 12,
    "supermarket_km": 14,
    "gas_station_km": 13,
    "bank_km": 15
  }'::jsonb
);

-- ═══════════════════════════════════════════════════════════
-- SÍTIO 6: SUCUPIRA
-- Coordinates from KML: -18.2810795708333, -48.8319018936111
-- ═══════════════════════════════════════════════════════════
INSERT INTO properties (
  id, title, description, location, city, state, country,
  price, area_total, bedrooms, bathrooms,
  property_type, transaction_type, status, published_at,
  featured, projeto, user_id,
  latitude, longitude,
  fotos,
  amenities, nearby_facilities
) VALUES (
  'sucupira',
  'Sítio Sucupira - Portal da Serenidade',
  'A sucupira, árvore medicinal e sagrada, empresta seu nome a este refúgio de paz. 2 hectares de cerrado preservado com sucupiras de mais de 100 anos. Este é o sítio com melhor posicionamento solar, recebendo luz plena durante todo o dia. Ideal para projetos de energia solar. Acesso direto pela via principal facilita logística. Terreno alto e seco, livre de alagamentos. Vista privilegiada do conjunto dos outros sítios e do vale. Potencial para construção de mirante natural. Solo pedregoso mas com bolsões de terra preta. Silêncio absoluto interrompido apenas pelo canto dos pássaros.',
  'Lago das Brisas, Buriti Alegre, GO',
  'Buriti Alegre',
  'GO',
  'Brasil',
  380000.00,
  20000.00,
  0, 0,
  'rural', 'sale', 'active', NOW(),
  true, 'Sítios Carcará', '00000000-0000-0000-0000-000000000000',
  -18.2810795708333, -48.8319018936111,
  ARRAY[
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800'
  ],
  '{
    "water_access": true,
    "electricity_available": true,
    "road_type": "main_dirt",
    "internet_4g": true,
    "internet_5g": true,
    "internet_fiber_available": true,
    "lake_proximity_m": 950,
    "forest_area": true,
    "high_elevation": true,
    "valley_view": true,
    "solar_potential": "excellent",
    "flood_free": true,
    "medicinal_trees": true,
    "title_deed": "clean"
  }'::jsonb,
  '{
    "hospital_km": 15,
    "school_km": 12,
    "supermarket_km": 14,
    "gas_station_km": 13,
    "bank_km": 15
  }'::jsonb
);

-- ═══════════════════════════════════════════════════════════
-- VERIFICATION QUERY
-- ═══════════════════════════════════════════════════════════
SELECT 
  id,
  title,
  price,
  area_total,
  latitude,
  longitude,
  projeto,
  status
FROM properties
WHERE projeto = 'Sítios Carcará'
ORDER BY price ASC;

-- Success! All 6 ranches inserted.
-- Next steps:
-- 1. Upload real photos to Supabase Storage
-- 2. Update fotos array with actual URLs
-- 3. Set correct user_id (property owner)
-- 4. Test display on homepage and Carcará landing page
