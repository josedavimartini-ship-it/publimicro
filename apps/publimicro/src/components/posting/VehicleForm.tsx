'use client';

import React, { useState, useEffect } from 'react';
import { Car, Search, Fuel, Calendar, Gauge, Settings } from 'lucide-react';
import { vehicleBrands, vehicleModels, VehicleBrand, VehicleModel } from '@/data/vehicles';

interface VehicleFormProps {
  onDataChange: (data: VehicleFormData) => void;
}

export interface VehicleFormData {
  brand: string;
  model: string;
  version: string;
  year: string;
  mileage: string;
  fuel: string;
  transmission: string;
  color: string;
  doors: string;
  engine: string;
  power: string;
  plate: string;
  licensingState: string;
  features: string[];
}

const COLORS = [
  'Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho', 'Azul', 
  'Verde', 'Amarelo', 'Laranja', 'Marrom', 'Bege', 'Dourado'
];

const FUEL_TYPES = ['Flex', 'Gasolina', 'Etanol', 'Diesel', 'Elétrico', 'Híbrido', 'GNV'];

const TRANSMISSIONS = ['Manual', 'Automático', 'CVT', 'Automatizado', 'Semi-automático'];

const VEHICLE_FEATURES = [
  'Ar Condicionado', 'Direção Hidráulica', 'Vidros Elétricos', 'Travas Elétricas',
  'Airbag', 'ABS', 'Alarme', 'Som', 'Bluetooth', 'Câmera de Ré', 'Sensor de Ré',
  'Bancos de Couro', 'Teto Solar', 'GPS', 'Piloto Automático', 'Start/Stop',
  'Faróis de LED', 'Rodas de Liga Leve', 'Porta-malas Elétrico', 'Chave Presencial'
];

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO'
];

