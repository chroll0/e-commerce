"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components";

export function AdminSidebarDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // close on route change
  useEffect(() => {
    setOpen(false);
  }, []);

  return (
    <>
      {/* Mobile hamburger button — shown in header area */}
      <Button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-2 z-50"
        aria-label="Open menu"
        iconOnly
        variant="outline"
        size="sm"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar — always visible on lg, drawer on mobile */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 transition-transform duration-300
          lg:static lg:translate-x-0 lg:z-auto lg:h-screen
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close button inside drawer on mobile */}
        <Button
          variant="outline"
          size="sm"
          iconOnly
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-4 right-4"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </Button>

        {children}
      </div>
    </>
  );
}
