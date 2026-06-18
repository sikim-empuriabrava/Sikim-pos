import { ActionLink, DarkPageShell, Panel, StatusBadge } from "@/components/ui";

const helpSections = [
  {
    title: "Abrir caja",
    body: "Ve a /turno, selecciona usuario, fecha negocio, fondo de apertura y contado. Abrir o cerrar sesion solo cambia la UI local.",
    status: "mock",
  },
  {
    title: "Seleccionar mesas",
    body: "En /pos usa las seis zonas y el mapa denso. Una mesa fisica no es una reserva; una sesion de mesa puede venir de reserva o walk-in.",
    status: "shell",
  },
  {
    title: "Reservas",
    body: "El panel Reservas muestra estados requested, confirmed, assigned, seated, completed, cancelled y no-show con acciones mock.",
    status: "mock",
  },
  {
    title: "Enviar cocina",
    body: "En /pos/comanda las lineas draft pueden enviarse visualmente. Las lineas enviadas quedan bloqueadas para evitar duplicados futuros.",
    status: "pendiente",
  },
  {
    title: "Cobros",
    body: "En /pos/cobro puedes ver cuenta completa, pago separado, cuenta dividida, teclado, exacto, efectivo, tarjeta, SumUp mock y cambio visual.",
    status: "mock",
  },
  {
    title: "Incidencias",
    body: "Marcar incidencia es una accion visible mock. En producto final debera auditar usuario, motivo, mesa y hora.",
    status: "pendiente",
  },
];

const faqs = [
  [
    "Por que no puedo cobrar de verdad",
    "Porque este PR solo restaura el shell visual. No hay terminal, SumUp real, backend, caja contable ni pago persistido.",
  ],
  [
    "Que pasa al enviar cocina",
    "La UI muestra el bloqueo de lineas enviadas y el tablero /cocina contiene tickets mock. No se genera produccion real.",
  ],
  [
    "Como asigno una reserva",
    "Desde /pos abre Reservas, usa Assignar taula / Asseure client como acciones visibles. No toca la app externa de reservas.",
  ],
  [
    "Que es el modo agrupar",
    "Es un estado visual para seleccionar mesas y ensenar Crear grupo / Dissociar. No guarda layout ni almacenamiento local.",
  ],
  [
    "El ticket es factura",
    "No. /ticket muestra una previsualizacion no fiscal. Facturacion legal, AEAT, VeriFactu, Odoo y contabilidad quedan fuera.",
  ],
];

export default function AyudaPage() {
  return (
    <DarkPageShell
      eyebrow="Ayuda operador"
      title="Guia frontoffice"
      description="Ayuda contextual para sala, caja, reservas, cocina, cobros e incidencias. Separada de la ayuda/admin backoffice."
      actions={
        <>
          <ActionLink href="/pos" variant="primary">
            Volver a POS
          </ActionLink>
          <ActionLink href="/turno">Abrir caja</ActionLink>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {helpSections.map((section) => (
          <Panel key={section.title} title={section.title}>
            <div className="mb-3">
              <StatusBadge value={section.status} />
            </div>
            <p className="text-sm font-semibold leading-6 text-slate-400">
              {section.body}
            </p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Panel title="Preguntas comunes de operador">
          <div className="grid gap-3">
            {faqs.map(([question, answer]) => (
              <article
                key={question}
                className="rounded-md border border-slate-800 bg-slate-950 p-4"
              >
                <h2 className="font-black text-white">{question}</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                  {answer}
                </p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Propuesta de ayuda mock">
          <div className="rounded-md border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm font-black text-white">
              Preparar respuesta para base de conocimiento
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
              Accion visible para futuro Help Admin. No crea chatbot, no envia
              datos y no actualiza ningun repositorio externo.
            </p>
          </div>
          <button
            type="button"
            className="mt-3 min-h-12 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm font-black text-slate-100"
          >
            Proponer articulo mock
          </button>
        </Panel>
      </div>
    </DarkPageShell>
  );
}
