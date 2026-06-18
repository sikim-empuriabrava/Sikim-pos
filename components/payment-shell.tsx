"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  formatCurrency,
  orderLines,
  orderTotal,
  paymentSummary,
  statusLabel,
} from "@/lib/ui-data";
import { StatusBadge } from "@/components/ui";

const paymentModes = [
  { id: "full", label: "Compte complet / cuenta completa" },
  { id: "separate", label: "Pagar per separat" },
  { id: "split", label: "Dividir compte" },
] as const;

const methods = [
  { id: "efectivo", label: "Efectivo" },
  { id: "tarjeta", label: "Tarjeta" },
  { id: "sumup", label: "SumUp mock" },
  { id: "manual", label: "Otro/manual" },
] as const;

const keypad = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ",", "borrar"];

function parseAmount(value: string) {
  return Number(value.replace(",", ".")) || 0;
}

function amountLabel(value: number) {
  return formatCurrency(value).replace("EUR", "EUR");
}

export function PaymentShell() {
  const [mode, setMode] = useState<(typeof paymentModes)[number]["id"]>("full");
  const [method, setMethod] = useState<(typeof methods)[number]["id"]>("efectivo");
  const [amountInput, setAmountInput] = useState("");
  const [splitParts, setSplitParts] = useState(2);
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [notice, setNotice] = useState("Pago mock/local. No registra caja real.");

  const total = orderTotal(orderLines);
  const selectedTotal = useMemo(
    () =>
      orderLines
        .filter((line) => selectedLines.includes(line.id))
        .reduce((sum, line) => sum + line.qty * line.price, 0),
    [selectedLines],
  );
  const amountDue =
    mode === "split"
      ? total / splitParts
      : mode === "separate"
        ? selectedTotal
        : total;
  const entered = parseAmount(amountInput);
  const cashReceived = method === "efectivo" ? entered : amountDue;
  const change = method === "efectivo" ? Math.max(cashReceived - amountDue, 0) : 0;

  function appendKey(key: string) {
    if (key === "borrar") {
      setAmountInput((current) => current.slice(0, -1));
      return;
    }

    if (key === "," && amountInput.includes(",")) {
      return;
    }

    setAmountInput((current) => `${current}${key}`);
  }

  function setExact() {
    setAmountInput(amountDue.toFixed(2).replace(".", ","));
    setNotice("Importe exacto rellenado en estado local.");
  }

  function toggleLine(lineId: string) {
    setSelectedLines((current) =>
      current.includes(lineId)
        ? current.filter((id) => id !== lineId)
        : [...current, lineId],
    );
  }

  return (
    <div className="grid gap-3 xl:grid-cols-[320px_1fr_300px]">
      <aside className="overflow-hidden rounded-md bg-slate-50 text-slate-950">
        <header className="border-b border-slate-200 p-4">
          <p className="text-xs font-black uppercase text-slate-500">Ticket</p>
          <h2 className="text-2xl font-black">{paymentSummary.table}</h2>
          <p className="mt-1 text-sm font-black text-slate-500">
            {paymentSummary.covers} clientes - pago pendiente
          </p>
        </header>

        <div className="max-h-[62dvh] overflow-y-auto p-4">
          <div className="grid gap-4">
            {orderLines.slice(0, 4).map((line) => {
              const selected = selectedLines.includes(line.id);

              return (
                <article
                  key={line.id}
                  className={`rounded-md border p-3 ${
                    selected
                      ? "border-blue-400 bg-blue-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black">
                        {line.qty} x {line.name}
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-500">
                        {statusLabel(line.status)}
                      </p>
                    </div>
                    <p className="font-black">
                      {formatCurrency(line.qty * line.price)}
                    </p>
                  </div>

                  {mode === "separate" ? (
                    <button
                      type="button"
                      onClick={() => toggleLine(line.id)}
                      className="mt-3 min-h-9 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-black text-slate-800"
                    >
                      {selected ? "Quitar seleccion" : "Seleccionar linea"} mock
                    </button>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>

        <footer className="border-t border-slate-200 p-4">
          {mode === "separate" ? (
            <div className="mb-3 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm font-bold text-blue-900">
              Subtotal seleccionado: {formatCurrency(selectedTotal)}
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <span className="text-lg font-black">Pendiente</span>
            <span className="text-3xl font-black">{formatCurrency(total)}</span>
          </div>
        </footer>
      </aside>

      <main className="rounded-md border border-slate-800 bg-[#101728] p-4">
        <div className="grid gap-2 md:grid-cols-3">
          {paymentModes.map((paymentMode) => (
            <button
              key={paymentMode.id}
              type="button"
              onClick={() => {
                setMode(paymentMode.id);
                setNotice(`${paymentMode.label} seleccionado localmente.`);
              }}
              className={`min-h-14 rounded-md border px-3 py-3 text-sm font-black ${
                mode === paymentMode.id
                  ? "border-blue-300 bg-blue-500 text-white shadow-[0_0_0_3px_rgba(96,165,250,0.25)]"
                  : "border-slate-700 bg-slate-800 text-slate-300"
              }`}
            >
              {paymentMode.label}
            </button>
          ))}
        </div>

        {mode === "split" ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-700 bg-slate-800 p-3">
            <div>
              <p className="text-xs font-black uppercase text-slate-500">
                Dividir entre
              </p>
              <p className="text-lg font-black text-white">
                {splitParts} partes - {formatCurrency(total / splitParts)} por parte
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSplitParts((current) => Math.max(2, current - 1))}
                className="min-h-12 min-w-12 rounded-md bg-slate-200 text-2xl font-black text-slate-950"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setSplitParts((current) => Math.min(12, current + 1))}
                className="min-h-12 min-w-12 rounded-md bg-slate-200 text-2xl font-black text-slate-950"
              >
                +
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <p className="text-xs font-black uppercase text-slate-500">
            {mode === "full"
              ? "Pendiente"
              : mode === "separate"
                ? "Seleccion"
                : "Importe por parte"}
          </p>
          <p className="mt-1 text-7xl font-black leading-none text-white">
            {formatCurrency(amountDue)}
          </p>
        </div>

        <div className="mt-4 flex min-h-14 items-center justify-between rounded-md border border-slate-700 bg-slate-800 px-4 py-3">
          <span className="text-lg font-black text-slate-400">Importe introducido</span>
          <span className="text-xl font-black text-white">
            {amountInput ? amountLabel(parseAmount(amountInput)) : formatCurrency(0)}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {keypad.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => appendKey(key)}
              className="min-h-14 rounded-md border border-slate-700 bg-slate-800 px-3 py-3 text-2xl font-black text-white transition hover:bg-slate-700"
            >
              {key === "borrar" ? "del" : key}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={setExact}
          className="mt-3 min-h-14 w-full rounded-md bg-slate-50 px-4 py-3 text-lg font-black text-slate-950"
        >
          Exacte / exacto
        </button>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-slate-700 bg-slate-900 p-3">
            <p className="text-xs font-black uppercase text-slate-500">
              Recibido efectivo
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {formatCurrency(cashReceived)}
            </p>
          </div>
          <div className="rounded-md border border-slate-700 bg-slate-900 p-3">
            <p className="text-xs font-black uppercase text-slate-500">Cambio</p>
            <p className="mt-1 text-2xl font-black text-emerald-300">
              {formatCurrency(change)}
            </p>
          </div>
          <div className="rounded-md border border-blue-400/40 bg-blue-400/10 p-3">
            <p className="text-xs font-black uppercase text-blue-200">Aviso</p>
            <p className="mt-1 text-sm font-bold text-blue-100">{notice}</p>
          </div>
        </div>
      </main>

      <aside className="overflow-hidden rounded-md bg-slate-50 text-slate-950">
        <header className="border-b border-slate-200 p-4">
          <p className="text-xs font-black uppercase text-slate-500">Metodo</p>
          <h2 className="text-2xl font-black">Pago mock</h2>
        </header>

        <div className="grid gap-3 p-4">
          {methods.map((paymentMethod) => (
            <button
              key={paymentMethod.id}
              type="button"
              onClick={() => {
                setMethod(paymentMethod.id);
                setNotice(
                  paymentMethod.id === "sumup"
                    ? "SumUp mock seleccionado. No hay terminal ni API."
                    : `${paymentMethod.label} seleccionado como mock.`,
                );
              }}
              className={`min-h-14 rounded-md border px-3 py-3 text-left text-base font-black ${
                method === paymentMethod.id
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-slate-300 bg-white text-slate-800"
              }`}
            >
              {paymentMethod.label}
            </button>
          ))}

          <div className="rounded-md bg-slate-100 p-3 text-sm font-black text-slate-600">
            {method === "sumup"
              ? "Placeholder SumUp: pendiente de arquitectura y aprobacion."
              : method === "tarjeta"
                ? "Terminal no conectado."
                : method === "manual"
                  ? "Metodo manual pendiente."
                  : "Pago en efectivo mock."}
          </div>

          <button
            type="button"
            disabled
            className="min-h-16 cursor-not-allowed rounded-md border border-slate-300 bg-slate-200 px-3 py-3 text-lg font-black text-slate-500"
          >
            Cobrar {formatCurrency(amountDue)} pendiente
          </button>

          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => setNotice("Abrir cajon registrado solo como aviso visual.")}
              className="min-h-12 rounded-md border border-slate-300 bg-white px-3 py-3 text-sm font-black text-slate-800"
            >
              Abrir cajon mock
            </button>
            <Link
              href="/ticket"
              className="min-h-12 rounded-md border border-slate-300 bg-white px-3 py-3 text-center text-sm font-black text-slate-800"
            >
              Imprimir ticket mock
            </Link>
            <button
              type="button"
              onClick={() => setNotice("Envio de email queda pendiente, sin destinatario real.")}
              className="min-h-12 rounded-md border border-slate-300 bg-white px-3 py-3 text-sm font-black text-slate-800"
            >
              Enviar email mock
            </button>
            <Link
              href="/pos/comanda"
              className="min-h-12 rounded-md border border-slate-300 bg-white px-3 py-3 text-center text-sm font-black text-slate-800"
            >
              Tornar / volver
            </Link>
          </div>

          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900">
            No hay cobro real, terminal, factura fiscal, impresora ni email
            enviado desde esta pantalla.
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusBadge value={mode} />
            <StatusBadge value="pendiente" />
          </div>
        </div>
      </aside>
    </div>
  );
}
