"use client";

import Image from "next/image";
import { TrendingUp, Building2, Briefcase, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { value: "6.9x", description: "higher conversion rates from UGC vs traditional ads" },
  { value: "65%", description: "lower customer acquisition costs compared to paid advertising" },
  { value: "82%", description: "more engagement, trust, and conversion through organic leads" },
  { value: "40%", description: "increase in repeat orders due to peer recommendations" },
];

const beneficiaries = [
  {
    icon: Building2,
    title: "For Organisations",
    description:
      "Organisations can build iconic brands, generate organic leads, outsource requirements, and streamline operations to become sector leaders and multiply revenue.",
  },
  {
    icon: Briefcase,
    title: "For Professionals",
    description:
      "Professionals can procure pre-paid demand, bid on assignments, complete work for instant, escrow-protected payments, creating sustainable, multiple sources of income.",
  },
];

export function ProvenResultsSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* ===== Background Image ===== */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/proven-results-bg.png" // <-- apni image yahan rakho
          alt="Professionals celebrating growth and success"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Dark premium overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/85 via-[#0a1628]/80 to-background" />

        {/* Very subtle dots (optional, clean) */}
        <div className="absolute inset-0 opacity-[0.06]">
          <svg className="w-full h-full">
            <defs>
              <pattern id="dots" width="90" height="90" patternUnits="userSpaceOnUse">
                <circle cx="45" cy="45" r="1.2" fill="currentColor" className="text-primary" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border/50 mb-6">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Data-Driven Success
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Proven Results
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real metrics that demonstrate the power of community-driven growth
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-card/60 backdrop-blur-md border-border/50 hover:border-primary/50 transition"
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-3">
                  {stat.value}
                </div>
                <div className="flex items-start gap-2 justify-center">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Beneficiaries */}
        <div className="grid md:grid-cols-2 gap-6">
          {beneficiaries.map((item, index) => (
            <Card
              key={index}
              className="bg-card/60 backdrop-blur-md border-border/50 hover:border-primary/50 transition"
            >
              <CardContent className="p-8 flex gap-4">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
