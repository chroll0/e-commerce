import { ReactNode } from "react";
import { AccountNav } from "@/components";

type Props = {
  children: ReactNode;
};

export default async function AccountLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-background px-4">
      <div className="mx-auto max-w-5xl py-10">
        <h1 className="text-3xl font-bold text-primary"></h1>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
          <AccountNav />

          <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_4px_18px_var(--color-shadow)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
