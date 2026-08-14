import { getTranslations } from "next-intl/server";
import { Logo, SidebarLink } from "@/components";
import { AdminSidebarDrawer } from "../dashboard/AdminSidebarDrawer";

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
  {
    key: "stores",
    children: [
      { key: "storesAll", href: "/admin/stores" },
      { key: "storesAdd", href: "/admin/stores/new" },
    ],
  },
  {
    key: "orders",
    children: [
      { key: "ordersAll", href: "/admin/orders" },
      { key: "paymentsList", href: "/admin/orders/payments" },
    ],
  },
  { key: "users", href: "/admin/users" },
];

function getParentPrefix(children: { href: string }[]) {
  return children.map((c) => c.href).sort((a, b) => a.length - b.length)[0];
}

export const AdminSidebar = async ({ locale }: AdminSidebarProps) => {
  const t = await getTranslations({ locale, namespace: "admin" });

  return (
    <AdminSidebarDrawer>
      <aside className="h-screen w-64 overflow-y-auto border-r bg-background">
        <div className="h-16 flex items-center px-6 border-b">
          <div className="flex items-end gap-2 text-xl font-semibold tracking-tight">
            <Logo />
            <span className="text-muted-foreground text-xs tracking-wider mb-1">
              {t("brand.admin")}
            </span>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            if (item.children?.length) {
              const parentPrefix = getParentPrefix(item.children);
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
                        exact={child.href === parentPrefix}
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
    </AdminSidebarDrawer>
  );
};
