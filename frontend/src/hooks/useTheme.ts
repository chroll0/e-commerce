"use client";

import { useThemeContext } from "@/components";

export function useTheme() {
  const { theme, toggleTheme, setTheme } = useThemeContext();
  return { theme, toggleTheme, setTheme };
}
