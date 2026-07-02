"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/stores", label: t("nav.stores") },
    { href: "/products", label: t("nav.products") },
    { href: "/sales", label: t("nav.sales") },
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

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

      {/* BUTTON */}
      <Button
        ref={buttonRef}
        variant="outline"
        iconOnly
        size="sm"
        className="md:hidden rounded-lg"
        onClick={() => setOpen((v) => !v)}
      >
        <motion.div
          initial={false}
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </motion.div>
      </Button>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden absolute top-12 left-0 w-full bg-background border-t border-border shadow-lg z-50"
          >
            <div className="flex flex-col px-2 py-1.5 gap-1">
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
