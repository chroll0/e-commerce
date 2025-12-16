"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const locales = [
  { code: "en", label: "EN", flag: "/flags/gb.svg" },
  { code: "ka", label: "KA", flag: "/flags/ge.svg" },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  if (!pathname) return null;

  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = segments[0];

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
    <div className="flex justify-end">
      <div className="flex items-center gap-2 rounded-full bg-background p-1 shadow-md">
        {locales.map(({ code, label, flag }) => {
          const isActive = currentLocale === code;
          return (
            <Link
              key={code}
              href={switchTo(code)}
              className={`flex items-center gap-2 px-2 py-1 rounded-full transition ${
                isActive
                  ? "bg-muted text-primary font-semibold"
                  : "text-muted hover:text-primary"
              }`}
            >
              <Image src={flag} alt={label} width={18} height={12} />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
