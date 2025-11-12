"use client";

import { useEffect, useRef } from "react";

export default function GoogleEarthMap({ lat = -18.977, lng = -48.273, zoom = 15 }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const googleMaps = window.google;
    if (googleMaps && mapRef.current) {
      const map = new googleMaps.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom,
        mapTypeId: "satellite",
        tilt: 45,
      });
    }
  }, [lat, lng, zoom]);

  return (
    <div className="w-full h-[400px] rounded-xl shadow-lg border-2 border-[#B7791F] overflow-hidden">
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
