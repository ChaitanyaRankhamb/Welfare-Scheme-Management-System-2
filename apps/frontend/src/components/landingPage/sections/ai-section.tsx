"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Search, LineChart, Sparkles, CheckCircle2 } from "lucide-react";
import styles from "../styles/ai-section.module.css";

const featuresList = [
  {
    icon: BrainCircuit,
    title: "Understands Complex Profiles",
    desc: "Transforms your raw details natively into structured data points instantly."
  },
  {
    icon: Search,
    title: "Matches Hidden Opportunities",
    desc: "Cross-references thousands of deep state and central government schemas."
  },
  {
    icon: LineChart,
    title: "Continuously Learns & Improves",
    desc: "Our model improves accuracy automatically with every successful application."
  }
];

export default function AiSection() {
  return (
    <section id="ai-section" className={`py-28 px-6 ${styles.section}`}>
      {/* Background Ambient Glow */}
      <div className={styles.ambientGlow} />
      
      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        
        {/* ── Left Side: Content ── */}
        <motion.div
           initial={{ opacity: 0, x: -40 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="max-w-xl"
        >
          <span className={styles.eyebrow}>Core Intelligence</span>
          <h2 className={styles.headline}>
            Powered by <span className={styles.headlineAccent}>Intelligent AI</span>
          </h2>
          <p className={styles.subtext}>
            YojanaConnect is not just a search directory. Our proprietary AI algorithmic engine serves as the brain that maps citizens to the entitlements they deserve, entirely autonomously.
          </p>

          <div className={styles.featureList}>
            {featuresList.map((item, idx) => (
              <motion.div 
                key={idx} 
                className={styles.featureItem}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.15 + 0.2 }}
              >
                <div className={styles.featureIcon}>
                  <item.icon size={22} strokeWidth={2.5} />
                </div>
                <div className={styles.featureText}>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Right Side: Visual Mockup ── */}
        <motion.div
           initial={{ opacity: 0, x: 40, scale: 0.95 }}
           whileInView={{ opacity: 1, x: 0, scale: 1 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
           className="w-full max-w-lg mx-auto lg:ml-auto perspective-1000"
        >
          {/* Glass Card UI Container */}
          <div className={styles.visualCard}>
            
             {/* Mockup Header */}
             <div className={styles.mockupHeader}>
               <Sparkles className="text-violet-500 animate-pulse" size={20} />
               <div className={styles.mockupTitle}>YojanaConnect Engine</div>
               <div className="flex-1" />
               <div className={styles.mockupStatus}>
                 Processing
                 <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               </div>
             </div>

             {/* Mockup Chat / Interface body */}
             <div className={styles.chatBubbleLeft}>
               &quot;I am a 28-year-old female farmer from Maharashtra with an annual income of ₹1.5 Lakh.&quot;
             </div>
             
             <div className={styles.chatBubbleRight}>
               Analyzing 1,248 schemes across central & state databases...
             </div>

             <div className="mt-6 mb-3 flex items-center justify-between px-1">
               <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">3 Matches Found</span>
               <span className="text-xs text-violet-500 font-semibold animate-pulse">0.8s execution</span>
             </div>

             {/* Result Payload Items */}
             <div className="flex flex-col gap-3">
               <div className={styles.chatAction}>
                 <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                 <div className="flex-1">
                   <div className="font-bold text-sm">PM Kisan Samman Nidhi</div>
                   <div className="text-xs opacity-70 mt-0.5">₹6,000/year • 99% match</div>
                 </div>
               </div>
               
               <div className={styles.chatAction}>
                 <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                 <div className="flex-1">
                   <div className="font-bold text-sm">Namo Shetkari Maha Sanman</div>
                   <div className="text-xs opacity-70 mt-0.5">₹6,000/year • 95% match</div>
                 </div>
               </div>
             </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
