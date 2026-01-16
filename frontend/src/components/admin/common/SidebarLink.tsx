"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type SidebarLinkProps = {
  href: string;
  label: string;
  variant?: "default" | "child";
  exact?: boolean;
};

const SidebarLink = ({
  href,
  label,
  variant = "default",
  exact = false,
}: SidebarLinkProps) => {
  const pathname = usePathname();

  const normalize = (path: string) => path.replace(/^\/(en|ka)(?=\/|$)/, "");

  const current = normalize(pathname).replace(/\/$/, "");
  const target = normalize(href).replace(/\/$/, "");

  const isActive = exact
    ? current === target
    : current === target || current.startsWith(target + "/");

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={clsx(
        "flex items-center rounded-md transition select-none border",
        variant === "child"
          ? "px-3 py-2 text-sm"
          : "px-3 py-2.5 text-sm font-medium",
        isActive
          ? "bg-primary/10 text-primary border-primary/20"
          : "bg-transparent text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
};

export default SidebarLink;
