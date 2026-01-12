import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SidebarLink } from "@/components";

type AdminSidebarProps = {
  locale: string;
};

type SidebarItem = {
  key: string;
  href?: string;
  children?: { key: string; href: string }[];
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  { key: "dashboard", href: "/admin/dashboard" },
  {
    key: "products",
    children: [
      { key: "productsAll", href: "/admin/products" },
      { key: "productsAdd", href: "/admin/products/new" },
    ],
  },
  {
    key: "categories",
    children: [
      { key: "categoriesAll", href: "/admin/categories" },
      { key: "categoriesAdd", href: "/admin/categories/new" },
    ],
  },

  { key: "orders", href: "/admin/orders" },
  {
    key: "payments",
    children: [
      { key: "paymentsList", href: "/admin/payments" },
      { key: "failedPayments", href: "/admin/payments/failed" },
    ],
  },
  { key: "users", href: "/admin/users" },
  { key: "inventory", href: "/admin/inventory" },
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
        {SIDEBAR_ITEMS.map((item) => {
          if (item.children?.length) {
            return (
              <div key={item.key}>
                <div className="px-3 py-2 text-sm">
                  {t(`sidebar.${item.key}`)}
                </div>

                <div className="ml-2 border-l border-border pl-3 space-y-1 capitalize">
                  {item.children.map((child) => (
                    <SidebarLink
                      key={child.key}
                      href={`/${locale}${child.href}`}
                      label={t(`sidebar.${child.key}`)}
                      variant="child"
                      exact={child.key === "productsAll"}
                    />
                  ))}
                </div>
              </div>
            );
          }
          return (
            <SidebarLink
              key={item.key}
              href={`/${locale}${item.href}`}
              label={t(`sidebar.${item.key}`)}
            />
          );
        })}
      </nav>
    </aside>
  );
};
