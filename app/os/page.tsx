import Navbar from "../components/Navbar";
import Section from "../components/Section";
import Footer from "../components/Footer";

export default function OS() {
  return (
    <>
      <Navbar />

      <Section title="Operating System">
        Decision-making OS connecting individuals, institutions & opportunities.
      </Section>

      <Section title="Data & Marketing">
        Audience insights, segmentation & targeted demand generation.
      </Section>

      <Section title="Sales & Support">
        Lead pipelines, conversions & customer workflows.
      </Section>

      <Section title="HR & Recruitment">
        Hiring, verification, onboarding & workforce lifecycle.
      </Section>

      <Section title="Career Map / Career Choice">
        Personalized pathways for education, skills & outcomes.
      </Section>

      <Section title="Education Index">
        Transparency in training, courses & institutional outcomes.
      </Section>

      <Section title="Work Opportunities">
        Jobs, gigs, internships, projects & micro-work discovery.
      </Section>

      <Footer />
    </>
  );
}
