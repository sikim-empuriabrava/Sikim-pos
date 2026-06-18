import { legacyParityCounts } from "@/lib/ui-data";
import { AdminPageShell, MetricTile, Panel, StatusBadge } from "@/components/ui";

const knowledgeEntries = [
  {
    module: "Caixa",
    title: "Obrir caixa",
    body: "Per obrir caixa, prem Obrir caixa a la barra superior i confirma el fons inicial. En aquesta fase queda com a referencia visual mock.",
    tags: "caixa, torn, obertura, efectiu",
  },
  {
    module: "Reserves",
    title: "Assignar taula",
    body: "Assignar taula vincula una reserva demo amb una sessio operativa sense escriure al motor extern de reserves.",
    tags: "reserves, taules, assignacio",
  },
  {
    module: "Produccio",
    title: "Enviar cuina",
    body: "Enviar cuina bloqueja visualment linies enviades i mostra produccio mock, pero no crea print jobs reals.",
    tags: "comanda, cuina, impressio",
  },
];

const unansweredQuestions = [
  "Com puc recuperar una comanda tancada per error?",
  "Que faig si una reserva no apareix al mapa?",
  "Com reassingo una impressora de cuina?",
];

export default function AdminHelpPage() {
  return (
    <AdminPageShell
      title="Ajuda"
      description="Backoffice de ayuda mock/local para revisar base de conocimiento, preguntas sin respuesta y propuestas sin persistencia."
    >
      <div className="grid gap-2">
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-black text-amber-900">
          Aquesta pantalla no escriu cap fitxer real, no fa servir backend i no
          persisteix dades.
        </div>
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-black text-amber-900">
          Les propostes es guarden nomes com estat visual mentre la pagina esta oberta.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricTile
          tone="light"
          label="Base de coneixement"
          value={`${legacyParityCounts.helpEntries}`}
          detail="entrades representatives"
        />
        <MetricTile tone="light" label="Preguntes sense resposta" value="3" detail="mock" />
        <MetricTile tone="light" label="Propostes pendents" value="0" detail="en memoria" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.9fr_0.9fr]">
        <Panel tone="light" title="Base de coneixement actual">
          <div className="grid gap-3">
            {knowledgeEntries.map((entry) => (
              <article
                key={entry.title}
                className="rounded-md border border-slate-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-black uppercase text-blue-700">
                    {entry.module}
                  </p>
                  <StatusBadge value="mock" />
                </div>
                <h2 className="mt-2 text-lg font-black">{entry.title}</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                  {entry.body}
                </p>
                <p className="mt-2 text-xs font-bold text-slate-500">
                  Tags: {entry.tags}
                </p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel tone="light" title="Preguntes sense resposta">
          <div className="grid gap-3">
            {unansweredQuestions.map((question) => (
              <article
                key={question}
                className="rounded-md border border-slate-200 bg-white p-4"
              >
                <p className="font-black">{question}</p>
                <button
                  type="button"
                  className="mt-3 min-h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-black text-slate-800"
                >
                  Preparar resposta <span className="text-blue-700">mock</span>
                </button>
              </article>
            ))}
          </div>
        </Panel>

        <Panel tone="light" title="Preparar entrada mock">
          <div className="grid gap-3">
            <label className="grid gap-1 text-sm font-black text-slate-700">
              Pregunta original
              <input
                className="min-h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-bold"
                placeholder="Selecciona una pregunta sense resposta"
              />
            </label>
            <label className="grid gap-1 text-sm font-black text-slate-700">
              Resposta mock
              <textarea
                className="min-h-28 rounded-md border border-slate-300 bg-white p-3 text-sm font-bold"
                placeholder="Escriu una resposta operativa curta..."
              />
            </label>
            <button
              type="button"
              className="min-h-12 rounded-md bg-emerald-700 px-3 py-3 text-sm font-black text-white"
            >
              Afegir com a proposta mock
            </button>
          </div>
        </Panel>
      </div>
    </AdminPageShell>
  );
}
