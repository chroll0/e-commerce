"use client";

import { ReactNode } from "react";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  wrapperClassName?: string;
};

export default function Tooltip({
  content,
  children,
  side = "top",
  className,
  wrapperClassName,
}: TooltipProps) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <span className={`relative inline-flex group ${wrapperClassName ?? ""}`}>
      {children}

      <span
        className={`
          bg-background/80
          pointer-events-none absolute z-50
          ${positionClasses[side]}
          rounded-md bg-popover
          px-3 py-2 text-xs text-popover-foreground
          shadow-lg
          opacity-0 transition
          group-hover:opacity-100
          group-focus-within:opacity-100
          ${className ?? ""}
        `}
      >
        {content}
      </span>
    </span>
  );
}
