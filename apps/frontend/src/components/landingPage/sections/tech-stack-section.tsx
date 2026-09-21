"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from "../styles/tech-stack-section.module.css";

const techStack = [
  { name: "Next.js", icon: "nextdotjs", color: "000000", darkColor: "ffffff" },
  { name: "TypeScript", icon: "typescript", color: "3178C6", darkColor: "3178C6" },
  { name: "Tailwind CSS", icon: "tailwindcss", color: "06B6D4", darkColor: "06B6D4" },
  { name: "Framer Motion", icon: "framer", color: "0055FF", darkColor: "0055FF" },
  { name: "Node.js", icon: "nodedotjs", color: "5FA04E", darkColor: "5FA04E" },
  { name: "Express", icon: "express", color: "000000", darkColor: "ffffff" },
  { name: "MongoDB", icon: "mongodb", color: "47A248", darkColor: "47A248" },
  { name: "Redis", icon: "redis", color: "DC382D", darkColor: "DC382D" },
  { name: "OpenAI API", icon: "openai", color: "412991", darkColor: "ffffff" },
  { name: "Resend", icon: "resend", color: "000000", darkColor: "ffffff" },
  { name: "React Query", icon: "reactquery", color: "FF4154", darkColor: "FF4154" },
  { name: "Zod", icon: "zod", color: "3E67B1", darkColor: "3E67B1" },
];

export default function TechStackSection() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <section id="tech-stack" className={`py-28 px-6 ${styles.section}`}>
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.7 }} 
          className="text-center mb-10 max-w-3xl mx-auto"
        >
          <span className={styles.eyebrow}>Technology</span>

          <h2 className={styles.headline}>
            Engineered for Scale
          </h2>

          <p className={styles.subtext}>
            YojanaConnect relies on an enterprise-grade technology stack to guarantee extremely high security, resilience, and lightning-fast performance.
          </p>
        </motion.div>

        {/* Marquee Carousel container */}
        <div className={styles.marqueeWrapper}>
           
           {/* Rendering two identical tracks for continuous seamless looping */}
           {[1, 2].map((trackIndex) => (
             <div key={trackIndex} className={styles.marqueeTrack} aria-hidden={trackIndex === 2 ? "true" : "false"}>
               {techStack.map((tech) => (
                 <div key={tech.name} className={styles.techItem}>
                   {/* We use external CDN to pull exact brand vectors safely */}
                   <img 
                     src={`https://cdn.simpleicons.org/${tech.icon}/${mounted && isDark ? tech.darkColor : tech.color}`}
                     alt={`${tech.name} logo`}
                     className={styles.techIcon}
                     loading="lazy"
                   />
                   <span className={styles.techName}>{tech.name}</span>
                 </div>
               ))}
             </div>
           ))}

        </div>
        
      </div>
    </section>
  );
}
