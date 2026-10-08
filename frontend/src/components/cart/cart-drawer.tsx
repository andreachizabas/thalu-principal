"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, CheckCircle2, KeyRound, Minus, Plus, Smartphone, Trash2, X } from "lucide-react";
import { useState } from "react";
import { formatCop } from "@/services/catalog";

const whatsappBaseUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://whatsapp.com/dl/";
import { getCartSubtotal, useCartStore } from "@/stores/cart-store";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const subtotal = getCartSubtotal(items);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "payment" | "confirmed">("cart");
  const [paymentMethod, setPaymentMethod] = useState<"nequi" | "llave">("nequi");

  function handleClose() {
    closeCart();
    setCheckoutStep("cart");
  }

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
            onClick={handleClose}
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
                  ThaLú
                </p>
                <h2 className="font-display text-4xl font-semibold text-ivory">
                  Tu carrito
                </h2>
              </div>
              <button className="icon-button" onClick={handleClose} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {checkoutStep === "payment" ? (
                <div className="space-y-6">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-salmon"
                    onClick={() => setCheckoutStep("cart")}
                  >
                    <ArrowLeft size={16} />
                    Volver al carrito
                  </button>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-salmon">
                      Método de pago
                    </p>
                    <h3 className="mt-2 font-display text-4xl font-semibold text-ivory">
                      Elige cómo pagar
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-ivory/75">
                      Selecciona la opción que prefieras para completar tu pedido.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <button
                      type="button"
                      aria-pressed={paymentMethod === "nequi"}
                      onClick={() => setPaymentMethod("nequi")}
                      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${
                        paymentMethod === "nequi"
                          ? "border-salmon bg-salmon text-ink"
                          : "border-ivory/20 bg-ivory/5 text-ivory"
                      }`}
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-salmon">
                        <Smartphone size={21} />
                      </span>
                      <span>
                        <span className="block font-bold">Pagar con Nequi</span>
                        <span className="mt-1 block text-xs opacity-75">
                          Pago móvil rápido y sencillo
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-pressed={paymentMethod === "llave"}
                      onClick={() => setPaymentMethod("llave")}
                      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${
                        paymentMethod === "llave"
                          ? "border-salmon bg-salmon text-ink"
                          : "border-ivory/20 bg-ivory/5 text-ivory"
                      }`}
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-salmon">
                        <KeyRound size={21} />
                      </span>
                      <span>
                        <span className="block font-bold">Pagar con Llave</span>
                        <span className="mt-1 block text-xs opacity-75">
                          Usa tu llave bancaria preferida
                        </span>
                      </span>
                    </button>
                  </div>

                  <div className="rounded-2xl border border-salmon/30 bg-salmon/10 p-4">
                    <div className="flex items-center justify-between text-sm text-ivory/75">
                      <span>Total del pedido</span>
                      <strong className="text-lg text-ivory">{formatCop(subtotal)}</strong>
                    </div>
                    <button
                      type="button"
                      className="button-accent mt-4 w-full"
                      onClick={() => setCheckoutStep("confirmed")}
                    >
                      Continuar con {paymentMethod === "nequi" ? "Nequi" : "Llave"}
                    </button>
                  </div>
                </div>
              ) : checkoutStep === "confirmed" ? (
                <div className="grid min-h-full place-items-center text-center">
                  <div>
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-salmon text-ink">
                      <CheckCircle2 size={30} />
                    </div>
                    <h3 className="mt-6 font-display text-4xl font-semibold text-ivory">
                      Pedido preparado
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-ivory/70">
                      Tu pedido quedó listo para pago por {paymentMethod === "nequi" ? "Nequi" : "Llave"}.
                      Configuraremos los datos de destino antes de activar el cobro real.
                    </p>
                    <a href={`${whatsappBaseUrl}?text=${encodeURIComponent("Hola, ThaLú. Quisiera confirmar mi pedido de productos.")}`} target="_blank" rel="noreferrer" className="button-accent mt-6 w-full">
                      Enviar pedido por WhatsApp
                    </a>
                    <button type="button" className="button-secondary mt-3 w-full" onClick={handleClose}>
                      Volver a la tienda
                    </button>
                  </div>
                </div>
              ) : items.length === 0 ? (
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
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus size={15} />
                          </button>
                          <span className="w-9 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            className="grid h-9 w-9 place-items-center"
                            aria-label="Aumentar cantidad"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
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

            {checkoutStep === "cart" ? <div className="border-t border-salmon/20 p-5">
              <div className="flex items-center justify-between text-lg font-bold text-ivory">
                <span>Subtotal</span>
                <span>{formatCop(subtotal)}</span>
              </div>
              <button
                className="button-accent mt-4 w-full"
                disabled={!items.length}
                onClick={() => setCheckoutStep("payment")}
              >
                Iniciar checkout
              </button>
              <p className="mt-3 text-xs leading-5 text-ivory/55">
                Los descuentos, envio e inventario se validaran en servidor.
              </p>
            </div> : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
