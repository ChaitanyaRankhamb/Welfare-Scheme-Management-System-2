"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import styles from "../styles/how-it-works-section.module.css";

const steps = [
  { 
    num: "01", 
    title: "Tell Us About Yourself", 
    desc: "Answer simple questions about your age, income, occupation, state, and caste (if applicable). It takes exactly 2 minutes." 
  },
  { 
    num: "02", 
    title: "AI Analyzes Your Profile", 
    desc: "Our AI engine cross-references your anonymized data securely with over 1,000 schemes across all Indian states instantly." 
  },
  { 
    num: "03", 
    title: "Get Your Results", 
    desc: "Receive a personalized, ranked list of schemes you're strictly eligible for. No fluff, just the benefits you can claim." 
  },
  { 
    num: "04", 
    title: "Apply & Track", 
    desc: "Get direct, verified application links, exact document checklists, and monitor real-time approval status right from your dashboard." 
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className={`py-28 px-6 ${styles.section}`}>
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.7 }} 
          className="text-center mb-24 max-w-3xl mx-auto"
        >
          <span className={styles.eyebrow}>Guided Flow</span>

          <h2 className={styles.headline}>
            From zero to {" "}
            <span className={styles.headlineAccent}>applied in minutes</span>
          </h2>

          <p className={styles.subtext}>
            We built a frictionless pipeline. You provide basic details, and we pave a clear path to direct government benefits.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
        >
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            
            return (
              <motion.div 
                key={step.num} 
                variants={itemVariants}
                className="relative"
              >
                {/* Visual Connector (Hidden on last item and smaller screens) */}
                {!isLast && (
                  <div className={styles.connectorWrapper}>
                    <div className={styles.connectorLine} />
                    <ChevronRight size={20} className={styles.connectorArrow} strokeWidth={2.5} />
                  </div>
                )}

                {/* Card Content */}
                <div className={`${styles.card} rounded-2xl p-7 flex flex-col`}>
                  {/* Step Badge */}
                  <div className={styles.stepBadge}>
                    {step.num}
                  </div>
                  
                  {/* Title & Desc */}
                  <h3 className={styles.cardTitle}>{step.title}</h3>
                  <p className={styles.cardDesc}>{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        
      </div>
    </section>
  );
}
