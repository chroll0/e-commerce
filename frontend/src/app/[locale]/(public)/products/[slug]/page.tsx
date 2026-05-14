"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useProduct, useProductData } from "@/hooks";
import { ProductDetails } from "@/components";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  const locale = useLocale();

  const { product, loading } = useProduct(slug, locale);

  const data = useProductData(product ?? undefined);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;

  return <ProductDetails product={product!} />;
}