export default function VehicleForm({ onDataChange }: VehicleFormProps) {
  const [selectedBrand, setSelectedBrand] = useState<VehicleBrand | null>(null);
  const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(null);
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const [formData, setFormData] = useState<VehicleFormData>({
    brand: '',
    model: '',
    version: '',
    year: '',
    mileage: '',
    fuel: '',
    transmission: '',
    color: '',
    doors: '',
    engine: '',
    power: '',
    plate: '',
    licensingState: '',
    features: []
  });

  // Filter brands based on search
  const filteredBrands = vehicleBrands.filter(brand =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  // Filter models based on search and selected brand
  const filteredModels = selectedBrand 
    ? vehicleModels.filter(model =>
        model.brandId === selectedBrand.id &&
        model.name.toLowerCase().includes(modelSearch.toLowerCase())
      )
    : [];

  // Update form data when selections change
  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  // Auto-fill specs when model is selected
  const handleModelSelect = (model: VehicleModel) => {
    setSelectedModel(model);
    setModelSearch(model.name);
    setShowModelDropdown(false);
    
    // Auto-fill available specs from model.specs
    const specs = model.specs || {};
    const updatedData = {
      ...formData,
      model: model.name,
      version: model.variants?.[0]?.name || '',
      engine: specs.engine || '',
      fuel: specs.fuel?.[0] || formData.fuel,
      transmission: specs.transmission?.[0] || formData.transmission,
      power: specs.power || ''
    };
    setFormData(updatedData);
  };

  const handleBrandSelect = (brand: VehicleBrand) => {
    setSelectedBrand(brand);
    setBrandSearch(brand.name);
    setShowBrandDropdown(false);
    setFormData(prev => ({ ...prev, brand: brand.name, model: '', version: '' }));
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

  const updateField = (field: keyof VehicleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Generate year options (last 50 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      {/* Brand & Model Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brand */}
        <div className="relative">
          <label className="block text-[#D4A574] font-semibold mb-2">
            <Car className="w-4 h-4 inline mr-2" />
            Marca *
          </label>
          <div className="relative">
            <input
              type="text"
              value={brandSearch}
              onChange={(e) => {
                setBrandSearch(e.target.value);
                setShowBrandDropdown(true);
              }}
              onFocus={() => setShowBrandDropdown(true)}
              placeholder="Digite ou selecione a marca"
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
                  className="w-full px-4 py-3 text-left hover:bg-[#3a3a3a] text-[#D4A574] flex items-center gap-3"
                >
                  {brand.logo && (
                    <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain" />
                  )}
                  <div>
                    <div className="font-medium">{brand.name}</div>
                    <div className="text-xs text-[#676767]">{brand.country}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Model */}
        <div className="relative">
          <label className="block text-[#D4A574] font-semibold mb-2">Modelo *</label>
          <div className="relative">
            <input
              type="text"
              value={modelSearch}
              onChange={(e) => {
                setModelSearch(e.target.value);
                setShowModelDropdown(true);
              }}
              onFocus={() => setShowModelDropdown(true)}
              placeholder={selectedBrand ? 'Digite ou selecione o modelo' : 'Selecione a marca primeiro'}
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
                  <div className="text-xs text-[#676767]">{model.category}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Version */}
      <div>
        <label className="block text-[#D4A574] font-semibold mb-2">Versão</label>
        <input
          type="text"
          value={formData.version}
          onChange={(e) => updateField('version', e.target.value)}
          placeholder="Ex: XEi 2.0 CVT"
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
        />
      </div>

      {/* Year & Mileage */}
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
            <option value="">Selecione o ano</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">
            <Gauge className="w-4 h-4 inline mr-2" />
            Quilometragem (km) *
          </label>
          <input
            type="text"
            value={formData.mileage}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              updateField('mileage', value ? parseInt(value).toLocaleString('pt-BR') : '');
            }}
            placeholder="Ex: 45.000"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          />
        </div>
      </div>

      {/* Fuel & Transmission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">
            <Fuel className="w-4 h-4 inline mr-2" />
            Combustível *
          </label>
          <select
            value={formData.fuel}
            onChange={(e) => updateField('fuel', e.target.value)}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          >
            <option value="">Selecione</option>
            {FUEL_TYPES.map(fuel => (
              <option key={fuel} value={fuel}>{fuel}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">
            <Settings className="w-4 h-4 inline mr-2" />
            Câmbio *
          </label>
          <select
            value={formData.transmission}
            onChange={(e) => updateField('transmission', e.target.value)}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          >
            <option value="">Selecione</option>
            {TRANSMISSIONS.map(trans => (
              <option key={trans} value={trans}>{trans}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Color & Doors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Cor *</label>
          <select
            value={formData.color}
            onChange={(e) => updateField('color', e.target.value)}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          >
            <option value="">Selecione a cor</option>
            {COLORS.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Portas</label>
          <select
            value={formData.doors}
            onChange={(e) => updateField('doors', e.target.value)}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          >
            <option value="">Selecione</option>
            <option value="2">2 portas</option>
            <option value="4">4 portas</option>
          </select>
        </div>
      </div>

      {/* Engine & Power (auto-filled) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Motor</label>
          <input
            type="text"
            value={formData.engine}
            onChange={(e) => updateField('engine', e.target.value)}
            placeholder="Ex: 2.0 16V"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          />
        </div>

        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Potência (cv)</label>
          <input
            type="text"
            value={formData.power}
            onChange={(e) => updateField('power', e.target.value)}
            placeholder="Ex: 170"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          />
        </div>
      </div>

      {/* Plate & Licensing State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Final da Placa</label>
          <input
            type="text"
            value={formData.plate}
            onChange={(e) => updateField('plate', e.target.value.slice(0, 1))}
            placeholder="Ex: 5"
            maxLength={1}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          />
        </div>

        <div>
          <label className="block text-[#D4A574] font-semibold mb-2">Estado de Licenciamento</label>
          <select
            value={formData.licensingState}
            onChange={(e) => updateField('licensingState', e.target.value)}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-[#A8C97F]"
          >
            <option value="">Selecione o estado</option>
            {BRAZILIAN_STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="block text-[#D4A574] font-semibold mb-3">Opcionais</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {VEHICLE_FEATURES.map(feature => (
            <button
              key={feature}
              type="button"
              onClick={() => toggleFeature(feature)}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                formData.features.includes(feature)
                  ? 'bg-[#A8C97F] text-[#0a0a0a] font-medium'
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
        <div className="p-4 bg-[#A8C97F]/10 border border-[#A8C97F]/30 rounded-lg">
          <p className="text-[#A8C97F] text-sm">
            ✨ Especificações do {selectedModel.name} preenchidas automaticamente!
          </p>
        </div>
      )}
    </div>
  );
}
