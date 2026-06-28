import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { getTheme, setTheme } from "@/lib/utils";

export function ThemeToggle() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    setThemeState(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
