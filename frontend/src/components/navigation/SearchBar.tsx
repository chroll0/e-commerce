"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components";
import { api } from "@/lib/axios";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/products", {
          params: { search: query },
        });
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="w-full relative">
      <Input
        placeholder="Search products..."
        size="sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        leftIcon={<Search className="w-4 h-4 text-muted" />}
      />

      {query && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded-md mt-1 z-50">
          {loading && <p className="p-2 text-sm">Searching...</p>}

          {!loading && results.length === 0 && (
            <p className="p-2 text-sm text-muted">No products found</p>
          )}

          {results.map((product) => (
            <div key={product.id} className="p-2 hover:bg-muted cursor-pointer">
              {product.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
