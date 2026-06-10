"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components";
import { Locale } from "@/types";
import { useTranslations } from "next-intl";
import { getProducts } from "@/lib/productsApi";

type Product = {
  id: number;
  title?: string;
  slug?: string;
  translations?: { locale: "en" | "ka"; title: string }[];
};

type Props = {
  value: string;
  onChange: (next: string) => void;
  locale: Locale;
  placeholder?: string;
};

const SearchBar = ({ value, onChange, locale, placeholder }: Props) => {
  const t = useTranslations("admin.products");
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const getTitle = (p: Product) => {
    if (p.title) return p.title;
    const tr = p.translations?.find((x) => x.locale === locale)?.title;
    return tr ?? p.slug ?? `#${p.id}`;
  };

  useEffect(() => {
    const q = value.trim();

    if (!q) {
      setResults([]);
      setOpen(false);
      return;
    }

    setOpen(true);

    const timeout = window.setTimeout(async () => {
      try {
        setLoading(true);

        const data = await getProducts({
          search: q,
          locale: String(locale),
        });

        setResults((data ?? []) as Product[]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [value, locale]);

  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const showDropdown = open && value.trim().length > 0;

  return (
    <div ref={wrapRef} className="w-full relative">
      <label className="capitalize flex items-center gap-2 text-xs font-medium text-secondary">
        {<Search className="w-4 h-4 text-foreground" />}
        {t("search")}
      </label>

      <Input
        placeholder={placeholder || t("searchPlaceholder")}
        size="md"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (value.trim()) setOpen(true);
        }}
        fullWidth
      />

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-md mt-1 z-50 text-foreground overflow-hidden">
          {loading && <p className="p-2 text-sm">{t("searching")}</p>}

          {!loading && results.length === 0 && (
            <p className="p-2 text-sm text-muted">{t("noResults")}</p>
          )}

          {!loading &&
            results.map((product) => {
              const title = getTitle(product);
              return (
                <button
                  key={product.id}
                  type="button"
                  className="w-full text-left p-2 hover:bg-muted/40 cursor-pointer text-sm"
                  onClick={() => {
                    onChange(title);
                    setOpen(false);
                  }}
                >
                  {title}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
