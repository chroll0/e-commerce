import Link from "next/link";

const AdminProductsPage = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products</h2>

        <Link
          href="./products/new"
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Add product
        </Link>
      </div>

      <div className="rounded-md border bg-background p-4">
        Products table goes here
      </div>
    </div>
  );
};

export default AdminProductsPage;
