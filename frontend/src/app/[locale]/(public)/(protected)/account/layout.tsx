import { ReactNode } from "react";
import { AccountNav } from "@/components";

type Props = {
  children: ReactNode;
};

export default async function AccountLayout({ children }: Props) {
  return (
    <section className="w-full max-w-7xl px-4 mt-6 mx-auto">
      <div className="rounded-2xl border border-border bg-card p-6 pt-4 shadow-[0_4px_18px_var(--color-shadow)]">
        <AccountNav />
        {children}
      </div>
    </section>
  );
}
