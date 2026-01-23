"use client";

import { Users, IndianRupee, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    icon: Users,
    value: "13M+",
    label: "Gig Workers",
    description: "Active professionals across India",
  },
  {
    icon: IndianRupee,
    value: "₹1.85T",
    label: "Gig Market",
    description: "Total market valuation",
  },
  {
    icon: TrendingUp,
    value: "₹24K Cr",
    label: "UGC + SMA",
    description: "User-generated content economy",
  },
  {
    icon: Clock,
    value: "24×7",
    label: "Phygital Availability",
    description: "Round-the-clock access",
  },
];

export function GigEconomySection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 text-balance">
            India&apos;s Booming Gig Economy:{" "}
            <span className="text-primary">Unprecedented Opportunities</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the revolution transforming how India works
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="group relative bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <CardContent className="p-6 text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                
                {/* Value */}
                <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2 tracking-tight">
                  {stat.value}
                </div>
                
                {/* Label */}
                <div className="text-lg font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                
                {/* Description */}
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Supporting Line */}
        <div className="text-center">
          <p className="text-xl md:text-2xl font-medium text-muted-foreground italic">
            &ldquo;Gig-work empowers you to work{" "}
            <span className="text-primary font-semibold">locally</span> and scale{" "}
            <span className="text-primary font-semibold">globally</span>.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
