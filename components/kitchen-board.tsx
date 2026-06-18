"use client";

import { useMemo, useState } from "react";
import { productionTickets, statusLabel, type Station } from "@/lib/ui-data";
import { MockBadge, Panel, StatusBadge } from "@/components/ui";

const stations: (Station | "todas")[] = ["todas", "cocina", "barra", "postres"];

export function KitchenBoard() {
  const [station, setStation] = useState<(typeof stations)[number]>("todas");
  const [notice, setNotice] = useState("Produccion mock alineada con Enviar cocina/barra.");
  const visibleTickets = useMemo(
    () =>
      station === "todas"
        ? productionTickets
        : productionTickets.filter((ticket) => ticket.station === station),
    [station],
  );

  return (
    <div className="grid gap-4">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-black text-blue-300">
                Pantalla de produccion
              </p>
              <MockBadge>sin backend</MockBadge>
            </div>
            <p className="mt-1 text-sm font-semibold text-slate-400">
              Estados visibles: pending, sent, preparing, ready, claimed, error.
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {stations.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStation(item)}
                className={`min-h-12 rounded-md px-5 py-3 text-sm font-black ${
                  station === item
                    ? "bg-blue-500 text-white"
                    : "border border-slate-800 bg-slate-950 text-slate-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <div className="rounded-md border border-blue-400/40 bg-blue-400/10 p-3 text-sm font-bold text-blue-100">
        {notice}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {visibleTickets.map((ticket) => (
          <Panel key={ticket.id} className="min-h-80">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-500">
                  {ticket.id} - {ticket.station}
                </p>
                <h2 className="mt-1 text-3xl font-black text-white">
                  {ticket.table}
                </h2>
              </div>
              <StatusBadge value={ticket.status} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-slate-950 p-3">
                <p className="text-xs font-black uppercase text-slate-500">
                  Tiempo
                </p>
                <p className="text-2xl font-black text-amber-300">
                  {ticket.elapsed}
                </p>
              </div>
              <div className="rounded-md bg-slate-950 p-3">
                <p className="text-xs font-black uppercase text-slate-500">
                  Estado
                </p>
                <p className="text-lg font-black text-slate-100">
                  {statusLabel(ticket.status)}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              {ticket.lines.map((line) => (
                <div
                  key={line}
                  className="rounded-md border border-slate-800 bg-slate-950 px-3 py-3 text-lg font-black text-slate-100"
                >
                  {line}
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 text-sm">
              <p className="rounded-md border border-amber-300/30 bg-amber-300/10 p-3 font-bold text-amber-100">
                Notas/alergenos: {ticket.notes}
              </p>
              <p className="rounded-md border border-slate-800 bg-slate-950 p-3 font-bold text-slate-400">
                Print job: {ticket.printStatus}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {["Preparar mock", "Listo mock", "Reclamar", "Reimprimir"].map(
                (action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() =>
                      setNotice(`${action} para ${ticket.id} queda como aviso local.`)
                    }
                    className="min-h-12 rounded-md border border-slate-700 px-2 py-2 text-sm font-black text-slate-200"
                  >
                    {action}
                  </button>
                ),
              )}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
