"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useTranslations } from "next-intl";
import styles from "./hero.module.css";
import { Button } from "@/components";
import Image from "next/image";

export default function Hero() {
  const t = useTranslations("hero");
  const slides = t.raw("slides");

  const autoplayRef = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      containScroll: "trimSnaps",
      dragFree: false,
    },
    [autoplayRef.current],
  );

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const prevIndexRef = useRef(0);

  const resetAutoplay = useCallback(() => {
    const plugin: any = emblaApi?.plugins()?.autoplay;
    plugin?.reset();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const newIndex = emblaApi.selectedScrollSnap();
    setDirection(newIndex > prevIndexRef.current ? "right" : "left");
    prevIndexRef.current = newIndex;
    setIndex(newIndex);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    emblaApi.on("pointerUp", resetAutoplay);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("pointerUp", resetAutoplay);
    };
  }, [emblaApi, onSelect, resetAutoplay]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    resetAutoplay();
  }, [emblaApi, resetAutoplay]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    resetAutoplay();
  }, [emblaApi, resetAutoplay]);

  const scrollTo = useCallback(
    (i: number) => {
      emblaApi?.scrollTo(i);
      resetAutoplay();
    },
    [emblaApi, resetAutoplay],
  );

  if (!slides?.length) return null;

  return (
    <section>
      <div className="relative h-[420px] overflow-hidden rounded-3xl bg-card shadow-xl group my-10">
        {/* Global Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent z-10 pointer-events-none" />

        <div
          ref={emblaRef}
          className="overflow-hidden h-full cursor-grab active:cursor-grabbing"
        >
          <div className="flex h-full">
            {slides.map((slide: any, i: number) => (
              <div
                key={i}
                className="flex-[0_0_100%] min-w-0 relative h-full select-none"
              >
                <div className="h-full flex items-center justify-between px-6 md:px-20">
                  {/* CONTENT */}
                  <div
                    key={`${index}-content`}
                    className={`relative z-20 max-w-[520px] ${
                      direction === "right"
                        ? styles.slideInContent
                        : styles.slideInContentLeft
                    }`}
                  >
                    <span className="text-sm text-primary bg-card-soft px-3 py-1 rounded-full">
                      {slide.tag}
                    </span>

                    <h1 className="mt-5 text-4xl md:text-[52px] font-bold leading-tight text-primary">
                      {slide.title}
                      <br />
                      <span className="text-primary">{slide.highlight}</span>
                    </h1>

                    <p className="mt-4 text-secondary">{slide.description}</p>
                  </div>

                  {/* IMAGE */}
                  <div
                    key={`${index}-image`}
                    className={`absolute inset-0 md:relative md:inset-auto h-full w-full md:w-[50%] ${
                      direction === "right"
                        ? styles.slideInImage
                        : styles.slideInImageLeft
                    }`}
                  >
                    {/* MOBILE */}
                    <div className="absolute inset-0 md:hidden">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        priority={i === 0}
                        sizes="100vw"
                        className="object-contain object-right scale-90 pointer-events-none"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/50 to-transparent" />
                    </div>

                    {/* DESKTOP */}
                    <div className="hidden md:flex h-full w-full items-center justify-center relative">
                      <div className="relative w-full h-[420px] max-w-[700px] flex items-center justify-center">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          priority={i === 0}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-contain object-center scale-[1.15] drop-shadow-2xl pointer-events-none"
                          draggable={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DOTS */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {slides.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className={`rounded-full transition-all duration-300 ${
                  idx === index
                    ? "w-6 h-2 bg-primary"
                    : "w-2 h-2 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* PREV */}
        <Button
          onClick={scrollPrev}
          size="xs"
          variant="outline"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-200"
        >
          <ChevronLeft />
        </Button>

        {/* NEXT */}
        <Button
          onClick={scrollNext}
          size="xs"
          variant="outline"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-200"
        >
          <ChevronRight />
        </Button>
      </div>
    </section>
  );
}
