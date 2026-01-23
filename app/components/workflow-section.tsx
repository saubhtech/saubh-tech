"use client";

import {
  UserCheck,
  FileSearch,
  Gavel,
  CheckCircle,
  Wallet,
} from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Sign Up, Get Verified",
    description: "Create account and complete identity verification",
    icon: UserCheck,
  },
  {
    number: 2,
    title: "Procure Demand",
    description:
      "Connect with businesses to list pre-paid service and product needs",
    icon: FileSearch,
  },
  {
    number: 3,
    title: "Bid on Assignments",
    description: "Browse opportunities and bid based on skills and interests",
    icon: Gavel,
  },
  {
    number: 4,
    title: "Complete & Deliver",
    description: "Fulfil requirements and ensure client satisfaction",
    icon: CheckCircle,
  },
  {
    number: 5,
    title: "Get Paid Instantly",
    description: "Receive payments securely through escrow account",
    icon: Wallet,
  },
];

export function WorkflowSection() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/workflow-illustration1.png')",
          backgroundPosition: "50% center",
        }}
      >
        {/* Dark readability overlay */}
        <div className="absolute inset-0 bg-background/90" />

        {/* Soft ambient glow */}
        <div className="absolute top-1/4 left-1/3 w-[520px] h-[320px] bg-primary/10 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Work from anywhere, anytime, with{" "}
            <span className="text-primary">guaranteed escrow payment</span>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl p-6 hover:border-primary/40 hover:bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
            >
              {/* Step Number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md shadow-primary/30">
                {step.number}
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-secondary/80 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <step.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Connector (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border/50 group-hover:bg-primary/40 transition-colors" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
