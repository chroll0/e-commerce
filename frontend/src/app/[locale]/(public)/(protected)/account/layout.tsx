import { ReactNode } from "react";
import { AccountNav } from "@/components";
import AuthGuard from "@/components/auth/AuthGuard";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AccountLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <AuthGuard locale={locale}>
      <section className="w-full max-w-7xl px-4 mt-6 mx-auto">
        <div className="rounded-2xl border border-border bg-card p-6 pt-4 shadow-[0_4px_18px_var(--color-shadow)]">
          <AccountNav />
          <div className="bg-background px-4 rounded-2xl">{children}</div>
        </div>
      </section>
    </AuthGuard>
  );
}
