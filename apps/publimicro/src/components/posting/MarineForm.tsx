'use client';

import React, { useState, useEffect } from 'react';
import { Anchor, Search, Gauge, Calendar, Ruler, Users } from 'lucide-react';
import { marineBrands, marineModels, MarineBrand, MarineModel } from '@/data/marine';

interface MarineFormProps {
  onDataChange: (data: MarineFormData) => void;
}

export interface MarineFormData {
  type: string;
  brand: string;
  model: string;
  year: string;
  length: string;
  beam: string;
  engine: string;
  engineHours: string;
  fuelCapacity: string;
  waterCapacity: string;
  passengers: string;
  cabins: string;
  hull: string;
  propulsion: string;
  condition: string;
  documentation: string;
  mooring: string;
  features: string[];
}

const MARINE_TYPES = [
  'Lancha', 'Barco', 'Jet Ski', 'Veleiro', 'Iate', 'Catamarã', 
  'Bote Inflável', 'Pesqueiro', 'Traineira', 'Trawler'
];

const HULL_TYPES = ['Fibra de Vidro', 'Alumínio', 'Aço', 'Madeira', 'Inflável'];

const PROPULSION_TYPES = ['Motor de Popa', 'Motor de Centro', 'Vela', 'Jet Drive', 'Pod Drive'];

const CONDITION_OPTIONS = ['Novo', 'Seminovo', 'Usado - Excelente', 'Usado - Bom', 'Para Restauro'];

const DOCUMENTATION_STATUS = ['Em dia', 'Pendente', 'Em transferência', 'Primeira habilitação'];

const MARINE_FEATURES = [
  'GPS', 'Radar', 'Piloto Automático', 'VHF', 'Sonar', 'Fish Finder',
  'Ar Condicionado', 'Gerador', 'Dessalinizador', 'Âncora Elétrica',
  'Guinchos Elétricos', 'Plataforma de Popa', 'Bimini Top', 'Toldo',
  'Churrasqueira', 'Frigobar', 'Pia', 'Banheiro', 'Chuveiro',
  'Som', 'TV', 'Wi-Fi', 'Cabine Fechada', 'Solarium'
];

