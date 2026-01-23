import Image from "next/image";
import { Shield, Users, Zap, Globe2 } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Community Verified",
    description:
      "Every professional is vetted through our trusted community network, ensuring quality and reliability.",
  },
  {
    icon: Users,
    title: "Local Connections",
    description:
      "Connect with verified professionals in your area who understand local needs and context.",
  },
  {
    icon: Zap,
    title: "Instant Matching",
    description:
      "Our smart algorithms match you with the right professionals within minutes, not days.",
  },
  {
    icon: Globe2,
    title: "Pan-India Reach",
    description:
      "Access a growing network of trusted gig workers across all major cities and towns.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Illustration */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/features-illustration.jpg"
          alt="Gig workers connecting digitally"
          fill
          className="object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Why Choose <span className="text-primary">Saubh.Tech</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            The future of work is phygital — physical trust meets digital efficiency
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
