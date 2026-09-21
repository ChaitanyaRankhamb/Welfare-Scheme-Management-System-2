"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CtaSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-20 px-6 text-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))" }}
    >
      <div
        className="hero-glow"
        style={{ opacity: 0.15, width: 400, height: 400, top: -80, left: "30%", background: "radial-gradient(circle, white, transparent)" }}
      />
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto"
      >
        Find your schemes in under 2 minutes.
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-3 text-white/80 text-base"
      >
        Just tell us who you are. Our AI does the rest.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35 }}
        className="mt-8"
      >
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl text-base font-bold bg-white dark:bg-black transition-all hover:scale-105 hover:shadow-2xl"
          style={{ color: "var(--primary)" }}
        >
          Get Started for Free →
        </Link>
      </motion.div>
    </motion.section>
  );
}
