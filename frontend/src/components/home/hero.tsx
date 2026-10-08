"use client";

import { motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ivory">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(233,155,145,0.28),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(201,121,116,0.16),transparent_28%)]" />
      <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="max-w-3xl">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-rosewood/25 px-4 py-2 text-sm font-semibold text-rosewood"
          >
            <Sparkles size={16} />
            Boutique colombiana de belleza
          </motion.p>
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.8 }}
            className="mt-7 max-w-4xl font-display text-6xl font-bold leading-[0.95] text-ink md:text-8xl"
          >
            Tu belleza, tu esencia, tu momento.
          </motion.h1>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.75 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-ink/70"
          >
            Descubre productos seleccionados para acompanarte en tus rituales
            de autocuidado.
          </motion.p>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.65 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a className="button-primary" href="#productos">
              Descubre nuestros productos
            </a>
            <a className="button-secondary" href="#historia">
              Conoce ThaLu
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="relative min-h-[440px]"
        >
          <div className="absolute left-4 top-6 h-64 w-48 rounded-[2rem] bg-salmon/80 shadow-2xl shadow-salmon/20 md:h-80 md:w-60" />
          <div className="absolute right-2 top-0 h-80 w-56 rounded-[2rem] border border-black/10 bg-white/70 p-4 shadow-xl backdrop-blur md:right-12 md:h-[26rem] md:w-72">
            <div className="h-full rounded-[1.35rem] bg-[url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
          </div>
          <div className="absolute bottom-4 left-0 h-72 w-56 rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-2xl backdrop-blur md:left-16 md:w-72">
            <div className="h-full rounded-[1.35rem] bg-[url('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
          </div>
          <div className="absolute bottom-12 right-0 max-w-56 rounded-2xl bg-ink p-5 text-ivory shadow-2xl">
            <p className="font-display text-3xl leading-none">ThaLu</p>
            <p className="mt-2 text-sm leading-5 text-ivory/70">
              Maquillaje, skincare y cuidado capilar con seleccion curada.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
