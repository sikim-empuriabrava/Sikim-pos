import { PosFloorShell } from "@/components/pos-floor-shell";

export default function PosPage() {
  return (
    <main className="min-h-[100dvh] bg-[#111827] text-slate-100">
      <h1 className="sr-only">POS sala</h1>
      <PosFloorShell />
    </main>
  );
}
