"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Smartphone, Check, ChevronDown, X, Info } from "lucide-react";
import { 
  SmartphoneSpec, 
  searchSmartphones, 
  getSmartphoneBrands, 
  getSmartphonesByBrand,
  getRecentSmartphones 
} from "@/data/smartphones";

interface SmartphoneSelectorProps {
  onSelect: (phone: SmartphoneSpec | null, userSpecs: UserSmartphoneSpecs) => void;
  className?: string;
}

export interface UserSmartphoneSpecs {
  storage: string;
  color: string;
  condition: "novo" | "seminovo" | "usado" | "com_defeito";
  accessories: string[];
  batteryHealth?: string;
  hasBox: boolean;
  hasCharger: boolean;
  customNotes: string;
}

const conditionOptions = [
  { value: "novo", label: "Novo (lacrado)", description: "Produto lacrado, nunca usado" },
  { value: "seminovo", label: "Seminovo", description: "Usado poucas vezes, excelente estado" },
  { value: "usado", label: "Usado", description: "Marcas de uso normais" },
  { value: "com_defeito", label: "Com defeito", description: "Apresenta algum problema" },
];

const accessoryOptions = [
  "Caixa original",
  "Carregador original",
  "Cabo USB",
  "Fones de ouvido",
  "Capinha",
  "Película protetora",
  "Carregador sem fio",
  "Adaptador",
];

