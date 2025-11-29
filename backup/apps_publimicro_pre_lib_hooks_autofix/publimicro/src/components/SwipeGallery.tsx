"use client";

import { useState, useRef, useEffect, TouchEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

interface SwipeGalleryProps {
  images: string[];
  alt?: string;
  aspectRatio?: "video" | "square" | "portrait";
  showThumbnails?: boolean;
  showCounter?: boolean;
  enableFullscreen?: boolean;
  onImageChange?: (index: number) => void;
}

/**
 * Touch-optimized Image Gallery with Swipe Gestures
 * 
 * Features:
 * - Swipe left/right to navigate
 * - Smooth momentum scrolling
 * - Dot indicators
 * - Optional thumbnails
 * - Fullscreen mode
 * - Lazy loading
 * - Double-tap to zoom (future enhancement)
 * 
 * @example
 * <SwipeGallery 
 *   images={property.fotos} 
 *   alt={property.title}
 *   showThumbnails
 *   showCounter
 * />
 */
export default function SwipeGallery({
  images,
  alt = "Image",
  aspectRatio = "video",
  showThumbnails = false,
  showCounter = true,
  enableFullscreen = true,
  onImageChange,
}: SwipeGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = useState<string>("");

  // Aspect ratio classes
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
  };

  // Handle touch start
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  // Handle touch move
  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  // Handle touch end - determine swipe direction
  const handleTouchEnd = () => {
    const difference = touchStartX.current - touchEndX.current;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(difference) > threshold) {
      if (difference > 0) {
        // Swiped left - next image
        goToNext();
      } else {
        // Swiped right - previous image
        goToPrevious();
      }
    }

    // Reset
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onImageChange?.(newIndex);
    setAnnouncement(`Image ${newIndex + 1} of ${images.length}`);
  };

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    onImageChange?.(newIndex);
    setAnnouncement(`Image ${newIndex + 1} of ${images.length}`);
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    onImageChange?.(index);
    setAnnouncement(`Image ${index + 1} of ${images.length}`);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isFullscreen]);

  // Prevent scroll when in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  if (!images || images.length === 0) {
    return (
      <div className={`${aspectClasses[aspectRatio]} bg-[#1a1a1a] rounded-2xl flex items-center justify-center`}>
        <p className="text-[#676767]">Sem imagens disponíveis</p>
      </div>
    );
  }

  return (
    <>
      {/* Screen Reader Announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Main Gallery */}
      <div 
        className="relative group" 
        ref={containerRef}
        role="region"
        aria-label="Image gallery"
      >
        {/* Image Container */}
        <div
          className={`relative ${aspectClasses[aspectRatio]} bg-[#0a0a0a] rounded-2xl overflow-hidden`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={images[currentIndex]}
            alt={`${alt} - ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient Overlays for Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

          {/* Counter */}
          {showCounter && images.length > 1 && (
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Fullscreen Button */}
          {enableFullscreen && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute top-4 left-4 p-2 bg-black/70 backdrop-blur-sm rounded-full text-white hover:bg-black/90 transition-all focus:outline-none focus:ring-2 focus:ring-[#A8C97F] md:opacity-0 md:group-hover:opacity-100"
              aria-label="Ver em tela cheia"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          )}

          {/* Desktop Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/70 backdrop-blur-sm rounded-full text-white hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#A8C97F]"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/70 backdrop-blur-sm rounded-full text-white hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#A8C97F]"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`w-2 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#A8C97F] ${
                  index === currentIndex
                    ? "bg-[#A8C97F] w-6"
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Ir para imagem ${index + 1}`}
                aria-current={index === currentIndex ? "true" : "false"}
              />
            ))}
          </div>
        )}

        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#3a3a3a] scrollbar-track-[#1a1a1a]">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#A8C97F] ${
                  index === currentIndex
                    ? "border-[#A8C97F] scale-105"
                    : "border-[#2a2a1a] hover:border-[#3a3a3a]"
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-10 p-3 bg-black/70 backdrop-blur-sm rounded-full text-white hover:bg-black/90 transition-all focus:outline-none focus:ring-2 focus:ring-[#A8C97F]"
            aria-label="Fechar tela cheia"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Fullscreen Image */}
          <div
            className="relative w-full h-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={images[currentIndex]}
              alt={`${alt} - ${currentIndex + 1}`}
              fill
              className="object-contain"
              priority
              sizes="100vw"
            />

            {/* Counter in Fullscreen */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-full text-white font-semibold">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Navigation Arrows in Fullscreen */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/70 backdrop-blur-sm rounded-full text-white hover:bg-black/90 transition-all focus:outline-none focus:ring-2 focus:ring-[#A8C97F]"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/70 backdrop-blur-sm rounded-full text-white hover:bg-black/90 transition-all focus:outline-none focus:ring-2 focus:ring-[#A8C97F]"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Dot Indicators in Fullscreen */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#A8C97F] ${
                    index === currentIndex
                      ? "bg-[#A8C97F] w-8"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
