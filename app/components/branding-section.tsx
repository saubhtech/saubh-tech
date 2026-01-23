"use client";

import Image from "next/image";
import { Users, Megaphone, Workflow } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    badge: "Aggregation",
    icon: Users,
    title: "User Generated Content (UGC) Hub",
    description:
      "Real users creating authentic content including reviews, testimonials, and videos that resonate with your audience.",
  },
  {
    badge: "Amplification",
    icon: Megaphone,
    title: "Social Media Amplification (SMA) Network",
    description:
      "Multi-channel people-to-people content distribution that multiplies reach, drives engagement, and visibility.",
  },
  {
    badge: "Automation",
    icon: Workflow,
    title: "Organic Leads Generation (OLG) Engine",
    description:
      "Embedded widgets, landing pages, and sign-ups delivering pre-qualified leads directly to your CRM sales funnel.",
  },
];

export function BrandingSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            No Business Without a Brand.
            <br />
            <span className="text-primary">No Brand Without Social Proof.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Build authentic connections that drive real business growth
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-8 text-center">
                {/* Badge */}
                <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-6">
                  {feature.badge}
                </div>

                {/* Icon */}
                <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
