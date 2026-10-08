"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { formatCop } from "@/services/catalog";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/types/catalog";

function getProductImage(product: Product) {
  if (product.id.startsWith("catalogo-")) {
    return product.imageUrl;
  }

  if (product.category === "Maquillaje") {
    return "/images/thalu-lipstick.png";
  }

  if (product.category === "Skincare") {
    return "/images/thalu-serum.png";
  }

  if (product.category === "Cuidado capilar") {
    return "/images/thalu-hair-mask.png";
  }

  return product.imageUrl;
}

export function ProductShowcase({
  products,
  selectedCategory = "Todos",
  onCategoryChange,
  showFilters = true,
}: {
  products: Product[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  showFilters?: boolean;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const visibleProducts = selectedCategory === "Todos"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  return (
    <section id="productos" className="bg-salmon px-5 py-16 text-center text-ink sm:py-20 md:text-left">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-rosewood">
              Productos destacados
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-semibold leading-[0.98] text-ink sm:text-5xl md:mx-0 md:text-6xl">
              Seleccion curada para rituales reales.
            </h2>
          </div>
          <p className="mx-auto max-w-md text-base font-medium leading-7 text-ink/82 md:mx-0">
            Datos de muestra conectados al contrato de API. Al aplicar
            migraciones, PostgreSQL sera el origen del catalogo.
          </p>
        </div>

        {showFilters ? (
          <div className="mt-8 flex flex-wrap gap-2 md:mt-10">
            {["Todos", "Maquillaje", "Skincare", "Cuidado capilar"].map(
              (category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={selectedCategory === category}
                  onClick={() => onCategoryChange?.(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    selectedCategory === category
                      ? "bg-ink text-ivory"
                      : "bg-ivory/65 text-ink hover:bg-ivory"
                  }`}
                >
                  {category}
                </button>
              ),
            )}
          </div>
        ) : null}

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {visibleProducts.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.08, duration: 0.55 }}
              whileHover={{ y: -8, scale: 1.015 }}
              whileTap={{ scale: 0.995 }}
              className="group overflow-hidden rounded-[1.75rem] border border-ink/10 bg-[#faeee9] text-ink shadow-xl shadow-ink/15"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={getProductImage(product)}
                  alt={product.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {product.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-ivory shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-rosewood">
                  {product.category}
                </p>
                <h3 className="mt-2 min-h-16 font-display text-3xl font-semibold leading-none text-ink">
                  {product.name}
                </h3>
                <p className="mt-3 min-h-16 text-sm font-medium leading-6 text-ink/86">
                  {product.shortDescription}
                </p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/75">
                      {product.brand}
                    </p>
                    <p className="text-lg font-bold text-ink">
                      {formatCop(product.priceCents)}
                    </p>
                  </div>
                  <button
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-ivory transition-transform hover:-translate-y-0.5"
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

        {visibleProducts.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-ink/20 bg-ivory/55 p-6 text-center font-medium text-ink/80">
            Pronto tendremos nuevos productos en esta categoría.
          </p>
        ) : null}

      </div>
    </section>
  );
}
