"use client";

import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getCartCount, useCartStore } from "@/stores/cart-store";

const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Maquillaje", href: "/catalogo/maquillaje" },
  { label: "Skincare", href: "/catalogo/skincare" },
  { label: "Cuidado capilar", href: "/catalogo/cuidado-capilar" },
  { label: "Novedades", href: "/novedades" },
  { label: "Nuestra historia", href: "/nuestra-historia" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);
  const count = getCartCount(items);

  return (
    <header className="sticky top-0 z-40 border-b border-salmon/20 bg-ink/92 text-ivory shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="group" aria-label="Ir al inicio">
          <span className="block font-display text-3xl font-bold leading-none text-salmon">
            ThaLu
          </span>
          <span className="block text-[0.68rem] uppercase tracking-[0.24em] text-ivory/70">
            By Andrea Chizabas
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ivory/72 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-salmon"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="icon-button" aria-label="Buscar productos">
            <Search size={19} />
          </button>
          <button
            className="icon-button relative"
            aria-label="Abrir carrito"
            onClick={openCart}
          >
            <ShoppingBag size={19} />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-salmon px-1 text-[0.7rem] font-bold text-ink">
                {count}
              </span>
            ) : null}
          </button>
          <button
            className="icon-button lg:hidden"
            aria-label={isMenuOpen ? "Cerrar menu" : "Abrir menu"}
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav className="border-t border-salmon/20 bg-ink px-5 py-5 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base font-medium text-ivory"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
