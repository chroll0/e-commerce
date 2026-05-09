import { useEffect, useState } from "react";
import { getBestStores } from "@/lib/storesApi";
import type { StoreApi } from "@/types";

export function useStores(limit = 4) {
  const [stores, setStores] = useState<StoreApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const data = await getBestStores(limit);
        setStores(data);
      } catch (err) {
        setError("Failed to load stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [limit]);

  return { stores, loading, error };
}
