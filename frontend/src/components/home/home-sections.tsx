"use client";

import { Reveal } from "@/components/animations/reveal";
import { StoryTypewriter } from "@/components/home/story-typewriter";
import { motion, useReducedMotion } from "motion/react";

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

export function HomeSections() {
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
              Tres mundos de autocuidado en una boutique cercana.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <Reveal key={category.title}>
                <motion.article
                  className="min-h-64 rounded-[1.5rem] border border-ink/10 bg-ink p-7 text-ivory shadow-xl shadow-ink/20"
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
                </motion.article>
              </Reveal>
            ))}
          </div>
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
