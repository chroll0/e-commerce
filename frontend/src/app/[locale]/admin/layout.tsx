import { ReactNode } from "react";
import { AdminSidebar, LanguageSwitcher, ThemeToggle } from "@/components";
import { getTranslations } from "next-intl/server";
import AuthGuard from "@/components/auth/AuthGuard";

type AdminLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const AdminLayout = async ({ children, params }: AdminLayoutProps) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.header" });

  return (
    <AuthGuard role="ADMIN" locale={locale}>
      <div className="flex min-h-screen bg-card">
        {/* Sidebar */}
        <AdminSidebar locale={locale} />
        {/* Content */}
        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 h-16 border-b bg-background/90 backdrop-blur flex items-center px-12 justify-between">
            <h1 className="text-lg font-medium">{t("title")}</h1>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </header>

          <section className="max-w-6xl mx-auto p-12 space-y-6">
            {children}
          </section>
        </main>
      </div>
    </AuthGuard>
  );
};

export default AdminLayout;
