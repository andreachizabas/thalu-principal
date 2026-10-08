"use client";

import { Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { SelfEsteemMessage } from "@/types/catalog";

export function SelfEsteemBanner({ message }: { message: SelfEsteemMessage }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-salmon px-5 py-14 text-ink">
      <motion.div
        className="absolute left-0 top-0 h-1 w-full origin-left bg-ink/80"
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={reduceMotion ? undefined : { scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 h-1 w-full origin-right bg-ink/80"
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={reduceMotion ? undefined : { scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 1.1, ease: "easeOut" }}
      />
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="relative mx-auto max-w-5xl text-center"
      >
        <motion.div
          className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full bg-ink text-salmon shadow-xl shadow-ink/20"
          animate={reduceMotion ? undefined : { y: [0, -5, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <Sparkles size={22} />
        </motion.div>
        <p className="text-sm font-bold uppercase tracking-[0.28em]">
          Un momento para ti
        </p>
        <blockquote className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl">
          &ldquo;{message.message}&rdquo;
        </blockquote>
      </motion.div>
    </section>
  );
}
