import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("infynux-theme") as "light" | "dark" | null;
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function setTheme(theme: "light" | "dark") {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("infynux-theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
}

export function applyTheme() {
  const theme = getTheme();
  document.documentElement.setAttribute("data-theme", theme);
}

