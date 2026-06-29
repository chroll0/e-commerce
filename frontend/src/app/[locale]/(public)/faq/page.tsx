"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Truck,
  RotateCcw,
  UserCheck,
  CreditCard,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components";

type Category = "orders" | "delivery" | "returns" | "account" | "payments";

const categoryIcons: Record<Category, React.ElementType> = {
  orders: ShoppingCart,
  delivery: Truck,
  returns: RotateCcw,
  account: UserCheck,
  payments: CreditCard,
};

const categories: Category[] = [
  "orders",
  "delivery",
  "returns",
  "account",
  "payments",
];

const Page = () => {
  const t = useTranslations("faq");
  const [activeCategory, setActiveCategory] = useState<Category>("orders");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = t.raw(`items.${activeCategory}`) as {
    q: string;
    a: string;
  }[];

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-border bg-muted/10 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </div>

          <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>

          <p className="mt-3 text-muted-foreground">{t("description")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        {/* Category tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat];
            const isActive = activeCategory === cat;

            return (
              <Button
                key={cat}
                variant={isActive ? "secondary" : "text"}
                className="rounded-md"
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(0);
                }}
              >
                <Icon className="h-4 w-4" />
                {t(`categories.${cat}`)}
              </Button>
            );
          })}
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card overflow-hidden"
              >
                {/* Header */}
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full justify-between"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="text-sm font-medium tracking-wide text-left">
                    {item.q}
                  </span>

                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {/* Animated Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.25,
                        ease: "easeInOut",
                      }}
                      className="overflow-hidden border-t border-border px-6"
                    >
                      <div className="py-4">
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Page;
