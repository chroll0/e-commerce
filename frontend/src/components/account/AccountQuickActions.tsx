import Link from "next/link";
import { Button } from "@/components";

const ITEMS = [
  {
    title: "Recent Orders",
    desc: "You’ll see your latest orders here once you place them.",
    href: "/orders",
    action: "View Orders",
  },
  {
    title: "Wishlist",
    desc: "Save products you like and buy later.",
    href: "/wishlist",
    action: "Open Wishlist",
  },
  {
    title: "Addresses",
    desc: "Add delivery addresses for faster checkout.",
    href: "/account/settings",
    action: "Manage Addresses",
  },
  {
    title: "Support",
    desc: "Need help? Contact our support team.",
    href: "/support",
    action: "Contact Support",
  },
];

export default function AccountQuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {ITEMS.map((item) => (
        <div
          key={item.title}
          className="p-6 rounded-2xl border border-border bg-card shadow-[0_4px_18px_var(--color-shadow)]"
        >
          <h2 className="text-lg font-semibold text-primary">{item.title}</h2>
          <p className="text-sm text-secondary mt-2">{item.desc}</p>

          <div className="mt-4">
            <Link href={item.href}>
              <Button variant="secondary">{item.action}</Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
