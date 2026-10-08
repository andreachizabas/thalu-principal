"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const heroImages = [
  "/images/thalu-lipstick.png",
  "/images/thalu-serum.png",
  "/images/thalu-cream.png",
  "/images/thalu-makeup.png",
  "/images/thalu-beauty.png",
];

export function Hero() {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [deckStep, setDeckStep] = useState(0);
  const [isDeckRotating, setIsDeckRotating] = useState(false);

  function advanceDeck() {
    if (isDeckRotating) {
      return;
    }

    setIsDeckRotating(true);
    window.setTimeout(() => {
      setDeckStep((currentStep) => (currentStep + 1) % heroImages.length);
      setIsDeckRotating(false);
    }, 325);
  }

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
          className="relative mx-auto min-h-[360px] w-full max-w-sm sm:min-h-[440px] lg:max-w-none"
        >
          <motion.button
            type="button"
            aria-label="Cambiar imagen de maquillaje"
            onClick={advanceDeck}
            className="absolute left-4 top-6 h-64 w-48 overflow-hidden rounded-[2.2rem] border-8 border-ink bg-ink p-2 shadow-2xl shadow-ink/30 md:h-80 md:w-60"
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, -10, 0],
                    rotateY: isDeckRotating ? [0, 180, 360] : 0,
                  }
            }
            transition={{
              y: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 0.65, ease: "easeInOut" },
            }}
            style={{ transformStyle: "preserve-3d", perspective: 900 }}
          >
            <motion.div
              key={heroImages[deckStep % heroImages.length]}
              className="h-full rounded-[1.45rem] bg-cover bg-center"
              style={{
                backgroundImage: `url(${heroImages[deckStep % heroImages.length]})`,
              }}
              initial={reduceMotion ? false : { opacity: 0.35 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            />
          </motion.button>
          <motion.button
            type="button"
            aria-label="Cambiar imagen de skincare"
            onClick={advanceDeck}
            className="absolute right-2 top-0 h-80 w-56 overflow-hidden rounded-[2.2rem] border-8 border-ink bg-ink p-2 shadow-xl md:right-12 md:h-[26rem] md:w-72"
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, 12, 0],
                    rotate: [0, -1.3, 0],
                    rotateY: isDeckRotating ? [0, 180, 360] : 0,
                  }
            }
            transition={{
              y: { duration: 5.6, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 5.6, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 0.65, ease: "easeInOut" },
            }}
            style={{ transformStyle: "preserve-3d", perspective: 900 }}
          >
            <motion.div
              key={heroImages[(deckStep + 1) % heroImages.length]}
              className="h-full rounded-[1.45rem] bg-cover bg-center"
              style={{
                backgroundImage: `url(${heroImages[(deckStep + 1) % heroImages.length]})`,
              }}
              initial={reduceMotion ? false : { opacity: 0.35 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            />
          </motion.button>
          <motion.button
            type="button"
            aria-label="Cambiar imagen de cuidado capilar"
            onClick={advanceDeck}
            className="absolute bottom-4 left-0 h-72 w-56 overflow-hidden rounded-[2.2rem] border-8 border-ink bg-ink p-2 shadow-2xl md:left-16 md:w-72"
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, -14, 0],
                    rotate: [0, 1.2, 0],
                    rotateY: isDeckRotating ? [0, 180, 360] : 0,
                  }
            }
            transition={{
              y: { duration: 6.2, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 6.2, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 0.65, ease: "easeInOut" },
            }}
            style={{ transformStyle: "preserve-3d", perspective: 900 }}
          >
            <motion.div
              key={heroImages[(deckStep + 2) % heroImages.length]}
              className="h-full rounded-[1.45rem] bg-cover bg-center"
              style={{
                backgroundImage: `url(${heroImages[(deckStep + 2) % heroImages.length]})`,
              }}
              initial={reduceMotion ? false : { opacity: 0.35 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            />
          </motion.button>
          <motion.div
            className="absolute bottom-12 right-0 max-w-56 cursor-pointer rounded-2xl bg-ink p-5 text-ivory shadow-2xl"
            role="link"
            tabIndex={0}
            onClick={() => router.push("/servicios-a-domicilio")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                router.push("/servicios-a-domicilio");
              }
            }}
            animate={reduceMotion ? undefined : { scale: [1, 1.035, 1] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="font-display text-3xl leading-none text-salmon">ThaLú</p>
            <p className="mt-2 text-sm font-medium leading-5 text-ivory/88">
              Uñas y cuidado capilar a domicilio en Manizales y Villamaría.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
