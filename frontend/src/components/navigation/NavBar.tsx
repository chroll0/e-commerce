"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components";

const NavBar = () => {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/shop", label: t("nav.shop") },
    { href: "/categories", label: t("nav.categories") },
    { href: "/deals", label: t("nav.deals") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const normalizedPath =
    pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";

  const isActive = (href: string) => {
    if (href === "/") return normalizedPath === "/";
    return normalizedPath === href || normalizedPath.startsWith(href + "/");
  };

  const fullHref = (href: string) => `/${locale}${href}`;

  return (
    <>
      {/* DESKTOP */}
      <nav className="hidden md:flex items-center gap-2">
        {links.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={fullHref(item.href)}
              className={
                "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors select-none border " +
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 " +
                (active
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "border-transparent text-muted-foreground hover:bg-muted")
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Button
        variant="outline"
        iconOnly
        size="sm"
        className="md:hidden rounded-lg"
        onClick={() => setOpen((v) => !v)}
      >
        <motion.div
          initial={false}
          animate={{ rotate: open ? 90 : 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </motion.div>
      </Button>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden absolute top-10.5 left-0 w-full bg-background border-t border-border shadow-lg z-50"
          >
            <div className="flex flex-col px-2 py-1 gap-1 shadow-2xl">
              {links.map((item, i) => {
                const active = isActive(item.href);

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      href={fullHref(item.href)}
                      onClick={() => setOpen(false)}
                      className={
                        "w-full flex items-center rounded-lg px-4 py-2 text-sm font-medium border transition " +
                        (active
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "text-muted-foreground border-transparent hover:bg-muted")
                      }
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
