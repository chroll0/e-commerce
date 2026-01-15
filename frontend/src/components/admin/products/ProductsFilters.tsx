import { FC } from "react";
import { SearchBar, CategoryDropdown } from "@/components";

export type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  categoryId: string;
  onCategoryChange: (id: string) => void;
};

const ProductsFilters: FC<Props> = ({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <SearchBar value={search} onChange={onSearchChange} />
      {/* <CategoryDropdown value={categoryId} onChange={onCategoryChange} /> */}
    </div>
  );
};

export default ProductsFilters;
