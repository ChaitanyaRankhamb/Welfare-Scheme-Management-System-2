import Navbar from "@/components/landingPage/sections/navbar";
import HeroSection from "@/components/landingPage/sections/hero-section";
import StatsBar from "@/components/landingPage/sections/stats-bar";
import AboutSection from "@/components/landingPage/sections/about-section";
import FeaturesSection from "@/components/landingPage/sections/features-section";
import HowItWorksSection from "@/components/landingPage/sections/how-it-works-section";
import AiSection from "@/components/landingPage/sections/ai-section";
import TechStackSection from "@/components/landingPage/sections/tech-stack-section";
import UseCasesSection from "@/components/landingPage/sections/use-cases-section";
import TestimonialsSection from "@/components/landingPage/sections/testimonials-section";
import FaqSection from "@/components/landingPage/sections/faq-section";
import CtaSection from "@/components/landingPage/sections/cta-section";
import Footer from "@/components/landingPage/sections/footer";

export default function LandingPage() {
  return (
    <main className="relative overflow-x-hidden" style={{ background: "var(--background)" }}>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <AboutSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AiSection />
      <TechStackSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
