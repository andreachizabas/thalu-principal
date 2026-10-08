"use client";

import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { formatCop } from "@/services/catalog";
import { getCartSubtotal, useCartStore } from "@/stores/cart-store";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const subtotal = getCartSubtotal(items);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            aria-label="Cerrar carrito"
            className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-ink text-ivory shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            aria-label="Carrito de compras"
          >
            <div className="flex items-center justify-between border-b border-salmon/20 p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-salmon">
                  ThaLu
                </p>
                <h2 className="font-display text-4xl font-semibold text-ivory">
                  Tu carrito
                </h2>
              </div>
              <button className="icon-button" onClick={closeCart} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <p className="font-display text-3xl font-semibold text-ivory">
                      Aun no hay productos.
                    </p>
                    <p className="mt-2 text-sm text-ivory/60">
                      Explora la seleccion y agrega tus favoritos.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <article
                      key={item.product.id}
                      className="rounded-2xl border border-salmon/25 bg-salmon p-4 text-ink"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-display text-2xl font-semibold leading-none text-ink">
                            {item.product.name}
                          </h3>
                          <p className="mt-2 text-sm text-ink/65">
                            {formatCop(item.product.priceCents)}
                          </p>
                        </div>
                        <button
                          className="icon-button icon-button-dark"
                          aria-label={`Eliminar ${item.product.name}`}
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-ink/15 bg-ivory/35">
                          <button
                            className="grid h-9 w-9 place-items-center"
                            aria-label="Reducir cantidad"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                          >
                            <Minus size={15} />
                          </button>
                          <span className="w-9 text-center text-sm font-bold">
                            {item.quantity}
                          </span>
                          <button
                            className="grid h-9 w-9 place-items-center"
                            aria-label="Aumentar cantidad"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                        <p className="font-bold text-ink">
                          {formatCop(item.product.priceCents * item.quantity)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-salmon/20 p-5">
              <div className="flex items-center justify-between text-lg font-bold text-ivory">
                <span>Subtotal</span>
                <span>{formatCop(subtotal)}</span>
              </div>
              <button className="button-accent mt-4 w-full" disabled={!items.length}>
                Iniciar checkout
              </button>
              <p className="mt-3 text-xs leading-5 text-ivory/55">
                Los descuentos, envio e inventario se validaran en servidor.
              </p>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
