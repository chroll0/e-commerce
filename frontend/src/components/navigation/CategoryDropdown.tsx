"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components";

type Category = {
  id: number;
  name: string;
  slug: string;
};

const CategorySelect = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState("Categories");
  const router = useRouter();

  useEffect(() => {
    api.get("/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const items = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
    slug: cat,
  }));

  return (
    <Dropdown<Category>
      items={items}
      size="sm"
      buttonLabel={selected}
      onSelect={(item) => {
        const cat = item.data!;
        setSelected(cat.name);
        router.push(`/products?category=${cat.slug}`);
      }}
    />
  );
};

export default CategorySelect;
