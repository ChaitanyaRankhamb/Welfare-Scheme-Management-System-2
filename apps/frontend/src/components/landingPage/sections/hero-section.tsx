"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { fadeIn, fadeUp, scaleUp } from "../animations";

const heroImages = [
  { src: "/hero_farmer.png", label: "Farmers", desc: "Agricultural support & crop insurance schemes", badge: "🌾" },
  { src: "/hero_student.png", label: "Students", desc: "Scholarships, education loans & skill programs", badge: "📚" },
  { src: "/hero_elderly.png", label: "Senior Citizens", desc: "Pension, healthcare & social welfare benefits", badge: "🏥" },
  { src: "/hero_labourer.png", label: "Workers & Labourers", desc: "E-Shram, PMAY housing & labor welfare", badge: "👷" },
];

function HeroUserCard({ src, label, desc, badge, delay }: { src: string; label: string; desc: string; badge: string; delay: number }) {
  return (
    <motion.div
      variants={scaleUp}
      initial="hidden"
      animate="visible"
      custom={delay}
      whileHover={{ scale: 1.04, y: -6 }}
      className="glass-card rounded-2xl overflow-hidden flex flex-col"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="relative w-full h-52 overflow-hidden">
        <Image src={src} alt={label} fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute bottom-3 left-3 text-2xl">{badge}</span>
      </div>
      <div className="p-4">
        <p className="font-bold text-lg" style={{ color: "var(--card-foreground)" }}>{label}</p>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>{desc}</p>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
      <div className="hero-glow hero-glow-1" />
      <div className="hero-glow hero-glow-2" />
      <div className="hero-glow hero-glow-3" />

      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={0.1}
        className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
        style={{ background: "var(--muted)", color: "var(--primary)", border: "1px solid var(--border)" }}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        AI-Powered Government Schemes Platform
      </motion.div>

      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.2}
        className="text-center text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl"
        style={{ color: "var(--foreground)" }}
      >
        Every Citizen Deserves{" "}
        <span
          className="inline-block"
          style={{
            background: "linear-gradient(90deg, var(--gradient-from), var(--gradient-to))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Their Benefits
        </span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.35}
        className="mt-6 text-center text-lg sm:text-xl max-w-2xl"
        style={{ color: "var(--muted-foreground)" }}
      >
        YojanaConnect uses AI to match you with government welfare schemes — based on who you are, where you live, and what you need. No bureaucracy. No confusion. Just clarity.
      </motion.p>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.5}
        className="mt-10 flex flex-wrap gap-4 justify-center"
      >
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold transition-all hover:scale-105 hover:shadow-xl"
          style={{ background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))", color: "#fff", boxShadow: "0 8px 32px rgba(99,102,241,0.35)" }}
        >
          Check My Eligibility →
        </Link>
        <Link
          href="#about"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold transition-all hover:scale-105"
          style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}
        >
          Learn More
        </Link>
      </motion.div>

      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {heroImages.map((img, i) => (
          <HeroUserCard key={img.label} {...img} delay={0.5 + i * 0.15} />
        ))}
      </div>
    </section>
  );
}
