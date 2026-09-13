"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useTranslations } from "next-intl";
import Image from "next/image";
import styles from "./hero.module.css";
import { Button } from "@/components";

interface Slide {
  tag: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
}

export default function Hero() {
  const t = useTranslations("hero");
  const slides = t.raw("slides") as Slide[];

  const autoplayRef = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [autoplayRef.current],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const prevIndexRef = useRef(0);

  const resetAutoplay = useCallback(() => {
    const plugin = emblaApi?.plugins()?.autoplay as any;
    plugin?.reset();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const newIndex = emblaApi.selectedScrollSnap();
    setDirection(newIndex > prevIndexRef.current ? "right" : "left");
    prevIndexRef.current = newIndex;
    setSelectedIndex(newIndex);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    },
    [scrollPrev, scrollNext],
  );

  if (!slides?.length) return null;

  const hasMultipleSlides = slides.length > 1;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="my-8 md:my-10"
    >
      <div
        className="group relative overflow-hidden rounded-2xl bg-card shadow-xl outline-none md:rounded-3xl"
        tabIndex={hasMultipleSlides ? 0 : -1}
        onKeyDown={handleKeyDown}
      >
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {slides.map((slide, i) => {
              const isActive = i === selectedIndex;
              const contentAnim = isActive
                ? direction === "right"
                  ? styles.slideInContent
                  : styles.slideInContentLeft
                : "";
              const imageAnim = isActive
                ? direction === "right"
                  ? styles.slideInImage
                  : styles.slideInImageLeft
                : "";

              return (
                <div
                  key={i}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${slides.length}`}
                  aria-hidden={!isActive}
                  className="relative min-w-0 flex-[0_0_100%]"
                >
                  <div className="relative flex min-h-[480px] flex-col justify-end md:min-h-[420px] md:flex-row md:items-center md:justify-between md:px-16">
                    {/* BACKGROUND IMAGE - mobile only */}
                    <div className="absolute inset-0 md:hidden">
                      <Image
                        src={slide.image}
                        alt=""
                        fill
                        priority={i === 0}
                        sizes="100vw"
                        className="object-cover"
                        draggable={false}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/80 to-transparent md:hidden" />
                    </div>

                    {/* CONTENT */}
                    <div
                      key={
                        isActive ? `${i}-content-${direction}` : `${i}-content`
                      }
                      className={`relative z-10 max-w-[520px] px-6 pb-8 pt-24 md:px-0 md:py-0 ${contentAnim}`}
                    >
                      <span className="inline-block rounded-full bg-card-soft px-3 py-1 text-sm text-primary">
                        {slide.tag}
                      </span>

                      <h1 className="mt-5 text-3xl font-bold leading-tight text-primary sm:text-4xl md:text-[52px]">
                        {slide.title}
                        <br />
                        <span className="text-primary">{slide.highlight}</span>
                      </h1>

                      <p className="mt-4 text-secondary">{slide.description}</p>
                    </div>

                    {/* IMAGE - desktop only */}
                    <div
                      key={isActive ? `${i}-image-${direction}` : `${i}-image`}
                      className={`relative hidden h-[420px] w-full max-w-[700px] items-center justify-center md:flex md:w-1/2 ${imageAnim}`}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        priority={i === 0}
                        sizes="(max-width: 768px) 0px, 50vw"
                        className="object-contain object-center drop-shadow-2xl"
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DOTS */}
        {hasMultipleSlides && (
          <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2 md:bottom-5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === selectedIndex}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === selectedIndex
                    ? "w-6 bg-primary"
                    : "w-2 bg-primary/50 hover:bg-primary/70"
                }`}
              />
            ))}
          </div>
        )}

        {/* PREV / NEXT */}
        {hasMultipleSlides && (
          <>
            <Button
              onClick={scrollPrev}
              size="xs"
              variant="outline"
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full opacity-100 transition-opacity duration-200 md:left-4 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft />
            </Button>

            <Button
              onClick={scrollNext}
              size="xs"
              variant="outline"
              aria-label="Next slide"
              className="absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-full opacity-100 transition-opacity duration-200 md:right-4 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight />
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
