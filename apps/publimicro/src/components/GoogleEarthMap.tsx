"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function GoogleEarthMap({ lat = -18.977, lng = -48.273, zoom = 15 }) {
  const center: [number, number] = [lat, lng];

  return (
    <div className="w-full h-[400px] rounded-xl shadow-lg border-2 border-[#B7791F] overflow-hidden">
      <MapContainer center={center} zoom={zoom} className="w-full h-full">
        {/* OpenStreetMap tiles + optional Esri imagery */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>
            Localização: {lat.toFixed(4)}, {lng.toFixed(4)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

