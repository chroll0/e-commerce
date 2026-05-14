"use client";

import { useEffect, useState } from "react";
import type { ProductApi } from "@/types";
import { api } from "@/lib/axios";

export function useProduct(slug: string, locale: string) {
  const [product, setProduct] = useState<ProductApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/products/slug/${slug}?locale=${locale}`,
        );

        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProduct(null);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, locale]);

  return { product, loading, error };
}
