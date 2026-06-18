"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  cashSession,
  formatCurrency,
  orderLines,
  orderTotal,
  reservations,
  staffContext,
  statusLabel,
  tables,
  tableCount,
  tableStatusLegend,
  tableZones,
  type Table,
  type TableStatus,
} from "@/lib/ui-data";
import { StatusBadge } from "@/components/ui";

const tableTone: Record<TableStatus, string> = {
  libre: "border-slate-200 bg-slate-50 text-slate-950",
  reservada:
    "border-violet-400 bg-violet-50 text-slate-950 shadow-[0_0_0_2px_rgba(124,58,237,0.25)]",
  ocupada:
    "border-rose-400 bg-rose-50 text-slate-950 shadow-[0_0_0_2px_rgba(244,63,94,0.18)]",
  "pendiente cocina":
    "border-yellow-400 bg-yellow-50 text-slate-950 shadow-[0_0_0_2px_rgba(250,204,21,0.22)]",
  "cuenta emitida":
    "border-blue-400 bg-blue-50 text-slate-950 shadow-[0_0_0_2px_rgba(96,165,250,0.2)]",
  incidencia:
    "border-red-500 bg-red-50 text-slate-950 shadow-[0_0_0_2px_rgba(239,68,68,0.24)]",
};

const topAction =
  "min-h-10 rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-slate-100 transition hover:bg-white/20";

const mapAction =
  "min-h-14 rounded-md border border-white/10 bg-white/10 px-5 py-3 text-base font-black text-slate-100 transition hover:bg-white/20";

const pendingAction =
  "min-h-11 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-black text-slate-100";

