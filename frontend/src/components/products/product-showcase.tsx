"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Plus, ShoppingBag } from "lucide-react";
import { formatCop } from "@/services/catalog";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/types/catalog";

export function ProductShowcase({ products }: { products: Product[] }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <section id="productos" className="bg-ink px-5 py-16 text-center text-ivory sm:py-20 md:text-left">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-salmon">
              Productos destacados
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-semibold text-ivory sm:text-5xl md:mx-0 md:text-6xl">
              Seleccion curada para rituales reales.
            </h2>
          </div>
          <p className="mx-auto max-w-md text-base leading-7 text-ivory/65 md:mx-0">
            Datos de muestra conectados al contrato de API. Al aplicar
            migraciones, PostgreSQL sera el origen del catalogo.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.08, duration: 0.55 }}
              className="group overflow-hidden rounded-[1.5rem] border border-salmon/25 bg-salmon text-ink shadow-xl shadow-black/30"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {product.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-ink/88 px-3 py-1 text-xs font-bold text-ivory shadow-sm backdrop-blur"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/62">
                  {product.category}
                </p>
                <h3 className="mt-2 min-h-16 font-display text-3xl font-semibold leading-none text-ink">
                  {product.name}
                </h3>
                <p className="mt-3 min-h-16 text-sm leading-6 text-ink/74">
                  {product.shortDescription}
                </p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-ink/55">
                      {product.brand}
                    </p>
                    <p className="text-lg font-bold text-ink">
                      {formatCop(product.priceCents)}
                    </p>
                  </div>
                  <button
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-4 text-sm font-bold text-ivory transition-transform hover:-translate-y-0.5"
                    onClick={() => addItem(product)}
                  >
                    <Plus size={17} />
                    Agregar
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-dashed border-salmon/40 bg-salmon/10 p-5 text-sm text-ivory/70">
          <ShoppingBag className="shrink-0 text-salmon" size={20} />
          El carrito local valida la experiencia visual inicial. Los importes e
          inventario finales se confirmaran desde el backend antes del checkout.
        </div>
      </div>
    </section>
  );
}
