"use client";

import Image from "next/image";
import { Database, HeadphonesIcon, Users, Compass, Cpu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Database,
    title: "Data & Marketing",
    description:
      "Extract, upload, clean and manage raw data based on tasks and lists. Generate targeted leads into CRM via Email, WhatsApp, SMS/RCM, Calls, Virtual meetings, Social media, and Physical visits.",
  },
  {
    icon: HeadphonesIcon,
    title: "Sales & Support",
    description:
      "Unified communication system to manage leads, set follow-ups, offer deals, generate invoices, and get paid seamlessly.",
  },
  {
    icon: Users,
    title: "HR & Recruitment",
    description:
      "Automate HR based on bespoke requirements. Post requirements, receive direct candidate applications, and hire the best talent.",
  },
  {
    icon: Compass,
    title: "Career Choice",
    description:
      "Comprehensive career exploration system covering ~1500 occupations across ability, interest, skills, industry, technology, traits, pathways, and zones.",
  },
];

export function SaubhOSSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border/50 mb-6">
            <Cpu className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              All-in-One Platform
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            SaubhOS – <span className="text-primary">Saubh Operating System</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            A unified ecosystem powering your entire business operations
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        
      </div>
    </section>
  );
}
