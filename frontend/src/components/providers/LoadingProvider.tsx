"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import GlobalCircularLoader from "@/app/loading";

export default function LoadingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let active = true;
    setBooting(true);

    const timeout = setTimeout(() => {
      if (active) setBooting(false);
    }, 400);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [pathname, searchParams]);

  if (booting) {
    return <GlobalCircularLoader />;
  }

  return <>{children}</>;
}
