import { adminModules, cashSession, tableCount, tableZones } from "@/lib/ui-data";
import {
  ActionLink,
  DarkPageShell,
  MetricTile,
  Panel,
  StatusBadge,
} from "@/components/ui";

const operatorCards = [
  {
    href: "/turno",
    title: "Abrir turno / caixa",
    body: "Gate de caja, usuario, fecha negocio, fondo inicial y movimientos mock.",
    status: "mock",
  },
  {
    href: "/pos",
    title: "POS sala",
    body: "Mapa de 6 zonas, 61 mesas, reservas, modos de agrupacion y editor visual.",
    status: "mock",
  },
  {
    href: "/cocina",
    title: "Cocina/barra",
    body: "Tablero de produccion alineado con Enviar cocina/barra, sin backend.",
    status: "pendiente",
  },
  {
    href: "/ayuda",
    title: "Ayuda operador",
    body: "Guia contextual para caja, mesas, reservas, cocina, cobros e incidencias.",
    status: "shell",
  },
  {
    href: "/admin",
    title: "Backoffice/admin",
    body: "Acceso interno a configuracion y modulos administrativos separados.",
    status: "shell",
  },
];

export default function Home() {
  return (
    <DarkPageShell
      eyebrow="Sikim POS"
      title="Frontoffice operativo"
      description="Entrada al TPV interno con flujo visible de caja, sala, comanda, cobro, cocina, ticket y ayuda. Los modulos de produccion POS siguen siendo mock/local hasta conectar backend, permisos, pagos e impresion."
      actions={
        <>
          <ActionLink href="/turno" variant="primary">
            Abrir turno
          </ActionLink>
          <ActionLink href="/pos">POS sala</ActionLink>
          <ActionLink href="/admin">Admin</ActionLink>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-4">
        <MetricTile
          label="Caja"
          value={cashSession.status}
          detail={`${cashSession.businessDate} - ${cashSession.user}`}
        />
        <MetricTile
          label="Mapa sala"
          value={`${tableZones.length} zonas`}
          detail={`${tableCount} mesas mock`}
        />
        <MetricTile label="Pagos" value="Mock" detail="Sin terminal ni SumUp real" />
        <MetricTile label="Impresion" value="Pendiente" detail="Sin print jobs reales" />
      </div>

      <Panel
        title="Ruta de servicio"
        description="El operador debe poder ver el camino completo sin adivinar donde empieza el turno."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {operatorCards.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md border border-slate-800 bg-slate-950 p-4 transition hover:border-blue-300/60"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-black text-white">{item.title}</h2>
                <StatusBadge value={item.status} />
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-400">
                {item.body}
              </p>
            </a>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.7fr]">
        <Panel title="Estado de producto final operativo">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              "Sin Supabase en este PR",
              "Sin migraciones POS",
              "Sin auth real",
              "Sin pagos, SumUp o terminal real",
              "Sin impresora real",
              "Sin factura fiscal, AEAT, VeriFactu, Odoo o contabilidad",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between gap-3 rounded-md border border-slate-800 bg-slate-950 p-3"
              >
                <span className="text-sm font-black text-slate-200">{item}</span>
                <StatusBadge value="pendiente" />
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Administracion inicial"
          description="Backoffice se mantiene separado del frontoffice."
        >
          <div className="grid gap-2">
            {adminModules.map((module) => (
              <a
                key={module.href}
                href={module.href}
                className="rounded-md border border-slate-800 bg-slate-950 p-3 transition hover:border-sky-300/60"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-black text-white">
                    {module.title}
                  </span>
                  <StatusBadge value={module.status} />
                </div>
              </a>
            ))}
          </div>
        </Panel>
      </div>
    </DarkPageShell>
  );
}
