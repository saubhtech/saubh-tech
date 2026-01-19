import Navbar from "../components/Navbar";
import Section from "../components/Section";
import Footer from "../components/Footer";

export default function Branding() {
  const items = [
    {
      title: "UGC — User Generated Content",
      desc: "Real stories, testimonials & social validation.",
    },
    {
      title: "SMA — Social Media Amplification",
      desc: "Boost distribution & conversions through verified reach.",
    },
  ];

  return (
    <>
      <Navbar />

      <Section
        title="Branding & Leads"
        subtitle="Visibility & trust powered by authentic community reach."
      >
        <div className="grid gap-4 mt-6">

          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06] transition-colors"
            >
              <h3 className="font-medium text-lg">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}

        </div>
      </Section>

      <Footer />
    </>
  );
}
