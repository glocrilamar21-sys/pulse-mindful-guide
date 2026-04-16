import { useState, useEffect, useCallback } from "react";
import { heroSlides } from "@/lib/heroData";
import { useI18n } from "@/lib/i18n";

export function HeroBanner() {
  const { locale } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const nextSlide = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
      setFadeIn(true);
    }, 600);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const slide = heroSlides[currentIndex];

  return (
    <div className="relative rounded-2xl overflow-hidden h-40">
      {/* Background image with crossfade */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out"
        style={{
          backgroundImage: `url(${slide.image})`,
          opacity: fadeIn ? 1 : 0,
        }}
      />
      {/* Persistent gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 z-10" />
      {/* Text content */}
      <div className="relative z-20 h-full flex flex-col justify-end p-5">
        <p
          className="text-xs font-semibold uppercase tracking-widest text-white/80 mb-1 transition-all duration-500"
          style={{ opacity: fadeIn ? 1 : 0, transform: fadeIn ? "translateY(0)" : "translateY(8px)" }}
        >
          {slide.subtitles[locale]}
        </p>
        <h2
          className="text-2xl font-extrabold text-white leading-tight transition-all duration-500"
          style={{ opacity: fadeIn ? 1 : 0, transform: fadeIn ? "translateY(0)" : "translateY(8px)" }}
        >
          {slide.messages[locale]}
        </h2>
      </div>
      {/* Slide indicators */}
      <div className="absolute bottom-2 right-4 z-20 flex gap-1.5">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setFadeIn(false);
              setTimeout(() => {
                setCurrentIndex(i);
                setFadeIn(true);
              }, 400);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              i === currentIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
