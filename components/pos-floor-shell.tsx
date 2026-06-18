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
  tableCount,
  tables,
  tableStatusLegend,
  tableZones,
  type Reservation,
  type Table,
  type TableStatus,
} from "@/lib/ui-data";
import { MockBadge, StatusBadge } from "@/components/ui";

const tableTone: Record<TableStatus, string> = {
  libre: "border-slate-200 bg-slate-50 text-slate-950",
  reservada: "border-violet-400 bg-violet-50 text-slate-950 shadow-[0_0_0_2px_rgba(124,58,237,0.22)]",
  ocupada: "border-rose-400 bg-rose-50 text-slate-950 shadow-[0_0_0_2px_rgba(244,63,94,0.18)]",
  "pendiente cocina": "border-yellow-400 bg-yellow-50 text-slate-950 shadow-[0_0_0_2px_rgba(250,204,21,0.2)]",
  "cuenta emitida": "border-blue-400 bg-blue-50 text-slate-950 shadow-[0_0_0_2px_rgba(96,165,250,0.2)]",
  incidencia: "border-red-500 bg-red-50 text-slate-950 shadow-[0_0_0_2px_rgba(239,68,68,0.24)]",
};

const actionButton =
  "min-h-12 rounded-md border border-slate-700 bg-slate-900 px-3 py-3 text-sm font-black text-slate-100 transition hover:border-blue-300 hover:bg-slate-800";

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
      className={`relative min-h-28 rounded-md border-2 p-3 text-center transition hover:-translate-y-0.5 ${
        selected ? "ring-4 ring-blue-400/70" : ""
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
      <p className="text-5xl font-black leading-none tracking-normal text-slate-950">
        {table.number}
      </p>
      <p className="mt-2 text-sm font-black text-slate-700">{table.seats} pax</p>
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

function ReservationPanel({
  onClose,
}: {
  onClose: () => void;
}) {
  const actionLabels = [
    "Acceptar/Aceptar",
    "Rebutjar/Rechazar",
    "Veure reserva",
    "Assignar taula",
    "Cancel.lar assignacio",
    "Asseure client",
    "Obrir taula",
    "Tancar reserva 0,00 EUR",
  ];

  function visibleActions(reservation: Reservation) {
    if (reservation.status === "requested") {
      return actionLabels.slice(0, 4);
    }

    if (reservation.status === "assigned" || reservation.status === "confirmed") {
      return actionLabels.slice(2, 8);
    }

    return ["Veure reserva", "Obrir taula", "Tancar reserva 0,00 EUR"];
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/78 p-4">
      <section className="max-h-[82dvh] w-full max-w-3xl overflow-hidden rounded-md bg-slate-50 text-slate-950 shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-slate-500">
              Lectura frontoffice mock
            </p>
            <h2 className="mt-1 text-3xl font-black">Reservas de hoy</h2>
            <p className="mt-2 text-sm font-bold text-blue-800">
              {cashSession.businessDate} - {reservations.length} reservas - sin
              conexion externa
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
        <div className="max-h-[60dvh] overflow-y-auto p-5">
          <div className="grid gap-3">
            {reservations.map((reservation) => (
              <article
                key={reservation.id}
                className="grid gap-3 border-b border-slate-200 pb-4 lg:grid-cols-[1fr_auto]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-black">
                      {reservation.time} - {reservation.guest}
                    </h3>
                    <StatusBadge value={reservation.status} />
                  </div>
                  <p className="mt-1 text-sm font-bold text-slate-600">
                    {reservation.partySize} personas -{" "}
                    {reservation.assignedTable ?? "sin mesa asignada"}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {reservation.zone ?? "Zona pendiente"} -{" "}
                    {reservation.notes ?? "Acciones locales de referencia"}
                  </p>
                </div>
                <div className="flex max-w-md flex-wrap justify-end gap-2">
                  {visibleActions(reservation).map((action) => (
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
    "No puedo cobrar",
    "No puedo enviar cocina",
    "Como anulo un plato",
    "Como divido una cuenta",
    "No sale la impresora",
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/78 p-4">
      <section className="w-full max-w-3xl overflow-hidden rounded-md bg-slate-50 text-slate-950 shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-slate-500">
              Soporte operativo mock
            </p>
            <h2 className="mt-1 text-3xl font-black">Ayuda SIKIM</h2>
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
        <div className="grid min-h-64 gap-3 bg-slate-100 p-5">
          <div className="w-fit rounded-md bg-white px-4 py-3 text-sm font-black text-slate-800">
            Hola, explica que pasa con el TPV.
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {[
              "Caja abierta: comprueba /turno antes de entrar a sala.",
              "Enviar cocina: las lineas enviadas quedan bloqueadas visualmente.",
              "Cobro: los modos completo, separado y dividido son locales.",
              "Incidencias: marca la mesa y deja nota para auditoria futura.",
            ].map((item) => (
              <p
                key={item}
                className="rounded-md border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
        <footer className="grid gap-3 border-t border-slate-200 p-4">
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
              placeholder="Escribe una consulta mock..."
            />
            <button
              type="button"
              className="min-h-12 rounded-md border border-slate-300 bg-white px-5 text-sm font-black"
            >
              Enviar mock
            </button>
            <Link
              href="/ayuda"
              className="min-h-12 rounded-md bg-blue-600 px-5 py-3 text-center text-sm font-black text-white"
            >
              Abrir /ayuda
            </Link>
          </div>
        </footer>
      </section>
    </div>
  );
}

export function PosFloorShell() {
  const [selectedZoneId, setSelectedZoneId] = useState(tableZones[0].id);
  const [selectedTableId, setSelectedTableId] = useState("restaurant-1");
  const [reservationsOpen, setReservationsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [terminalLocked, setTerminalLocked] = useState(false);
  const [mapMode, setMapMode] = useState<"normal" | "grouping" | "edit">(
    "normal",
  );

  const selectedZone = tableZones.find((zone) => zone.id === selectedZoneId) ??
    tableZones[0];
  const visibleTables = useMemo(
    () => tables.filter((table) => table.zoneId === selectedZoneId),
    [selectedZoneId],
  );
  const selectedTable =
    tables.find((table) => table.id === selectedTableId) ?? visibleTables[0];
  const activeTotal = orderTotal(orderLines);

  function selectZone(zoneId: string) {
    setSelectedZoneId(zoneId);
    setSelectedTableId(
      tables.find((table) => table.zoneId === zoneId)?.id ?? selectedTableId,
    );
  }

  return (
    <div className="relative -mt-2 grid min-w-0 gap-4">
      {reservationsOpen ? (
        <ReservationPanel onClose={() => setReservationsOpen(false)} />
      ) : null}
      {helpOpen ? <HelpPanel onClose={() => setHelpOpen(false)} /> : null}
      {terminalLocked ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4">
          <section className="w-full max-w-xl rounded-md border border-slate-700 bg-slate-900 p-8 text-center shadow-2xl">
            <p className="text-xs font-black uppercase text-blue-300">
              Bloqueo mock/local
            </p>
            <h2 className="mt-3 text-5xl font-black text-white">SIKIM</h2>
            <p className="mt-4 text-lg font-bold text-slate-300">
              Terminal bloqueado. No hay auth real ni cierre de sesion.
            </p>
            <button
              type="button"
              onClick={() => setTerminalLocked(false)}
              className="mt-6 min-h-14 w-full rounded-md bg-blue-500 px-5 py-4 text-lg font-black text-white"
            >
              Desbloquear mock
            </button>
          </section>
        </div>
      ) : null}

      <section className="min-w-0 rounded-md border border-slate-800 bg-[#101728] text-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
          <div className="flex items-center gap-4">
            <p className="text-3xl font-black text-white">SIKIM</p>
            <p className="text-3xl font-black text-white">{cashSession.openedAt}</p>
            <p className="hidden text-sm font-black text-slate-400 md:block">
              {staffContext.device} - {staffContext.user} - modo operativo final
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <label className="flex items-center gap-2 text-xs font-black text-slate-300">
              Usuario
              <select className="min-h-10 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-white">
                <option>Manager turno</option>
                <option>Camarero sala</option>
                <option>Cocina solo lectura</option>
              </select>
            </label>
            <span className="rounded-md border border-emerald-300/40 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-100">
              Caja {cashSession.status}
            </span>
            <button type="button" className={actionButton}>
              Actualizar <span className="text-blue-300">mock</span>
            </button>
            <button
              type="button"
              onClick={() => setReservationsOpen(true)}
              className={actionButton}
            >
              Reservas
            </button>
            <Link href="/turno" className={actionButton}>
              Abrir caja
            </Link>
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className={actionButton}
            >
              Ayuda
            </button>
            <Link href="/admin" className={actionButton}>
              Backoffice
            </Link>
            <button
              type="button"
              onClick={() => setTerminalLocked(true)}
              className={actionButton}
            >
              Bloquear
            </button>
          </div>
        </div>

        <div className="flex min-w-0 gap-4 overflow-x-auto border-b border-slate-800 px-4 py-3">
          <button
            type="button"
            className="min-h-12 shrink-0 rounded-md px-5 py-3 text-sm font-black text-slate-400"
          >
            Pedidos <span className="text-blue-300">pendiente</span>
          </button>
          {tableZones.map((zone) => (
            <button
              key={zone.id}
              type="button"
              onClick={() => selectZone(zone.id)}
              className={`min-h-12 shrink-0 rounded-md px-5 py-3 text-sm font-black transition ${
                selectedZoneId === zone.id
                  ? "bg-slate-800 text-white shadow-[inset_0_-3px_0_#3b82f6]"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              {zone.name}
              <span className="ml-2 text-xs text-slate-500">
                {tables.filter((table) => table.zoneId === zone.id).length}
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[1fr_390px]">
        <section className="grid min-w-0 gap-4">
          <div className="flex min-w-0 flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-slate-500">
                Mapa de mesas - {tableZones.length} zonas - {tableCount} mesas
              </p>
              <h2 className="text-4xl font-black text-white">{selectedZone.name}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-400">
                {selectedZone.description}. Datos locales sin persistencia.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMapMode(mapMode === "grouping" ? "normal" : "grouping")}
                className={`min-h-14 rounded-md border px-5 py-3 text-sm font-black ${
                  mapMode === "grouping"
                    ? "border-blue-300 bg-blue-500 text-white"
                    : "border-slate-700 bg-slate-900 text-slate-100"
                }`}
              >
                Agrupar / Dissociar
              </button>
              <button
                type="button"
                onClick={() => setMapMode(mapMode === "edit" ? "normal" : "edit")}
                className={`min-h-14 rounded-md border px-5 py-3 text-sm font-black ${
                  mapMode === "edit"
                    ? "border-blue-300 bg-blue-500 text-white"
                    : "border-slate-700 bg-slate-900 text-slate-100"
                }`}
              >
                Modificar mapa
              </button>
            </div>
          </div>

          {mapMode === "grouping" ? (
            <div className="rounded-md border border-yellow-400/50 bg-yellow-300/10 p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-black text-yellow-100">
                  Selecciona mesas para crear grupo o dissociar un grupo existente.
                  Estado mock, sin guardar layout.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Crear grupo mock", "Dissociar mock", "Cancelar"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => label === "Cancelar" && setMapMode("normal")}
                      className="min-h-10 rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-xs font-black text-slate-100"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {mapMode === "edit" ? (
            <div className="rounded-md border border-blue-400/50 bg-blue-300/10 p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-black text-blue-100">
                  Modo modificar mapa. Arrastre visual pendiente, sin almacenamiento
                  local ni persistencia.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Guardar layout mock", "Restaurar layout mock", "Cancelar"].map(
                    (label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => label === "Cancelar" && setMapMode("normal")}
                        className="min-h-10 rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-xs font-black text-slate-100"
                      >
                        {label}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          ) : null}

          <div
            className={`min-w-0 rounded-md border border-slate-800 p-3 ${
              mapMode === "edit"
                ? "bg-[linear-gradient(rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.14)_1px,transparent_1px)] bg-[length:34px_34px]"
                : "bg-[#101728]"
            }`}
          >
            <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(112px,1fr))] gap-3">
              {visibleTables.map((table) => (
                <TableTile
                  key={table.id}
                  table={table}
                  selected={selectedTable.id === table.id}
                  mode={mapMode}
                  onSelect={() => setSelectedTableId(table.id)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-md border border-slate-800 bg-slate-900/80 p-3">
            {tableStatusLegend.map((item) => (
              <span
                key={item.status}
                className="flex items-center gap-2 text-xs font-black text-slate-300"
              >
                <span
                  className={`h-3 w-3 rounded-full border-2 ${
                    item.status === "libre"
                      ? "border-white bg-white"
                      : item.status === "pendiente cocina"
                        ? "border-yellow-300 bg-yellow-300"
                        : item.status === "ocupada"
                          ? "border-rose-300 bg-rose-300"
                          : item.status === "cuenta emitida"
                            ? "border-blue-300 bg-blue-300"
                            : item.status === "reservada"
                              ? "border-violet-300 bg-violet-300"
                              : "border-red-400 bg-red-400"
                  }`}
                />
                {item.label}
              </span>
            ))}
          </div>
        </section>

        <aside className="grid gap-4 self-start">
          <section className="overflow-hidden rounded-md bg-slate-50 text-slate-950">
            <header className="border-b border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase text-slate-500">
                    Mesa seleccionada
                  </p>
                  <h2 className="text-2xl font-black">{selectedTable.name}</h2>
                  <p className="text-sm font-bold text-slate-500">
                    {selectedTable.zone} - {selectedTable.covers || selectedTable.seats} pax
                  </p>
                </div>
                <StatusBadge value={selectedTable.status} />
              </div>
              {selectedTable.note ? (
                <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900">
                  {selectedTable.note}
                </p>
              ) : null}
            </header>

            <div className="min-h-80 p-4">
              <p className="mb-3 text-xs font-black uppercase text-slate-500">
                Ticket / comanda preview
              </p>
              <div className="grid gap-3">
                {orderLines.slice(0, 4).map((line) => (
                  <div
                    key={line.id}
                    className="rounded-md border border-slate-200 bg-white p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black">
                          {line.qty} x {line.name}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {line.station} - {statusLabel(line.status)}
                        </p>
                      </div>
                      <p className="font-black">
                        {formatCurrency(line.qty * line.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <footer className="border-t border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-black">Total</span>
                <span className="text-3xl font-black">
                  {formatCurrency(activeTotal)}
                </span>
              </div>
              <div className="mt-4 grid gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" className="min-h-12 rounded-md bg-slate-950 px-3 py-3 text-sm font-black text-white">
                    Abrir mesa <span className="text-blue-300">mock</span>
                  </button>
                  <Link
                    href="/pos/comanda"
                    className="min-h-12 rounded-md bg-blue-500 px-3 py-3 text-center text-sm font-black text-white"
                  >
                    Ver comanda
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/pos/cobro"
                    className="min-h-12 rounded-md bg-blue-500 px-3 py-3 text-center text-sm font-black text-white"
                  >
                    Cobrar
                  </Link>
                  <button type="button" className="min-h-12 rounded-md border border-yellow-400 bg-yellow-100 px-3 py-3 text-sm font-black text-yellow-950">
                    Enviar cocina mock
                  </button>
                </div>
              </div>
            </footer>
          </section>

          <section className="rounded-md border border-slate-800 bg-slate-900 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-white">Acciones visibles</h2>
              <MockBadge>mock/local</MockBadge>
            </div>
            <div className="grid gap-2">
              {[
                "Buscar reserva",
                "Mover mesa",
                "Marcar incidencia",
                "Agrupar / Dissociar",
                "Modificar mapa",
                "Crear comanda directa",
              ].map((action) =>
                action === "Crear comanda directa" ? (
                  <Link
                    key={action}
                    href="/pos/comanda"
                    className="min-h-11 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-black text-slate-100"
                  >
                    {action} <span className="text-blue-300">pendiente</span>
                  </Link>
                ) : (
                  <button
                    key={action}
                    type="button"
                    onClick={() => {
                      if (action === "Buscar reserva") setReservationsOpen(true);
                      if (action === "Agrupar / Dissociar") setMapMode("grouping");
                      if (action === "Modificar mapa") setMapMode("edit");
                    }}
                    className="min-h-11 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-left text-sm font-black text-slate-100"
                  >
                    {action} <span className="text-blue-300">mock</span>
                  </button>
                ),
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
