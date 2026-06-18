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
  const [movementReason, setMovementReason] = useState("Cambio para caja");
  const [sessionOpen, setSessionOpen] = useState(true);
  const [notice, setNotice] = useState("Caja abierta mock para entrar a POS sala.");

  const expected = cashSession.expectedCash;
  const counted = Number(countedCash) || 0;
  const difference = useMemo(() => counted - expected, [counted, expected]);

  function markAction(action: string) {
    if (action.startsWith("Abrir")) {
      setSessionOpen(true);
      setNotice("Sesion abierta en estado local. Puedes entrar a POS sala.");
      return;
    }

    if (action.startsWith("Cerrar")) {
      setSessionOpen(false);
      setNotice("Cierre visual preparado. No hay contabilidad ni persistencia.");
      return;
    }

    setNotice(`${action} registrado solo como movimiento mock.`);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_390px]">
      <section className="grid gap-4">
        <div className="rounded-md border border-slate-800 bg-[#101728] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-slate-500">
                Gate de caja frontoffice
              </p>
              <h2 className="mt-1 text-5xl font-black text-white">SIKIM</h2>
              <p className="mt-2 text-lg font-bold text-slate-300">
                Abre o revisa caja antes de operar sala. Estado local, sin
                contabilidad real.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge value={sessionOpen ? "mock" : "pendiente"} />
              <StatusBadge value={sessionOpen ? "mock abierta" : "cerrada"} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="grid gap-2 text-sm font-black text-slate-300">
              Usuario
              <select
                value={user}
                onChange={(event) => setUser(event.target.value)}
                className="min-h-12 rounded-md border border-slate-700 bg-slate-950 px-3 text-white"
              >
                <option>Manager turno</option>
                <option>Responsable sala</option>
                <option>Camarero caja</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-black text-slate-300">
              Fecha negocio
              <input
                value={businessDate}
                onChange={(event) => setBusinessDate(event.target.value)}
                className="min-h-12 rounded-md border border-slate-700 bg-slate-950 px-3 text-white"
              />
            </label>
            <label className="grid gap-2 text-sm font-black text-slate-300">
              Fondo apertura
              <input
                value={openingCash}
                onChange={(event) => setOpeningCash(event.target.value)}
                inputMode="decimal"
                className="min-h-12 rounded-md border border-slate-700 bg-slate-950 px-3 text-white"
              />
            </label>
            <label className="grid gap-2 text-sm font-black text-slate-300">
              Efectivo contado
              <input
                value={countedCash}
                onChange={(event) => setCountedCash(event.target.value)}
                inputMode="decimal"
                className="min-h-12 rounded-md border border-slate-700 bg-slate-950 px-3 text-white"
              />
            </label>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm font-bold text-slate-400">Efectivo esperado</p>
            <p className="mt-2 text-3xl font-black text-white">
              {formatCurrency(expected)}
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500">
              Calculado visual desde mock
            </p>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm font-bold text-slate-400">Efectivo contado</p>
            <p className="mt-2 text-3xl font-black text-white">
              {formatCurrency(counted)}
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500">
              Entrada local
            </p>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm font-bold text-slate-400">Diferencia</p>
            <p className="mt-2 text-3xl font-black text-amber-300">
              {formatCurrency(difference)}
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500">
              Pendiente de validar
            </p>
          </div>
        </div>

        <div className="rounded-md border border-slate-800 bg-slate-900 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-white">Movimientos mock</h2>
              <p className="mt-1 text-sm font-semibold text-slate-400">
                Deposito, retirada o gasto quedan como UI local.
              </p>
            </div>
            <MockBadge>sin contabilidad</MockBadge>
          </div>
          <div className="grid gap-3 md:grid-cols-[180px_1fr]">
            <label className="grid gap-2 text-sm font-black text-slate-300">
              Importe
              <input
                value={movementAmount}
                onChange={(event) => setMovementAmount(event.target.value)}
                inputMode="decimal"
                className="min-h-12 rounded-md border border-slate-700 bg-slate-950 px-3 text-white"
              />
            </label>
            <label className="grid gap-2 text-sm font-black text-slate-300">
              Motivo
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
      </section>

      <aside className="grid gap-4 self-start">
        <section className="rounded-md border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-xl font-black text-white">Estado de sesion</h2>
          <div className="mt-4 grid gap-3">
            {[
              ["Usuario activo", user],
              ["Fecha negocio", businessDate],
              ["Fondo apertura", formatCurrency(Number(openingCash) || 0)],
              ["Movimiento", `${formatCurrency(Number(movementAmount) || 0)} - ${movementReason}`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-md border border-slate-800 bg-slate-950 p-3"
              >
                <p className="text-xs font-black uppercase text-slate-500">
                  {label}
                </p>
                <p className="mt-1 text-sm font-black text-slate-100">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-md border border-blue-400/40 bg-blue-400/10 p-3 text-sm font-bold text-blue-100">
            {notice}
          </p>
          <Link
            href="/pos"
            className={`mt-4 block min-h-14 rounded-md px-4 py-4 text-center text-base font-black ${
              sessionOpen
                ? "bg-blue-500 text-white"
                : "border border-slate-700 bg-slate-950 text-slate-500"
            }`}
          >
            Entrar a POS sala
          </Link>
        </section>

        <section className="rounded-md border border-slate-800 bg-slate-900 p-4">
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
          <div className="mt-4 rounded-md border border-amber-300/40 bg-amber-300/10 p-3 text-sm font-bold leading-6 text-amber-100">
            Estos permisos no son auth real. Sirven para mostrar el flujo de
            producto antes de definir roles y backend.
          </div>
        </section>
      </aside>
    </div>
  );
}
