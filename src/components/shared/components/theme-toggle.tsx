"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // tránh lỗi hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center rounded-full border border-border p-1 bg-muted">
      <Button
        size="icon"
        variant={!isDark ? "default" : "ghost"}
        className="rounded-full"
        onClick={() => setTheme("light")}
      >
        <Sun className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant={isDark ? "default" : "ghost"}
        className="rounded-full"
        onClick={() => setTheme("dark")}
      >
        <Moon className="h-4 w-4" />
      </Button>
    </div>
  );
}