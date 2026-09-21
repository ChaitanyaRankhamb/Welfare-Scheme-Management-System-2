"use client";

import { motion } from "framer-motion";
import { Sparkles, MousePointerClick, BellRing, ShieldCheck, Globe, Activity } from "lucide-react";
import styles from "../styles/features-section.module.css";

const features = [
  {
    icon: Sparkles,
    title: "Smart Matching AI",
    desc: "Our engine instantly matches you with eligible schemes based on your profile — saving you hours of exhausting research.",
    bgTheme: "from-sky-500/10 to-blue-500/10",
    iconColor: "#0ea5e9", // Sky 500
  },
  {
    icon: MousePointerClick,
    title: "One-Click Applications",
    desc: "Get direct, verified links and step-by-step guidance for every scheme. No redirects, no spam, no confusion.",
    bgTheme: "from-indigo-500/10 to-violet-500/10",
    iconColor: "#8b5cf6", // Violet 500
  },
  {
    icon: BellRing,
    title: "Real-Time Updates",
    desc: "Stay informed about new government schemes and critical deadline changes. Get notified before it's too late.",
    bgTheme: "from-amber-500/10 to-orange-500/10",
    iconColor: "#f59e0b", // Amber 500
  },
  {
    icon: ShieldCheck,
    title: "100% Privacy & Security",
    desc: "Your data is military-grade encrypted and strictly confidential. We prioritize your privacy and NEVER share your information.",
    bgTheme: "from-emerald-500/10 to-teal-500/10",
    iconColor: "#10b981", // Emerald 500
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    desc: "We break language barriers in government support. Access all schemes comfortably in your preferred regional language.",
    bgTheme: "from-fuchsia-500/10 to-purple-500/10",
    iconColor: "#d946ef", // Fuchsia 500
  },
  {
    icon: Activity,
    title: "Track Application Status",
    desc: "Monitor your document verification and application status in real-time. Stay fully updated at every single step.",
    bgTheme: "from-rose-500/10 to-red-500/10",
    iconColor: "#f43f5e", // Rose 500
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function FeaturesSection() {
  return (
    <section id="features" className={`py-28 px-6 ${styles.section}`}>
      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <span className={styles.eyebrow}>Features</span>

          <h2 className={styles.headline}>
            Everything you need,{" "}
            <span className={styles.headlineAccent}>all in one place</span>
          </h2>

          <p className={styles.subtext}>
            YojanaConnect gives you the most powerful tools to discover, track, and apply for government benefits with absolute confidence and zero friction.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map(({ icon: Icon, title, desc, bgTheme, iconColor }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              whileHover={{ borderColor: iconColor, transition: { duration: 0.3 } }}
              className={`${styles.card} bg-gradient-to-br ${bgTheme} rounded-2xl p-7 flex flex-col border border-transparent`}
            >
              {/* Feature Icon Wrapper */}
              <div
                className={styles.iconWrapper}
                style={{
                  background: `${iconColor}1a`, // Low opacity background based on icon color
                  border: `1px solid ${iconColor}100` // Subtle border using the same color
                }}
              >
                <Icon size={24} style={{ color: iconColor }} strokeWidth={2} />
              </div>

              {/* Title & Desc */}
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDesc}>{desc}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
