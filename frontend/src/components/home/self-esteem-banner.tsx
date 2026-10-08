"use client";

import { motion, useReducedMotion } from "motion/react";
import type { SelfEsteemMessage } from "@/types/catalog";

export function SelfEsteemBanner({ message }: { message: SelfEsteemMessage }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-salmon px-5 py-14 text-ink">
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="relative mx-auto max-w-5xl text-center"
      >
        <blockquote className="mt-4 font-script text-5xl leading-[0.9] md:text-7xl">
          &ldquo;{message.message}&rdquo;
        </blockquote>
      </motion.div>
    </section>
  );
}
