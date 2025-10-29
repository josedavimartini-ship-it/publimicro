// ...existing code...
"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function BirdAudioToggle() {
  const [isMuted, setIsMuted] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audioEl = new Audio("/sounds/carcara.mp3");
    audioEl.loop = false;
    audioEl.volume = 0.4;
    setAudio(audioEl);

    // Expose globally for Carcara3D to trigger
    (window as any).__publimicroCarcaraAudio = {
      play: () => {
        if (!isMuted && audioEl) {
          audioEl.currentTime = 0;
          audioEl.play().catch(console.warn);
        }
      },
    };

    return () => {
      audioEl.pause();
      delete (window as any).__publimicroCarcaraAudio;
    };
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <button
      onClick={toggleMute}
      className="rounded-full bg-[#1a1a1a] hover:bg-[#252525] p-2.5 transition-all border border-[#3a3a2a]"
      title={isMuted ? "Ativar som do carcará" : "Desativar som"}
      aria-label={isMuted ? "Ativar som" : "Desativar som"}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-[#676767]" />
      ) : (
        <Volume2 className="w-5 h-5 text-[#FF6B35]" />
      )}
    </button>
  );
}
// ...existing code...