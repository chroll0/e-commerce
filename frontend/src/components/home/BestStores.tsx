"use client";

import { useStores } from "@/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components";
import Image from "next/image";
import { ImageIcon, Star } from "lucide-react";

export default function BestStores() {
  const t = useTranslations("home.stores");
  const router = useRouter();
  const { stores, loading, error } = useStores(4);

  const handleStoreClick = (slug: string) => {
    router.push(`/stores/${slug}`);
  };

  if (loading) {
    return (
      <section>
        <h2 className="text-xl font-semibold my-6 text-primary">
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
      <section>
        <h2 className="text-xl font-semibold my-6 text-primary">
          {t("title")}
        </h2>
        <p className="text-sm text-destructive">{t("loadError")}</p>
      </section>
    );
  }

  if (!stores.length) {
    return (
      <section>
        <h2 className="text-xl font-semibold my-6 text-primary">
          {t("title")}
        </h2>
        <p className="text-sm text-muted">{t("noStores")}</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold my-6 text-primary">{t("title")}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stores.map((store) => (
          <div
            key={store.id}
            onClick={() => handleStoreClick(store.slug)}
            className="group cursor-pointer rounded-xl border border-border bg-card p-4 shadow-[0_2px_12px_var(--color-shadow)] transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_24px_var(--color-shadow)]"
          >
            {/* LOGO */}
            <div className="relative mb-3 flex h-20 w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-card-soft">
              {store.logo ? (
                <Image
                  src={store.logo}
                  alt={store.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>

            {/* INFO */}
            <p className="font-medium text-primary truncate">{store.name}</p>

            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
              <span>{(store.rating ?? 0).toFixed(1)}</span>
              <span>•</span>
              <span>
                {store.sales ?? 0} {t("sales")}
              </span>
            </div>

            {/* CTA */}
            <Button className="mt-4 w-full" size="sm" variant="primary">
              {t("viewStore")}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