export default function MarineForm({ onDataChange }: MarineFormProps) {
  const [selectedBrand, setSelectedBrand] = useState<MarineBrand | null>(null);
  const [selectedModel, setSelectedModel] = useState<MarineModel | null>(null);
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const [formData, setFormData] = useState<MarineFormData>({
    type: '',
    brand: '',
    model: '',
    year: '',
    length: '',
    beam: '',
    engine: '',
    engineHours: '',
    fuelCapacity: '',
    waterCapacity: '',
    passengers: '',
    cabins: '',
    hull: '',
    propulsion: '',
    condition: '',
    documentation: '',
    mooring: '',
    features: []
  });

  // Filter brands based on search
  const filteredBrands = marineBrands.filter(brand =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  // Filter models based on search, selected brand and type
  const filteredModels = selectedBrand 
    ? marineModels.filter(model => {
        const matchesBrand = model.brandId === selectedBrand.id;
        const matchesSearch = model.name.toLowerCase().includes(modelSearch.toLowerCase());
        const matchesType = !formData.type || model.type.toLowerCase() === formData.type.toLowerCase();
        return matchesBrand && matchesSearch && matchesType;
      })
    : [];

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const handleModelSelect = (model: MarineModel) => {
    setSelectedModel(model);
    setModelSearch(model.name);
    setShowModelDropdown(false);
    
    const specs = model.specs || {};
    const updatedData = {
      ...formData,
      model: model.name,
      type: model.type,
      length: specs.length || '',
      beam: specs.beam || '',
      engine: specs.engine || '',
      passengers: specs.passengers ? String(specs.passengers) : '',
      hull: specs.material || formData.hull
    };
    setFormData(updatedData);
  };

  const handleBrandSelect = (brand: MarineBrand) => {
    setSelectedBrand(brand);
    setBrandSearch(brand.name);
    setShowBrandDropdown(false);
    setFormData(prev => ({ ...prev, brand: brand.name, model: '' }));
    setSelectedModel(null);
    setModelSearch('');
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const updateField = (field: keyof MarineFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      {/* Type Selection */}
      <div>
        <label className="block text-[#D4A574] font-semibold mb-2">
          <Anchor className="w-4 h-4 inline mr-2" />
          Tipo de Embarcação *
        </label>
        <select
          value={formData.type}
          onChange={(e) => updateField('type', e.target.value)}
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
        >
          <option value="">Selecione o tipo</option>
          {MARINE_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

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
                  <div className="text-xs text-[#676767]">{model.specs?.length || ''} - {model.type}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Year & Condition */}
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
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">
            <Ruler className="w-4 h-4 inline mr-2" />
            Comprimento (pés)
          </label>
          <input
            type="text"
            value={formData.length}
            onChange={(e) => updateField('length', e.target.value)}
            placeholder="Ex: 32"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          />
        </div>

        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Boca (metros)</label>
          <input
            type="text"
            value={formData.beam}
            onChange={(e) => updateField('beam', e.target.value)}
            placeholder="Ex: 3.2"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          />
        </div>
      </div>

      {/* Engine */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">
            <Gauge className="w-4 h-4 inline mr-2" />
            Motor
          </label>
          <input
            type="text"
            value={formData.engine}
            onChange={(e) => updateField('engine', e.target.value)}
            placeholder="Ex: 2x Mercury 300hp"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          />
        </div>

        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Horas de Motor</label>
          <input
            type="number"
            value={formData.engineHours}
            onChange={(e) => updateField('engineHours', e.target.value)}
            placeholder="Ex: 150"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          />
        </div>
      </div>

      {/* Capacity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            Passageiros
          </label>
          <input
            type="number"
            value={formData.passengers}
            onChange={(e) => updateField('passengers', e.target.value)}
            placeholder="Ex: 12"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          />
        </div>

        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Cabines</label>
          <input
            type="number"
            value={formData.cabins}
            onChange={(e) => updateField('cabins', e.target.value)}
            placeholder="Ex: 2"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          />
        </div>

        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Combustível (L)</label>
          <input
            type="number"
            value={formData.fuelCapacity}
            onChange={(e) => updateField('fuelCapacity', e.target.value)}
            placeholder="Ex: 500"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          />
        </div>
      </div>

      {/* Hull & Propulsion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Casco</label>
          <select
            value={formData.hull}
            onChange={(e) => updateField('hull', e.target.value)}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          >
            <option value="">Selecione</option>
            {HULL_TYPES.map(hull => (
              <option key={hull} value={hull}>{hull}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Propulsão</label>
          <select
            value={formData.propulsion}
            onChange={(e) => updateField('propulsion', e.target.value)}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          >
            <option value="">Selecione</option>
            {PROPULSION_TYPES.map(prop => (
              <option key={prop} value={prop}>{prop}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documentation & Mooring */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Marina/Atracadouro</label>
          <input
            type="text"
            value={formData.mooring}
            onChange={(e) => updateField('mooring', e.target.value)}
            placeholder="Ex: Marina da Glória, RJ"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          />
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="block text-[#D4A574] font-semibold mb-3">Equipamentos e Opcionais</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {MARINE_FEATURES.map(feature => (
            <button
              key={feature}
              type="button"
              onClick={() => toggleFeature(feature)}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                formData.features.includes(feature)
                  ? 'bg-cyan-500 text-white font-medium'
                  : 'bg-[#1a1a1a] border border-[#3a3a3a] text-[#676767] hover:border-[#4a4a4a]'
              }`}
            >
              {feature}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-fill indicator */}
      {selectedModel && (
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <p className="text-cyan-400 text-sm">
            ⚓ Especificações da {selectedModel.name} preenchidas automaticamente!
          </p>
        </div>
      )}
    </div>
  );
}
