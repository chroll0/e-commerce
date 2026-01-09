import Link from "next/link";

const ITEMS = [
  {
    key: "orders",
    title: "Recent Orders",
    desc: "Track your latest purchases and delivery status.",
    href: "/account/orders",
    action: "View orders",
  },
  {
    key: "wishlist",
    title: "Wishlist",
    desc: "Save items you love and buy them later.",
    href: "/account/wishlist",
    action: "Open wishlist",
  },
  {
    key: "addresses",
    title: "Addresses",
    desc: "Manage delivery addresses for faster checkout.",
    href: "/account/addresses",
    action: "Manage addresses",
  },
  {
    key: "support",
    title: "Support",
    desc: "Need help? Contact our support team.",
    href: "/support",
    action: "Contact support",
  },
];

export default function AccountQuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {ITEMS.map((item) => (
        <div
          key={item.key}
          className="group flex flex-col justify-between p-6 rounded-2xl border border-border bg-card shadow-[0_4px_18px_var(--color-shadow)]"
        >
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {item.title}
            </h2>

            <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
          </div>
          <div className="mt-4">
            <Link
              href={item.href}
              className="w-full inline-flex items-center justify-end text-sm font-medium text-primary hover:underline"
            >
              {item.action}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
