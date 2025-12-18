"use client";

import { useEffect, useState } from "react";
import LeafletMapKML from "@/components/LeafletMapKML";

type MapKmlViewerProps = {
  kmlUrl: string; // e.g. "/maps/carcara.kml"
  center?: { lat: number; lng: number };
  zoom?: number;
};

export default function MapKmlViewer({
  kmlUrl,
  center = { lat: -18.2795, lng: -48.8325 },
  zoom = 15,
}: MapKmlViewerProps) {
  const [kmlData, setKmlData] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchKml = async () => {
      try {
        const res = await fetch(kmlUrl);
        if (!res.ok) throw new Error(`Failed to fetch KML: ${res.status}`);
        const text = await res.text();
        if (!cancelled) setKmlData(text);
      } catch (err) {
        console.warn("MapKmlViewer: failed to load KML, ensure the file exists and is accessible", err);
      }
    };

    void fetchKml();
    return () => { cancelled = true; };
  }, [kmlUrl]);

  if (!kmlData) {
    return <div className="w-full h-[420px] rounded-xl border border-[#242424] flex items-center justify-center text-sm text-[#8B9B6E]">Carregando mapa...</div>;
  }

  // Delegate to the existing Leaflet-based KML parser and renderer
  return <LeafletMapKML kmlData={kmlData} center={[center.lat, center.lng]} zoom={zoom} />;
}
