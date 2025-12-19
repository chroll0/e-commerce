import { ReactNode } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

type AdminLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const AdminLayout = async ({ children, params }: AdminLayoutProps) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background">
        <div className="h-16 flex items-center px-6 border-b">
          <Link
            href={`/${locale}`}
            className="text-lg font-semibold tracking-tight"
          >
            {t("brand.name")}{" "}
            <span className="text-muted-foreground text-sm">
              {t("brand.admin")}
            </span>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          <SidebarLink href={`/${locale}/admin/dashboard`} label="Dashboard" />
          <SidebarLink href={`/${locale}/admin/product`} label="Product" />
          <SidebarLink
            href={`/${locale}/admin/categories`}
            label="Categories"
          />
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1">
        <header className="h-16 border-b bg-background flex items-center px-6">
          <h1 className="text-lg font-medium">{t("header.title")}</h1>
        </header>

        <section className="p-6">{children}</section>
      </main>
    </div>
  );
};

export default AdminLayout;

type SidebarLinkProps = {
  href: string;
  label: string;
};

const SidebarLink = ({ href, label }: SidebarLinkProps) => {
  return (
    <Link
      href={href}
      className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
    >
      {label}
    </Link>
  );
};
