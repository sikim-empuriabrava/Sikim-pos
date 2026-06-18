"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  formatCurrency,
  orderLines,
  orderTotal,
  productCategories,
  products,
  type OrderLine,
  type Product,
} from "@/lib/ui-data";
import { StatusBadge } from "@/components/ui";

const productTone: Record<Product["color"], string> = {
  blue: "border-blue-400",
  green: "border-emerald-400",
  amber: "border-amber-400",
  cyan: "border-cyan-400",
  rose: "border-rose-400",
  violet: "border-violet-400",
  slate: "border-slate-400",
};

function lineFromProduct(product: Product): OrderLine {
  return {
    id: `draft-${product.id}`,
    name: product.name,
    qty: 1,
    price: product.price,
    station: product.station,
    status: "draft",
    course: product.category,
  };
}

function TicketLine({ line }: { line: OrderLine }) {
  const locked = line.status !== "draft";

  return (
    <article className="rounded-md border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-black text-slate-950">
            {line.qty} x {line.name}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-500">
            {line.course ?? line.station} - {line.station}
          </p>
        </div>
        <div className="text-right">
          <p className="font-black text-slate-950">
            {formatCurrency(line.qty * line.price)}
          </p>
          <StatusBadge value={line.status} />
        </div>
      </div>

      {line.modifiers?.length ? (
        <ul className="mt-2 grid gap-1 text-xs font-bold text-slate-600">
          {line.modifiers.map((modifier) => (
            <li key={modifier}>Mod: {modifier}</li>
          ))}
        </ul>
      ) : null}

      {line.note ? (
        <p className="mt-2 rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-900">
          Nota: {line.note}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="min-h-9 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-black text-slate-800"
        >
          Mod. <span className="text-blue-700">mock</span>
        </button>
        <button
          type="button"
          className="min-h-9 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-black text-slate-800"
        >
          Nota <span className="text-blue-700">mock</span>
        </button>
        {locked ? (
          <button
            type="button"
            className="min-h-9 rounded-md border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-800"
          >
            Anular pendiente
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function ComandaShell() {
  const [selectedCategory, setSelectedCategory] = useState(productCategories[0]);
  const [lines, setLines] = useState<OrderLine[]>(orderLines);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("Catalogo mock visible para producto final.");

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const categoryMatches =
        selectedCategory === "Cercar" ||
        selectedCategory === "Favoritos" ||
        selectedCategory === "Configurados" ||
        product.category === selectedCategory;
      const searchMatches =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch);

      return product.visible && categoryMatches && searchMatches;
    });
  }, [search, selectedCategory]);

  function addProduct(product: Product) {
    setLines((currentLines) => {
      const existing = currentLines.find((line) => line.id === `draft-${product.id}`);

      if (!existing) {
        return [...currentLines, lineFromProduct(product)];
      }

      return currentLines.map((line) =>
        line.id === existing.id ? { ...line, qty: line.qty + 1 } : line,
      );
    });
    setNotice(`Anadido mock: ${product.name}`);
  }

  function clearDraft() {
    setLines((currentLines) =>
      currentLines.filter((line) => line.status !== "draft"),
    );
    setNotice("Borrador limpiado localmente. Lineas enviadas o pagadas quedan visibles.");
  }

  function sendKitchen() {
    setLines((currentLines) =>
      currentLines.map((line) =>
        line.status === "draft" ? { ...line, status: "sent" } : line,
      ),
    );
    setNotice("Enviar cocina/barra ejecutado como mock local, sin produccion real.");
  }

  const total = orderTotal(lines);
  const draftCount = lines.filter((line) => line.status === "draft").length;

  return (
    <div className="grid gap-3 xl:grid-cols-[132px_1fr_390px]">
      <aside className="rounded-md border border-slate-800 bg-[#101728] p-2">
        <Link
          href="/pos"
          className="mb-3 flex min-h-12 items-center rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-black text-white"
        >
          Volver mapa
        </Link>
        <div className="grid gap-2">
          {productCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`min-h-12 rounded-md px-3 py-2 text-left text-sm font-black transition ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </aside>

      <main className="rounded-md border border-slate-800 bg-[#101728] p-3">
        <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_280px]">
          <div>
            <p className="text-xs font-black uppercase text-slate-500">
              Venta POS - mesa/sesion
            </p>
            <h2 className="text-3xl font-black text-white">
              Restaurant - Mesa 1
              <span className="ml-3 text-base font-black text-slate-400">
                2 clientes
              </span>
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-md border border-yellow-300/50 bg-yellow-300/10 px-2 py-1 text-xs font-black text-yellow-100">
                Catalogo mock - {products.length} productos visibles
              </span>
              <span className="rounded-md border border-blue-300/50 bg-blue-300/10 px-2 py-1 text-xs font-black text-blue-100">
                Sin Cheffing real conectado
              </span>
            </div>
          </div>
          <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
            Buscar
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Producto..."
              className="min-h-12 rounded-md border border-slate-700 bg-slate-800 px-3 text-base font-bold normal-case text-white outline-none focus:border-blue-300"
            />
          </label>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(142px,1fr))] gap-3">
          {visibleProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => addProduct(product)}
              className={`min-h-28 rounded-md border-2 bg-slate-50 p-3 text-left text-slate-950 transition hover:-translate-y-0.5 hover:bg-white ${productTone[product.color]}`}
            >
              <p className="text-[11px] font-black uppercase text-slate-500">
                {product.category}
              </p>
              <h3 className="mt-2 min-h-10 text-base font-black leading-tight">
                {product.name}
              </h3>
              <p className="mt-4 text-xl font-black">
                {formatCurrency(product.price)}
              </p>
            </button>
          ))}
        </div>
      </main>

      <aside className="overflow-hidden rounded-md bg-slate-50 text-slate-950">
        <header className="border-b border-slate-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-slate-500">Ticket</p>
              <h2 className="text-2xl font-black">Restaurant - Mesa 1</h2>
            </div>
            <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-black text-blue-800">
              2 clientes
            </span>
          </div>
          <p className="mt-3 rounded-md bg-slate-950 px-3 py-2 text-xs font-black text-white">
            {notice}
          </p>
        </header>

        <div className="max-h-[58dvh] min-h-80 overflow-y-auto bg-slate-50 p-4">
          <div className="grid gap-3">
            {lines.map((line) => (
              <TicketLine key={line.id} line={line} />
            ))}
          </div>
        </div>

        <section className="border-t border-slate-200 p-4">
          <div className="mb-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900">
            Las lineas enviadas o pagadas estan bloqueadas visualmente. Anular,
            reclamar y seguimiento son mock/pending.
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-black">Total</span>
            <span className="text-3xl font-black">{formatCurrency(total)}</span>
          </div>

          <div className="mt-4 grid gap-2">
            <button
              type="button"
              onClick={sendKitchen}
              className="min-h-12 rounded-md bg-yellow-400 px-3 py-3 text-sm font-black text-slate-950"
            >
              Enviar cocina/barra mock ({draftCount})
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setNotice("Reclamar enviado como aviso mock.")}
                className="min-h-12 rounded-md border border-slate-300 bg-white px-3 py-3 text-sm font-black text-slate-800"
              >
                Reclamar
              </button>
              <button
                type="button"
                onClick={() => setNotice("Afegir seguit / seguimiento queda pendiente.")}
                className="min-h-12 rounded-md border border-slate-300 bg-white px-3 py-3 text-sm font-black text-slate-800"
              >
                Afegir seguit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={clearDraft}
                className="min-h-12 rounded-md border border-slate-300 bg-white px-3 py-3 text-sm font-black text-slate-800"
              >
                Buidar / limpiar
              </button>
              <Link
                href="/pos/cobro"
                className="min-h-12 rounded-md bg-blue-500 px-3 py-3 text-center text-sm font-black text-white"
              >
                Cobrar
              </Link>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
