"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-salmon text-ink">
      <motion.div
        className="pointer-events-none absolute right-[-1rem] top-10 z-0 h-[24rem] w-[24rem] bg-[url('/images/thalu-blossom.png')] bg-contain bg-center bg-no-repeat opacity-85 sm:h-[30rem] sm:w-[30rem] lg:right-[-4rem]"
        animate={reduceMotion ? undefined : { y: [0, -12, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute bottom-[-5rem] left-[-6rem] z-0 h-64 w-64 -scale-x-100 bg-[url('/images/thalu-blossom.png')] bg-contain bg-center bg-no-repeat opacity-65 sm:h-80 sm:w-80"
        animate={reduceMotion ? undefined : { y: [0, 10, 0], rotate: [0, -4, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-5 py-10 text-center sm:py-12 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16 lg:text-left">
        <div className="mx-auto max-w-3xl lg:mx-0">
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.8 }}
            className="mx-auto mt-4 max-w-4xl font-display text-5xl font-bold leading-[0.95] text-ink sm:text-6xl md:text-8xl lg:mx-0"
          >
            Tu belleza, tu esencia, tu momento.
          </motion.h1>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.65 }}
            className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row lg:mx-0 lg:max-w-none"
          >
            <a className="button-primary" href="#productos">
              Descubre nuestros productos
            </a>
            <a className="button-secondary" href="#historia">
              Conoce ThaLú
            </a>
          </motion.div>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.75 }}
            className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-7 text-ink sm:text-lg sm:leading-8 lg:mx-0"
          >
            Descubre productos seleccionados para acompanarte en tus rituales
            de autocuidado.
          </motion.p>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="relative mx-auto w-full max-w-sm lg:max-w-none"
        >
          <motion.div
            className="relative overflow-hidden rounded-[2rem] border border-ivory/20 bg-ink/60 p-6 text-ivory shadow-2xl shadow-ink/30 backdrop-blur-md sm:p-8"
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[url('/images/thalu-blossom.png')] bg-contain bg-center bg-no-repeat opacity-70" aria-hidden="true" />
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-salmon">Belleza a tu puerta</p>
              <h2 className="mt-4 max-w-xs font-display text-4xl font-semibold leading-[0.98] text-salmon sm:text-5xl">Tu momento de belleza, sin salir de casa.</h2>
              <p className="mt-5 text-sm font-medium leading-6 text-ivory/80">Llevamos a tu hogar servicios de uñas y cuidado capilar en Manizales y Villamaría.</p>
              <div className="mt-6 grid grid-cols-2 gap-2 text-xs font-bold text-ink">
                {['Manicure', 'Semipermanentes', 'Press On', 'Cepillado y planchado'].map((service) => (
                  <span key={service} className="rounded-xl bg-salmon px-3 py-3">{service}</span>
                ))}
              </div>
              <button type="button" onClick={() => router.push("/servicios-a-domicilio")} className="button-accent mt-7 w-full">Agenda tu domicilio</button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
