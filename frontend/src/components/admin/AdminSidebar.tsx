import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SidebarLink } from "@/components";

type AdminSidebarProps = {
  locale: string;
};

const SIDEBAR_ITEMS = [
  { key: "dashboard", href: "/admin/dashboard" },
  { key: "products", href: "/admin/product" },
  { key: "categories", href: "/admin/categories" },
];

export const AdminSidebar = async ({ locale }: AdminSidebarProps) => {
  const t = await getTranslations({ locale, namespace: "admin" });

  return (
    <aside className="w-64 border-r bg-background">
      <div className="h-16 flex items-center px-6 border-b">
        <Link
          href={`/${locale}`}
          className="text-lg font-semibold tracking-tight"
        >
          {t("brand.name")}{" "}
          <span className="text-muted-foreground text-sm tracking-wider">
            {t("brand.admin")}
          </span>
        </Link>
      </div>

      <nav className="p-4 space-y-1">
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarLink
            key={item.key}
            href={`/${locale}${item.href}`}
            label={t(`sidebar.${item.key}`)}
          />
        ))}
      </nav>
    </aside>
  );
};
