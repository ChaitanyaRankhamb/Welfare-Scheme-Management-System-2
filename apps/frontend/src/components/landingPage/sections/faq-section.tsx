"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import styles from "../styles/faq-section.module.css";

const faqs = [
  { q: "Is YojanaConnect incredibly free to use?", a: "Yes, completely free. We believe every Indian deserves to know about schemes they're eligible for, without any paywalls or hidden fees." },
  { q: "What happens to my personal data?", a: "Your data is encrypted, strictly compartmentalized, and never sold. It is solely used algorithmically to match you with schemes. We comply entirely with India's latest DPDP privacy laws." },
  { q: "How long does the AI take to find my schemes?", a: "Nearly instantaneous. Usually ranging from 0.5 to 2 seconds. Our engine streams results live as soon as it maps your core demographics." },
  { q: "Do I apply through your platform or the government?", a: "We act as your dedicated bridge. We provide direct, certified links and step-by-step guidance, but you ultimately process applications securely through the official government portals." },
  { q: "How accurately are the datasets updated?", a: "We synchronize our database bi-weekly with central and regional nodal agencies. You'll receive automated notifications about newly launched schemes and hard deadline extensions." },
  { q: "Are all Indian states currently covered?", a: "Yes, we proudly cover 28 states and all union territories. Geolocation filters dynamically pull exact regional criteria." },
];

function FaqItem({ faq, index, isOpen, toggleOpen }: { faq: any; index: number; isOpen: boolean; toggleOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${styles.faqCard} ${isOpen ? styles.faqCardExpanded : ""}`}
    >
      <button 
        className={styles.faqButton} 
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <span className={styles.faqButtonInner}>{faq.q}</span>
        <div className={styles.faqIcon}>
          <ChevronDown size={20} strokeWidth={2.5} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={styles.faqAnswerWrapper}
          >
            <div className={styles.faqAnswerInner}>
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item gracefully open by default

  return (
    <section id="faq" className={`py-28 px-6 ${styles.section}`}>
      <div className="max-w-[800px] mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }} 
          className="text-center mb-16"
        >
          <span className={styles.eyebrow}>Support</span>

          <h2 className={styles.headline}>
            Answers to your <span className={styles.headlineAccent}>Questions</span>
          </h2>

          <p className={styles.subtext}>
            We've distilled everything you need to know about YojanaConnect into a few quick pointers. Still need help? Reach out to our support channel.
          </p>
        </motion.div>

        {/* Custom Accordion List */}
        <div className={styles.faqList}>
          {faqs.map((faq, i) => (
            <FaqItem 
              key={faq.q} 
              faq={faq} 
              index={i} 
              isOpen={openIndex === i}
              toggleOpen={() => setOpenIndex(openIndex === i ? null : i)} 
            />
          ))}
        </div>
        
      </div>
    </section>
  );
}
