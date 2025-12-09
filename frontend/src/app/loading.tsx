"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  loading: boolean;
  height?: number;
  colorClass?: string;
};

export default function GlobalLoadingBar({
  loading,
  height = 4,
  colorClass = "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
}: Props) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  // When loading starts we show the bar and slowly increase progress until 90%
  useEffect(() => {
    if (loading) {
      setVisible(true);
      setProgress((p) => Math.max(p, 8)); // give a quick initial bump

      // increase progress gradually while loading
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setProgress((p) => {
          // slow down as we approach 90
          const delta =
            p < 60 ? Math.random() * 6 + 2 : Math.random() * 3 + 0.5;
          const next = Math.min(90, p + delta);
          return next;
        });
      }, 300) as unknown as number;
    } else {
      // finish the bar
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setProgress(100);
      // hide shortly after finished so user sees the completion
      const hide = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 360);
      return () => window.clearTimeout(hide);
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [loading]);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="fixed left-0 top-0 w-full z-9999 pointer-events-none"
      style={{ height }}
    >
      <div className="relative w-full h-full overflow-hidden">
        {/* Main progress bar */}
        <motion.div
          layout
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.28 }}
          className={`${colorClass} h-full rounded-r-md drop-shadow-lg`}
          style={{ willChange: "width" }}
        />

        {/* subtle glossy shimmer that moves across the bar */}
        <motion.div
          initial={{ left: "-30%" }}
          animate={{ left: "120%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 1.6,
            delay: 0.1,
          }}
          className="absolute top-0 h-full w-1/4 opacity-30 blur-sm"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))",
            pointerEvents: "none",
          }}
        />

        {/* small subtle shadow below */}
        <div className="absolute left-0 top-full w-full h-0.5 bg-black/5" />
      </div>
    </div>
  );
}
