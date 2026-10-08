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
        <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-[1fr_auto]">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-salmon">Belleza a tu puerta</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight text-salmon sm:text-5xl">ThaLú llega hasta ti.</h2>
            <p className="mt-4 max-w-xl text-base font-medium leading-7 text-ivory/80">Descubre nuestros servicios de uñas y cabello a domicilio en Manizales y Villamaría.</p>
          </Reveal>
          <Link href="/servicios-a-domicilio" className="button-accent">Conoce nuestros servicios</Link>
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
