"use client";

import { Briefcase, User, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const providerBenefits = [
  "List offerings across multiple sectors and territories",
  "Procure prepaid demand and bid on assignments",
  "Complete work and receive instant, escrow-guaranteed payments",
  "Build reach, reputation, and recurring revenue",
];

const clientBenefits = [
  "Call or chat with verified providers instantly",
  "Post assignments to securely outsource work",
  "Compare bids and hire at competitive rates",
  "Pay safely with escrow protection",
];

export function TrustSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/trust-illustration.jpg')",
          backgroundPosition: "50% center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-background/85" />

        {/* Subtle glow */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Real People. Real Work.{" "}
            <span className="text-primary">Real Trust.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with verified professionals and clients in a secure,
            transparent marketplace
          </p>
        </div>

        {/* Two Column Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Providers */}
          <Card className="bg-card/60 backdrop-blur-md border-border/40 hover:border-primary/30 transition">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
                  <Briefcase className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Verified Providers
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {providerBenefits.map((benefit, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Clients */}
          <Card className="bg-card/60 backdrop-blur-md border-border/40 hover:border-primary/30 transition">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Verified Clients
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {clientBenefits.map((benefit, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
