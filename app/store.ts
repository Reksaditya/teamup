"use client";
import { useSyncExternalStore } from "react";
import { seed, type State } from "../lib/demo";
const initial = seed();
type Snapshot = { state: State; warning: boolean };
let snapshot: Snapshot | null = null;
const listeners = new Set<() => void>();
function read() {
  if (!snapshot) {
    let state = initial,
      warning = false;
    try {
      const saved = localStorage.getItem("teamup-demo-v1");
      if (saved) {
        const value = JSON.parse(saved);
        const arrays = [
          "users",
          "competitions",
          "teams",
          "requests",
          "applications",
          "messages",
          "blocks",
          "reports",
          "audit",
        ];
        if (!arrays.every((key) => Array.isArray(value[key])))
          throw Error("Invalid demo");
        state = value;
      }
    } catch {
      warning = true;
    }
    snapshot = { state, warning };
  }
  return snapshot;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  function sync(e: StorageEvent) {
    if (e.key === "teamup-demo-v1") {
      snapshot = null;
      read();
      listeners.forEach((fn) => fn());
    }
  }
  window.addEventListener("storage", sync);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", sync);
  };
}
function setState(change: State | ((s: State) => State)) {
  const old = read();
  const state = typeof change === "function" ? change(old.state) : change;
  let warning = old.warning;
  try {
    localStorage.setItem("teamup-demo-v1", JSON.stringify(state));
  } catch {
    warning = true;
  }
  snapshot = { state, warning };
  listeners.forEach((fn) => fn());
}
const serverSnapshot = () => null;
export function useDemoState() {
  const current = useSyncExternalStore(subscribe, read, serverSnapshot);
  return {
    state: current?.state || initial,
    ready: current !== null,
    storageWarning: current?.warning || false,
    setState,
  };
}
