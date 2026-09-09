"use client";

import { useAuthStore } from "@/state/useAuthStore";
import { ThemeProvider } from "@/components";
import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    void fetchMe();

    const reconcileAuth = () => {
      void fetchMe(true);
    };

    window.addEventListener("pageshow", reconcileAuth);
    return () => window.removeEventListener("pageshow", reconcileAuth);
  }, [fetchMe]);

  return <ThemeProvider>{children}</ThemeProvider>;
}
