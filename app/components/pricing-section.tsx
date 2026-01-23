"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "9,999",
    popular: false,
    features: [
      "Access to verified marketplace",
      "Basic profile listing",
      "Standard support",
      "Up to 10 bids per month",
    ],
  },
  {
    name: "Growth",
    price: "9,999",
    popular: true,
    features: [
      "Everything in Basic",
      "Priority profile placement",
      "Unlimited bids",
      "Dedicated account manager",
      "Analytics dashboard",
    ],
  },
  {
    name: "Premium",
    price: "9,999",
    popular: false,
    features: [
      "Everything in Growth",
      "Custom branding tools",
      "API access",
      "White-glove onboarding",
      "SLA guarantees",
    ],
  },
];

export function PricingSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Saubh.Tech – Subscription
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Integrate the Power of People + Intelligence of Technology.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative group bg-card/50 border-border/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "border-primary/50 shadow-xl shadow-primary/10 scale-105 md:scale-110"
                  : "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/30">
                  <Sparkles className="h-3.5 w-3.5" />
                  Most Popular
                </div>
              )}

              <CardContent className="p-8 pt-10">
                {/* Plan Name */}
                <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-medium text-muted-foreground">
                      ₹
                    </span>
                    <span className="text-5xl font-bold text-foreground">
                      {plan.price}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">/ month</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full py-6 font-semibold ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                      : "bg-secondary text-foreground hover:bg-secondary/80 border border-border/50"
                  }`}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
