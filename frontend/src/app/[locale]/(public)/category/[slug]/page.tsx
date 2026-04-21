import { getProducts } from "@/lib/productsApi";
import { getCategoryBySlug } from "@/lib/categoriesApi";

type Props = {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
};
export const dynamic = "force-dynamic";

export default async function Page({ params }: Props) {
  const { slug, locale } = await params;

  const [products, category] = await Promise.all([
    getProducts({
      categorySlug: slug,
      locale,
    }),
    getCategoryBySlug(slug, locale),
  ]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">{category?.name ?? slug}</h1>
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
