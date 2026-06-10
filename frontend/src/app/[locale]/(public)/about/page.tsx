"use client";

import { Advertisement, Breadcrumbs } from "@/components";
import {
  Package,
  Users,
  Store,
  Globe,
  Rocket,
  ShieldCheck,
  Headphones,
  Target,
  Eye,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function AboutPage() {
  const locale = useLocale();
  const t = useTranslations("about");
  const navT = useTranslations("nav");
  const cta = useTranslations("advertisements.cta");

  const stats = [
    {
      icon: Package,
      value: t("statsValues.products"),
      label: t("stats.products"),
    },
    {
      icon: Users,
      value: t("statsValues.customers"),
      label: t("stats.customers"),
    },
    {
      icon: Store,
      value: t("statsValues.stores"),
      label: t("stats.stores"),
    },
    {
      icon: Globe,
      value: t("statsValues.countries"),
      label: t("stats.countries"),
    },
  ];

  const features = [
    {
      icon: Rocket,
      title: t("whyChooseUs.fastDelivery.title"),
      text: t("whyChooseUs.fastDelivery.text"),
    },
    {
      icon: ShieldCheck,
      title: t("whyChooseUs.securePayments.title"),
      text: t("whyChooseUs.securePayments.text"),
    },
    {
      icon: Headphones,
      title: t("whyChooseUs.support.title"),
      text: t("whyChooseUs.support.text"),
    },
  ];

  return (
    <main className="mx-auto mt-10 w-full max-w-7xl px-4 space-y-16">
      <Breadcrumbs
        items={[
          { label: "Satori", href: `/${locale}` },
          { label: navT("about") },
        ]}
      />
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

        <div className="relative max-w-3xl">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {t("hero.badge")}
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight leading-tight sm:text-6xl">
            {t("hero.title")}
          </h1>

          <p className="mt-6 text-base leading-8 text-muted sm:text-lg">
            {t("hero.description")}
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="group rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>

            <div className="text-3xl font-bold">{value}</div>

            <div className="mt-2 text-sm text-muted">{label}</div>
          </div>
        ))}
      </section>

      {/* MISSION + VISION */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3">
              <Target className="h-5 w-5 text-primary" />
            </div>

            <h2 className="text-xl font-semibold">{t("mission.title")}</h2>
          </div>

          <p className="leading-7 text-muted">{t("mission.text")}</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3">
              <Eye className="h-5 w-5 text-primary" />
            </div>

            <h2 className="text-xl font-semibold">{t("vision.title")}</h2>
          </div>

          <p className="leading-7 text-muted">{t("vision.text")}</p>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold">{t("whyChooseUs.title")}</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Icon className="h-7 w-7 text-primary" />
              </div>

              <h3 className="mb-3 text-lg font-semibold">{title}</h3>

              <p className="text-sm leading-7 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <Advertisement
        badge={cta("badge")}
        title={cta("title")}
        description={cta("description")}
        href="/products"
        ctaLabel={cta("button")}
        variant="promo"
      />
    </main>
  );
}
