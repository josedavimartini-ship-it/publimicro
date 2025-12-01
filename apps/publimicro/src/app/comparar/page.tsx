"use client";

import React, { useState, useEffect, type ElementType } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { X, ArrowLeft, Share2, Download, MapPin, Maximize2, DollarSign } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

interface Property {
  id: string;
  nome: string;
  localizacao: string;
  preco: number;
  area_total: number;
  fotos: string[];
  descricao: string;
  agua: boolean;
  energia: boolean;
  internet: boolean;
}

interface ComparisonRow {
  label: string;
  key: keyof Property | 'preco_ha';
  icon?: ElementType;
  suffix?: string;
  format?: (value: unknown, property?: Property) => string;
}

export default function ComparePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    // Load selected property IDs from URL params
    const params = new URLSearchParams(window.location.search);
    const ids = params.get("ids")?.split(",").filter(Boolean) || [];
    setSelectedIds(ids);
    
    if (ids.length > 0) {
      void loadProperties(ids);
    } else {
      setLoading(false);
    }
  }, []);

  const loadProperties = async (ids: string[]) => {
    try {
      const { data, error } = await supabase
        .from("sitios")
        .select("*")
        .in("id", ids);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeProperty = (id: string) => {
    const newIds = selectedIds.filter(selectedId => selectedId !== id);
    setSelectedIds(newIds);
    setProperties(properties.filter(p => p.id !== id));
    
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("ids", newIds.join(","));
    window.history.pushState({}, "", url);
  };

  const shareComparison = () => {
    const url = window.location.href;
    void navigator.clipboard.writeText(url);
    alert("Link copiado! Compartilhe com sua família ou sócio.");
  };

  const downloadPDF = () => {
    // TODO: Implement PDF generation
    alert("Funcionalidade de download PDF em desenvolvimento!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-[#A8C97F] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#8B9B6E]">Carregando comparação...</p>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-2 text-[#8B9B6E] hover:text-[#A8C97F] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Propriedades
          </Link>

          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-[#2a2a1a] rounded-full flex items-center justify-center">
              <MapPin className="w-16 h-16 text-[#676767]" />
            </div>
            <h2 className="text-2xl font-bold text-[#E6C98B] mb-3">
              Nenhuma propriedade selecionada
            </h2>
            <p className="text-[#8B9B6E] mb-6">
              Selecione até 3 propriedades para comparar
            </p>
            <Link
              href="/imoveis"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#6B7F5C] to-[#2C5F6F] hover:from-[#7A8F6B] hover:to-[#3A6F7F] text-[#D4C4A8] font-bold rounded-full hover:scale-105 transition-all shadow-lg"
            >
              Buscar Propriedades
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const comparisonRows: ComparisonRow[] = [
    { label: "Localização", key: "localizacao", icon: MapPin },
    { label: "Área Total", key: "area_total", suffix: " hectares", icon: Maximize2 },
    {
      label: "Preço",
      key: "preco",
      format: (v: unknown) => (typeof v === "number" ? `R$ ${v.toLocaleString("pt-BR")}` : "-"),
      icon: DollarSign,
    },
    {
      label: "Preço por Hectare",
      key: "preco_ha",
      format: (_v: unknown, p?: Property) => (p && p.area_total ? `R$ ${Math.round(p.preco / p.area_total).toLocaleString("pt-BR")}` : "N/A"),
    },
    { label: "Água", key: "agua", format: (v: unknown) => (v === true ? "✅ Sim" : "❌ Não") },
    { label: "Energia Elétrica", key: "energia", format: (v: unknown) => (v === true ? "✅ Sim" : "❌ Não") },
    { label: "Internet", key: "internet", format: (v: unknown) => (v === true ? "✅ Sim" : "❌ Não") },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E6C98B] to-[#A8C97F] mb-2">
              Comparar Propriedades
            </h1>
            <p className="text-[#8B9B6E]">
              Comparando {properties.length} {properties.length === 1 ? "propriedade" : "propriedades"}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={shareComparison}
              className="flex items-center gap-2 px-4 py-2 border-2 border-[#E6C98B] text-[#E6C98B] font-semibold rounded-lg hover:bg-[#E6C98B]/10 transition-all"
              aria-label="Compartilhar comparação"
            >
              <Share2 className="w-5 h-5" />
              Compartilhar
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6B7F5C] to-[#2C5F6F] hover:from-[#7A8F6B] hover:to-[#3A6F7F] text-[#D4C4A8] font-bold rounded-lg hover:scale-105 transition-all shadow-lg"
              aria-label="Baixar comparação em PDF"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-2 border-[#2a2a1a] rounded-2xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d]">
                <th className="p-4 text-left text-[#8B9B6E] font-semibold border-b-2 border-[#2a2a1a] sticky left-0 bg-[#1a1a1a]">
                  Característica
                </th>
                {properties.map((property) => (
                  <th key={property.id} className="p-4 border-b-2 border-[#2a2a1a] min-w-[250px]">
                    <div className="relative">
                      <button
                        onClick={() => removeProperty(property.id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                        aria-label={`Remover ${property.nome} da comparação`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      <div className="w-full h-32 bg-[#2a2a1a] rounded-lg overflow-hidden mb-3">
                        {property.fotos && property.fotos[0] ? (
                          <Image
                            src={property.fotos[0]}
                            alt={property.nome}
                            width={200}
                            height={128}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-[#959595]" />
                          </div>
                        )}
                      </div>
                      
                      <Link
                        href={`/imoveis/${property.id}`}
                        className="text-[#E6C98B] font-bold hover:text-[#A8C97F] transition-colors"
                      >
                        {property.nome}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, index) => {
                const Icon = row.icon;
                return (
                  <tr
                    key={row.key}
                    className={index % 2 === 0 ? "bg-[#0a0a0a]" : "bg-[#0d0d0d]"}
                  >
                    <td className="p-4 text-[#8B9B6E] font-semibold border-b border-[#2a2a1a] sticky left-0 bg-inherit">
                      <div className="flex items-center gap-2">
                        {Icon ? React.createElement(Icon as any, { className: "w-4 h-4" }) : null}
                        {row.label}
                      </div>
                    </td>
                    {properties.map((property) => (
                      <td key={property.id} className="p-4 text-[#E6C98B] border-b border-[#2a2a1a]">
                        {
                          (() => {
                            let cellContent: React.ReactNode = null;
                            if (row.format) {
                              try {
                                cellContent = row.key === "preco_ha"
                                  ? row.format(undefined, property)
                                  : row.format((property as unknown as Record<string, unknown>)[row.key as string], property);
                              } catch {
                                cellContent = null;
                              }
                            } else if (row.key === "preco_ha") {
                              cellContent = "-";
                            } else {
                              const val = (property as unknown as Record<string, unknown>)[row.key as string];
                              cellContent = val === undefined || val === null ? '' : String(val);
                            }
                            return cellContent;
                          })()
                        }
                        {row.suffix && (property as unknown as Record<string, unknown>)[row.key as string] && <>{row.suffix}</>}
                      </td>
                    ))}
                  </tr>
                );
              })}
              
              {/* Description Row */}
              <tr className="bg-[#0a0a0a]">
                <td className="p-4 text-[#8B9B6E] font-semibold border-b border-[#2a2a1a] sticky left-0 bg-[#0a0a0a]">
                  Descrição
                </td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4 text-[#676767] text-sm border-b border-[#2a2a1a]">
                    {property.descricao || "Sem descrição"}
                  </td>
                ))}
              </tr>

              {/* Action Row */}
              <tr className="bg-[#0d0d0d]">
                <td className="p-4 sticky left-0 bg-[#0d0d0d]"></td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4">
                    <Link
                      href={`/imoveis/${property.id}`}
                      className="block w-full text-center px-4 py-3 bg-gradient-to-r from-[#6B7F5C] to-[#2C5F6F] hover:from-[#7A8F6B] hover:to-[#3A6F7F] text-[#D4C4A8] font-bold rounded-lg hover:scale-105 transition-all shadow-lg"
                    >
                      Ver Detalhes
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Add More Properties */}
        {properties.length < 3 && (
          <div className="mt-8 text-center">
            <p className="text-[#8B9B6E] mb-4">
              Você pode comparar até {3 - properties.length} {3 - properties.length === 1 ? "propriedade" : "propriedades"} adicionais
            </p>
            <Link
              href="/imoveis"
              className="inline-block px-6 py-3 border-2 border-[#E6C98B] text-[#E6C98B] font-semibold rounded-full hover:bg-[#E6C98B]/10 transition-all"
            >
              + Adicionar Propriedade
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

