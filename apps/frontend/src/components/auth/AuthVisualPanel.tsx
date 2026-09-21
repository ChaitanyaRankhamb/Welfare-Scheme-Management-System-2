"use client";

import styles from "./auth-visual-panel.module.css";
import React from 'react';

type AuthVariant = "login" | "register" | "verify";

interface PanelContent {
  headline: string;
  subtext: string;
}

const content: Record<AuthVariant, PanelContent> = {
  login: {
    headline: "Decide faster. Waste less money.",
    subtext: "YojanaConnect lays out schemes by eligibility, so you act on what matters—no guesswork.",
  },
  register: {
    headline: "Simplify your benefits journey.",
    subtext: "Verify eligibility instantly and find the perfect schemes for your unique profile.",
  },
  verify: {
    headline: "Secure your access.",
    subtext: "Finalize your profile to unlock personalized recommendations and instant aid.",
  },
};

export default function AuthVisualPanel({ variant }: { variant: AuthVariant }) {
  const { headline, subtext } = content[variant];

  return (
    <div className={styles.visualInner}>
      {/* Background Blobs */}
      <div className={`${styles.blob} ${styles.blobOne}`} />
      <div className={`${styles.blob} ${styles.blobTwo}`} />

      {/* Text Content */}
      <div className={styles.textContent}>
        <h2 className={styles.headline}>{headline}</h2>
        <p className={styles.subtext}>{subtext}</p>
      </div>

      {/* Floating Mockup Elements */}
      <div className={styles.mockupContainer}>
        {/* Card 1 */}
        <div className={`${styles.mockCard} ${styles.cardLeft}`}>
          <div className={styles.cardHeader}>
             <span className={styles.badgeSuccess}>EASY</span>
          </div>
          <div className={styles.cardData}>
             <span className={styles.amount}>₹6,000</span>
          </div>
          <div className={styles.cardFooter}>PM-Kisan Yojana</div>
        </div>

        {/* Card 2 */}
        <div className={`${styles.mockCard} ${styles.cardRight}`}>
          <div className={styles.cardHeader}>
             <span className={styles.badgeWarning}>ADVANCED</span>
          </div>
          <div className={styles.cardData}>
             <span className={styles.amount}>₹5 Lakh</span>
          </div>
          <div className={styles.cardFooter}>Ayushman Bharat</div>
        </div>
        
        {/* Circle */}
        <div className={styles.mockCircle}>
           <span className={styles.badgeSuccess}>MATCH</span>
           <span className={styles.amount}>98%</span>
           <span className={styles.circleText}>Eligibility Rate</span>
        </div>
      </div>

      {/* Pagination dots */}
      <div className={styles.pagination}>
        <span className={`${styles.dot} ${styles.dotActive}`}></span>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
      </div>
    </div>
  );
}
