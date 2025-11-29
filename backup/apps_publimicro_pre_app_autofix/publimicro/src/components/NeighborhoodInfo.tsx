"use client";

import { 
  Heart, 
  GraduationCap, 
  ShoppingCart, 
  Fuel, 
  Wifi, 
  MapPin,
  Building2,
  Stethoscope,
  University,
  Pill
} from "lucide-react";
import { formatDistance, getDistanceQuality } from "@/lib/distanceUtils";

export interface NeighborhoodData {
  // Healthcare
  nearest_hospital_name?: string | null;
  nearest_hospital_distance_km?: number | null;
  nearest_clinic_name?: string | null;
  nearest_clinic_distance_km?: number | null;
  
  // Education
  nearest_school_name?: string | null;
  nearest_school_distance_km?: number | null;
  nearest_university_name?: string | null;
  nearest_university_distance_km?: number | null;
  
  // Shopping & Services
  nearest_supermarket_name?: string | null;
  nearest_supermarket_distance_km?: number | null;
  nearest_pharmacy_name?: string | null;
  nearest_pharmacy_distance_km?: number | null;
  nearest_gas_station_name?: string | null;
  nearest_gas_station_distance_km?: number | null;
  nearest_bank_name?: string | null;
  nearest_bank_distance_km?: number | null;
  
  // Infrastructure
  road_condition?: 'paved' | 'gravel' | 'dirt' | 'mixed' | null;
  road_quality?: 'excellent' | 'good' | 'fair' | 'poor' | null;
  internet_available?: boolean;
  internet_type?: 'fiber' | 'cable' | 'satellite' | '4G' | '5G' | 'none' | null;
  internet_speed_mbps?: number | null;
  mobile_signal_quality?: 'excellent' | 'good' | 'fair' | 'poor' | 'none' | null;
  
  // Location
  distance_to_city_center_km?: number | null;
  nearest_city_name?: string | null;
  urban_area?: boolean;
  rural_area?: boolean;
}

interface POIBadgeProps {
  icon: React.ReactNode;
  label: string;
  distance?: number | null;
  name?: string | null;
  quality?: 'excellent' | 'good' | 'moderate' | 'far';
  type: string;
}

