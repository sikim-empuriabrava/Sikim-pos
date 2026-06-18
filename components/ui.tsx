import Link from "next/link";
import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  tone?: "dark" | "light";
};

type PanelProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
};

type MetricTileProps = {
  label: string;
  value: string;
  detail?: string;
  tone?: "dark" | "light";
};

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
};

const statusClasses: Record<string, string> = {
  libre: "border-emerald-300/40 bg-emerald-300/15 text-emerald-100",
  reservada: "border-sky-300/40 bg-sky-300/15 text-sky-100",
  ocupada: "border-amber-300/40 bg-amber-300/15 text-amber-100",
  "pendiente cocina": "border-yellow-300/50 bg-yellow-300/15 text-yellow-100",
  "cuenta emitida": "border-blue-300/50 bg-blue-300/15 text-blue-100",
  enviada: "border-violet-300/40 bg-violet-300/15 text-violet-100",
  cobro: "border-cyan-300/40 bg-cyan-300/15 text-cyan-100",
  incidencia: "border-rose-300/40 bg-rose-300/15 text-rose-100",
  borrador: "border-slate-400/40 bg-slate-400/15 text-slate-100",
  draft: "border-slate-400/40 bg-slate-400/15 text-slate-100",
  sent: "border-blue-300/40 bg-blue-300/15 text-blue-100",
  preparando: "border-amber-300/40 bg-amber-300/15 text-amber-100",
  preparing: "border-amber-300/40 bg-amber-300/15 text-amber-100",
  lista: "border-emerald-300/40 bg-emerald-300/15 text-emerald-100",
  ready: "border-emerald-300/40 bg-emerald-300/15 text-emerald-100",
  servida: "border-slate-300/40 bg-slate-300/15 text-slate-100",
  served: "border-slate-300/40 bg-slate-300/15 text-slate-100",
  voided: "border-rose-300/40 bg-rose-300/15 text-rose-100",
  requested: "border-amber-300/50 bg-amber-300/15 text-amber-100",
  confirmed: "border-sky-300/50 bg-sky-300/15 text-sky-100",
  assigned: "border-violet-300/50 bg-violet-300/15 text-violet-100",
  seated: "border-emerald-300/50 bg-emerald-300/15 text-emerald-100",
  completed: "border-slate-300/50 bg-slate-300/15 text-slate-100",
  cancelled: "border-rose-300/50 bg-rose-300/15 text-rose-100",
  "no-show": "border-zinc-300/50 bg-zinc-300/15 text-zinc-100",
  pending: "border-yellow-300/50 bg-yellow-300/15 text-yellow-100",
  claimed: "border-blue-300/50 bg-blue-300/15 text-blue-100",
  error: "border-rose-300/50 bg-rose-300/15 text-rose-100",
  inicial: "border-amber-500/40 bg-amber-100 text-amber-900",
  ejemplo: "border-amber-500/40 bg-amber-100 text-amber-900",
  mock: "border-blue-500/40 bg-blue-100 text-blue-900",
  pendiente: "border-amber-500/40 bg-amber-100 text-amber-900",
  shell: "border-sky-500/40 bg-sky-100 text-sky-900",
  plan: "border-slate-400 bg-slate-100 text-slate-700",
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  tone = "dark",
}: PageHeaderProps) {
  const dark = tone === "dark";

  return (
    <section
      className={`mx-auto flex w-full max-w-[1500px] flex-col gap-5 px-4 py-6 lg:flex-row lg:items-end lg:justify-between lg:px-6 ${
        dark ? "text-white" : "text-slate-950"
      }`}
    >
      <div>
        {eyebrow ? (
          <p
            className={`mb-2 text-sm font-semibold ${
              dark ? "text-emerald-300" : "text-emerald-700"
            }`}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-black tracking-normal md:text-5xl">
          {title}
        </h1>
        <p
          className={`mt-3 max-w-3xl text-base leading-7 ${
            dark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </section>
  );
}

export function Panel({
  title,
  description,
  children,
  tone = "dark",
  className = "",
}: PanelProps) {
  const dark = tone === "dark";

  return (
    <section
      className={`rounded-md border p-4 ${
        dark
          ? "border-slate-800 bg-slate-900 text-slate-100"
          : "border-slate-200 bg-white text-slate-950 shadow-sm"
      } ${className}`}
    >
      {title ? (
        <div className="mb-4">
          <h2 className="text-lg font-bold tracking-normal">{title}</h2>
          {description ? (
            <p
              className={`mt-1 text-sm leading-6 ${
                dark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function MetricTile({
  label,
  value,
  detail,
  tone = "dark",
}: MetricTileProps) {
  const dark = tone === "dark";

  return (
    <div
      className={`rounded-md border p-4 ${
        dark
          ? "border-slate-800 bg-slate-900 text-slate-100"
          : "border-slate-200 bg-white text-slate-950"
      }`}
    >
      <p className={dark ? "text-sm text-slate-400" : "text-sm text-slate-500"}>
        {label}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
      {detail ? (
        <p className={dark ? "mt-1 text-xs text-slate-500" : "mt-1 text-xs text-slate-500"}>
          {detail}
        </p>
      ) : null}
    </div>
  );
}

export function ActionLink({
  href,
  children,
  variant = "secondary",
}: ActionLinkProps) {
  const classes = {
    primary:
      "border-emerald-300 bg-emerald-300 text-slate-950 hover:bg-emerald-200",
    secondary:
      "border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500 hover:bg-slate-800",
    danger: "border-rose-400 bg-rose-400 text-slate-950 hover:bg-rose-300",
  };

  return (
    <Link
      href={href}
      className={`min-h-12 rounded-md border px-5 py-3 text-sm font-black transition ${classes[variant]}`}
    >
      {children}
    </Link>
  );
}

export function StatusBadge({ value }: { value: string }) {
  const key = value.toLowerCase();
  const classes = statusClasses[key] ?? statusClasses.shell;

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-bold ${classes}`}
    >
      {value}
    </span>
  );
}

export function MockBadge({ children = "mock" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-blue-400/40 bg-blue-400/10 px-2 py-1 text-[11px] font-black uppercase text-blue-100">
      {children}
    </span>
  );
}

export function ContentGrid({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-[1500px] gap-4 px-4 pb-8 lg:px-6">
      {children}
    </div>
  );
}

export function AdminPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-[100dvh] bg-slate-100 text-slate-950">
      <PageHeader
        tone="light"
        eyebrow="Administracion POS"
        title={title}
        description={description}
      />
      <div className="mx-auto grid w-full max-w-[1500px] gap-4 px-4 pb-8 lg:px-6">
        {children}
      </div>
    </main>
  );
}

export function DarkPageShell({
  title,
  description,
  children,
  actions,
  eyebrow = "Operativa POS",
}: {
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <main className="min-h-[100dvh] bg-slate-950 text-slate-100">
      <PageHeader
        title={title}
        description={description}
        actions={actions}
        eyebrow={eyebrow}
      />
      <ContentGrid>{children}</ContentGrid>
    </main>
  );
}
