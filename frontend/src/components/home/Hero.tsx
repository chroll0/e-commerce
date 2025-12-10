import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full max-w-7xl px-4 mt-6">
      <div className="relative w-full h-[380px] bg-white rounded-2xl shadow-sm overflow-hidden flex items-center">
        {/* Left text */}
        <div className="pl-10 flex flex-col gap-3">
          <p className="text-sm text-gray-500">#Big Fashion Sale</p>
          <h1 className="text-4xl font-bold leading-tight">
            Limited Time Offer! <br /> Up to 50% OFF!
          </h1>
          <p className="text-gray-600">Redefine Your Everyday Style</p>

          {/* Carousel Dots */}
          <div className="flex gap-2 mt-4">
            <div className="w-3 h-3 rounded-full bg-black" />
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <div className="w-3 h-3 rounded-full bg-gray-300" />
          </div>
        </div>

        {/* Right Banner Image */}
        <div className="absolute right-0 bottom-0">
          <Image
            src="/hero-clothes.png"
            alt="Clothes"
            width={420}
            height={350}
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
