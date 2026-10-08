"use client";

import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { getCartCount, useCartStore } from "@/stores/cart-store";

const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Maquillaje", href: "/catalogo/maquillaje" },
  { label: "Skincare", href: "/catalogo/skincare" },
  { label: "Cuidado capilar", href: "/catalogo/cuidado-capilar" },
  { label: "Servicios a domicilio", href: "/servicios-a-domicilio" },
  { label: "Novedades", href: "/novedades" },
  { label: "Nuestra historia", href: "/nuestra-historia" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const items = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);
  const count = getCartCount(items);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    router.push(`/buscar?q=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-salmon/20 bg-ink/92 text-ivory shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="group" aria-label="Ir al inicio">
          <span className="block font-display text-3xl font-bold leading-none text-salmon">
            ThaLú
          </span>
          <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-ivory/88">
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
          <button
            className="icon-button"
            aria-label={isSearchOpen ? "Cerrar buscador" : "Buscar productos"}
            aria-expanded={isSearchOpen}
            onClick={() => setIsSearchOpen((value) => !value)}
          >
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

      <AnimatePresence>
        {isSearchOpen ? (
          <motion.form
            onSubmit={submitSearch}
            className="border-t border-salmon/20 bg-ink px-5 py-4"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          >
            <div className="mx-auto flex max-w-7xl gap-3">
              <label className="sr-only" htmlFor="site-search">
                Buscar productos
              </label>
              <input
                id="site-search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Buscar maquillaje, skincare o cuidado capilar"
                autoFocus
                className="min-h-12 min-w-0 flex-1 rounded-full border border-ivory/20 bg-ivory/10 px-5 text-sm font-medium text-ivory outline-none placeholder:text-ivory/55 focus:border-salmon"
              />
              <button type="submit" className="button-accent shrink-0 px-5" aria-label="Buscar">
                <Search size={18} />
                <span className="hidden sm:inline">Buscar</span>
              </button>
            </div>
          </motion.form>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.nav
            className="border-t border-salmon/20 bg-ink px-5 py-5 lg:hidden"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="mx-auto grid max-w-7xl gap-4">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                  animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.035, duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className="block text-base font-medium text-ivory"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
