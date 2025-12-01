'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Search, Gauge, Calendar, Settings, Wrench } from 'lucide-react';
import { machineryBrands, machineryModels, MachineryBrand, MachineryModel } from '@/data/machinery';

interface MachineryFormProps {
  onDataChange: (data: MachineryFormData) => void;
}

export interface MachineryFormData {
  category: string;
  type: string;
  brand: string;
  model: string;
  year: string;
  hours: string;
  power: string;
  engine: string;
  weight: string;
  capacity: string;
  condition: string;
  implements: string[];
  features: string[];
  documentation: string;
  financing: boolean;
  location: string;
}

const MACHINERY_CATEGORIES = [
  { id: 'agricultural', label: 'Agrícola', types: ['Trator', 'Colheitadeira', 'Plantadeira', 'Pulverizador', 'Enfardadeira'] },
  { id: 'construction', label: 'Construção', types: ['Escavadeira', 'Retroescavadeira', 'Pá Carregadeira', 'Rolo Compactador', 'Motoniveladora'] },
  { id: 'industrial', label: 'Industrial', types: ['Empilhadeira', 'Guindaste', 'Compressor', 'Gerador', 'Plataforma Elevatória'] }
];

const CONDITION_OPTIONS = [
  'Novo', 'Seminovo', 'Usado - Excelente', 'Usado - Bom', 
  'Usado - Regular', 'Para Restauro', 'Sucata'
];

const DOCUMENTATION_STATUS = [
  'Documentação completa', 'Nota fiscal', 'Sem documentação', 'Em transferência'
];

const AGRICULTURAL_IMPLEMENTS = [
  'Grade Aradora', 'Grade Niveladora', 'Arado', 'Subsolador', 
  'Roçadeira', 'Semeadeira', 'Adubadeira', 'Carreta Agrícola',
  'Tanque de Combustível', 'Plaina Traseira', 'Concha Frontal'
];

const MACHINERY_FEATURES = [
  'Ar Condicionado', 'Cabine Fechada', 'GPS/Telemetria', 'Piloto Automático',
  'Câmera de Ré', 'Luzes de Trabalho', 'Rádio', 'Bluetooth',
  'Tomada de Força', 'Controle Remoto Hidráulico', 'Sistema de Lastro',
  'Pneus Novos', 'Esteiras', 'Transmissão Automática', 'Monitor de Rendimento'
];

