import { legacyParityCounts, permissions } from "@/lib/ui-data";
import { AdminPageShell, MetricTile, Panel, StatusBadge } from "@/components/ui";

const roles = ["Responsable", "Sala", "Cocina/barra", "Admin POS", "Auditor"];

export default function UsuariosPage() {
  return (
    <AdminPageShell
      title="Usuarios y permisos"
      description="Capacidades POS propuestas para una futura capa de auth y permisos."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricTile tone="light" label="Roles" value={`${roles.length}`} detail="mock/local" />
        <MetricTile
          tone="light"
          label="Permisos"
          value={`${legacyParityCounts.permissionCells}`}
          detail="matriz conceptual"
        />
        <MetricTile tone="light" label="Auth" value="Pendiente" detail="sin enforcement" />
      </div>

      <Panel
        tone="light"
        title="Capacidades"
        description="No hay autenticacion real ni enforcement de permisos en esta fase."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {permissions.map((permission) => (
            <div
              key={permission}
              className="rounded-md border border-slate-200 bg-white p-4"
            >
              <p className="font-black">{permission}</p>
              <div className="mt-4">
                <StatusBadge value="plan" />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel tone="light" title="Roles previstos">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {roles.map((role) => (
            <div key={role} className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <p className="text-lg font-black">{role}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Perfil operativo previsto para definir permisos granulares en
                backend.
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </AdminPageShell>
  );
}
