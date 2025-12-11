"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="icon"
      size="md"
      onClick={toggleTheme}
      className="rounded-full"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
export default ThemeToggle;
