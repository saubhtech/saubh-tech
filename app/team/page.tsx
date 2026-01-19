import Navbar from "../components/Navbar";
import Section from "../components/Section";
import Footer from "../components/Footer";

export default function Team() {
  return (
    <>
      <Navbar />

      <Section title="Team Support">
        Geo-based coverage for execution & coordination.
      </Section>

      <Section title="Geo">
        Country → State → District → Pin-code structure.
      </Section>

      <Section title="Support & Tickets">
        Escrow, dispute management, and operational trust.
      </Section>

      <Footer />
    </>
  );
}
