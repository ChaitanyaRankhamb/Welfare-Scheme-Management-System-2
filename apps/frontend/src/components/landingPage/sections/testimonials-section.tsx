"use client";

import { motion } from "framer-motion";
import styles from "../styles/testimonials-section.module.css";

const testimonials = [
  { name: "Ramesh Kumar", role: "Farmer, Uttar Pradesh", content: "I was eligible for 3 schemes but didn't know. YojanaConnect changed my life.", avatar: "🧑" },
  { name: "Sneha Sharma", role: "Student, Maharashtra", content: "Found a scholarship in 2 minutes that I could've missed forever. Saved me ₹1.5 Lakh!", avatar: "👩" },
  { name: "Vijay Patel", role: "Entrepreneur, Gujarat", content: "The AI-powered matching is insanely accurate. Best platform for government schemes.", avatar: "🧑" },
];

export default function TestimonialsSection() {
  return (
    <section className={`py-24 px-6 ${styles.section}`} style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "var(--foreground)" }}>Trusted by Thousands</h2>
          <p className="mt-3 text-base" style={{ color: "var(--muted-foreground)" }}>Hear what our users have to say.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }} whileHover={{ scale: 1.02 }}
              className={`glass-card rounded-xl p-6 border flex flex-col ${styles.card}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{testimonial.avatar}</span>
                <div>
                  <p className="font-semibold" style={{ color: "var(--card-foreground)" }}>{testimonial.name}</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{testimonial.role}</p>
                </div>
              </div>
              <p className="text-sm italic flex-1" style={{ color: "var(--muted-foreground)" }}>
                &quot;{testimonial.content}&quot;
              </p>
              <div className="flex mt-4 gap-1">
                {[...Array(5)].map((_, j) => <span key={j} className="text-lg">⭐</span>)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
