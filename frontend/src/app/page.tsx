import Hero from "@/components/home/Hero";
import CategoryScroller from "@/components/home/CategoryScroller";
import FlashSale from "@/components/home/FlashSale";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BestStores from "@/components/home/BestStores";

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center bg-zinc-50 text-black">
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
