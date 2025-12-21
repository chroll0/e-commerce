import { ReactNode } from "react";
import { AdminSidebar } from "@/components";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type AdminLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const AdminLayout = async ({ children, params }: AdminLayoutProps) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.header" });

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  if (!token) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen bg-card">
      {/* Sidebar */}
      <AdminSidebar locale={locale} />
      {/* Content */}
      <main className="flex-1">
        <header className="h-16 border-b bg-background flex items-center px-6">
          <h1 className="text-lg font-medium">{t("title")}</h1>
        </header>

        <section className="p-6">{children}</section>
      </main>
    </div>
  );
};

export default AdminLayout;
