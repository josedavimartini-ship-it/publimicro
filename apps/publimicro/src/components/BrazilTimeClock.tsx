"use client";

import { useState, useEffect } from "react";
import { Clock, MapPin, Sun, Moon } from "lucide-react";

interface TimeZoneInfo {
  name: string;
  offset: string;
  cities: string[];
  emoji: string;
}

const BRAZIL_TIMEZONES: TimeZoneInfo[] = [
  {
    name: "Horário de Brasília",
    offset: "UTC-3",
    cities: ["Brasília", "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador", "Goiânia"],
    emoji: "🏛️",
  },
  {
    name: "Horário do Amazonas",
    offset: "UTC-4",
    cities: ["Manaus", "Porto Velho", "Boa Vista", "Rio Branco"],
    emoji: "🌳",
  },
  {
    name: "Horário de Fernando de Noronha",
    offset: "UTC-2",
    cities: ["Fernando de Noronha"],
    emoji: "🏝️",
  },
];

export default function BrazilTimeClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, offset: string): string => {
    const offsetHours = parseInt(offset.replace("UTC", ""));
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
    const localTime = new Date(utcTime + offsetHours * 3600000);
    
    return localTime.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isDaytime = (): boolean => {
    const hours = currentTime.getHours();
    return hours >= 6 && hours < 18;
  };

  const getGreeting = (): string => {
    const hours = currentTime.getHours();
    if (hours < 12) return "Bom dia";
    if (hours < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#CD7F32]/30 rounded-2xl p-6 shadow-2xl">
      {/* Greeting */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {isDaytime() ? (
            <Sun className="w-8 h-8 text-[#D4AF37]" />
          ) : (
            <Moon className="w-8 h-8 text-[#B87333]" />
          )}
          <div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#CD7F32]">
              {getGreeting()}!
            </h3>
            <p className="text-sm text-[#8B9B6E]">Brasil</p>
          </div>
        </div>
        <Clock className="w-6 h-6 text-[#A8C97F] animate-pulse" />
      </div>

      {/* Main Time Display */}
      <div className="bg-[#0a0a0a] rounded-xl p-6 mb-4 border border-[#2a2a1a]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">{BRAZIL_TIMEZONES[selectedTimezone].emoji}</span>
          <h4 className="text-[#E6C98B] font-semibold">
            {BRAZIL_TIMEZONES[selectedTimezone].name}
          </h4>
          <span className="ml-auto text-xs text-[#676767] bg-[#1a1a1a] px-2 py-1 rounded">
            {BRAZIL_TIMEZONES[selectedTimezone].offset}
          </span>
        </div>

        {/* Digital Clock */}
        <div className="text-center mb-4">
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#CD7F32] tabular-nums tracking-tight">
            {formatTime(currentTime, BRAZIL_TIMEZONES[selectedTimezone].offset)}
          </div>
          <div className="text-[#8B9B6E] text-sm mt-2 capitalize">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Cities */}
        <div className="flex flex-wrap gap-2 justify-center">
          {BRAZIL_TIMEZONES[selectedTimezone].cities.map((city) => (
            <span
              key={city}
              className="text-xs bg-[#1a1a1a] text-[#B7791F] px-3 py-1 rounded-full border border-[#CD7F32]/20"
            >
              <MapPin className="w-3 h-3 inline mr-1" />
              {city}
            </span>
          ))}
        </div>
      </div>

      {/* Timezone Selector */}
      <div className="grid grid-cols-3 gap-2">
        {BRAZIL_TIMEZONES.map((tz, index) => (
          <button
            key={index}
            onClick={() => setSelectedTimezone(index)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              selectedTimezone === index
                ? "bg-gradient-to-r from-[#CD7F32] to-[#B87333] text-[#0a0a0a] shadow-lg"
                : "bg-[#2a2a1a] text-[#8B9B6E] hover:bg-[#3a3a2a] hover:text-[#A8C97F]"
            }`}
          >
            <span className="block">{tz.emoji}</span>
            <span className="block text-[10px] mt-1">{tz.offset}</span>
          </button>
        ))}
      </div>

      {/* Fun Fact */}
      <div className="mt-4 p-3 bg-[#0a0a0a] rounded-lg border border-[#CD7F32]/20">
        <p className="text-xs text-[#8B9B6E] text-center">
          ⏰ <span className="text-[#E6C98B]">Curiosidade:</span> O Brasil tem 4 fusos horários diferentes,
          abrangendo {BRAZIL_TIMEZONES.reduce((acc, tz) => acc + tz.cities.length, 0)} cidades principais!
        </p>
      </div>
    </div>
  );
}
