import { PaymentShell } from "@/components/payment-shell";

export default function CobroPage() {
  return (
    <main className="min-h-[100dvh] bg-[#111827] text-slate-100">
      <h1 className="sr-only">Cobro mock</h1>
      <PaymentShell />
    </main>
  );
}