export function SmartphoneSelector({ onSelect, className = "" }: SmartphoneSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SmartphoneSpec[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<SmartphoneSpec | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // User-specific specs (varies per unit)
  const [userSpecs, setUserSpecs] = useState<UserSmartphoneSpecs>({
    storage: "",
    color: "",
    condition: "seminovo",
    accessories: [],
    batteryHealth: "",
    hasBox: false,
    hasCharger: true,
    customNotes: "",
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const brands = getSmartphoneBrands();

  // Handle search
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = searchSmartphones(searchQuery);
      setSearchResults(results.slice(0, 10));
      setShowSearchResults(true);
    } else if (selectedBrand) {
      const results = getSmartphonesByBrand(selectedBrand);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, selectedBrand]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
        setShowBrandDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Notify parent when selection changes
  useEffect(() => {
    onSelect(selectedPhone, userSpecs);
  }, [selectedPhone, userSpecs, onSelect]);

  const handleSelectPhone = (phone: SmartphoneSpec) => {
    setSelectedPhone(phone);
    setSearchQuery(phone.fullName);
    setShowSearchResults(false);
    // Reset user specs when phone changes
    setUserSpecs({
      ...userSpecs,
      storage: phone.storage[0] || "",
      color: phone.colors[0] || "",
    });
  };

  const handleClearSelection = () => {
    setSelectedPhone(null);
    setSearchQuery("");
    setSelectedBrand("");
    setUserSpecs({
      storage: "",
      color: "",
      condition: "seminovo",
      accessories: [],
      batteryHealth: "",
      hasBox: false,
      hasCharger: true,
      customNotes: "",
    });
  };

  const toggleAccessory = (accessory: string) => {
    setUserSpecs(prev => ({
      ...prev,
      accessories: prev.accessories.includes(accessory)
        ? prev.accessories.filter(a => a !== accessory)
        : [...prev.accessories, accessory],
    }));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Section */}
      <div ref={searchRef} className="relative">
        <label className="block text-sm font-medium text-[#C9A87C] mb-2">
          <Smartphone className="inline w-4 h-4 mr-2" />
          Modelo do Smartphone
        </label>
        
        {/* Brand Filter */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => setShowBrandDropdown(!showBrandDropdown)}
              className="w-full h-12 px-4 bg-[#1a1a1a] border-2 border-[#2a2a1a] rounded-lg text-[#E6C98B] hover:border-[#6B7F5C] transition-colors flex items-center justify-between"
            >
              <span>{selectedBrand || "Selecione a marca"}</span>
              <ChevronDown className="w-5 h-5" />
            </button>
            {showBrandDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full bg-[#1a1a1a] border-2 border-[#2a2a1a] rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => { setSelectedBrand(""); setShowBrandDropdown(false); }}
                  className="w-full text-left px-4 py-3 text-[#8B9B6E] hover:bg-[#2a2a1a] transition-colors"
                >
                  Todas as marcas
                </button>
                {brands.map(brand => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => { setSelectedBrand(brand); setShowBrandDropdown(false); setSearchQuery(""); }}
                    className="w-full text-left px-4 py-3 text-[#E6C98B] hover:bg-[#2a2a1a] transition-colors"
                  >
                    {brand}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9B6E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Digite o modelo (ex: iPhone 15, Galaxy S24...)"
            className="w-full h-14 pl-12 pr-12 bg-[#1a1a1a] border-2 border-[#2a2a1a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:ring-2 focus:ring-[#6B7F5C] focus:border-[#6B7F5C] text-lg"
          />
          {selectedPhone && (
            <button
              type="button"
              onClick={handleClearSelection}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B9B6E] hover:text-[#E6C98B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a] border-2 border-[#2a2a1a] rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
            {searchResults.map(phone => (
              <button
                key={phone.id}
                type="button"
                onClick={() => handleSelectPhone(phone)}
                className="w-full text-left px-4 py-4 hover:bg-[#2a2a1a] transition-colors border-b border-[#2a2a1a] last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2a2a1a] rounded-lg flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-[#6B7F5C]" />
                  </div>
                  <div>
                    <p className="text-[#E6C98B] font-medium">{phone.fullName}</p>
                    <p className="text-sm text-[#8B9B6E]">
                      {phone.releaseYear} • {phone.displaySize} • {phone.processor}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {showSearchResults && searchQuery.length >= 2 && searchResults.length === 0 && (
          <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a] border-2 border-[#2a2a1a] rounded-lg shadow-xl z-50 p-4">
            <p className="text-[#8B9B6E] text-center">
              Modelo não encontrado. Você pode preencher manualmente abaixo.
            </p>
          </div>
        )}
      </div>

      {/* Selected Phone Info - Auto-filled specs */}
      {selectedPhone && (
        <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#C9A87C] flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Especificações Preenchidas Automaticamente
            </h3>
            <span className="text-xs text-[#8B9B6E] bg-[#2a2a1a] px-3 py-1 rounded-full">
              Dados do fabricante
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-[#676767]">Tela:</span>
              <p className="text-[#E6C98B]">{selectedPhone.displaySize}</p>
            </div>
            <div>
              <span className="text-[#676767]">Processador:</span>
              <p className="text-[#E6C98B]">{selectedPhone.processor}</p>
            </div>
            <div>
              <span className="text-[#676767]">Câmera Principal:</span>
              <p className="text-[#E6C98B]">{selectedPhone.mainCamera.split(" + ")[0]}</p>
            </div>
            <div>
              <span className="text-[#676767]">Bateria:</span>
              <p className="text-[#E6C98B]">{selectedPhone.battery}</p>
            </div>
            <div>
              <span className="text-[#676767]">Carregamento:</span>
              <p className="text-[#E6C98B]">{selectedPhone.charging.split(",")[0]}</p>
            </div>
            <div>
              <span className="text-[#676767]">Sistema:</span>
              <p className="text-[#E6C98B]">{selectedPhone.os}</p>
            </div>
          </div>

          {/* Price reference */}
          {selectedPhone.priceRangeMin && selectedPhone.priceRangeMax && (
            <div className="mt-4 pt-4 border-t border-[#2a2a1a] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#6B7F5C]" />
              <span className="text-sm text-[#8B9B6E]">
                Preço de referência (novo): R$ {selectedPhone.priceRangeMin.toLocaleString("pt-BR")} - R$ {selectedPhone.priceRangeMax.toLocaleString("pt-BR")}
              </span>
            </div>
          )}
        </div>
      )}

      {/* User-specific specs - What varies per unit */}
      {selectedPhone && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-[#C9A87C]">
            Detalhes do Seu Aparelho
          </h3>

          {/* Storage Selection */}
          <div>
            <label className="block text-sm font-medium text-[#B8A890] mb-2">
              Capacidade de Armazenamento *
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedPhone.storage.map(storage => (
                <button
                  key={storage}
                  type="button"
                  onClick={() => setUserSpecs({ ...userSpecs, storage })}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    userSpecs.storage === storage
                      ? "bg-[#6B7F5C] border-[#6B7F5C] text-white"
                      : "bg-[#1a1a1a] border-[#2a2a1a] text-[#E6C98B] hover:border-[#6B7F5C]"
                  }`}
                >
                  {storage}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-[#B8A890] mb-2">
              Cor *
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedPhone.colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setUserSpecs({ ...userSpecs, color })}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    userSpecs.color === color
                      ? "bg-[#6B7F5C] border-[#6B7F5C] text-white"
                      : "bg-[#1a1a1a] border-[#2a2a1a] text-[#E6C98B] hover:border-[#6B7F5C]"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-[#B8A890] mb-2">
              Estado de Conservação *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {conditionOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setUserSpecs({ ...userSpecs, condition: option.value as UserSmartphoneSpecs["condition"] })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    userSpecs.condition === option.value
                      ? "bg-[#6B7F5C]/20 border-[#6B7F5C]"
                      : "bg-[#1a1a1a] border-[#2a2a1a] hover:border-[#6B7F5C]"
                  }`}
                >
                  <p className={`font-medium ${userSpecs.condition === option.value ? "text-[#A8C97F]" : "text-[#E6C98B]"}`}>
                    {option.label}
                  </p>
                  <p className="text-xs text-[#676767] mt-1">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Battery Health (for used phones) */}
          {userSpecs.condition !== "novo" && (
            <div>
              <label className="block text-sm font-medium text-[#B8A890] mb-2">
                Saúde da Bateria (opcional)
              </label>
              <input
                type="text"
                value={userSpecs.batteryHealth}
                onChange={(e) => setUserSpecs({ ...userSpecs, batteryHealth: e.target.value })}
                placeholder="Ex: 87%, Boa, Excelente..."
                className="w-full h-12 px-4 bg-[#1a1a1a] border-2 border-[#2a2a1a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:ring-2 focus:ring-[#6B7F5C]"
              />
            </div>
          )}

          {/* Accessories */}
          <div>
            <label className="block text-sm font-medium text-[#B8A890] mb-2">
              Acessórios Inclusos
            </label>
            <div className="flex flex-wrap gap-2">
              {accessoryOptions.map(accessory => (
                <button
                  key={accessory}
                  type="button"
                  onClick={() => toggleAccessory(accessory)}
                  className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                    userSpecs.accessories.includes(accessory)
                      ? "bg-[#6B7F5C] border-[#6B7F5C] text-white"
                      : "bg-[#1a1a1a] border-[#2a2a1a] text-[#B8A890] hover:border-[#6B7F5C]"
                  }`}
                >
                  {userSpecs.accessories.includes(accessory) && <Check className="inline w-4 h-4 mr-1" />}
                  {accessory}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-[#B8A890] mb-2">
              Observações Adicionais (opcional)
            </label>
            <textarea
              value={userSpecs.customNotes}
              onChange={(e) => setUserSpecs({ ...userSpecs, customNotes: e.target.value })}
              placeholder="Descreva detalhes adicionais, defeitos específicos, histórico do aparelho..."
              rows={3}
              className="w-full px-4 py-3 bg-[#1a1a1a] border-2 border-[#2a2a1a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:ring-2 focus:ring-[#6B7F5C] resize-none"
            />
          </div>
        </div>
      )}

      {/* Manual Entry Option */}
      {!selectedPhone && (
        <div className="text-center py-6 border-2 border-dashed border-[#2a2a1a] rounded-xl">
          <Smartphone className="w-12 h-12 mx-auto text-[#676767] mb-3" />
          <p className="text-[#8B9B6E] mb-2">
            Pesquise acima ou selecione uma marca para ver os modelos disponíveis
          </p>
          <p className="text-xs text-[#676767]">
            Se o seu modelo não estiver na lista, você poderá preencher manualmente
          </p>
        </div>
      )}

      {/* Popular Models Shortcut */}
      {!selectedPhone && !searchQuery && !selectedBrand && (
        <div>
          <p className="text-sm text-[#8B9B6E] mb-3">Modelos populares:</p>
          <div className="flex flex-wrap gap-2">
            {getRecentSmartphones().slice(0, 6).map(phone => (
              <button
                key={phone.id}
                type="button"
                onClick={() => handleSelectPhone(phone)}
                className="px-3 py-2 bg-[#1a1a1a] border border-[#2a2a1a] rounded-lg text-sm text-[#E6C98B] hover:border-[#6B7F5C] hover:bg-[#2a2a1a] transition-all"
              >
                {phone.model}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartphoneSelector;
