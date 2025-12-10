"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="w-full h-20 flex items-center justify-between px-6 shadow-sm bg-card border-b border-border">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">E-Commerce</h1>
      </div>

      {/* Right: Theme Button */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-border hover:bg-gray-300 dark:hover:bg-gray-700 transition"
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </nav>
  );
}
