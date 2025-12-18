"use client";

import { useState, useEffect } from "react";
import { Users, TrendingUp, Star, MapPin } from "lucide-react";
import Image from "next/image";

export function LiveCounter() {
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    // Simulate online users count (replace with real-time connection later)
    const baseCount = 280;
    const variance = 60;
    setOnlineUsers(Math.floor(baseCount + Math.random() * variance));

    // Update every 10 seconds
    const interval = setInterval(() => {
      setOnlineUsers(Math.floor(baseCount + Math.random() * variance));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-2 border-[#8B9B6E]/30 rounded-full">
      <div className="relative">
        <Users className="w-5 h-5 text-[#8B9B6E]" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#8B9B6E] rounded-full animate-pulse" />
      </div>
      <span className="text-[#8B9B6E] font-semibold text-sm">
        {onlineUsers} pessoas online
      </span>
    </div>
  );
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Array<{
    id: string;
    text: string;
    time: string;
    icon: React.ComponentType<{ className?: string }>;
  }>>([]);

  useEffect(() => {
    // Sample activities (replace with real-time data)
    const sampleActivities = [
      {
        id: "1",
        text: "João de São Paulo fez um lance em Sítio Canário",
        time: "2 min atrás",
        icon: TrendingUp
      },
      {
        id: "2",
        text: "Maria de Goiânia favoritou uma propriedade",
        time: "5 min atrás",
        icon: Star
      },
      {
        id: "3",
        text: "Pedro de Brasília visitou 3 propriedades",
        time: "8 min atrás",
        icon: MapPin
      }
    ];

    setActivities(sampleActivities);

    // Rotate activities every 5 seconds
    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivities = [...prev];
        const first = newActivities.shift();
        if (first) newActivities.push(first);
        return newActivities;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (activities.length === 0) return null;

  const currentActivity = activities[0];
  const Icon = currentActivity.icon;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-xl animate-fade-in">
      <div className="p-2 bg-[#6B7F5C]/20 rounded-full">
        <Icon className="w-4 h-4 text-[#6B7F5C]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#C9A87C] text-sm font-medium truncate">
          {currentActivity.text}
        </p>
        <p className="text-[#676767] text-xs">{currentActivity.time}</p>
      </div>
    </div>
  );
}

export function Testimonials() {
  const testimonials = [
    {
      id: "1",
      name: "Carlos Silva",
      location: "São Paulo, SP",
      rating: 5,
      text: "Encontrei a fazenda dos meus sonhos através do PubliMicro. Processo transparente e equipe super atenciosa!",
      image: "https://i.pravatar.cc/150?img=12"
    },
    {
      id: "2",
      name: "Ana Oliveira",
      location: "Goiânia, GO",
      rating: 5,
      text: "Excelente plataforma! O sistema de lances é muito justo e consegui fazer um ótimo negócio.",
      image: "https://i.pravatar.cc/150?img=45"
    },
    {
      id: "3",
      name: "Roberto Santos",
      location: "Brasília, DF",
      rating: 5,
      text: "Recomendo! Transparência total nas negociações e propriedades verificadas. Valeu muito a pena!",
      image: "https://i.pravatar.cc/150?img=33"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const testimonial = testimonials[currentIndex];

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-[#6B7F5C] relative overflow-hidden flex-shrink-0">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            sizes="64px"
            className="object-cover"
            unoptimized
          />
        </div>
        <div>
          <h4 className="text-[#C9A87C] font-bold">{testimonial.name}</h4>
          <p className="text-[#B8A890] text-sm">{testimonial.location}</p>
          <div className="flex gap-1 mt-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-[#B7791F] fill-current" />
            ))}
          </div>
        </div>
      </div>
      
      <p className="text-[#B8A890] text-lg italic leading-relaxed">
        "{testimonial.text}"
      </p>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-[#6B7F5C] w-6" : "bg-[#2a2a1a]"
            }`}
            aria-label={`Ver depoimento ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function TrustBadges() {
  const badges = [
    { icon: "✓", label: "Propriedades Verificadas", color: "text-[#6B7F5C]" },
    { icon: "🔒", label: "Pagamento Seguro", color: "text-[#2C5F6F]" },
    { icon: "⭐", label: "4.8/5 Avaliação", color: "text-[#9B6B3E]" },
    { icon: "🏆", label: "Melhor Plataforma 2024", color: "text-[#C9A87C]" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-2 px-4 py-6 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-xl hover:border-[#A8C97F] transition-all"
        >
          <span className="text-3xl">{badge.icon}</span>
          <span className={`${badge.color} font-semibold text-sm text-center`}>
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  );
}
