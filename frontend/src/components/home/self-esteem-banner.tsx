"use client";

import { motion } from "motion/react";
import type { SelfEsteemMessage } from "@/types/catalog";

export function SelfEsteemBanner({ message }: { message: SelfEsteemMessage }) {
  return (
    <section className="bg-salmon px-5 py-14 text-ink">
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="mx-auto max-w-5xl text-center"
      >
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
