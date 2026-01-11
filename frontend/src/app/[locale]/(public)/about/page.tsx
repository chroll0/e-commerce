import { Advertisement } from "@/components";

const page = () => {
  return (
    <main className="w-full max-w-7xl px-4 mt-6 mx-auto">
      <Advertisement
        badge="New"
        title="Up to 30% off Winter Sale"
        description="Limited time deals on best-selling products."
        href="/deals"
        ctaLabel="Shop now"
        variant="promo"
      />
    </main>
  );
};

export default page;
