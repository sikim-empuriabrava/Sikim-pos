"use client";

import { usePathname } from "next/navigation";

export function GlobalLogoutAction() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return (
    <form action="/api/pos-auth/logout" method="post" className="fixed right-3 top-3 z-50">
      <button
        className="min-h-9 rounded-md border border-slate-700 bg-slate-950/90 px-3 py-1.5 text-xs font-black text-slate-100 shadow-lg shadow-black/20 transition hover:border-rose-300 hover:text-rose-100"
        type="submit"
      >
        Sortir
      </button>
    </form>
  );
}
