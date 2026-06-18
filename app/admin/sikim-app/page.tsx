import { AdminPageShell, MetricTile, Panel, StatusBadge } from "@/components/ui";

const connectorWarnings = [
  "SIKIM_POS no gestiona stock real.",
  "SIKIM APP sera la fuente de stock/inventario cuando se disene el contrato.",
  "Esta fase solo muestra eventos mock/local.",
  "No hay conexion externa, credenciales ni API real.",
];

const connectorActions = [
  "Queue event",
  "Mark event sent",
  "Mark event error",
  "Build batch",
  "Queue batch",
  "Mark batch sent",
  "Mark batch error",
];

const consumptionEvents = [
  {
    event: "production_line_created",
    source: "session",
    status: "pending",
    product: "Bravas Sikim",
    qty: 1,
  },
  {
    event: "production_line_created",
    source: "session",
    status: "pending",
    product: "Menu mediodia",
    qty: 1,
  },
];

export default function SikimAppPage() {
  return (
    <AdminPageShell
      title="SIKIM APP"
      description="Conector mock/local para visualizar futuros eventos POS -> SIKIM APP sin gestionar stock real ni llamar APIs externas."
    >
      <div className="grid gap-2">
        {connectorWarnings.map((warning) => (
          <div
            key={warning}
            className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-black text-amber-900"
          >
            {warning}
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricTile tone="light" label="Events" value="2" detail="generated/session" />
        <MetricTile tone="light" label="Pending" value="2" detail="mock" />
        <MetricTile tone="light" label="Queued" value="0" detail="sin backend" />
        <MetricTile tone="light" label="Batches" value="1" detail="mock/local" />
        <MetricTile tone="light" label="Target" value="sikim_app" detail="futuro" />
      </div>

      <Panel
        tone="light"
        title="Accions connector"
        description="Acciones visibles para paridad legacy; ninguna envia datos fuera del navegador."
      >
        <div className="grid gap-2 md:grid-cols-2">
          {connectorActions.map((action) => (
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

      <Panel tone="light" title="Events POS -> SIKIM APP">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">event</th>
                <th className="px-3 py-2">source</th>
                <th className="px-3 py-2">status</th>
                <th className="px-3 py-2">producte</th>
                <th className="px-3 py-2">qty</th>
              </tr>
            </thead>
            <tbody>
              {consumptionEvents.map((event) => (
                <tr
                  key={`${event.event}-${event.product}`}
                  className="border-t border-slate-200"
                >
                  <td className="px-3 py-3 font-bold">{event.event}</td>
                  <td className="px-3 py-3">{event.source}</td>
                  <td className="px-3 py-3">
                    <StatusBadge value={event.status} />
                  </td>
                  <td className="px-3 py-3">{event.product}</td>
                  <td className="px-3 py-3">{event.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AdminPageShell>
  );
}
