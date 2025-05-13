import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

import { useTheme } from "../context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-2 rounded-md bg-emerald-50 dark:bg-emerald-900 shadow-lg hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <MoonIcon className="h-6 w-6 text-emerald-700 dark:text-emerald-200" />
      ) : (
        <SunIcon className="h-6 w-6 text-emerald-700 dark:text-emerald-200" />
      )}
    </button>
  );
}
