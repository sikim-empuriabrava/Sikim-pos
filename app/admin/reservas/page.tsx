import { reservations, statusLabel } from "@/lib/ui-data";
import { AdminPageShell, Panel, StatusBadge } from "@/components/ui";

const reservationActions = [
  "Acceptar / Aceptar",
  "Rebutjar / Rechazar",
  "Veure reserva / Ver reserva",
  "Assignar taula / Asignar mesa",
  "Cancel·lar assignació / Cancelar asignación",
  "Asseure client / Sentar cliente",
  "Obrir taula / Abrir mesa",
  "Tancar reserva 0,00 € / Cerrar reserva 0,00 €",
];

export default function ReservasPage() {
  return (
    <AdminPageShell
      title="Reservas y sesiones"
      description="Relacion inicial entre reservas, walk-ins y sesiones de mesa del POS."
    >
      <Panel
        tone="light"
        title="Reservas confirmadas"
        description="No modifica ni redisenia el motor externo de reservas."
      >
        <div className="grid gap-3">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 xl:grid-cols-[120px_1fr_150px]"
            >
              <p className="text-xl font-black">{reservation.time}</p>
              <div>
                <p className="font-black">{reservation.guest}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {reservation.partySize} pax -{" "}
                  {reservation.assignedTable ?? "Sin mesa"}
                </p>
                <p className="mt-1 text-xs font-bold text-slate-500">
                  {reservation.zone ?? "Zona pendiente"} - {statusLabel(reservation.status)}
                </p>
              </div>
              <StatusBadge value={reservation.status} />
              <div className="xl:col-span-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                {reservationActions.map((action) => (
                  <button
                    key={`${reservation.id}-${action}`}
                    type="button"
                    className="min-h-10 rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-black text-slate-800"
                  >
                    {action} <span className="text-blue-700">mock</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel tone="light" title="Asignacion de mesa">
          <p className="text-sm leading-6 text-slate-600">
            Placeholder para sentar reservas y crear sesiones de mesa cuando el
            cliente llega al restaurante.
          </p>
        </Panel>
        <Panel tone="light" title="Reservas externas pendientes">
          <p className="text-sm leading-6 text-slate-600">
            Aviso futuro para reservas que aun no esten sincronizadas con la
            operativa de sala.
          </p>
        </Panel>
        <Panel tone="light" title="Walk-in">
          <p className="text-sm leading-6 text-slate-600">
            Una entrada sin reserva podra crear sesion de mesa sin duplicar una
            reserva.
          </p>
        </Panel>
      </div>
    </AdminPageShell>
  );
}
