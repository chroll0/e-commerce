"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import classNames from "classnames";
import { Button } from "@/components";

type AdvertisementProps = {
  title: string;
  description?: string;
  badge?: string;

  // Optional media
  imageSrc?: string;
  imageAlt?: string;

  // Optional action
  href?: string;
  ctaLabel?: string;

  // Styling presets
  variant?: "default" | "promo" | "dark";

  // Optional dismiss
  dismissible?: boolean;
  storageKey?: string; // if provided, will persist dismissed state in localStorage

  className?: string;
};

export default function Advertisement({
  title,
  description,
  badge,
  imageSrc,
  imageAlt = "Advertisement",
  href,
  ctaLabel = "Learn more",
  variant = "default",
  dismissible = false,
  storageKey,
  className,
}: AdvertisementProps) {
  const [hidden, setHidden] = useState(false);

  // restore dismiss state (optional)
  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === "1") setHidden(true);
    } catch {}
  }, [storageKey]);

  const styles = useMemo(() => {
    switch (variant) {
      case "promo":
        return {
          wrapper: "border border-primary/20 bg-primary/10 text-foreground",
          badge: "bg-primary text-background",
        };
      case "dark":
        return {
          wrapper: "border border-border bg-foreground text-background",
          badge: "bg-background text-foreground",
        };
      default:
        return {
          wrapper: "border border-border bg-card text-foreground",
          badge: "bg-muted text-foreground",
        };
    }
  }, [variant]);

  const handleDismiss = () => {
    setHidden(true);
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, "1");
    } catch {}
  };

  if (hidden) return null;

  return (
    <div
      className={classNames(
        "rounded-2xl p-4 sm:p-6 shadow-[0_4px_18px_var(--color-shadow)]",
        "flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between",
        styles.wrapper,
        className
      )}
      role="region"
      aria-label="Advertisement"
    >
      <div className="flex items-start gap-4 min-w-0">
        {imageSrc ? (
          // If you prefer Next/Image, you can swap this for <Image />
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-14 w-14 rounded-xl object-cover border border-border/40"
          />
        ) : null}

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {badge ? (
              <span
                className={classNames(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                  styles.badge
                )}
              >
                {badge}
              </span>
            ) : null}

            <p className="text-base sm:text-lg font-semibold truncate">
              {title}
            </p>
          </div>

          {description ? (
            <p className={classNames("mt-1 text-sm opacity-90 line-clamp-2")}>
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:justify-end">
        {href ? (
          <Link href={href}>
            <Button variant={variant === "dark" ? "secondary" : "primary"}>
              {ctaLabel}
            </Button>
          </Link>
        ) : null}

        {dismissible ? (
          <button
            type="button"
            onClick={handleDismiss}
            className={classNames(
              "rounded-md px-3 py-2 text-sm font-medium",
              "border border-border/40 hover:bg-muted transition"
            )}
            aria-label="Dismiss advertisement"
          >
            ✕
          </button>
        ) : null}
      </div>
    </div>
  );
}
