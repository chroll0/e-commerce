"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/axios";

const locales = [
  { code: "en", label: "EN", flag: "/flags/gb.svg" },
  { code: "ka", label: "KA", flag: "/flags/ge.svg" },
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  if (!pathname) return null;

  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = segments[0];

  const buildPath = (locale: string) => {
    const newSegments = [...segments];

    if (locales.some((l) => l.code === newSegments[0])) {
      newSegments[0] = locale;
    } else {
      newSegments.unshift(locale);
    }

    return "/" + newSegments.join("/");
  };

  const mapCategorySlugForLocale = async (
    currentSlug: string,
    targetLocale: string,
  ) => {
    try {
      const res = await api.get(`/categories/slug/${encodeURIComponent(currentSlug)}`, {
        params: { locale: targetLocale },
      });

      return res.data?.slug ? String(res.data.slug) : currentSlug;
    } catch {
      return currentSlug;
    }
  };

  const handleSwitch = async (locale: string, path: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/`;
    const newSegments = path.split("/").filter(Boolean);
    const isCategoryPage = newSegments[1] === "category" && !!newSegments[2];

    if (isCategoryPage) {
      newSegments[2] = await mapCategorySlugForLocale(newSegments[2], locale);
      router.push("/" + newSegments.join("/"));
      return;
    }

    router.push(path);
  };

  return (
    <div className="flex justify-end">
      <div className="flex items-center gap-2 rounded-full bg-background p-1 shadow-md">
        {locales.map(({ code, label, flag }) => {
          const isActive = currentLocale === code;
          const path = buildPath(code);

          return (
            <button
              key={code}
              type="button"
              onClick={() => handleSwitch(code, path)}
              className={`flex items-center gap-2 px-2 py-1 rounded-full transition ${
                isActive
                  ? "bg-muted text-primary font-semibold"
                  : "text-muted hover:text-primary"
              }`}
            >
              <div className="w-5 h-5 relative">
                <Image src={flag} alt={label} fill className="object-contain" />
              </div>
              <span className="text-xs">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
