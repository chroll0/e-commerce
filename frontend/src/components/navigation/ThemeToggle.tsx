"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks";
import { Button } from "@/components";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      iconOnly
      size="sm"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="h-8 w-8 rounded-full bg-background active:scale-95"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
}

export default ThemeToggle;
