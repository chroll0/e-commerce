"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const locales = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "ka", label: "KA", flag: "🇬🇪" },
];

export function LanguageSwitcher() {
  const pathname = usePathname();

  if (!pathname) return null;

  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = segments[0]; // en | ka

  const switchTo = (locale: string) => {
    const newSegments = [...segments];

    if (locales.some((l) => l.code === newSegments[0])) {
      newSegments[0] = locale;
    } else {
      newSegments.unshift(locale);
    }

    return "/" + newSegments.join("/");
  };

  return (
    <div className="flex items-center gap-2 rounded-full border px-3 py-1">
      {locales.map(({ code, label, flag }) => {
        const isActive = currentLocale === code;

        return (
          <Link
            key={code}
            href={switchTo(code)}
            className={`flex items-center gap-1 px-2 py-1 rounded-full transition ${
              isActive
                ? "bg-muted text-primary font-semibold"
                : "text-muted hover:text-primary"
            }`}
          >
            <span className="text-base leading-none">{flag}</span>
            <span className="text-xs leading-none">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
