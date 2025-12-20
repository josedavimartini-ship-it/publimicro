'use client';

import React from 'react';
import { 
  Home, Car, Anchor, Truck, Smartphone, Package, 
  Briefcase, Shirt, Gamepad2, Book, Baby, Dog
} from 'lucide-react';

export type PostingCategory = 
  | 'property'
  | 'vehicle'
  | 'marine'
  | 'machinery'
  | 'electronics'
  | 'general'
  | 'services'
  | 'fashion'
  | 'games'
  | 'books'
  | 'kids'
  | 'pets';

interface CategoryOption {
  id: PostingCategory;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  subCategories?: string[];
}

const CATEGORIES: CategoryOption[] = [
  {
    id: 'property',
    label: 'Imóveis',
    description: 'Sítios, chácaras, fazendas, casas',
    icon: <Home className="w-8 h-8" />,
    color: 'from-emerald-500 to-emerald-700',
    subCategories: ['Sítio', 'Chácara', 'Fazenda', 'Rancho', 'Casa de Campo', 'Terreno']
  },
  {
    id: 'vehicle',
    label: 'Veículos',
    description: 'Carros, motos, caminhões',
    icon: <Car className="w-8 h-8" />,
    color: 'from-blue-500 to-blue-700',
    subCategories: ['Carro', 'Moto', 'Caminhão', 'Van', 'Utilitário']
  },
  {
    id: 'marine',
    label: 'Náuticos',
    description: 'Barcos, lanchas, jet skis',
    icon: <Anchor className="w-8 h-8" />,
    color: 'from-cyan-500 to-cyan-700',
    subCategories: ['Lancha', 'Barco', 'Jet Ski', 'Veleiro', 'Iate']
  },
  {
    id: 'machinery',
    label: 'Máquinas',
    description: 'Tratores, escavadeiras, equipamentos',
    icon: <Truck className="w-8 h-8" />,
    color: 'from-amber-500 to-amber-700',
    subCategories: ['Agrícola', 'Construção', 'Industrial']
  },
  {
    id: 'electronics',
    label: 'Eletrônicos',
    description: 'Celulares, computadores, TVs',
    icon: <Smartphone className="w-8 h-8" />,
    color: 'from-purple-500 to-purple-700',
    subCategories: ['Smartphone', 'Notebook', 'TV', 'Console', 'Acessórios']
  },
  {
    id: 'general',
    label: 'Geral',
    description: 'Móveis, eletrodomésticos, outros',
    icon: <Package className="w-8 h-8" />,
    color: 'from-gray-500 to-gray-700',
    subCategories: ['Móveis', 'Eletrodomésticos', 'Decoração', 'Ferramentas']
  },
  {
    id: 'services',
    label: 'Serviços',
    description: 'Profissionais e prestadores',
    icon: <Briefcase className="w-8 h-8" />,
    color: 'from-indigo-500 to-indigo-700',
    subCategories: ['Reformas', 'Manutenção', 'Consultoria', 'Aulas']
  },
  {
    id: 'fashion',
    label: 'Moda',
    description: 'Roupas, calçados, acessórios',
    icon: <Shirt className="w-8 h-8" />,
    color: 'from-pink-500 to-pink-700',
    subCategories: ['Feminino', 'Masculino', 'Infantil', 'Calçados', 'Bolsas']
  },
  {
    id: 'games',
    label: 'Games',
    description: 'Jogos, consoles, acessórios',
    icon: <Gamepad2 className="w-8 h-8" />,
    color: 'from-red-500 to-red-700',
    subCategories: ['PlayStation', 'Xbox', 'Nintendo', 'PC Games', 'Acessórios']
  },
  {
    id: 'books',
    label: 'Livros',
    description: 'Livros, revistas, materiais',
    icon: <Book className="w-8 h-8" />,
    color: 'from-yellow-500 to-yellow-700',
    subCategories: ['Ficção', 'Acadêmico', 'Técnico', 'Infantil', 'Revistas']
  },
  {
    id: 'kids',
    label: 'Infantil',
    description: 'Brinquedos, roupas, carrinhos',
    icon: <Baby className="w-8 h-8" />,
    color: 'from-teal-500 to-teal-700',
    subCategories: ['Brinquedos', 'Roupas', 'Carrinhos', 'Berços', 'Cadeiras']
  },
  {
    id: 'pets',
    label: 'Pets',
    description: 'Animais e acessórios',
    icon: <Dog className="w-8 h-8" />,
    color: 'from-orange-500 to-orange-700',
    subCategories: ['Cães', 'Gatos', 'Acessórios', 'Alimentos', 'Veterinário']
  }
];

interface CategorySelectorProps {
  selectedCategory: PostingCategory | null;
  onSelectCategory: (category: PostingCategory) => void;
}

export default function CategorySelector({ selectedCategory, onSelectCategory }: CategorySelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#D4A574] mb-2">O que você deseja anunciar?</h2>
        <p className="text-[#676767]">Selecione a categoria do seu anúncio</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 group ${
              selectedCategory === category.id
                ? 'border-[#A8C97F] bg-[#A8C97F]/10'
                : 'border-[#3a3a3a] bg-[#2a2a2a] hover:border-[#4a4a4a]'
            }`}
          >
            <div className={`w-full flex flex-col items-center text-center`}>
              <div className={`p-3 rounded-full bg-gradient-to-br ${category.color} text-warm mb-3 group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              <h3 className="font-bold text-[#D4A574] mb-1">{category.label}</h3>
              <p className="text-xs text-[#676767] leading-tight">{category.description}</p>
            </div>
            {selectedCategory === category.id && (
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#A8C97F]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export { CATEGORIES };
export type { CategoryOption };
