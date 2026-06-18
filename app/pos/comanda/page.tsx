import { ComandaShell } from "@/components/comanda-shell";

export default function ComandaPage() {
  return (
    <main className="min-h-[100dvh] bg-slate-950 text-slate-100">
      <div className="mx-auto grid w-full max-w-[1500px] gap-4 px-4 py-4 lg:px-6">
        <h1 className="sr-only">Comanda de mesa</h1>
        <ComandaShell />
      </div>
    </main>
  );
}
