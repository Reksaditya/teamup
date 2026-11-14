"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { User } from "../lib/demo";
import { Avatar, Icon } from "./ui";

export function AccountMenu({
  user,
  logout,
}: {
  user: User;
  logout: () => void;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node))
        ref.current.open = false;
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  function closeMenu() {
    if (ref.current) ref.current.open = false;
  }
  return (
    <details
      className="account-menu"
      ref={ref}
      onKeyDown={(event) => {
        if (event.key === "Escape" && ref.current?.open) {
          event.preventDefault();
          closeMenu();
          ref.current?.querySelector("summary")?.focus();
        }
      }}
    >
      <summary className="account-link" aria-label="Menu akun">
        <Avatar user={user} size="tiny" />
        <span>{user.name.split(" ")[0]}</span>
        <Icon name="arrow" size={16} />
      </summary>
      <div className="account-dropdown">
        <div className="account-summary">
          <Avatar user={user} />
          <div>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
        </div>
        <Link href="/dashboard" onClick={closeMenu}>
          <Icon name="grid" size={18} />
          Dashboard
        </Link>
        <Link href="/dashboard/profil" onClick={closeMenu}>
          <Icon name="edit" size={18} />
          Profil
        </Link>
        {user.admin && (
          <Link href="/admin" onClick={closeMenu}>
            <Icon name="shield" size={18} />
            Admin
          </Link>
        )}
        <button
          className="account-logout"
          onClick={() => {
            closeMenu();
            ref.current?.querySelector("summary")?.focus();
            logout();
          }}
        >
          <Icon name="logout" size={18} />
          Logout
        </button>
      </div>
    </details>
  );
}
