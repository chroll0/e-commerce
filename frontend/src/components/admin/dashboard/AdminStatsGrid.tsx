"use client";

import Link from "next/link";
import { FC } from "react";

type Props = {
  locale: string;
};

const items = (locale: string) => [
  { title: "Users", value: "—", href: `/${locale}/admin/users` },
  { title: "Products", value: "—", href: `/${locale}/admin/products` },
  { title: "Categories", value: "—", href: `/${locale}/admin/categories` },
  { title: "Orders", value: "—", href: `/${locale}/admin/orders` },
];

const AdminStatsGrid: FC<Props> = ({ locale }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items(locale).map((x) => (
        <Link
          key={x.title}
          href={x.href}
          className="rounded-2xl border border-border bg-card p-4 hover:bg-muted/30 transition"
        >
          <div className="text-xs text-muted-foreground">{x.title}</div>
          <div className="mt-2 text-2xl font-semibold">{x.value}</div>
          <div className="mt-3 text-xs text-muted-foreground">View</div>
        </Link>
      ))}
    </div>
  );
};

export default AdminStatsGrid;
