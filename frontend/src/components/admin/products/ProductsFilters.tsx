"use client";

import { FC } from "react";
import { SearchBar, CategorySelect, LabelSelect } from "@/components";

export type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  categoryId: string;
  onCategoryChange: (id: string) => void;
  labelId: string;
  onLabelChange: (id: string) => void;
};

const ProductsFilters: FC<Props> = ({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  labelId,
  onLabelChange,
}) => {
  return (
    <div className="flex items-end flex-row sm:flex-nowrap flex-wrap gap-3 mb-12">
      <div className="flex-3/5">
        <SearchBar value={search} onChange={onSearchChange} locale="en" />
      </div>
      <div className="flex-1/5">
        <CategorySelect value={categoryId} onChange={onCategoryChange} />
      </div>
      <div className="flex-1/5">
        <LabelSelect value={labelId} onChange={onLabelChange} />
      </div>
    </div>
  );
};

export default ProductsFilters;
