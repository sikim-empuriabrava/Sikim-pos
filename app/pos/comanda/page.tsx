import { ComandaShell } from "@/components/comanda-shell";

export default function ComandaPage() {
  return (
    <main className="min-h-[100dvh] bg-[#111827] text-slate-100">
      <h1 className="sr-only">Comanda de mesa</h1>
      <ComandaShell />
    </main>
  );
}
