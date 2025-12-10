import Image from "next/image";

export default function ProductCard({ productId }: { productId: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition cursor-pointer">
      <div className="relative w-full h-40 bg-gray-100 rounded-lg">
        <Image
          src="/placeholder-product.jpg"
          alt=""
          fill
          className="object-cover rounded-lg"
        />

        {/* heart icon */}
        <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
          ❤️
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-700">Sample Product {productId}</p>

      <div className="flex gap-2 items-center mt-1">
        <span className="text-black font-bold">$99.00</span>
        <span className="line-through text-gray-400 text-sm">$150.00</span>
      </div>

      <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
        <div className="bg-black h-2 rounded-full w-3/5"></div>
      </div>

      <p className="text-xs text-gray-500 mt-1">6/10 Sold</p>
    </div>
  );
}
