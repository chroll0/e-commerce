"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Hero() {
  const t = useTranslations("hero");
  const slides = t.raw("slides");

  const [index, setIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [direction, setDirection] = useState<"left" | "right">("right");

  // Autoplay
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length, isAutoPlay]);

  const handlePrev = () => {
    setDirection("left");
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
  };

  const handleNext = () => {
    setDirection("right");
    setIndex((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
  };

  const handleDotClick = (i: number) => {
    setDirection(i > index ? "right" : "left");
    setIndex(i);
    setIsAutoPlay(false);
  };

  const handleMouseEnter = () => setIsAutoPlay(false);
  const handleMouseLeave = () => setIsAutoPlay(true);

  const slide = slides[index];

  return (
    <section className="w-full">
      <style>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutToLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-100px);
          }
        }

        @keyframes slideOutToRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100px);
          }
        }

        .slide-in-content {
          animation: slideInFromRight 0.6s cubic-bezier(0.32, 0.72, 0.36, 1) forwards;
        }

        .slide-in-content-left {
          animation: slideInFromLeft 0.6s cubic-bezier(0.32, 0.72, 0.36, 1) forwards;
        }

        .slide-in-image {
          animation: slideInFromRight 0.8s cubic-bezier(0.32, 0.72, 0.36, 1) forwards;
        }

        .slide-in-image-left {
          animation: slideInFromLeft 0.8s cubic-bezier(0.32, 0.72, 0.36, 1) forwards;
        }
      `}</style>
      <div
        className="relative w-full h-[400px] md:h-[480px] rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden flex items-center group transition-shadow duration-500 hover:shadow-[0_12px_48px_rgba(0,0,0,0.16)]"
        style={{
          backgroundImage: `url('/content/hero_bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* BACKGROUND OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-transparent"></div>

        {/* LEFT CONTENT */}
        <div
          className={`pl-8 md:pl-12 flex flex-col gap-4 z-20 max-w-[520px] relative ${
            direction === "right" ? "slide-in-content" : "slide-in-content-left"
          }`}
        >
          {/* TAG */}
          <div className="inline-flex w-fit">
            <p className="text-xs md:text-sm font-semibold text-primary bg-primary/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-primary/30">
              {slide.tag}
            </p>
          </div>

          {/* TITLE */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white tracking-tight">
              {slide.title} <br />
              <span className="bg-linear-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                {slide.highlight}
              </span>
            </h1>
          </div>

          {/* DESCRIPTION */}
          <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-md">
            {slide.description}
          </p>

          {/* DOTS NAVIGATION */}
          <div className="flex gap-2 mt-6">
            {slides.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === index
                    ? "w-8 h-2.5 bg-primary shadow-lg shadow-primary/50"
                    : "w-2.5 h-2.5 bg-border hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div
          className={`absolute right-0 bottom-0 h-full flex items-end pr-4 md:pr-8 pointer-events-none z-20 ${
            direction === "right" ? "slide-in-image" : "slide-in-image-left"
          }`}
        >
          <Image
            src="/content/hero_clothes.png"
            alt="Hero"
            width={600}
            height={400}
            priority
            className="object-contain drop-shadow-2xl scale-100 group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* LEFT ARROW */}
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={handleNext}
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* SLIDE COUNTER */}
        <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8 z-30 text-sm font-medium text-white/70 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </div>
      </div>
    </section>
  );
}
