import Hero from "@/components/home/Hero";
import CategoryScroller from "@/components/home/CategoryScroller";
import FlashSale from "@/components/home/FlashSale";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BestStores from "@/components/home/BestStores";

export default function Home() {
  return (
    <main className="w-full max-w-7xl px-4 mt-6 mx-auto">
      {/* HERO SECTION */}
      <Hero />

      {/* CATEGORY SCROLLER */}
      <CategoryScroller />

      {/* FLASH SALE */}
      <FlashSale />

      {/* FEATURES / TODAY'S PICKS */}
      <FeaturedProducts />

      {/* BEST STORES */}
      <BestStores />
    </main>
  );
}
