"use client";

import { useAuthStore } from "@/state/useAuthStore";
import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return <>{children}</>;
}
