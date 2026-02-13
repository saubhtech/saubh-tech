import Header from './components/header';
import HeroSection from './components/hero-section';
import PhygitalSection from './components/phygital-section';
import StepsSection from './components/steps-section';
import TrustSection from './components/trust-section';
import CategoriesSection from './components/categories-section';
import BrandingSection from './components/branding-section';
import ProvenResultsSection from './components/proven-results-section';
import SaubhosSection from './components/saubhos-section';
import LearningSection from './components/learning-section';
import GigEconomySection from './components/gig-economy-section';
import FaqSection from './components/faq-section';
import CommunitySection from './components/community-section';
import PricingSection from './components/pricing-section';
import NewsletterSection from './components/newsletter-section';
import Footer from './components/footer';
import ScrollAnimator from './components/scroll-animator';

export default function HomeV2() {
  return (
    <>
      <Header />
      <HeroSection />
      <PhygitalSection />
      <StepsSection />
      <TrustSection />
      <CategoriesSection />
      <BrandingSection />
      <ProvenResultsSection />
      <SaubhosSection />
      <LearningSection />
      <GigEconomySection />
      <FaqSection />
      <CommunitySection />
      <PricingSection />
      <NewsletterSection />
      <Footer />
      <ScrollAnimator />
    </>
  );
}
