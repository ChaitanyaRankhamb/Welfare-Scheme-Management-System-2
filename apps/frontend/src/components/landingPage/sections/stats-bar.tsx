"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "1000+", label: "Schemes Indexed" },
  { value: "28", label: "States Covered" },
  { value: "15+", label: "Beneficiary Categories" },
  { value: "AI", label: "Powered Matching" },
];

export default function StatsBar() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-12 px-6"
      style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <p
              className="text-4xl font-extrabold"
              style={{
                background: "linear-gradient(90deg, var(--gradient-from), var(--gradient-to))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {stat.value}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
