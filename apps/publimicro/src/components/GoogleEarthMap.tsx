"use client";

import { useEffect, useRef } from "react";

export default function GoogleEarthMap({ lat = -18.977, lng = -48.273, zoom = 15 }) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const googleMaps = (window as any).google;
    if (googleMaps && mapRef.current) {
      try {
        // Initialize a Google Maps map if the API is available
        // Use minimal typing to avoid hard dependency on @types/googlemaps
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const MapConstructor = (googleMaps.maps || (googleMaps as any)).Map;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new MapConstructor(mapRef.current, {
          center: { lat, lng },
          zoom,
          mapTypeId: "satellite",
          tilt: 45,
        });
      } catch {
        // silently ignore initialization errors in environments without the full API
      }
    }
  }, [lat, lng, zoom]);

  return (
    <div className="w-full h-[400px] rounded-xl shadow-lg border-2 border-[#B7791F] overflow-hidden">
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

