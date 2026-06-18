"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  cashSession,
  formatCurrency,
  permissions,
  shiftActions,
} from "@/lib/ui-data";
import { MockBadge, StatusBadge } from "@/components/ui";

export function ShiftGateShell() {
  const [user, setUser] = useState(cashSession.user);
  const [businessDate, setBusinessDate] = useState(cashSession.businessDate);
  const [openingCash, setOpeningCash] = useState(String(cashSession.openingCash));
  const [countedCash, setCountedCash] = useState(String(cashSession.countedCash));
  const [movementAmount, setMovementAmount] = useState("25");
  const [movementReason, setMovementReason] = useState("Canvi per caixa");
  const [sessionOpen, setSessionOpen] = useState(false);
  const [notice, setNotice] = useState(
    "Caixa tancada. Obre caixa per comencar.",
  );

  const expected = cashSession.expectedCash;
  const counted = Number(countedCash) || 0;
  const difference = useMemo(() => counted - expected, [counted, expected]);

  function markAction(action: string) {
    if (action.startsWith("Abrir")) {
      setSessionOpen(true);
      setNotice("Caixa oberta en estat local. Pots entrar al POS sala.");
      return;
    }

    if (action.startsWith("Cerrar")) {
      setSessionOpen(false);
      setNotice("Tancament visual preparat. Sense comptabilitat ni persistencia.");
      return;
    }

    setNotice(`${action} registrat nomes com moviment mock.`);
  }

  return (
    <div className="min-h-[100dvh] bg-[radial-gradient(circle_at_top_left,rgba(47,128,237,0.18),transparent_34rem),#0b1220]">
      <section className="grid min-h-[68dvh] place-items-center px-7 py-10">
        <div className="grid w-full max-w-[620px] gap-6 text-center">
          <div>
            <p className="text-xs font-black uppercase text-slate-400">
              Frontoffice v0.4 - Mode prova
            </p>
            <h2 className="mt-2 text-[clamp(48px,7vw,84px)] font-black leading-[0.95] text-white">
              SIKIM
              <span className="block">Empuriabrava</span>
            </h2>
          </div>

          <p className="text-[clamp(76px,13vw,128px)] font-black leading-[0.86] text-white">
            {cashSession.openedAt}
          </p>

          <p className="text-lg font-black text-slate-400">{notice}</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <label className="flex items-center gap-2 text-xs font-black text-slate-300">
              Usuari
              <select
                value={user}
                onChange={(event) => setUser(event.target.value)}
                className="min-h-9 w-[140px] rounded-md border border-white/20 bg-white/10 px-3 text-sm text-white"
              >
                <option>Manager torn</option>
                <option>Responsable sala</option>
                <option>Cambrer caixa</option>
              </select>
            </label>
            <span className="text-xs font-black text-slate-400">
              Mode permisos mock/local
            </span>
          </div>

          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => markAction("Abrir caja/session")}
              className="min-h-[76px] rounded-md border border-blue-500 bg-blue-500 px-5 py-4 text-2xl font-black text-white"
            >
              Obrir caixa
            </button>
            <Link
              href="/pos"
              className={`min-h-14 rounded-md px-5 py-4 text-center text-base font-black ${
                sessionOpen
                  ? "border border-white/10 bg-white/10 text-white"
                  : "cursor-not-allowed border border-white/10 bg-white/5 text-slate-500"
              }`}
              aria-disabled={!sessionOpen}
            >
              Entrar POS sala
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1220px] gap-4 px-5 pb-10 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          <div className="rounded-md border border-white/10 bg-[#101728] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-white">
                  Dades de caixa mock
                </h2>
                <p className="mt-1 text-sm font-bold text-slate-400">
                  Cap dada es persisteix ni crea comptabilitat real.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={sessionOpen ? "mock" : "pendiente"} />
                <StatusBadge value={sessionOpen ? "mock abierta" : "cerrada"} />
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="grid gap-2 text-sm font-black text-slate-300">
                Data negoci
                <input
                  value={businessDate}
                  onChange={(event) => setBusinessDate(event.target.value)}
                  className="min-h-12 rounded-md border border-slate-700 bg-slate-950 px-3 text-white"
                />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-300">
                Fons apertura
                <input
                  value={openingCash}
                  onChange={(event) => setOpeningCash(event.target.value)}
                  inputMode="decimal"
                  className="min-h-12 rounded-md border border-slate-700 bg-slate-950 px-3 text-white"
                />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-300">
                Efectiu comptat
                <input
                  value={countedCash}
                  onChange={(event) => setCountedCash(event.target.value)}
                  inputMode="decimal"
                  className="min-h-12 rounded-md border border-slate-700 bg-slate-950 px-3 text-white"
                />
              </label>
              <div className="rounded-md border border-slate-800 bg-slate-950 p-3">
                <p className="text-xs font-black uppercase text-slate-500">
                  Diferencia
                </p>
                <p className="mt-1 text-2xl font-black text-amber-300">
                  {formatCurrency(difference)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-white/10 bg-[#101728] p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-white">
                  Moviments mock
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-400">
                  Diposit, retirada o despesa queden nomes com UI local.
                </p>
              </div>
              <MockBadge>sin contabilidad</MockBadge>
            </div>
            <div className="grid gap-3 md:grid-cols-[180px_1fr]">
              <label className="grid gap-2 text-sm font-black text-slate-300">
                Import
                <input
                  value={movementAmount}
                  onChange={(event) => setMovementAmount(event.target.value)}
                  inputMode="decimal"
                  className="min-h-12 rounded-md border border-slate-700 bg-slate-950 px-3 text-white"
                />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-300">
                Motiu
                <input
                  value={movementReason}
                  onChange={(event) => setMovementReason(event.target.value)}
                  className="min-h-12 rounded-md border border-slate-700 bg-slate-950 px-3 text-white"
                />
              </label>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {shiftActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => markAction(action)}
                  className="min-h-12 rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm font-black text-slate-100"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="grid gap-4 self-start">
          <section className="rounded-md border border-white/10 bg-[#101728] p-4">
            <h2 className="text-xl font-black text-white">Estat de sessio</h2>
            <div className="mt-4 grid gap-3">
              {[
                ["Usuari actiu", user],
                ["Data negoci", businessDate],
                ["Fons apertura", formatCurrency(Number(openingCash) || 0)],
                [
                  "Moviment",
                  `${formatCurrency(Number(movementAmount) || 0)} - ${movementReason}`,
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-md border border-slate-800 bg-slate-950 p-3"
                >
                  <p className="text-xs font-black uppercase text-slate-500">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-100">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-md border border-blue-400/40 bg-blue-400/10 p-3 text-sm font-bold text-blue-100">
              {notice}
            </p>
          </section>

          <section className="rounded-md border border-white/10 bg-[#101728] p-4">
            <h2 className="text-xl font-black text-white">Permisos visibles</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {permissions.map((permission) => (
                <span
                  key={permission}
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-black text-slate-200"
                >
                  {permission}
                </span>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
