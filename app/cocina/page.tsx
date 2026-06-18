import { KitchenBoard } from "@/components/kitchen-board";
import { ActionLink, DarkPageShell } from "@/components/ui";

export default function CocinaPage() {
  return (
    <DarkPageShell
      eyebrow="Produccion"
      title="Cocina y barra"
      description="Tablero mock para lineas enviadas desde POS, filtros por cocina/barra/postres, reclamaciones, reimpresion y estado de print job pendiente."
      actions={
        <>
          <ActionLink href="/pos">POS sala</ActionLink>
          <ActionLink href="/admin/produccion" variant="primary">
            Configuracion
          </ActionLink>
        </>
      }
    >
      <KitchenBoard />
    </DarkPageShell>
  );
}
