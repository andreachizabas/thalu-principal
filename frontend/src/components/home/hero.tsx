"use client";

import { motion, useReducedMotion } from "motion/react";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-salmon text-ink">
      <motion.div
        className="pointer-events-none absolute right-[-4rem] top-24 z-0 h-64 w-64 bg-[url('/images/thalu-blossom.png')] bg-contain bg-center bg-no-repeat opacity-55 sm:h-80 sm:w-80"
        animate={reduceMotion ? undefined : { y: [0, -12, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-10 text-center sm:py-12 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16 lg:text-left">
        <div className="mx-auto max-w-3xl lg:mx-0">
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.8 }}
            className="mx-auto mt-4 max-w-4xl font-display text-5xl font-bold leading-[0.95] text-ink sm:text-6xl md:text-8xl lg:mx-0"
          >
            Tu belleza, tu esencia, tu momento.
          </motion.h1>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.75 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-ink/70 sm:text-lg sm:leading-8 lg:mx-0"
          >
            Descubre productos seleccionados para acompanarte en tus rituales
            de autocuidado.
          </motion.p>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.65 }}
            className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row lg:mx-0 lg:max-w-none"
          >
            <a className="button-primary" href="#productos">
              Descubre nuestros productos
            </a>
            <a className="button-secondary" href="#historia">
              Conoce ThaLú
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="relative mx-auto min-h-[360px] w-full max-w-sm sm:min-h-[440px] lg:max-w-none"
        >
          <motion.div
            className="absolute left-4 top-6 h-64 w-48 overflow-hidden rounded-[2.2rem] border-8 border-ink bg-ink p-2 shadow-2xl shadow-ink/30 md:h-80 md:w-60"
            animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-full rounded-[1.45rem] bg-[url('/images/thalu-makeup.png')] bg-cover bg-center" />
          </motion.div>
          <motion.div
            className="absolute right-2 top-0 h-80 w-56 overflow-hidden rounded-[2.2rem] border-8 border-ink bg-ink p-2 shadow-xl md:right-12 md:h-[26rem] md:w-72"
            animate={reduceMotion ? undefined : { y: [0, 12, 0], rotate: [0, -1.3, 0] }}
            transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-full rounded-[1.45rem] bg-[url('/images/thalu-beauty.png')] bg-cover bg-center" />
          </motion.div>
          <motion.div
            className="absolute bottom-4 left-0 h-72 w-56 overflow-hidden rounded-[2.2rem] border-8 border-ink bg-ink p-2 shadow-2xl md:left-16 md:w-72"
            animate={reduceMotion ? undefined : { y: [0, -14, 0], rotate: [0, 1.2, 0] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-full rounded-[1.45rem] bg-[url('/images/thalu-makeup.png')] bg-cover bg-center" />
          </motion.div>
          <motion.div
            className="absolute bottom-12 right-0 max-w-56 rounded-2xl bg-ink p-5 text-ivory shadow-2xl"
            animate={reduceMotion ? undefined : { scale: [1, 1.035, 1] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="font-display text-3xl leading-none">ThaLú</p>
            <p className="mt-2 text-sm leading-5 text-ivory/70">
              Maquillaje, skincare y cuidado capilar con seleccion curada.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
