import { adminModules, legacyParityCounts, tableCount, tableZones } from "@/lib/ui-data";
import { AdminPageShell, MetricTile, Panel, StatusBadge } from "@/components/ui";

export default function AdminPage() {
  return (
    <AdminPageShell
      title="Inici"
      description="Backoffice SIKIM_POS mock/local para revisar configuracion, estado operativo y modulos pendientes de conectar."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricTile
          tone="light"
          label="Catàleg"
          value={`${legacyParityCounts.products}`}
          detail="Total TPV/Cheffing representado"
        />
        <MetricTile
          tone="light"
          label="Zones"
          value={`${tableZones.length}`}
          detail={`${tableCount} taules mock`}
        />
        <MetricTile
          tone="light"
          label="Impressores"
          value={`${legacyParityCounts.printerProfiles}`}
          detail={`${legacyParityCounts.productionRoutes} rutes logiques`}
        />
        <MetricTile tone="light" label="Caixa" value="Mock" detail="cash/session local" />
        <MetricTile
          tone="light"
          label="Ajuda"
          value={`${legacyParityCounts.helpEntries}`}
          detail="Entrades KB representatives"
        />
      </div>

      <Panel tone="light" title="Modulos">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {adminModules.map((module) => (
            <a
              key={module.href}
              href={module.href}
              className="rounded-md border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-400"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-black text-slate-950">{module.title}</h2>
                <StatusBadge value={module.status} />
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {module.description}
              </p>
            </a>
          ))}
        </div>
      </Panel>

      <Panel
        tone="light"
        title="Alcance de esta fase"
        description="La UI prepara la estructura de producto sin activar integraciones sensibles."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Sin Supabase",
            "Sin auth real",
            "Sin pagos reales",
            "Sin impresoras reales",
            "Fiscal / Odoo solo mock",
            "SIKIM APP solo mock",
            `${legacyParityCounts.permissionCells} celdas de permisos como matriz conceptual`,
            "No persiste cambios ni usa datos reales",
          ].map((item) => (
            <div key={item} className="rounded-md border border-slate-200 bg-white p-4">
              <p className="font-black">{item}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Se conectara en una fase posterior con contratos revisados.
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </AdminPageShell>
  );
}
