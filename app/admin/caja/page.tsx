import { formatCurrency } from "@/lib/ui-data";
import { AdminPageShell, MetricTile, Panel, StatusBadge } from "@/components/ui";

const payments = [
  { method: "Efectivo", amount: 436.2, status: "pendiente backend" },
  { method: "Tarjeta", amount: 318.9, status: "sin terminal" },
  { method: "Otro/manual", amount: 42, status: "por definir" },
];

export default function CajaPage() {
  return (
    <AdminPageShell
      title="Caja y cobros"
      description="Vista administrativa inicial de pagos, movimientos y cierres de turno."
    >
      <div className="grid gap-4 lg:grid-cols-4">
        <MetricTile tone="light" label="Cobros" value={formatCurrency(797.1)} detail="Ejemplo" />
        <MetricTile tone="light" label="Efectivo" value={formatCurrency(436.2)} detail="Esperado" />
        <MetricTile tone="light" label="Diferencia" value={formatCurrency(-6.2)} detail="Por revisar" />
        <MetricTile tone="light" label="Cash/session" value="Mock" detail="Cena abierta local" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Panel tone="light" title="Resumen por metodo">
          <div className="grid gap-3">
            {payments.map((payment) => (
              <div
                key={payment.method}
                className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white p-4"
              >
                <div>
                  <p className="font-black">{payment.method}</p>
                  <p className="mt-1 text-sm text-slate-500">{payment.status}</p>
                </div>
                <p className="text-xl font-black">{formatCurrency(payment.amount)}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel tone="light" title="Cierre de turno">
          <div className="grid gap-3">
            {["Arqueo pendiente", "Notas internas", "Actor responsable"].map((item) => (
              <div key={item} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold">{item}</p>
                  <StatusBadge value="inicial" />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AdminPageShell>
  );
}
