"use client";

import { FC } from "react";
import { SearchBar, CategorySelect } from "@/components";

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
    <div className="flex items-end flex-row sm:flex-nowrap flex-wrap gap-3 mb-12">
      <div className="flex-3/4">
        <SearchBar value={search} onChange={onSearchChange} locale="en" />
      </div>
      <div className="flex-1/4">
        <CategorySelect value={categoryId} onChange={onCategoryChange} />
      </div>
    </div>
  );
};

export default ProductsFilters;
