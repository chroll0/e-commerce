import { useEffect, useState } from "react";
import { getProducts } from "@/lib/productsApi";
import type { ProductApi } from "@/types";

type Params = {
  locale: string;
  limit?: number;
  onlyDiscounted?: boolean;
};

export function useProducts({ locale, limit = 10, onlyDiscounted }: Params) {
  const [products, setProducts] = useState<ProductApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      try {
        setLoading(true);

        const data = await getProducts({ locale, limit: 100 });

        if (cancelled) return;

        let result = data ?? [];

        // 🔥 domain logic moves here
        if (onlyDiscounted) {
          result = result.filter((p) => p.discount && p.discount > 0);
          result = result.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
        }

        setProducts(result.slice(0, limit));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();

    return () => {
      cancelled = true;
    };
  }, [locale, limit, onlyDiscounted]);

  return { products, loading };
}
