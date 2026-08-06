import { Footer, Navigation } from "@/components";
import { ReactNode } from "react";

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navigation />
      <>{children}</>
      <Footer />
    </>
  );
}
