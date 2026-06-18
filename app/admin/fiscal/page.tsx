import { AdminPageShell, MetricTile, Panel, StatusBadge } from "@/components/ui";

const fiscalWarnings = [
  "El TPV no emite factura fiscal final.",
  "El agente de facturas es un puente futuro/mock.",
  "Odoo / agente fiscal seria responsable futuro de la emision.",
  "VeriFactu es solo estado informativo mock en esta fase.",
  "No hay emision real ni conexion AEAT, Odoo o contabilidad.",
];

const fiscalActions = [
  "Crear invoice request",
  "Marcar requested",
  "Marcar issued",
  "Marcar error",
  "Queue export Odoo",
  "Mark sent Odoo",
  "Queue fiscal_agent",
  "Queue Agent",
  "Mark Agent issued",
];

const invoiceRows = [
  { source: "order-demo-none", status: "none", external: "-" },
  { source: "order-demo-1024", status: "requested", external: "-" },
  { source: "cash-session-previous", status: "issued", external: "ODOO-MOCK-2026-0001" },
  { source: "cash-session-error-demo", status: "error", external: "Error mock connector" },
];

export default function FiscalPage() {
  return (
    <AdminPageShell
      title="Fiscal / Odoo"
      description="Puente fiscal mock/local para que la ruta legacy sea visible sin activar factura real, AEAT, VeriFactu, Odoo ni contabilidad."
    >
      <div className="grid gap-2">
        {fiscalWarnings.map((warning) => (
          <div
            key={warning}
            className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-black text-amber-900"
          >
            {warning}
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricTile tone="light" label="Invoices none" value="1" detail="mock" />
        <MetricTile tone="light" label="Invoices requested" value="2" detail="mock" />
        <MetricTile tone="light" label="Invoices issued" value="2" detail="mock" />
        <MetricTile tone="light" label="Odoo sent" value="2" detail="sin API real" />
        <MetricTile tone="light" label="VeriFactu mock" value="3 pending" detail="informativo" />
      </div>

      <Panel
        tone="light"
        title="Accions Fiscal / Odoo"
        description="Todas las acciones son visibles para paridad legacy y quedan marcadas como mock o pendiente."
      >
        <div className="mb-4 flex flex-wrap gap-2 text-sm font-black text-slate-600">
          {["Veure fiscal", "Sol.licitar factura", "Marcar issued", "Exportar"].map(
            (permission) => (
              <span
                key={permission}
                className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-900"
              >
                {permission} permes
              </span>
            ),
          )}
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {fiscalActions.map((action) => (
            <button
              key={action}
              type="button"
              className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-black text-slate-800"
            >
              {action} <span className="text-blue-700">mock</span>
            </button>
          ))}
        </div>
      </Panel>

      <Panel tone="light" title="Factura mock">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">source_id</th>
                <th className="px-3 py-2">status</th>
                <th className="px-3 py-2">external_reference</th>
                <th className="px-3 py-2">scope</th>
              </tr>
            </thead>
            <tbody>
              {invoiceRows.map((row) => (
                <tr key={row.source} className="border-t border-slate-200">
                  <td className="px-3 py-3 font-bold">{row.source}</td>
                  <td className="px-3 py-3">
                    <StatusBadge value={row.status} />
                  </td>
                  <td className="px-3 py-3">{row.external}</td>
                  <td className="px-3 py-3">mock/local</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AdminPageShell>
  );
}
