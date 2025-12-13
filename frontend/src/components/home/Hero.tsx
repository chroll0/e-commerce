export default function Hero() {
  return (
    <section className="w-full max-w-7xl px-4 mt-6 mx-auto">
      <div className="relative w-full h-[380px] rounded-2xl shadow-[0_4px_20px_var(--color-shadow)] overflow-hidden flex items-center bg-card">
        {/* Left Content */}
        <div className="pl-10 flex flex-col gap-3 z-10">
          <p className="text-sm text-muted">#Big Fashion Sale</p>

          <h1 className="text-4xl font-bold leading-tight text-primary">
            Limited Time Offer! <br /> Up to 50% OFF!
          </h1>

          <p className="text-secondary">Redefine Your Everyday Style</p>

          {/* Carousel Dots */}
          <div className="flex gap-2 mt-4">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="w-3 h-3 rounded-full bg-border" />
            <div className="w-3 h-3 rounded-full bg-border" />
          </div>
        </div>

        {/* Right Banner Image */}
        <div className="absolute right-0 bottom-0">
          {/* <Image
            src="/hero-clothes.png"
            alt="Clothes"
            width={420}
            height={350}
            className="object-contain drop-shadow-xl"
          /> */}
        </div>
      </div>
    </section>
  );
}
