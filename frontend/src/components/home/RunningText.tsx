"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

export default function RunningText() {
  const t = useTranslations("nav");
  const ref = useRef<HTMLDivElement>(null);

  const messages = [
    t("ticker.fastDelivery"),
    t("ticker.discount"),
    t("ticker.support"),
    t("ticker.secure"),
  ];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let animationId: number;

    const speed = 0.5;

    const loop = () => {
      if (!el) return;

      el.scrollLeft += speed;

      // reset WITHOUT visual jump
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationId);
  }, []);

  const list = [...messages, ...messages];

  return (
    <div className="relative w-full overflow-hidden">
      {/* fades */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-background to-transparent" />

      {/* SCROLL CONTAINER */}
      <div ref={ref} className="flex gap-12 overflow-hidden whitespace-nowrap">
        {list.map((m, i) => (
          <span key={i} className="shrink-0 text-sm font-medium text-muted">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
