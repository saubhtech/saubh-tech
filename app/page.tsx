import { Header } from "@/app/components/header";
import { HeroSection } from "@/app/components/hero-section";
import { FeaturesSection } from "@/app/components/features-section";
import { CategoriesSection } from "@/app/components/categories-section";
import { CommunitySection } from "@/app/components/community-section";
import { GigEconomySection } from "@/app/components/gig-economy-section";
import { TrustSection } from "@/app/components/trust-section";
import { WorkflowSection } from "@/app/components/workflow-section";
import { PhygitalSection } from "@/app/components/phygital-section";
import { ProvenResultsSection } from "@/app/components/proven-results-section";
import { BrandingSection } from "@/app/components/branding-section";
import { SaubhOSSection } from "@/app/components/saubhos-section";
import { LearningSection } from "@/app/components/learning-section";
import { BlogsSection } from "@/app/components/blogs-section";
import { FAQSection } from "@/app/components/faq-section";
import { PricingSection } from "@/app/components/pricing-section";
import { TestimonialsSection } from "@/app/components/testimonials-section";
import { CTASection } from "@/app/components/cta-section";
import { NewsletterSection } from "@/app/components/newsletter-section";
import { Footer } from "@/app/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <CommunitySection />
      <TrustSection />
      <GigEconomySection />
      <WorkflowSection />
      <PhygitalSection />
      <BrandingSection />
      <ProvenResultsSection />
      <SaubhOSSection />
      <LearningSection />
      <PricingSection />
      <BlogsSection />
      <FAQSection />
      <TestimonialsSection />
      <CTASection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
