"use client";

import { useStores } from "@/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function BestStores() {
  const t = useTranslations("home.stores");
  const router = useRouter();
  const { stores, loading, error } = useStores(4);

  const handleStoreClick = (slug: string) => {
    router.push(`/stores/${slug}`);
  };

  if (loading) {
    return (
      <section className="border-t border-border py-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          {t("title")}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-card p-4 rounded-xl border border-border animate-pulse"
            >
              <div className="w-full h-20 bg-card-soft rounded-lg" />
              <div className="mt-2 h-4 bg-card-soft rounded" />
              <div className="mt-1 h-3 bg-card-soft rounded w-2/3" />
              <div className="mt-3 h-8 bg-card-soft rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="border-t border-border py-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          {t("title")}
        </h2>
        <p className="text-sm text-red-500">{t("loadError")}</p>
      </section>
    );
  }

  if (!stores.length) {
    return (
      <section className="border-t border-border py-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          {t("title")}
        </h2>
        <p className="text-sm text-muted">{t("noStores")}</p>
      </section>
    );
  }

  return (
    <section className="border-t border-border py-6">
      <h2 className="text-xl font-semibold mb-4 text-primary">{t("title")}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stores.map((store) => (
          <div
            key={store.id}
            onClick={() => handleStoreClick(store.slug)}
            className="group bg-card shadow-[0_2px_12px_var(--color-shadow)] p-4 rounded-xl border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_var(--color-shadow)] cursor-pointer"
          >
            {/* LOGO */}
            <div className="w-full h-20 bg-card-soft rounded-lg border border-border flex items-center justify-center overflow-hidden">
              {store.logo ? (
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-muted">{store.name}</span>
              )}
            </div>

            {/* INFO */}
            <p className="mt-2 font-medium text-primary">{store.name}</p>

            <div className="flex items-center gap-1 text-xs text-muted">
              ⭐ {(store.rating ?? 0).toFixed(1)}
              <span>•</span>
              <span>
                {store.sales ?? 0} {t("sales")}
              </span>
            </div>

            {/* CTA */}
            <button className="mt-3 w-full text-xs font-medium py-2 rounded-lg bg-card-soft border border-border hover:bg-border transition">
              {t("viewStore")}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
