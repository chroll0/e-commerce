"use client";

import { ReactNode } from "react";
import Link from "next/link";

type AdminLayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href={`/`} className="text-lg font-semibold tracking-tight">
            Satori <span className="text-muted-foreground text-sm">Admin</span>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          <SidebarLink href={`/admin`} label="Dashboard" />
          <SidebarLink href={`/admin/product`} label="Product" />
          <SidebarLink href={`/admin/categories`} label="Categories" />
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <header className="h-16 border-b bg-background flex items-center px-6">
          <h1 className="text-lg font-medium">Admin Panel</h1>
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
