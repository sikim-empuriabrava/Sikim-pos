import { formatCurrency, legacyParityCounts, products } from "@/lib/ui-data";
import { AdminPageShell, Panel, StatusBadge } from "@/components/ui";

export default function CatalogoPage() {
  return (
    <AdminPageShell
      title="Catàleg POS"
      description="Overlay previsto para decidir que productos de Cheffing aparecen en el TPV, con estacion y precio de referencia."
    >
      <Panel
        tone="light"
        title="Productos visibles"
        description={`${products.length} productos visibles como subconjunto representativo de ${legacyParityCounts.products} productos TPV/Cheffing. Cheffing sigue siendo la fuente de producto, carta y menu.`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="px-3 py-2">Producto</th>
                <th className="px-3 py-2">Categoria</th>
                <th className="px-3 py-2">Estacion</th>
                <th className="px-3 py-2">Precio</th>
                <th className="px-3 py-2">Visibilidad</th>
                <th className="px-3 py-2">Fuente</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="bg-white">
                  <td className="rounded-l-md border-y border-l border-slate-200 px-3 py-3 font-black">
                    {product.name}
                  </td>
                  <td className="border-y border-slate-200 px-3 py-3">
                    {product.category}
                  </td>
                  <td className="border-y border-slate-200 px-3 py-3">
                    {product.station}
                  </td>
                  <td className="border-y border-slate-200 px-3 py-3 font-bold">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="border-y border-slate-200 px-3 py-3">
                    <StatusBadge value={product.visible ? "visible" : "oculto"} />
                  </td>
                  <td className="rounded-r-md border-y border-r border-slate-200 px-3 py-3">
                    <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-900">
                      {product.source}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-3">
        {["Precio snapshot", "Override POS", "Pendiente de configurar"].map((title) => (
          <Panel key={title} tone="light" title={title}>
            <p className="text-sm leading-6 text-slate-600">
              Placeholder para revisar snapshots historicos y reglas de
              visibilidad sin editar recetas, foodcost ni datos fuente de
              Cheffing.
            </p>
          </Panel>
        ))}
      </div>
    </AdminPageShell>
  );
}
