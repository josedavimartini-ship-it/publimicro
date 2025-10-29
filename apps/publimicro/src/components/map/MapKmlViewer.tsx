"use client";

import { useEffect, useRef } from "react";

type MapKmlViewerProps = {
  kmlUrl: string; // e.g. "/maps/carcara.kml"
  center?: google.maps.LatLngLiteral; // fallback center
  zoom?: number;
};

export default function MapKmlViewer({
  kmlUrl,
  center = { lat: -18.2795, lng: -48.8325 },
  zoom = 15,
}: MapKmlViewerProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let map: google.maps.Map | null = null;
    let kmlLayer: google.maps.KmlLayer | null = null;

    const init = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.warn("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
      }
      // Load Google Maps script (one-time)
      if (!(window as any).google?.maps) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Google Maps"));
          document.head.appendChild(script);
        });
      }
      if (!ref.current) return;

      map = new google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeId: "satellite",
        disableDefaultUI: false,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#0b0b0b" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#bfa97a" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#0b0b0b" }] },
        ],
      });

      kmlLayer = new google.maps.KmlLayer({
        url: `${location.origin}${kmlUrl}`,
        map,
        preserveViewport: false,
        suppressInfoWindows: false,
      });

      kmlLayer.addListener("status_changed", () => {
        const status = kmlLayer?.getStatus();
        if (status !== "OK") console.warn("KML status:", status);
      });
    };

    init();
    return () => {
      // Maps API cleans itself when element is removed; just null refs
      map = null;
      kmlLayer = null;
    };
  }, [kmlUrl, center, zoom]);

  return <div ref={ref} className="w-full h-[420px] rounded-xl border border-[#242424]" />;
}