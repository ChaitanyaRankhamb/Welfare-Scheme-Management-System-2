"use client";

import Image from "next/image";

type AuthVariant = "login" | "register" | "verify";

interface PanelContent {
  headline: string;
  subtext: string;
  image: string;
}

const content: Record<AuthVariant, PanelContent> = {
  login: {
    headline: "Welcome back.",
    subtext:
      "Log in to check your eligibility and access our personalized recommendations.",
    image: "/hero_student.png",
  },
  register: {
    headline: "Discover your benefits.",
    subtext:
      "Let AI match you to welfare schemes you're eligible for in seconds.",
    image: "/hero_farmer.png",
  },
  verify: {
    headline: "Almost there.",
    subtext: "Verify your email to unlock your full access to YojanaConnect.",
    image: "/hero_labourer.png",
  },
};

interface AuthLeftPanelProps {
  variant: AuthVariant;
}

export default function AuthLeftPanel({ variant }: AuthLeftPanelProps) {
  const { headline, subtext, image } = content[variant];

  return (
    <div className="relative flex min-h-full w-full flex-col justify-center overflow-hidden bg-foreground px-12 py-12 text-background dark:bg-background dark:text-foreground">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -left-35 -top-30 h-120 w-120 animate-[float_9s_ease-in-out_infinite] rounded-full bg-primary opacity-30 blur-[90px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-90 w-90 animate-[float_11s_ease-in-out_infinite_reverse] rounded-full bg-accent opacity-30 blur-[90px]" />

      {/* Main content */}
      <div className="relative z-1 flex h-full flex-col gap-8">
        {/* Brand wordmark */}
        <div className="mb-auto flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
          <span className="font-sans text-[1.1rem] font-bold tracking-[-0.01em] text-background dark:text-foreground">
            YojanaConnect
          </span>
        </div>

        {/* Feature Image */}
        <div className="relative my-auto min-h-62.5 max-h-125 w-full flex-1 overflow-hidden rounded-3xl border border-primary-foreground/10 shadow-xl">
          <Image
            src={image}
            alt="YojanaConnect Illustration"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Text */}
        <div className="mt-auto text-center">
          <h2 className="m-0 mb-2 font-sans text-[2.2rem] font-extrabold tracking-[-0.02em] text-background dark:text-foreground">
            {headline}
          </h2>
          <p className="m-0 text-[1.05rem] leading-[1.6] text-background/70 dark:text-foreground/70">
            {subtext}
          </p>
        </div>
      </div>
    </div>
  );
}