function TableTile({
  table,
  selected,
  mode,
  onSelect,
}: {
  table: Table;
  selected: boolean;
  mode: "normal" | "grouping" | "edit";
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative min-h-[128px] rounded-md border-2 p-3 text-center transition hover:-translate-y-0.5 ${
        selected ? "ring-4 ring-blue-400/80" : ""
      } ${tableTone[table.status]}`}
    >
      {mode === "edit" ? (
        <span className="absolute right-2 top-2 rounded bg-slate-900 px-1.5 py-1 text-[10px] font-black uppercase text-white">
          mover
        </span>
      ) : null}
      {mode === "grouping" && selected ? (
        <span className="absolute right-2 top-2 rounded bg-blue-600 px-1.5 py-1 text-[10px] font-black uppercase text-white">
          grupo
        </span>
      ) : null}
      <p className="text-[64px] font-black leading-[0.86] tracking-normal text-slate-950">
        {table.number}
      </p>
      <p className="mt-3 text-sm font-black text-slate-700">
        {table.seats} coberts
      </p>
      <p className="mx-auto mt-1 w-fit rounded-md bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-700">
        {statusLabel(table.status)}
      </p>
      {table.reservation ? (
        <p className="mt-2 truncate text-[11px] font-bold text-violet-700">
          {table.reservation}
        </p>
      ) : null}
    </button>
  );
}

function ReservationPanel({ onClose }: { onClose: () => void }) {
  const actionLabels = [
    "Acceptar / Aceptar",
    "Rebutjar / Rechazar",
    "Veure reserva / Ver reserva",
    "Assignar taula / Asignar mesa",
    "Cancel·lar assignació / Cancelar asignación",
    "Asseure client / Sentar cliente",
    "Obrir taula / Abrir mesa",
    "Tancar reserva 0,00 € / Cerrar reserva 0,00 €",
  ];

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/78 p-4">
      <section className="grid max-h-[82dvh] w-full max-w-[860px] grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-md bg-slate-50 text-slate-950 shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <p className="text-xs font-black uppercase text-slate-500">
              Reserves frontoffice mock
            </p>
            <h2 className="mt-1 text-4xl font-black">Reserves de avui</h2>
            <p className="mt-2 text-sm font-bold text-blue-800">
              {cashSession.businessDate} - {reservations.length} reserves - sense
              connexio externa
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 min-w-12 rounded-md border border-slate-300 bg-white text-2xl font-black"
            aria-label="Cerrar reservas"
          >
            x
          </button>
        </header>
        <div className="overflow-y-auto p-5">
          <div className="grid gap-3">
            {reservations.map((reservation) => (
              <article
                key={reservation.id}
                className="grid gap-3 border-b border-slate-200 pb-4 xl:grid-cols-[280px_1fr]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-black">
                      {reservation.time} - {reservation.guest}
                    </h3>
                    <StatusBadge value={reservation.status} />
                  </div>
                  <p className="mt-1 text-sm font-bold text-slate-600">
                    {reservation.partySize} persones -{" "}
                    {reservation.assignedTable ?? "sense taula assignada"}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {reservation.zone ?? "Zona pendent"} -{" "}
                    {reservation.notes ?? "Accions locals de referencia"}
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {actionLabels.map((action) => (
                    <button
                      key={`${reservation.id}-${action}`}
                      type="button"
                      className="min-h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-800"
                    >
                      {action} <span className="text-blue-700">mock</span>
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function HelpPanel({ onClose }: { onClose: () => void }) {
  const faqs = [
    "Com obro caixa?",
    "Com obro una taula?",
    "Com envio cuina?",
    "Com gestiono una reserva?",
    "Com marco incidencia?",
  ];

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/78 p-4">
      <section className="grid h-[468px] w-full max-w-[720px] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-md bg-slate-50 text-slate-950 shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <p className="text-xs font-black uppercase text-slate-500">
              Suport operatiu mock
            </p>
            <h2 className="mt-1 text-4xl font-black">Ajuda SIKIM</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 min-w-12 rounded-md border border-slate-300 bg-white text-2xl font-black"
            aria-label="Cerrar ayuda"
          >
            x
          </button>
        </header>
        <div className="bg-slate-100 p-5">
          <div className="w-fit rounded-md bg-white px-4 py-3 text-sm font-black text-slate-800">
            Hola, explica que passa amb el TPV.
          </div>
        </div>
        <footer className="grid gap-3 border-t border-slate-200 bg-white p-4">
          <div className="flex gap-2 overflow-x-auto">
            {faqs.map((faq) => (
              <button
                key={faq}
                type="button"
                className="min-h-10 shrink-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-700"
              >
                {faq}
              </button>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
            <input
              className="min-h-12 rounded-md border border-blue-300 bg-white px-3 text-sm font-bold text-slate-900 outline-none"
              placeholder="Escriu una consulta mock..."
            />
            <button
              type="button"
              className="min-h-12 rounded-md border border-slate-300 bg-white px-5 text-sm font-black"
            >
              Enviar
            </button>
            <Link
              href="/ayuda"
              className="min-h-12 rounded-md bg-blue-600 px-5 py-3 text-center text-sm font-black text-white"
            >
              /ayuda
            </Link>
          </div>
        </footer>
      </section>
    </div>
  );
}

export function PosFloorShell() {
  const [selectedZoneId, setSelectedZoneId] = useState(tableZones[0].id);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(
    "restaurant-1",
  );
  const [reservationsOpen, setReservationsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [terminalLocked, setTerminalLocked] = useState(false);
  const [mapMode, setMapMode] = useState<"normal" | "grouping" | "edit">(
    "normal",
  );

  const selectedZone =
    tableZones.find((zone) => zone.id === selectedZoneId) ?? tableZones[0];
  const visibleTables = useMemo(
    () => tables.filter((table) => table.zoneId === selectedZoneId),
    [selectedZoneId],
  );
  const selectedTable =
    tables.find((table) => table.id === selectedTableId) ?? null;
  const activeTotal = orderTotal(orderLines);

  function selectZone(zoneId: string) {
    setSelectedZoneId(zoneId);
    setSelectedTableId(tables.find((table) => table.zoneId === zoneId)?.id ?? null);
  }

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#111827] pb-12 text-slate-100">
      {reservationsOpen ? (
        <ReservationPanel onClose={() => setReservationsOpen(false)} />
      ) : null}
      {helpOpen ? <HelpPanel onClose={() => setHelpOpen(false)} /> : null}
      {terminalLocked ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/90 p-4">
          <section className="w-full max-w-xl rounded-md border border-slate-700 bg-slate-900 p-8 text-center shadow-2xl">
            <p className="text-xs font-black uppercase text-blue-300">
              Bloqueig mock/local
            </p>
            <h2 className="mt-3 text-5xl font-black text-white">SIKIM</h2>
            <p className="mt-4 text-lg font-bold text-slate-300">
              Terminal bloquejat. Sense auth real ni tancament de sessio.
            </p>
            <button
              type="button"
              onClick={() => setTerminalLocked(false)}
              className="mt-6 min-h-14 w-full rounded-md bg-blue-500 px-5 py-4 text-lg font-black text-white"
            >
              Desbloquejar mock
            </button>
          </section>
        </div>
      ) : null}

      <header className="grid min-h-[92px] grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-5 border-b border-white/10 bg-[#0f172a] px-[18px] py-2">
        <p className="text-3xl font-black text-white">SIKIM</p>
        <p className="text-3xl font-black text-white">{cashSession.openedAt}</p>
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_auto] grid-rows-[auto_auto] items-center gap-x-3 gap-y-2">
          <p className="truncate text-sm font-black text-slate-400">
            {staffContext.device} - {staffContext.user} - Manager - Mode prova
          </p>
          <label className="flex items-center gap-2 text-xs font-black text-slate-300">
            Usuari
            <select className="min-h-9 w-[132px] rounded-md border border-white/20 bg-white/10 px-3 text-sm text-white">
              <option>Manager torn</option>
              <option>Cambrer sala</option>
              <option>Cuina lectura</option>
            </select>
          </label>
          <span className="text-xs font-black text-slate-400">
            Mode permisos mock/local
          </span>
          <div className="col-span-3 flex flex-wrap items-center justify-between gap-2 text-xs font-black text-slate-400">
            <span>
              Caixa {cashSession.status} - {tableZones.length} zones -{" "}
              {tableCount} taules
            </span>
            <span>
              Sessio {cashSession.businessDate} - {cashSession.service} - sense
              backend
            </span>
          </div>
          <div className="col-span-3 flex min-w-0 justify-end gap-2 overflow-x-auto pb-0.5">
            <button type="button" className={topAction}>
              Actualitzar
            </button>
            <button
              type="button"
              onClick={() => setReservationsOpen(true)}
              className={topAction}
            >
              Reserves
            </button>
            <Link href="/turno" className={topAction}>
              Obrir caixa
            </Link>
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className={topAction}
            >
              Ajuda
            </button>
            <Link href="/admin" className={topAction}>
              Backoffice/Admin
            </Link>
            <button
              type="button"
              onClick={() => setTerminalLocked(true)}
              className={topAction}
            >
              Bloquejar
            </button>
          </div>
        </div>
      </header>

      <nav
        className="flex min-w-0 gap-4 overflow-x-auto border-b border-white/10 bg-[#111827] px-[18px] py-3"
        aria-label="Zones"
      >
        <button
          type="button"
          className="min-h-14 shrink-0 rounded-md px-8 py-3 text-base font-black text-slate-400"
        >
          Pedidos
        </button>
        {tableZones.map((zone) => (
          <button
            key={zone.id}
            type="button"
            onClick={() => selectZone(zone.id)}
            className={`min-h-14 shrink-0 rounded-md px-6 py-3 text-base font-black transition ${
              selectedZoneId === zone.id
                ? "bg-white/10 text-white shadow-[inset_0_-4px_0_#3b82f6]"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {zone.name}
          </button>
        ))}
      </nav>

      <section className="px-[18px] pt-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-slate-400">
              Mapa de taules
            </p>
            <h2 className="text-4xl font-black leading-none text-white">
              {selectedZone.name}
            </h2>
            <p className="mt-2 text-sm font-black text-slate-400">
              {visibleTables.length} taules visibles - {tableCount} totals - flux
              mock/local
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setMapMode(mapMode === "grouping" ? "normal" : "grouping")
              }
              className={`${mapAction} ${
                mapMode === "grouping"
                  ? "border-blue-300 bg-blue-500 text-white"
                  : ""
              }`}
            >
              Agrupar / Dissociar
            </button>
            <button
              type="button"
              onClick={() => setMapMode(mapMode === "edit" ? "normal" : "edit")}
              className={`${mapAction} ${
                mapMode === "edit" ? "border-blue-300 bg-blue-500 text-white" : ""
              }`}
            >
              {mapMode === "edit" ? "Modificant mapa" : "Modificar mapa"}
            </button>
          </div>
        </div>

        {mapMode === "grouping" ? (
          <div className="mt-3 rounded-md border border-yellow-400/50 bg-yellow-300/10 p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-black text-yellow-100">
                Selecciona taules per agrupar o selecciona un grup per dissociar.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Crear grup", "Dissociar", "Cancel.lar"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => label === "Cancel.lar" && setMapMode("normal")}
                    className="min-h-10 rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-xs font-black text-slate-100"
                  >
                    {label} mock
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {mapMode === "edit" ? (
          <div className="mt-3 rounded-md border border-blue-400/50 bg-blue-300/10 p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <strong className="text-sm font-black text-white">
                  Mode modificar mapa
                </strong>
                <p className="text-sm font-bold text-blue-100">
                  Arrossega les taules per col.locar-les. Layout mock, sense
                  persistencia.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Guardar", "Cancel.lar", "Restaurar layout"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => label === "Cancel.lar" && setMapMode("normal")}
                    className="min-h-10 rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-xs font-black text-slate-100"
                  >
                    {label} mock
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {selectedTable ? (
          <section className="mt-3 grid gap-3 rounded-md border border-white/10 bg-white/10 p-3 xl:grid-cols-[0.9fr_1.1fr_1.2fr]">
            <div className="rounded-md border border-white/10 bg-slate-950/40 p-3">
              <p className="text-xs font-black uppercase text-slate-400">
                Taula seleccionada
              </p>
              <p className="mt-1 text-2xl font-black text-white">
                {selectedTable.zone} - {selectedTable.name}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge value={selectedTable.status} />
                <span className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs font-black text-slate-300">
                  {selectedTable.seats} coberts
                </span>
                <span className="rounded-md border border-blue-300/40 bg-blue-300/10 px-2 py-1 text-xs font-black text-blue-100">
                  sessio mock {selectedTable.elapsed}
                </span>
              </div>
              <p className="mt-3 text-sm font-bold leading-5 text-slate-400">
                {selectedTable.note ??
                  selectedTable.reservation ??
                  "Llista per obrir una sessio de taula o comanda directa."}
              </p>
            </div>

            <div className="rounded-md bg-slate-50 p-3 text-slate-950">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase text-slate-500">
                    Ticket / comanda preview
                  </p>
                  <h3 className="text-xl font-black">
                    {selectedTable.zone} - {selectedTable.name}
                  </h3>
                </div>
                <p className="text-2xl font-black">{formatCurrency(activeTotal)}</p>
              </div>
              <div className="mt-3 grid gap-2">
                {orderLines.slice(0, 3).map((line) => (
                  <div
                    key={line.id}
                    className="grid grid-cols-[1fr_auto] gap-3 rounded-md border border-slate-200 bg-white px-3 py-2"
                  >
                    <span className="text-sm font-black">
                      {line.qty} x {line.name}
                    </span>
                    <span className="text-sm font-black">
                      {formatCurrency(line.qty * line.price)}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {statusLabel(line.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <button type="button" className={pendingAction}>
                Abrir mesa <span className="text-blue-200">mock</span>
              </button>
              <Link href="/pos/comanda" className={pendingAction}>
                Ver comanda
              </Link>
              <Link href="/pos/cobro" className={pendingAction}>
                Cobrar
              </Link>
              <button type="button" className={pendingAction}>
                Enviar cocina <span className="text-blue-200">mock</span>
              </button>
              <button
                type="button"
                onClick={() => setReservationsOpen(true)}
                className={pendingAction}
              >
                Buscar reserva <span className="text-blue-200">mock</span>
              </button>
              <button type="button" className={pendingAction}>
                Mover mesa <span className="text-amber-200">pendiente</span>
              </button>
              <button type="button" className={pendingAction}>
                Marcar incidencia <span className="text-blue-200">mock</span>
              </button>
              <Link href="/pos/comanda" className={pendingAction}>
                Crear comanda directa
              </Link>
            </div>
          </section>
        ) : null}

        <div
          className={`mt-3 ${
            mapMode === "edit"
              ? "min-h-[620px] rounded-md border border-white/10 bg-[linear-gradient(rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.14)_1px,transparent_1px)] bg-[length:34px_34px] p-12"
              : ""
          }`}
        >
          <div
            className={
              mapMode === "edit"
                ? "mx-auto grid max-w-[1120px] grid-cols-[repeat(5,minmax(120px,140px))] justify-between gap-y-0"
                : "grid grid-cols-[repeat(auto-fill,minmax(122px,1fr))] gap-3"
            }
          >
            {visibleTables.map((table) => (
              <TableTile
                key={table.id}
                table={table}
                selected={selectedTable?.id === table.id}
                mode={mapMode}
                onSelect={() => setSelectedTableId(table.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <footer className="fixed inset-x-0 bottom-0 z-20 flex min-h-12 items-center gap-5 overflow-x-auto border-t border-white/10 bg-[#0f172a]/95 px-[18px] py-2 backdrop-blur">
        {tableStatusLegend.map((item) => (
          <span
            key={item.status}
            className="flex shrink-0 items-center gap-2 text-sm font-black text-slate-300"
          >
            <span
              className={`h-4 w-4 rounded-full border-2 ${
                item.status === "libre"
                  ? "border-white bg-white"
                  : item.status === "pendiente cocina"
                    ? "border-yellow-300 bg-yellow-300"
                    : item.status === "ocupada"
                      ? "border-rose-300 bg-rose-300"
                      : item.status === "cuenta emitida"
                        ? "border-amber-200 bg-amber-200"
                        : item.status === "reservada"
                          ? "border-violet-300 bg-violet-300"
                          : "border-red-400 bg-red-400"
              }`}
            />
            {item.label}
          </span>
        ))}
      </footer>

      <Link
        href="/pos/comanda"
        aria-label="Crear comanda directa"
        className="fixed bottom-14 right-5 z-30 flex min-h-16 items-center gap-3 rounded-full bg-blue-500 px-5 py-3 text-base font-black text-white shadow-2xl"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-3xl">
          +
        </span>
        Crear comanda directa
      </Link>
    </div>
  );
}
