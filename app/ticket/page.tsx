import {
  cashSession,
  formatCurrency,
  orderLines,
  orderTotal,
  paymentSummary,
  staffContext,
  statusLabel,
} from "@/lib/ui-data";
import { ActionLink, DarkPageShell, Panel, StatusBadge } from "@/components/ui";

export default function TicketPage() {
  const total = orderTotal(orderLines);
  const subtotal = total / 1.1;
  const tax = total - subtotal;

  return (
    <DarkPageShell
      eyebrow="Ticket cliente"
      title="Vista previa de ticket"
      description="Ticket no fiscal accesible desde cobro. Las acciones de imprimir o enviar email son mock y no salen del navegador."
      actions={
        <>
          <ActionLink href="/pos/cobro" variant="primary">
            Volver a cobro
          </ActionLink>
          <ActionLink href="/pos">POS sala</ActionLink>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="mx-auto w-full max-w-2xl">
          <Panel className="bg-white text-slate-950" tone="light">
            <div className="border-b border-slate-200 pb-5 text-center">
              <p className="text-4xl font-black">SIKIM</p>
              <p className="mt-2 text-sm font-bold text-slate-500">
                Ticket no fiscal - datos fiscales pendientes de arquitectura
              </p>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">Mesa / sesion</dt>
                <dd className="font-black">{paymentSummary.table}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Fecha</dt>
                <dd className="font-black">{staffContext.date}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Turno</dt>
                <dd className="font-black">{cashSession.service}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Pago</dt>
                <dd className="font-black">{paymentSummary.method}</dd>
              </div>
            </dl>

            <div className="mt-6 grid gap-3">
              {orderLines.map((line) => (
                <div
                  key={line.id}
                  className="grid grid-cols-[auto_1fr_auto] gap-3 border-b border-slate-100 pb-3 text-sm"
                >
                  <span className="font-black">{line.qty}</span>
                  <span>
                    <span className="block font-bold">{line.name}</span>
                    <span className="text-xs font-semibold text-slate-500">
                      {statusLabel(line.status)}
                    </span>
                  </span>
                  <span className="font-black">
                    {formatCurrency(line.qty * line.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal visual</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA visual</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-2xl font-black">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-900">
              Documento no fiscal. No emite factura, numeracion fiscal, AEAT,
              VeriFactu, Odoo, contabilidad ni ticket de impresora real.
            </div>
          </Panel>
        </div>

        <aside className="grid gap-4 self-start">
          <Panel title="Acciones ticket">
            <div className="grid gap-2">
              {["Imprimir ticket mock", "Enviar email mock", "Reimprimir pendiente"].map(
                (action) => (
                  <button
                    key={action}
                    type="button"
                    className="min-h-12 rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-left text-sm font-black text-slate-100"
                  >
                    {action}
                  </button>
                ),
              )}
            </div>
          </Panel>

          <Panel title="Resumen de pago">
            <div className="grid gap-3">
              {[
                ["Modo", paymentSummary.mode],
                ["Metodo", paymentSummary.method],
                ["Pagado real", formatCurrency(paymentSummary.paid)],
                ["Pendiente", formatCurrency(total)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-md border border-slate-800 bg-slate-950 p-3"
                >
                  <span className="text-xs font-black uppercase text-slate-500">
                    {label}
                  </span>
                  <span className="text-sm font-black text-slate-100">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <StatusBadge value="mock" />
              <StatusBadge value="pendiente" />
            </div>
          </Panel>
        </aside>
      </div>
    </DarkPageShell>
  );
}