export default function MachineryForm({ onDataChange }: MachineryFormProps) {
  const [selectedBrand, setSelectedBrand] = useState<MachineryBrand | null>(null);
  const [selectedModel, setSelectedModel] = useState<MachineryModel | null>(null);
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [formData, setFormData] = useState<MachineryFormData>({
    category: '',
    type: '',
    brand: '',
    model: '',
    year: '',
    hours: '',
    power: '',
    engine: '',
    weight: '',
    capacity: '',
    condition: '',
    implements: [],
    features: [],
    documentation: '',
    financing: false,
    location: ''
  });

  // Filter brands based on search and category
  const filteredBrands = machineryBrands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(brandSearch.toLowerCase());
    const matchesCategory = !selectedCategory || brand.types.includes(selectedCategory as any);
    return matchesSearch && matchesCategory;
  });

  // Filter models based on search, brand and category
  const filteredModels = selectedBrand 
    ? machineryModels.filter(model => {
        const matchesBrand = model.brandId === selectedBrand.id;
        const matchesSearch = model.name.toLowerCase().includes(modelSearch.toLowerCase());
        return matchesBrand && matchesSearch;
      })
    : [];

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFormData(prev => ({ 
      ...prev, 
      category, 
      type: '',
      brand: '',
      model: ''
    }));
    setSelectedBrand(null);
    setSelectedModel(null);
    setBrandSearch('');
    setModelSearch('');
  };

  const handleModelSelect = (model: MachineryModel) => {
    setSelectedModel(model);
    setModelSearch(model.name);
    setShowModelDropdown(false);
    
    const specs = model.specs || {};
    const updatedData = {
      ...formData,
      model: model.name,
      type: model.type,
      power: specs.power || '',
      engine: specs.engine || '',
      capacity: specs.capacity || '',
      weight: specs.weight || ''
    };
    setFormData(updatedData);
  };

  const handleBrandSelect = (brand: MachineryBrand) => {
    setSelectedBrand(brand);
    setBrandSearch(brand.name);
    setShowBrandDropdown(false);
    setFormData(prev => ({ ...prev, brand: brand.name, model: '' }));
    setSelectedModel(null);
    setModelSearch('');
  };

  const toggleImplement = (implement: string) => {
    setFormData(prev => ({
      ...prev,
      implements: prev.implements.includes(implement)
        ? prev.implements.filter(i => i !== implement)
        : [...prev.implements, implement]
    }));
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const updateField = (field: keyof MachineryFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const currentCategoryTypes = MACHINERY_CATEGORIES.find(c => c.id === selectedCategory)?.types || [];

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div>
        <label className="block text-[#D4A574] font-semibold mb-3">Categoria *</label>
        <div className="grid grid-cols-3 gap-4">
          {MACHINERY_CATEGORIES.map(category => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryChange(category.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedCategory === category.id
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-[#3a3a3a] bg-[#2a2a2a] hover:border-[#4a4a4a]'
              }`}
            >
              <div className="font-bold text-[#D4A574]">{category.label}</div>
              <div className="text-xs text-[#676767] mt-1">{category.types.slice(0, 3).join(', ')}...</div>
            </button>
          ))}
        </div>
      </div>

      {/* Type Selection */}
      {selectedCategory && (
        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">
            <Truck className="w-4 h-4 inline mr-2" />
            Tipo de Máquina *
          </label>
          <select
            value={formData.type}
            onChange={(e) => updateField('type', e.target.value)}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          >
            <option value="">Selecione o tipo</option>
            {currentCategoryTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      )}

      {/* Brand & Model */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-[#D4A574] font-semibold mb-2">Marca *</label>
          <div className="relative">
            <input
              type="text"
              value={brandSearch}
              onChange={(e) => {
                setBrandSearch(e.target.value);
                setShowBrandDropdown(true);
              }}
              onFocus={() => setShowBrandDropdown(true)}
              placeholder="Digite ou selecione"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#676767]" />
          </div>
          
          {showBrandDropdown && filteredBrands.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredBrands.map(brand => (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => handleBrandSelect(brand)}
                  className="w-full px-4 py-3 text-left hover:bg-[#3a3a3a] text-[#D4A574]"
                >
                  <div className="font-medium">{brand.name}</div>
                  <div className="text-xs text-[#676767]">{brand.country} - {brand.types.join(', ')}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="block text-[#D4A574] font-semibold mb-2">Modelo</label>
          <div className="relative">
            <input
              type="text"
              value={modelSearch}
              onChange={(e) => {
                setModelSearch(e.target.value);
                setShowModelDropdown(true);
              }}
              onFocus={() => setShowModelDropdown(true)}
              placeholder={selectedBrand ? 'Digite ou selecione' : 'Selecione a marca'}
              disabled={!selectedBrand}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F] disabled:opacity-50"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#676767]" />
          </div>
          
          {showModelDropdown && filteredModels.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredModels.map(model => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => handleModelSelect(model)}
                  className="w-full px-4 py-3 text-left hover:bg-[#3a3a3a] text-[#D4A574]"
                >
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-[#676767]">{model.type} - {model.specs?.power || model.category}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Year & Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Ano *
          </label>
          <select
            value={formData.year}
            onChange={(e) => updateField('year', e.target.value)}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          >
            <option value="">Selecione</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">
            <Gauge className="w-4 h-4 inline mr-2" />
            Horas de Uso
          </label>
          <input
            type="text"
            value={formData.hours}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              updateField('hours', value ? parseInt(value).toLocaleString('pt-BR') : '');
            }}
            placeholder="Ex: 2.500"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          />
        </div>
      </div>

      {/* Power & Engine */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">
            <Settings className="w-4 h-4 inline mr-2" />
            Potência
          </label>
          <input
            type="text"
            value={formData.power}
            onChange={(e) => updateField('power', e.target.value)}
            placeholder="Ex: 180 cv"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          />
        </div>

        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Motor</label>
          <input
            type="text"
            value={formData.engine}
            onChange={(e) => updateField('engine', e.target.value)}
            placeholder="Ex: PowerTech 6.8L"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          />
        </div>
      </div>

      {/* Weight & Capacity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Peso (kg)</label>
          <input
            type="text"
            value={formData.weight}
            onChange={(e) => updateField('weight', e.target.value)}
            placeholder="Ex: 8.500"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          />
        </div>

        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Capacidade</label>
          <input
            type="text"
            value={formData.capacity}
            onChange={(e) => updateField('capacity', e.target.value)}
            placeholder="Ex: 5.000 kg ou 200 sacas/hora"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          />
        </div>
      </div>

      {/* Condition & Documentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Estado de Conservação</label>
          <select
            value={formData.condition}
            onChange={(e) => updateField('condition', e.target.value)}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          >
            <option value="">Selecione</option>
            {CONDITION_OPTIONS.map(cond => (
              <option key={cond} value={cond}>{cond}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Documentação</label>
          <select
            value={formData.documentation}
            onChange={(e) => updateField('documentation', e.target.value)}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          >
            <option value="">Selecione</option>
            {DOCUMENTATION_STATUS.map(doc => (
              <option key={doc} value={doc}>{doc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-[#D4A574] font-semibold mb-2">Localização</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder="Ex: Ribeirão Preto - SP"
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
        />
      </div>

      {/* Implements (for agricultural) */}
      {selectedCategory === 'agricultural' && (
        <div>
          <label className="block text-[#D4A574] font-semibold mb-3">
            <Wrench className="w-4 h-4 inline mr-2" />
            Implementos Inclusos
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {AGRICULTURAL_IMPLEMENTS.map(implement => (
              <button
                key={implement}
                type="button"
                onClick={() => toggleImplement(implement)}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  formData.implements.includes(implement)
                    ? 'bg-amber-500 text-white font-medium'
                    : 'bg-[#1a1a1a] border border-[#3a3a3a] text-[#676767] hover:border-[#4a4a4a]'
                }`}
              >
                {implement}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      <div>
        <label className="block text-[#D4A574] font-semibold mb-3">Opcionais e Acessórios</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {MACHINERY_FEATURES.map(feature => (
            <button
              key={feature}
              type="button"
              onClick={() => toggleFeature(feature)}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                formData.features.includes(feature)
                  ? 'bg-amber-500 text-white font-medium'
                  : 'bg-[#1a1a1a] border border-[#3a3a3a] text-[#676767] hover:border-[#4a4a4a]'
              }`}
            >
              {feature}
            </button>
          ))}
        </div>
      </div>

      {/* Financing Option */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="financing"
          checked={formData.financing}
          onChange={(e) => updateField('financing', e.target.checked)}
          className="w-5 h-5 rounded border-[#3a3a3a] text-amber-500 focus:ring-amber-500"
        />
        <label htmlFor="financing" className="text-[#D4A574]">
          Aceito financiamento / consórcio
        </label>
      </div>

      {/* Auto-fill indicator */}
      {selectedModel && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="text-amber-400 text-sm">
            🚜 Especificações do {selectedModel.name} preenchidas automaticamente!
          </p>
        </div>
      )}
    </div>
  );
}
