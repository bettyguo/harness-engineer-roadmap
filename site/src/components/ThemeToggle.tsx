import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("hr-theme");
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.dataset.theme = theme;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem("hr-theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg
                 border border-white/10 bg-[rgb(var(--canvas))]/85 backdrop-blur
                 text-[rgb(var(--ink-dim))] hover:text-[rgb(var(--ink))]
                 hover:border-white/20 transition-colors"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M13.2 9.5a5 5 0 1 1-6.7-6.7 5 5 0 0 0 6.7 6.7Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M8 1.5v1.5M8 13v1.5M1.5 8h1.5M13 8h1.5M3.5 3.5l1 1M11.5 11.5l1 1M3.5 12.5l1-1M11.5 4.5l1-1"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
