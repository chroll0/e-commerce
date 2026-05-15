import { FeaturedProducts, ProductFilter } from "@/components";

const page = () => {
  return (
    <main className="w-full max-w-7xl px-4 mt-10 mx-auto">
      <ProductFilter />
      <FeaturedProducts />
    </main>
  );
};

export default page;
