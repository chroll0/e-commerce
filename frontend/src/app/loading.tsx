"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  size?: number;
};

export default function GlobalCircularLoader({ size = 64 }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center pointer-events-none">
      {/* subtle backdrop */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[1.5px]" />

      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* OUTER RING — slow */}
        <motion.div
          className="absolute rounded-full border border-border"
          style={{ width: size, height: size }}
          animate={reduceMotion ? {} : { rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut",
          }}
        />

        {/* MIDDLE RING — medium */}
        <motion.div
          className="absolute rounded-full border-2 border-foreground/60 border-t-transparent"
          style={{ width: size * 0.72, height: size * 0.72 }}
          animate={reduceMotion ? {} : { rotate: -360 }}
          transition={{
            repeat: Infinity,
            duration: 2.8,
            ease: "easeInOut",
          }}
        />

        {/* INNER RING — fast */}
        <motion.div
          className="absolute rounded-full border-2 border-foreground border-b-transparent"
          style={{ width: size * 0.45, height: size * 0.45 }}
          animate={reduceMotion ? {} : { rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut",
          }}
        />

        {/* CENTER DOT */}
        <motion.div
          className="absolute rounded-full bg-foreground"
          style={{ width: 6, height: 6 }}
          animate={reduceMotion ? {} : { scale: [0.8, 1.15, 0.8] }}
          transition={{
            repeat: Infinity,
            duration: 1.4,
            ease: "easeInOut",
          }}
        />

        {/* ORBIT DOTS */}
        {!reduceMotion && (
          <motion.div
            className="absolute"
            style={{ width: size * 1.15, height: size * 1.15 }}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "linear",
            }}
          >
            {["top", "right", "bottom", "left"].map((pos, i) => (
              <div
                key={pos}
                className="absolute w-1.5 h-1.5 rounded-full bg-foreground/50"
                style={{
                  top: pos === "top" ? 0 : pos === "bottom" ? "100%" : "50%",
                  left: pos === "left" ? 0 : pos === "right" ? "100%" : "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
