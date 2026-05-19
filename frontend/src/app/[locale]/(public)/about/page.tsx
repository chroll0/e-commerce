"use client";

import { Advertisement } from "@/components";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");
  const cta = useTranslations("advertisements.cta");

  return (
    <main className="w-full max-w-7xl mx-auto px-4 mt-10 space-y-10">
      {/* HERO */}
      <section className="rounded-xl border border-border bg-card p-6 sm:p-10 shadow-[0_2px_12px_var(--color-shadow)]">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs text-muted">{t("hero.badge")}</span>

          <h1 className="text-2xl sm:text-4xl font-bold text-primary">
            {t("hero.title")}
          </h1>

          <p className="text-sm sm:text-base text-muted leading-relaxed">
            {t("hero.description")}
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-xl font-bold text-primary">
            {t("statsValues.products")}
          </div>
          <div className="text-xs text-muted mt-1">{t("stats.products")}</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-xl font-bold text-primary">
            {t("statsValues.customers")}
          </div>
          <div className="text-xs text-muted mt-1">{t("stats.customers")}</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-xl font-bold text-primary">
            {t("statsValues.stores")}
          </div>
          <div className="text-xs text-muted mt-1">{t("stats.stores")}</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-xl font-bold text-primary">
            {t("statsValues.countries")}
          </div>
          <div className="text-xs text-muted mt-1">{t("stats.countries")}</div>
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <h2 className="text-lg font-semibold text-primary">
            {t("mission.title")}
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            {t("mission.text")}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <h2 className="text-lg font-semibold text-primary">
            {t("vision.title")}
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            {t("vision.text")}
          </p>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-primary">
          {t("whyChooseUs.title")}
        </h2>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-5 space-y-2 hover:shadow-[0_8px_24px_var(--color-shadow)] transition">
            <h3 className="font-medium text-primary">
              {t("whyChooseUs.fastDelivery.title")}
            </h3>
            <p className="text-xs text-muted">
              {t("whyChooseUs.fastDelivery.text")}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-2 hover:shadow-[0_8px_24px_var(--color-shadow)] transition">
            <h3 className="font-medium text-primary">
              {t("whyChooseUs.securePayments.title")}
            </h3>
            <p className="text-xs text-muted">
              {t("whyChooseUs.securePayments.text")}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-2 hover:shadow-[0_8px_24px_var(--color-shadow)] transition">
            <h3 className="font-medium text-primary">
              {t("whyChooseUs.support.title")}
            </h3>
            <p className="text-xs text-muted">
              {t("whyChooseUs.support.text")}
            </p>
          </div>
        </div>
      </section>

      {/* ADVERTISEMENT */}
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
