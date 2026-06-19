import { AdminNotice, AdminPageShell, MetricTile, Panel, StatusBadge } from "@/components/ui";
import { getSupabasePublicConfigStatus } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  createServerSupabaseServiceClient,
  getSupabaseServiceConfigStatus,
} from "@/lib/supabase/service";

const nextSteps = [
  "Configurar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en Vercel.",
  "Configurar SUPABASE_SERVICE_ROLE_KEY solo como variable server-side cuando hagan falta lecturas protegidas.",
  "Redeploy tras guardar las variables.",
  "Planificar rutas o acciones server-side protegidas por la puerta de contrasena antes de tocar tablas reales.",
  "Mantener Supabase Auth, reservas, Cheffing, pagos, impresoras y fiscalidad fuera de esta fase.",
];

export default function SupabaseDiagnosticsPage() {
  const status = getSupabasePublicConfigStatus();
  const serverClient = createServerSupabaseClient();
  const serviceStatus = getSupabaseServiceConfigStatus();
  const serviceClient = createServerSupabaseServiceClient();
  const configurationLabel = status.isConfigured ? "Configured" : "Not configured";
  const urlLabel = status.urlHost ?? (status.urlPresent ? "URL no valida" : "No configurada");
  const serviceLabel = serviceStatus.helperEnabled && serviceClient ? "Ready" : "Disabled";
  const serviceDetail = serviceStatus.serviceKeyPresent
    ? "present, value hidden"
    : "server service not configured";

  return (
    <AdminPageShell
      title="Supabase"
      description="Diagnostico protegido de configuracion Supabase para Sikim POS, sin consultas a tablas de negocio ni escrituras."
    >
      <div className="grid gap-2">
        <AdminNotice>Ruta protegida por la puerta de contrasena existente.</AdminNotice>
        <AdminNotice>No se consultan reservas, Cheffing, clientes, comandas ni tablas POS.</AdminNotice>
        <AdminNotice>No se realizan escrituras, no se ejecutan RPCs y Supabase Auth todavia no esta implementado.</AdminNotice>
        <AdminNotice>La service role key es server-only: no se muestra, no se envia al navegador y no debe usar prefijo publico.</AdminNotice>
      </div>

      <div className="grid gap-2 md:grid-cols-5">
        <MetricTile tone="light" label="Supabase" value={configurationLabel} detail="public config" />
        <MetricTile tone="light" label="URL" value={status.urlPresent ? "Present" : "Missing"} detail={urlLabel} />
        <MetricTile tone="light" label="Publishable key" value={status.publishableKeyPresent ? "Present" : "Missing"} detail="value hidden" />
        <MetricTile tone="light" label="Public server helper" value={serverClient ? "Ready" : "Disabled"} detail="publishable key only" />
        <MetricTile tone="light" label="Service foundation" value={serviceLabel} detail={serviceDetail} />
      </div>

      <div className="grid gap-3 xl:grid-cols-[360px_1fr]">
        <Panel tone="light" title="Estado de configuracion" description="Valores visibles sin exponer secretos ni claves.">
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3 rounded-md border border-[#d7dde3] bg-[#f9fafb] p-3">
              <span className="font-black">Estado general</span>
              <StatusBadge value={status.isConfigured ? "enabled" : "pending config"} />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md border border-[#d7dde3] bg-[#f9fafb] p-3">
              <span className="font-black">NEXT_PUBLIC_SUPABASE_URL</span>
              <StatusBadge value={status.urlPresent && status.urlValid ? "visible" : "hidden"} />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md border border-[#d7dde3] bg-[#f9fafb] p-3">
              <span className="font-black">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</span>
              <StatusBadge value={status.publishableKeyPresent ? "visible" : "hidden"} />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md border border-[#d7dde3] bg-[#f9fafb] p-3">
              <span className="font-black">SUPABASE_SERVICE_ROLE_KEY</span>
              <StatusBadge value={serviceStatus.serviceKeyPresent ? "present" : "missing"} />
            </div>
          </div>
        </Panel>

        <Panel tone="light" title="Alcance de esta base" description="Cliente minimo para futuras lecturas seguras.">
          <div className="grid gap-2 md:grid-cols-2">
            {[
              "Cliente publico: URL publica y publishable key.",
              "Helper service-role: solo server-side y desactivado si faltan variables.",
              "Sin integracion de cookies o sesiones Supabase Auth.",
              "Sin consultas a tablas de negocio.",
              "Sin escrituras, RPCs, migraciones ni politicas RLS.",
              "Sin reservas, Cheffing, clientes, pagos, impresoras ni fiscalidad real.",
            ].map((item) => (
              <div key={item} className="rounded-md border border-[#d7dde3] bg-[#f9fafb] p-3">
                <p className="font-black">{item}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel tone="light" title="Siguientes pasos" description="Trabajo futuro despues de configurar variables y redeploy.">
        <ol className="grid gap-2 md:grid-cols-2">
          {nextSteps.map((step) => (
            <li key={step} className="rounded-md border border-[#d7dde3] bg-white p-3 font-black">
              {step}
            </li>
          ))}
        </ol>
      </Panel>
    </AdminPageShell>
  );
}
