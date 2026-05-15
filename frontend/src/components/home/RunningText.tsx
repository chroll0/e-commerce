"use client";

import { useTranslations } from "next-intl";

export default function RunningText() {
  const t = useTranslations("nav");

  const messages = [
    t("ticker.fastDelivery"),
    t("ticker.discount"),
    t("ticker.support"),
    t("ticker.secure"),
  ];

  const list = [...messages, ...messages];

  return (
    <div className="relative w-full overflow-hidden">
      {/* fades */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-background to-transparent" />

      <div className="marquee">
        <div className="marqueeTrack">
          {list.map((m, i) => (
            <span key={i} className="item">
              {m}
            </span>
          ))}
        </div>

        <div className="marqueeTrack" aria-hidden>
          {list.map((m, i) => (
            <span key={`dup-${i}`} className="item">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
