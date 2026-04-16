export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/slug/${params.slug}`,
  ).then((res) => res.json());

  return (
    <div>
      <h1>{category.name}</h1>
    </div>
  );
}
