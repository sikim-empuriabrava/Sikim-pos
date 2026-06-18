import { ShiftGateShell } from "@/components/shift-gate-shell";
import { ActionLink, DarkPageShell } from "@/components/ui";

export default function TurnoPage() {
  return (
    <DarkPageShell
      eyebrow="Turno y caja"
      title="Apertura de caja"
      description="Gate visual para abrir o cerrar sesion de caja antes de entrar al mapa de sala. Todo es mock/local, sin contabilidad ni persistencia."
      actions={
        <>
          <ActionLink href="/pos" variant="primary">
            Entrar POS sala
          </ActionLink>
          <ActionLink href="/admin/caja">Caja admin</ActionLink>
        </>
      }
    >
      <ShiftGateShell />
    </DarkPageShell>
  );
}
