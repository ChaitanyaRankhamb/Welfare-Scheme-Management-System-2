"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Users, Sparkles } from "lucide-react";
import styles from "../styles/about-section.module.css";

const cards = [
  {
    icon: AlertTriangle,
    label: "The Problem",
    title: "Lost in bureaucracy",
    desc: "India has 1,000+ welfare schemes — yet most eligible citizens never discover them. The system was built for clerks, not citizens.",
    accent: "from-rose-500/10 to-orange-500/10",
    iconColor: "#f97316",
    borderAccent: "rgba(249,115,22,0.2)",
  },
  {
    icon: Users,
    label: "Who It's For",
    title: "Built for every Indian",
    desc: "Farmers, students, women entrepreneurs, daily-wage workers, senior citizens — anyone who deserves support but struggles to find it.",
    accent: "from-violet-500/10 to-indigo-500/10",
    iconColor: "#8b5cf6",
    borderAccent: "rgba(139,92,246,0.2)",
  },
  {
    icon: Sparkles,
    label: "The Solution",
    title: "AI does the heavy lifting",
    desc: "Tell us who you are. Our AI cross-references your profile with every scheme and hands you a clear, ranked, actionable list in minutes.",
    accent: "from-cyan-500/10 to-teal-500/10",
    iconColor: "#06b6d4",
    borderAccent: "rgba(6,182,212,0.2)",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.25 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function AboutSection() {
  return (
    <section id="about" className={`py-28 px-6 ${styles.section}`}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <span className={styles.eyebrow}>The why behind YojanaConnect</span>

          <h2 className={styles.headline}>
            Millions miss benefits{" "}
            <span className={styles.headlineAccent}>they deserve</span>
          </h2>

          <p className={styles.subtext}>
            Not because schemes don&apos;t exist — but because discovering them
            is buried under red tape, jargon, and endless government portals.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {cards.map(({ icon: Icon, label, title, desc, accent, iconColor, borderAccent }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`${styles.card} bg-gradient-to-br ${accent} rounded-2xl p-7 flex flex-col gap-5`}
              style={{ borderColor: borderAccent }}
            >
              {/* Icon badge */}
              <div
                className={styles.iconBadge}
                style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}30` }}
              >
                <Icon size={20} style={{ color: iconColor }} strokeWidth={2} />
              </div>

              {/* Label */}
              <span className={styles.cardLabel} style={{ color: iconColor }}>
                {label}
              </span>

              {/* Title */}
              <h3 className={styles.cardTitle}>{title}</h3>

              {/* Description */}
              <p className={styles.cardDesc}>{desc}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
