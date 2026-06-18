import { ShiftGateShell } from "@/components/shift-gate-shell";

export default function TurnoPage() {
  return (
    <main className="min-h-[100dvh] bg-[#0b1220] text-slate-100">
      <h1 className="sr-only">Apertura de caja</h1>
      <ShiftGateShell />
    </main>
  );
}
