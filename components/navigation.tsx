"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLinks } from "@/lib/ui-data";

function isActive(pathname: string, href: string) {
  return pathname === href;
}

export function AppNavigation() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isAdminRoute) {
    return null;
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 text-slate-100 backdrop-blur">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 lg:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-3 rounded-md px-2 py-1 text-left transition hover:bg-white/5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-400 text-sm font-black text-slate-950">
              SK
            </span>
            <span>
              <span className="block text-base font-semibold tracking-normal">
                Sikim POS
              </span>
              <span className="block text-xs font-medium text-slate-400">
                Shell operativo interno
              </span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-amber-300/50 bg-amber-300/10 px-3 py-2 text-xs font-semibold text-amber-100">
              Fase inicial. Sin backend.
            </span>
            <Link
              href="/ayuda"
              className="min-h-11 rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
            >
              Ayuda
            </Link>
          </div>
        </div>

        <nav aria-label="Navegacion backoffice" className="flex flex-col gap-2">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={`min-h-11 shrink-0 rounded-md border px-3 py-2 text-xs font-semibold transition ${
                  isActive(pathname, link.href)
                    ? "border-emerald-300 bg-emerald-300 text-slate-950"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-600 hover:text-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/pos"
              className="min-h-11 shrink-0 rounded-md border border-emerald-300/70 bg-slate-950 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-300 hover:text-slate-950"
            >
              Frontoffice
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