function POIBadge({ icon, label, distance, name, type }: POIBadgeProps) {
  if (!distance || !name) return null;
  
  const quality = getDistanceQuality(distance, type);
  
  const qualityColors = {
    excellent: 'bg-green-500/20 border-green-500/40 text-green-400',
    good: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
    moderate: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
    far: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
  };
  
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${qualityColors[quality]} transition-all hover:scale-105`}>
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold">{label}</div>
        <div className="text-xs opacity-80 truncate" title={name}>{name}</div>
      </div>
      <div className="text-sm font-bold whitespace-nowrap">
        {formatDistance(distance)}
      </div>
    </div>
  );
}

interface NeighborhoodInfoProps {
  data: NeighborhoodData;
  compact?: boolean;
  showTitle?: boolean;
}

export default function NeighborhoodInfo({ data, compact = false, showTitle = true }: NeighborhoodInfoProps) {
  const hasPOIData = 
    data.nearest_hospital_distance_km || 
    data.nearest_school_distance_km || 
    data.nearest_supermarket_distance_km ||
    data.nearest_gas_station_distance_km;
  
  if (!hasPOIData && !data.internet_available && !data.road_condition) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      {showTitle && (
        <h3 className="text-xl font-bold text-[#E6C98B] flex items-center gap-2">
          <MapPin className="w-6 h-6" />
          Região & Proximidades
        </h3>
      )}
      
      {/* Location Summary */}
      {(data.nearest_city_name || data.distance_to_city_center_km) && (
        <div className="flex items-center gap-2 text-sm text-[#8B9B6E]">
          <Building2 className="w-4 h-4" />
          {data.nearest_city_name && <span>{data.nearest_city_name}</span>}
          {data.distance_to_city_center_km && (
            <span className="font-semibold">
              {formatDistance(data.distance_to_city_center_km)} do centro
            </span>
          )}
          {data.rural_area && (
            <span className="px-2 py-0.5 bg-[#8B9B6E]/20 rounded text-xs">Zona Rural</span>
          )}
          {data.urban_area && (
            <span className="px-2 py-0.5 bg-[#A8C97F]/20 rounded text-xs">Zona Urbana</span>
          )}
        </div>
      )}
      
      {/* POI Grid */}
      <div className={`grid gap-3 ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {/* Healthcare */}
        <POIBadge
          icon={<Heart className="w-5 h-5" strokeWidth={2} />}
          label="Hospital"
          distance={data.nearest_hospital_distance_km}
          name={data.nearest_hospital_name}
          type="hospital"
        />
        
        <POIBadge
          icon={<Stethoscope className="w-5 h-5" strokeWidth={2} />}
          label="Posto de Saúde"
          distance={data.nearest_clinic_distance_km}
          name={data.nearest_clinic_name}
          type="clinic"
        />
        
        {/* Education */}
        <POIBadge
          icon={<GraduationCap className="w-5 h-5" strokeWidth={2} />}
          label="Escola"
          distance={data.nearest_school_distance_km}
          name={data.nearest_school_name}
          type="school"
        />
        
        <POIBadge
          icon={<University className="w-5 h-5" strokeWidth={2} />}
          label="Universidade"
          distance={data.nearest_university_distance_km}
          name={data.nearest_university_name}
          type="university"
        />
        
        {/* Shopping & Services */}
        <POIBadge
          icon={<ShoppingCart className="w-5 h-5" strokeWidth={2} />}
          label="Supermercado"
          distance={data.nearest_supermarket_distance_km}
          name={data.nearest_supermarket_name}
          type="supermarket"
        />
        
        <POIBadge
          icon={<Pill className="w-5 h-5" strokeWidth={2} />}
          label="Farmácia"
          distance={data.nearest_pharmacy_distance_km}
          name={data.nearest_pharmacy_name}
          type="pharmacy"
        />
        
        <POIBadge
          icon={<Fuel className="w-5 h-5" strokeWidth={2} />}
          label="Posto de Gasolina"
          distance={data.nearest_gas_station_distance_km}
          name={data.nearest_gas_station_name}
          type="gas_station"
        />
        
        <POIBadge
          icon={<Building2 className="w-5 h-5" strokeWidth={2} />}
          label="Banco"
          distance={data.nearest_bank_distance_km}
          name={data.nearest_bank_name}
          type="bank"
        />
      </div>
      
      {/* Infrastructure Info */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-[#2a2a1a]">
        {/* Internet */}
        {data.internet_available && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#A8C97F]/20 to-[#0D7377]/20 border border-[#A8C97F]/30 rounded-lg">
            <Wifi className="w-4 h-4 text-[#A8C97F]" strokeWidth={2} />
            <span className="text-sm font-semibold text-[#E6C98B]">
              {data.internet_type === 'fiber' && '🚀 Internet Fibra'}
              {data.internet_type === 'satellite' && '📡 Internet Satélite'}
              {data.internet_type === '4G' && '📱 Internet 4G'}
              {data.internet_type === '5G' && '📱 Internet 5G'}
              {data.internet_type === 'cable' && '🔌 Internet Cabo'}
              {!data.internet_type && 'Internet Disponível'}
            </span>
            {data.internet_speed_mbps && (
              <span className="text-xs text-[#8B9B6E]">
                {data.internet_speed_mbps} Mbps
              </span>
            )}
          </div>
        )}
        
        {/* Road Condition */}
        {data.road_condition && (
          <div className="flex items-center gap-2 px-3 py-2 bg-[#2a2a1a] border border-[#3a3a2a] rounded-lg">
            <span className="text-sm text-[#8B9B6E]">
              Via de Acesso:
            </span>
            <span className="text-sm font-semibold text-[#E6C98B]">
              {data.road_condition === 'paved' && '✅ Asfaltada'}
              {data.road_condition === 'gravel' && '🟡 Cascalho'}
              {data.road_condition === 'dirt' && '🔶 Terra'}
              {data.road_condition === 'mixed' && '🔀 Mista'}
            </span>
            {data.road_quality && (
              <span className="text-xs text-[#8B9B6E]">
                ({data.road_quality === 'excellent' ? 'Excelente' :
                  data.road_quality === 'good' ? 'Bom' :
                  data.road_quality === 'fair' ? 'Regular' : 'Ruim'})
              </span>
            )}
          </div>
        )}
        
        {/* Mobile Signal */}
        {data.mobile_signal_quality && data.mobile_signal_quality !== 'none' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-[#2a2a1a] border border-[#3a3a2a] rounded-lg">
            <span className="text-sm text-[#8B9B6E]">
              Sinal Celular:
            </span>
            <span className="text-sm font-semibold text-[#E6C98B]">
              {data.mobile_signal_quality === 'excellent' && '📶 Excelente'}
              {data.mobile_signal_quality === 'good' && '📶 Bom'}
              {data.mobile_signal_quality === 'fair' && '📶 Regular'}
              {data.mobile_signal_quality === 'poor' && '📶 Fraco'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
