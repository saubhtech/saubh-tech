import Navbar from "../components/Navbar";
import Section from "../components/Section";
import Footer from "../components/Footer";

const clusters = [
  "Agriculture, Food & Nutrition",
  "Branding, Marketing & Sales",
  "Computing, Data & Digital Technology",
  "Education, Skilling & Career Development",
  "Finance, Banking & Insurance",
  "Government, Public Sector & Welfare",
  "Healthcare, Wellness & Personal care",
  "HR, Employment & Gig Work",
  "Installation, Repair & Technical Support",
  "Legal, Police & Protection",
  "Manufacturing, Production & Operations",
  "Matchmaking, Relationships & Connections",
  "Media, Entertainment & Sports",
  "Real Estate, Infrastructure & Construction",
  "Transport, Logistics and Storage",
  "Travel, Tourism & Hospitality",
];

export default function GigWork() {
  return (
    <>
      <Navbar />

      <Section
        title="Phygital Gig-Work"
        subtitle="Hybrid marketplace merging digital & physical work clusters."
      >
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {clusters.map((c, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition-colors"
            >
              <h3 className="font-medium text-[15px] leading-tight">
                {c}
              </h3>
            </div>
          ))}
        </div>
      </Section>

      <Footer />
    </>
  );
}
