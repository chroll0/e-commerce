import {
  BestStores,
  CategoryScroller,
  LabeledProductSection,
  Hero,
  SaleProducts,
} from "@/components";

export default function Home() {
  return (
    <main className="w-full max-w-7xl px-4 mx-auto">
      {/* HERO SECTION */}
      <Hero />

      {/* CATEGORY SCROLLER */}
      <CategoryScroller />

      {/* LIMITED TIME OFFER TREATS */}
      <LabeledProductSection labelSlug="treat-yourself" />

      {/* SALE PRODUCTS */}
      <SaleProducts />

      {/* LIMITED TIME OFFER SCHOOL */}
      <LabeledProductSection labelSlug="school" />

      {/* BEST STORES */}
      <BestStores />
    </main>
  );
}
