"use client";

import Image from "next/image";
import { Users, Globe, Layers } from "lucide-react";

const features = [
  {
    title: "Physical Trust",
    description:
      "Build relationships through personal connections and meet clients face-to-face to establish genuine trust",
    icon: Users,
  },
  {
    title: "Digital Scalability",
    description:
      "Access gig assignments, bid on projects, and scale beyond geographical boundaries using technology",
    icon: Globe,
  },
  {
    title: "Phygital Synergy",
    description:
      "Work from anywhere, anytime to manage both demand and supply with the perfect blend of physical and digital",
    icon: Layers,
  },
];

export function PhygitalSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            The Future is{" "}
            <span className="text-primary">Phygital</span>{" "}
            <span className="text-muted-foreground">(Physical + Digital)</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:border-primary/50 hover:bg-card/90 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Subtle glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
