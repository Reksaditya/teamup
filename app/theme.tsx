"use client";

import { useEffect, useSyncExternalStore } from "react";

const key = "teamup-theme";
const listeners = new Set<() => void>();
function read() {
  try {
    return localStorage.getItem(key) === "dark" ? "dark" : "light";
  } catch {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  }
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const sync = (event: StorageEvent) => {
    if (event.key === key || event.key === null) listener();
  };
  window.addEventListener("storage", sync);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", sync);
  };
}
export function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribe, read, () => "light");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === "dark"}
      aria-label="Tema gelap"
      className="theme-switch"
      title={theme === "dark" ? "Gunakan tema terang" : "Gunakan tema gelap"}
      onClick={() => {
        const next = theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem(key, next);
        } catch {
          /* Keep the choice for this page when storage is unavailable. */
        }
        listeners.forEach((listener) => listener());
      }}
    >
      <span className="theme-track" aria-hidden="true">
        <span className="theme-thumb" />
      </span>
      <span className="theme-label">
        {theme === "dark" ? "Gelap" : "Terang"}
      </span>
    </button>
  );
}
