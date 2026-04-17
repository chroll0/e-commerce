import { getCategoryProducts } from "@/lib/productsApi";

type Props = {
  params: {
    slug: string;
    locale: string;
  };
};

export default async function Page({ params }: Props) {
  const { slug, locale } = params;

  const products = await getCategoryProducts(slug, locale);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Category: {slug}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg">
            <p>{product.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
