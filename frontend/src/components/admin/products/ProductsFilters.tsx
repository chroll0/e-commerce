import { FC } from "react";
import { SearchBar } from "@/components";

export type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  categoryId: string;
  onCategoryChange: (id: string) => void;
};

const ProductsFilters: FC<Props> = ({ search, onSearchChange }) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-12">
      <SearchBar value={search} onChange={onSearchChange} locale="en" />
    </div>
  );
};

export default ProductsFilters;
