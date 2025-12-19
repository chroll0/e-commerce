"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type SidebarLinkProps = {
  href: string;
  label: string;
};

const SidebarLink = ({ href, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const normalize = (path: string) => path.replace(/^\/(en|ka)/, "");
  const isActive =
    normalize(pathname) === normalize(href) ||
    normalize(pathname).startsWith(normalize(href) + "/");

  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center rounded-md px-3 py-2 text-sm transition",
        isActive
          ? "bg-card text-primary-foreground font-medium"
          : "text-muted-foreground hover:bg-card"
      )}
    >
      {label}
    </Link>
  );
};

export default SidebarLink;
