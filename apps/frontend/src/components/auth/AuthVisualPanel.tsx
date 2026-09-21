"use client";

import React from "react";

type AuthVariant = "login" | "register" | "verify";

interface PanelContent {
  headline: string;
  subtext: string;
}

const content: Record<AuthVariant, PanelContent> = {
  login: {
    headline: "Decide faster. Waste less money.",
    subtext:
      "YojanaConnect lays out schemes by eligibility, so you act on what matters—no guesswork.",
  },
  register: {
    headline: "Simplify your benefits journey.",
    subtext:
      "Verify eligibility instantly and find the perfect schemes for your unique profile.",
  },
  verify: {
    headline: "Secure your access.",
    subtext:
      "Finalize your profile to unlock personalized recommendations and instant aid.",
  },
};

export default function AuthVisualPanel({ variant }: { variant: AuthVariant }) {
  const { headline, subtext } = content[variant];

  return (
    <div className="relative z-[1] flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-border bg-background p-12">
      {/* Background Blobs */}
      <div className="absolute right-[-50px] top-[10%] z-0 h-[350px] w-[350px] animate-[float_8s_ease-in-out_infinite] rounded-full bg-primary opacity-15 blur-[80px]" />
      <div className="absolute bottom-[50px] left-[-50px] z-0 h-[300px] w-[300px] animate-[float_10s_ease-in-out_infinite_reverse] rounded-full bg-accent opacity-15 blur-[80px]" />

      {/* Text Content */}
      <div className="relative z-[1] max-w-[360px]">
        <h2 className="mb-4 font-sans text-3xl font-medium leading-tight text-foreground">
          {headline}
        </h2>
        <p className="m-0 text-[0.9rem] leading-[1.6] text-muted-foreground">
          {subtext}
        </p>
      </div>

      {/* Floating Mockup Elements */}
      <div className="relative z-[1] mt-8 w-full flex-1">
        {/* Card 1 */}
        <div className="absolute left-0 top-[15%] z-[1] flex w-[200px] flex-col items-start justify-center gap-2 rounded-xl border border-border bg-card p-6 shadow-lg transition-transform">
          <div>
            <span className="rounded border border-primary px-2 py-[0.2rem] text-[0.6rem] font-bold tracking-[0.05em] text-primary">
              EASY
            </span>
          </div>
          <div>
            <span className="text-[1.4rem] font-extrabold text-foreground">
              ₹6,000
            </span>
          </div>
          <div className="mt-[0.2rem] text-[0.7rem] text-muted-foreground">
            PM-Kisan Yojana
          </div>
        </div>

        {/* Card 2 */}
        <div className="absolute right-0 top-[45%] z-[2] flex w-[180px] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-6 text-center shadow-lg transition-transform">
          <div>
            <span className="rounded border border-destructive px-2 py-[0.2rem] text-[0.6rem] font-bold tracking-[0.05em] text-destructive">
              ADVANCED
            </span>
          </div>
          <div>
            <span className="text-[1.4rem] font-extrabold text-foreground">
              ₹5 Lakh
            </span>
          </div>
          <div className="mt-[0.2rem] text-[0.7rem] text-muted-foreground">
            Ayushman Bharat
          </div>
        </div>

        {/* Circle */}
        <div className="absolute left-[30%] top-[30%] z-[3] flex h-[150px] w-[150px] flex-col items-center justify-center rounded-full border border-border bg-card p-6 text-center shadow-lg transition-transform">
          <span className="rounded border border-primary px-2 py-[0.2rem] text-[0.6rem] font-bold tracking-[0.05em] text-primary">
            MATCH
          </span>
          <span className="text-[1.4rem] font-extrabold text-foreground">
            98%
          </span>
          <span className="mt-[0.2rem] text-[0.65rem] text-muted-foreground">
            Eligibility Rate
          </span>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="z-[1] mt-auto flex items-center justify-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-foreground transition-all"></span>
        <span className="h-1.5 w-1.5 rounded-full bg-border transition-all"></span>
        <span className="h-1.5 w-1.5 rounded-full bg-border transition-all"></span>
      </div>
    </div>
  );
}
