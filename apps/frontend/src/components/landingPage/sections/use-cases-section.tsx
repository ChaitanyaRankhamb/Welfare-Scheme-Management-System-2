"use client";

import { motion } from "framer-motion";
import styles from "../styles/use-cases-section.module.css";

const useCases = [
  { user: "Raj (Farmer)", situation: "Lost his farm to drought", solution: "Found crop insurance + emergency relief scheme worth ₹5 Lakhs", icon: "🌾" },
  { user: "Priya (Student)", situation: "First in family to go to college, need help with fees", solution: "Discovered 7 scholarship schemes she qualified for, worth ₹2.5 Lakhs", icon: "📚" },
  { user: "Amita (Women Entrepreneur)", situation: "Starting a beauty business with limited capital", solution: "Accessed MUDRA loan + women entrepreneur scheme, launched successfully", icon: "👩‍💼" },
];

export default function UseCasesSection() {
  return (
    <section id="use-cases" className={`py-24 px-6 ${styles.section}`} style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "var(--foreground)" }}>Real Stories, Real Impact</h2>
          <p className="mt-3 text-base" style={{ color: "var(--muted-foreground)" }}>See how YojanaConnect is transforming lives across India.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((useCase, i) => (
            <motion.div
              key={useCase.user}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }} whileHover={{ y: -6 }}
              className={`glass-card rounded-2xl p-8 border ${styles.card}`}
            >
              <span className="text-5xl">{useCase.icon}</span>
              <h3 className="mt-4 font-bold text-lg" style={{ color: "var(--card-foreground)" }}>{useCase.user}</h3>
              <p className="mt-2 text-xs font-medium" style={{ color: "var(--primary)" }}>Challenge: {useCase.situation}</p>
              <p className="mt-3 text-sm" style={{ color: "var(--muted-foreground)" }}><span className="font-semibold">Result:</span> {useCase.solution}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
