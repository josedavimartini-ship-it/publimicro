// ...existing code...
"use client";

import { useEffect, useRef, useState } from "react";

export default function BirdAudioToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/carcara.mp3");
      audioRef.current.loop = true;
      audioRef.current.preload = "auto";
      audioRef.current.volume = 0.35;
    }

    // Expose a small, safe controller on window so other client code (Carcara3D) can trigger sound.
    // This avoids complex prop drilling / context for a simple play/pause API.
    const controller = {
      play: async () => {
        if (!audioRef.current) return;
        try {
          await audioRef.current.play();
          setPlaying(true);
        } catch {
          // play() may be blocked by browser autoplay rules until user interacts
          setPlaying(false);
        }
      },
      pause: () => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        setPlaying(false);
      },
      toggle: async () => {
        if (!audioRef.current) return;
        if (audioRef.current.paused) {
          await controller.play();
        } else {
          controller.pause();
        }
      },
      isPlaying: () => !!audioRef.current && !audioRef.current.paused,
    };

    ;(window as any).__publimicroCarcaraAudio = controller;

    return () => {
      audioRef.current?.pause();
      try {
        delete (window as any).__publimicroCarcaraAudio;
      } catch {}
    };
  }, []);

  const toggle = async () => {
    const ctrl = (window as any).__publimicroCarcaraAudio;
    if (ctrl?.toggle) {
      await ctrl.toggle();
      // playing state will be synced by controller calling setPlaying
      return;
    }

    // Fallback if controller not present for any reason
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={playing}
      className="inline-flex items-center gap-2 rounded-full bg-[#111] px-3 py-2 text-sm text-[#bfa97a] hover:bg-[#161616]"
      title="Ativar / desativar som do Carcará"
    >
      <span>{playing ? "🔊" : "🔈"}</span>
      <span className="sr-only">{playing ? "Som ligado" : "Som desligado"}</span>
      <span className="hidden sm:inline">{playing ? "Som" : "Som"}</span>
    </button>
  );
}
// ...existing code...