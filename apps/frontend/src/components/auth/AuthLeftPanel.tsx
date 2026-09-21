"use client";

import Image from "next/image";
import styles from "./auth-left-panel.module.css";

type AuthVariant = "login" | "register" | "verify";

interface PanelContent {
  headline: string;
  subtext: string;
  image: string;
}

const content: Record<AuthVariant, PanelContent> = {
  login: {
    headline: "Welcome back.",
    subtext: "Log in to check your eligibility and access our personalized recommendations.",
    image: "/hero_student.png"
  },
  register: {
    headline: "Discover your benefits.",
    subtext: "Let AI match you to welfare schemes you're eligible for in seconds.",
    image: "/hero_farmer.png"
  },
  verify: {
    headline: "Almost there.",
    subtext: "Verify your email to unlock your full access to YojanaConnect.",
    image: "/hero_labourer.png"
  },
};

interface AuthLeftPanelProps {
  variant: AuthVariant;
}

export default function AuthLeftPanel({ variant }: AuthLeftPanelProps) {
  const { headline, subtext, image } = content[variant];

  return (
    <div className={styles.panel}>
      {/* Ambient glow blobs */}
      <div className={`${styles.glow} ${styles.glowOne}`} />
      <div className={`${styles.glow} ${styles.glowTwo}`} />
      
      {/* Main content */}
      <div className={styles.content}>
        {/* Brand wordmark */}
        <div className={styles.brandRow}>
          <span className={styles.brandDot} />
          <span className={styles.brandName}>YojanaConnect</span>
        </div>

        {/* Feature Image */}
        <div className={styles.imageContainer}>
          <Image 
            src={image} 
            alt="YojanaConnect Illustration" 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
            priority
          />
        </div>

        {/* Text */}
        <div className={styles.textSection}>
          <h2 className={styles.headline}>{headline}</h2>
          <p className={styles.subtext}>{subtext}</p>
        </div>
      </div>
    </div>
  );
}
