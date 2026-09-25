"use client";

import { useStores } from "@/hooks";
import { useTranslations } from "next-intl";
import { StoreCard } from "@/components";

export default function BestStores() {
  const t = useTranslations("home.stores");
  const { stores, loading, error } = useStores(4);

  if (loading && (!stores || stores.length === 0)) {
    return null;
  }

  return (
    <section>
      <h2 className="my-6 text-xl font-semibold text-primary">{t("title")}</h2>

      {/* ERROR */}
      {!loading && error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center text-destructive">
          {t("loadError")}
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && (!stores || stores.length === 0) && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
          {t("noStores")}
        </div>
      )}

      {/* CONTENT */}
      {!loading && !error && stores && stores.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </section>
  );
}
