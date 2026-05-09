"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getStoreBySlug } from "@/lib/storesApi";
import type { StoreApi } from "@/types";
import { ProductCard } from "@/components";

export default function StorePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [store, setStore] = useState<StoreApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await getStoreBySlug(slug);
        setStore(data);
      } catch (err) {
        console.error("Failed to fetch store:", err);
        setError("Store not found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchStore();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-card-soft rounded-xl mb-8"></div>
          <div className="h-8 bg-card-soft rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-card-soft rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-card-soft rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">
            Store Not Found
          </h1>
          <p className="text-muted">
            The store you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Store Header */}
      <div className="mb-8">
        {store.banner && (
          <div className="w-full h-64 rounded-xl overflow-hidden mb-6">
            <img
              src={store.banner}
              alt={store.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-4 mb-4">
          {store.logo && (
            <img
              src={store.logo}
              alt={store.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-primary">{store.name}</h1>
            <div className="flex items-center gap-2 text-muted">
              {store.rating && (
                <>
                  <span>⭐ {store.rating.toFixed(1)}</span>
                  <span>•</span>
                </>
              )}
              <span>{store.sales} sales</span>
              <span>•</span>
              <span>{store._count.products} products</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-6 text-primary">
          Products from {store.name}
        </h2>

        {!store.products || store.products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted">
              No products available in this store yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {store.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
