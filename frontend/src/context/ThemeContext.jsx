import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "theme";
const THEMES = ["light", "dark"];

function getStoredTheme() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(stored) ? stored : "light";
  } catch {
    // localStorage can be unavailable (private browsing, disabled cookies).
    // Falling back to light mode keeps the app usable either way.
    return "light";
  }
}

function readInitialTheme() {
  // The inline script in index.html already applies the saved theme to
  // <html> before React mounts (this avoids a flash of the wrong theme on
  // load), so read it back from there first and fall back to storage.
  if (typeof document !== "undefined") {
    const attr = document.documentElement.getAttribute("data-theme");
    if (THEMES.includes(attr)) return attr;
  }
  return getStoredTheme();
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readInitialTheme);

  // Keep <html data-theme="..."> and localStorage in sync with state. This is
  // the single place that writes the theme, and every page reads its colors
  // from the CSS variables that key off that attribute (see tokens.css).
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Non-fatal: the toggle still works for the current session/tab.
    }
  }, [theme]);

  // If the theme is changed in another tab, mirror it here too.
  useEffect(() => {
    function handleStorage(event) {
      if (event.key === STORAGE_KEY && THEMES.includes(event.newValue)) {
        setTheme(event.newValue);
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({ theme, isDark: theme === "dark", toggleTheme, setTheme }),
    [theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
