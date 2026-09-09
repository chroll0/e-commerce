"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/hooks";

const Logo = () => {
  const { theme } = useTheme();

  return (
    <Link
      href="/"
      className="relative flex items-baseline select-none tracking-wider"
    >
      <Image
        src={theme === "dark" ? "/logo_dark.png" : "/logo_light.png"}
        alt="Logo"
        width={100}
        height={100}
      />
    </Link>
  );
};

export default Logo;
