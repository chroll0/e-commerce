import { Footer, Navigation } from "@/components";
import { ReactNode } from "react";

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navigation />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  );
}
