import {
  BestStores,
  CategoryScroller,
  FeaturedProducts,
  ProductFilter,
  Hero,
} from "@/components";

export default function Home() {
  return (
    <main className="w-full max-w-7xl px-4 mx-auto">
      {/* HERO SECTION */}
      <Hero />

      {/* CATEGORY SCROLLER */}
      <CategoryScroller />

      {/* PRODUCT FILTER */}
      <ProductFilter />

      {/* FEATURES / TODAY'S PICKS */}
      <FeaturedProducts />

      {/* BEST STORES */}
      <BestStores />
    </main>
  );
}
