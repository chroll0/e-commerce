"use client";

import { useCallback, useEffect, useState } from "react";
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

  const autoplay = Autoplay({
    delay: 5000,
    stopOnInteraction: false,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const resetAutoplay = useCallback(() => {
    const plugin: any = emblaApi?.plugins()?.autoplay;
    plugin?.reset();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const newIndex = emblaApi.selectedScrollSnap();
    setDirection(newIndex > index ? "right" : "left");
    setIndex(newIndex);
  }, [emblaApi, index]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    onSelect();
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

  if (!slides?.length) return null;

  return (
    <section>
      <div className="relative h-[420px] rounded-3xl overflow-hidden bg-card shadow-xl group my-10">
        {/* OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-r from-black/30 to-transparent" />

        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide: any, i: number) => (
              <div
                key={i}
                className="md:px-20 px-10 flex-[0_0_100%] relative h-full flex items-center justify-between"
              >
                <div
                  key={index}
                  className={`z-20 max-w-[520px] ${
                    direction === "right"
                      ? styles.slideInContent
                      : styles.slideInContentLeft
                  }`}
                >
                  <span className="text-sm text-primary bg-card-soft px-3 py-1 rounded-full">
                    {slide.tag}
                  </span>

                  <h1 className="text-[52px] font-bold text-white mt-5 leading-tight">
                    {slide.title}
                    <br />
                    <span className="text-primary">{slide.highlight}</span>
                  </h1>

                  <p className="text-white/90 mt-4">{slide.description}</p>
                </div>

                <div
                  className={`absolute inset-0 md:relative md:inset-auto h-full w-full md:w-[50%] ${
                    direction === "right"
                      ? styles.slideInImage
                      : styles.slideInImageLeft
                  }`}
                >
                  {/* MOBILE BACKGROUND LAYER */}
                  <div className="absolute inset-0 md:hidden">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority
                      className="object-cover object-center scale-110"
                    />
                    <div className="absolute inset-0 bg-background/20" />
                  </div>

                  {/* DESKTOP IMAGE (FIXED) */}
                  <div className="hidden md:flex h-full w-full items-center justify-center relative">
                    <div className="relative w-full h-[380px] max-w-[620px] flex items-center justify-center">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        priority
                        className="object-contain object-center scale-[1.05] drop-shadow-2xl"
                        sizes="50vw"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

        {/* ARROWS */}
        <Button
          onClick={scrollPrev}
          size="xs"
          variant="outline"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 rounded-full"
        >
          <ChevronLeft />
        </Button>

        <Button
          onClick={scrollNext}
          size="xs"
          variant="outline"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 rounded-full"
        >
          <ChevronRight />
        </Button>
      </div>
    </section>
  );
}
