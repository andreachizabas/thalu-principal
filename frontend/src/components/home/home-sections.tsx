"use client";

import { Reveal } from "@/components/animations/reveal";
import { StoryTypewriter } from "@/components/home/story-typewriter";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

const categories = [
  {
    title: "Maquillaje",
    text: "Color, textura y acabados para expresarte a tu manera.",
  },
  {
    title: "Skincare",
    text: "Rituales faciales pensados para cuidado diario y bienestar.",
  },
  {
    title: "Cuidado capilar",
    text: "Productos cosmeticos para acompanar brillo, suavidad y manejo.",
  },
];

export function HomeSections({
  selectedCategory,
  onCategorySelect,
}: {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <section className="bg-salmon px-5 py-16 text-center text-ink sm:py-20 md:text-left">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-rosewood">
              Categorias
            </p>
            <h2 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-semibold leading-[0.98] text-ink sm:text-5xl md:mx-0 md:text-6xl">
              Tres mundos de autocuidado en una tienda cercana.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <Reveal key={category.title}>
                <motion.button
                  type="button"
                  aria-pressed={selectedCategory === category.title}
                  onClick={() => onCategorySelect(category.title)}
                  className={`min-h-64 w-full cursor-pointer rounded-[1.5rem] border p-7 text-left text-ivory shadow-xl shadow-ink/20 transition-colors ${
                    selectedCategory === category.title
                      ? "border-salmon bg-[#2b2020]"
                      : "border-ink/10 bg-ink"
                  }`}
                  whileHover={reduceMotion ? undefined : { y: -8, scale: 1.02 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  <h3 className="font-display text-4xl font-semibold text-salmon">
                    {category.title}
                  </h3>
                  <p className="mt-5 text-base font-medium leading-7 text-ivory/85">
                    {category.text}
                  </p>
                </motion.button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink px-5 py-16 text-ivory sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-salmon">Nuestros productos</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-semibold leading-tight text-salmon sm:text-5xl">Selección para tus rituales de autocuidado.</h2>
            <p className="mt-4 max-w-xl text-base font-medium leading-7 text-ivory/80">Maquillaje, skincare y cuidado capilar seleccionados para acompañarte cada día.</p>
            <Link href="#productos" className="button-accent mt-6">Descubrir productos</Link>
          </Reveal>
          <Reveal>
            <div className="grid min-h-64 grid-cols-3 gap-3">
              <div className="overflow-hidden rounded-[1.5rem] border-4 border-ink bg-salmon shadow-xl shadow-black/25">
                <img src="/images/thalu-lipstick.png" alt="Producto de maquillaje ThaLú" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="mt-8 overflow-hidden rounded-[1.5rem] border-4 border-ink bg-salmon shadow-xl shadow-black/25">
                <img src="/images/thalu-serum.png" alt="Producto de skincare ThaLú" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="overflow-hidden rounded-[1.5rem] border-4 border-ink bg-salmon shadow-xl shadow-black/25">
                <img src="/images/thalu-hair-mask.png" alt="Producto de cuidado capilar ThaLú" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="historia" className="bg-salmon px-5 py-16 text-ink sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-10">
          <Reveal>
            <motion.div
              className="mx-auto aspect-[4/5] max-h-[30rem] max-w-sm rounded-[2rem] bg-[url('/images/thalu-beauty.png')] bg-cover bg-center shadow-2xl shadow-ink/20 md:max-h-none md:max-w-none"
              animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </Reveal>
          <Reveal>
            <p className="text-center text-sm font-bold uppercase tracking-[0.24em] text-ink/88 lg:text-left">
              Nuestra historia
            </p>
            <StoryTypewriter />
          </Reveal>
        </div>
      </section>
    </>
  );
}
