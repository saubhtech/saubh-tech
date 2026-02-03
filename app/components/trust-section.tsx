"use client";

import { useState, useEffect, useRef } from "react";
import { Briefcase, User, Check, Shield, Zap, Award, Clock, DollarSign, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const providerBenefits = [
  {
    text: "List offerings across multiple sectors and territories",
    icon: Target,
    color: "#4FA34D"
  },
  {
    text: "Procure prepaid demand and bid on assignments",
    icon: Zap,
    color: "#4FA34D"
  },
  {
    text: "Complete work and receive instant, escrow-guaranteed payments",
    icon: DollarSign,
    color: "#4FA34D"
  },
  {
    text: "Build reach, reputation, and recurring revenue",
    icon: Award,
    color: "#4FA34D"
  },
];

const clientBenefits = [
  {
    text: "Call or chat with verified providers instantly",
    icon: Clock,
    color: "#4FA34D"
  },
  {
    text: "Post assignments to securely outsource work",
    icon: Shield,
    color: "#4FA34D"
  },
  {
    text: "Compare bids and hire at competitive rates",
    icon: Target,
    color: "#4FA34D"
  },
  {
    text: "Pay safely with escrow protection",
    icon: DollarSign,
    color: "#4FA34D"
  },
];

export function TrustSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProvider, setHoveredProvider] = useState<number | null>(null);
  const [hoveredClient, setHoveredClient] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState<'provider' | 'client' | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
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

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-60" />

        {/* Subtle glow - animated */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[250px] bg-primary/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: "1s" }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="trust-grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-foreground"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#trust-grid)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/50 mb-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer group">
            <Shield className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-sm font-medium text-foreground">Trust & Safety First</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
            Real People. Real Work.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-[#E84545] to-primary">
              Real Trust.
            </span>
          </h2>
          <p 
            className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-1000 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Connect with verified professionals and clients in a secure,
            transparent marketplace
          </p>

          {/* Decorative line */}
          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mx-auto" />
        </div>

        {/* Two Column Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Providers Card */}
          <Card 
            onMouseEnter={() => setActiveCard('provider')}
            onMouseLeave={() => setActiveCard(null)}
            className={`group relative bg-card/60 backdrop-blur-md border-border/40 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 overflow-hidden ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            {/* Animated background gradient */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl bg-gradient-to-br from-primary/10 to-transparent" />

            <CardHeader className="relative z-10">
              <div className="flex items-center gap-4">
                {/* Icon container */}
                <div className="relative w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Briefcase className="h-7 w-7 text-primary" />
                  {/* Icon glow */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div>
                  <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground group-hover:from-primary group-hover:to-foreground transition-all duration-300">
                    Verified Providers
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {providerBenefits.length} key benefits
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10">
              <ul className="space-y-4">
                {providerBenefits.map((benefit, i) => {
                  const IconComponent = benefit.icon;
                  const isHovered = hoveredProvider === i;

                  return (
                    <li
                      key={i}
                      onMouseEnter={() => setHoveredProvider(i)}
                      onMouseLeave={() => setHoveredProvider(null)}
                      className={`group/item flex gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-secondary/50 hover:scale-[1.02] cursor-pointer ${
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                      }`}
                      style={{ 
                        transitionDelay: `${600 + i * 100}ms`,
                        borderLeft: isHovered ? `3px solid ${benefit.color}` : '3px solid transparent',
                      }}
                    >
                      {/* Icon container */}
                      <div 
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-secondary group-hover/item:scale-110 transition-all duration-300 group-hover/item:rotate-12"
                        style={{
                          backgroundColor: isHovered ? `${benefit.color}20` : undefined,
                        }}
                      >
                        <IconComponent 
                          className="h-4 w-4 transition-colors duration-300"
                          style={{ color: isHovered ? benefit.color : undefined }}
                        />
                      </div>

                      {/* Check icon */}
                      <div 
                        className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300"
                        style={{
                          backgroundColor: isHovered ? `${benefit.color}30` : undefined,
                        }}
                      >
                        <Check 
                          className="h-4 w-4 transition-colors duration-300"
                          style={{ color: isHovered ? benefit.color : undefined }}
                        />
                      </div>

                      {/* Text */}
                      <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-300 flex-1">
                        {benefit.text}
                      </span>

                      {/* Hover shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-700 rounded-lg" />
                    </li>
                  );
                })}
              </ul>

              {/* Card footer stats */}
              <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>5K+ Active Providers</span>
                </div>
                <div className="text-primary font-semibold group-hover:scale-105 transition-transform duration-300">
                  Join Now →
                </div>
              </div>
            </CardContent>

            {/* Card number indicator */}
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              01
            </div>
          </Card>

          {/* Clients Card */}
          <Card 
            onMouseEnter={() => setActiveCard('client')}
            onMouseLeave={() => setActiveCard(null)}
            className={`group relative bg-card/60 backdrop-blur-md border-border/40 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 overflow-hidden ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            {/* Animated background gradient */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl bg-gradient-to-br from-primary/10 to-transparent" />

            <CardHeader className="relative z-10">
              <div className="flex items-center gap-4">
                {/* Icon container */}
                <div className="relative w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <User className="h-7 w-7 text-primary" />
                  {/* Icon glow */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div>
                  <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground group-hover:from-primary group-hover:to-foreground transition-all duration-300">
                    Verified Clients
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {clientBenefits.length} key benefits
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10">
              <ul className="space-y-4">
                {clientBenefits.map((benefit, i) => {
                  const IconComponent = benefit.icon;
                  const isHovered = hoveredClient === i;

                  return (
                    <li
                      key={i}
                      onMouseEnter={() => setHoveredClient(i)}
                      onMouseLeave={() => setHoveredClient(null)}
                      className={`group/item flex gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-secondary/50 hover:scale-[1.02] cursor-pointer ${
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                      }`}
                      style={{ 
                        transitionDelay: `${600 + i * 100}ms`,
                        borderLeft: isHovered ? `3px solid ${benefit.color}` : '3px solid transparent',
                      }}
                    >
                      {/* Icon container */}
                      <div 
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-secondary group-hover/item:scale-110 transition-all duration-300 group-hover/item:rotate-12"
                        style={{
                          backgroundColor: isHovered ? `${benefit.color}20` : undefined,
                        }}
                      >
                        <IconComponent 
                          className="h-4 w-4 transition-colors duration-300"
                          style={{ color: isHovered ? benefit.color : undefined }}
                        />
                      </div>

                      {/* Check icon */}
                      <div 
                        className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300"
                        style={{
                          backgroundColor: isHovered ? `${benefit.color}30` : undefined,
                        }}
                      >
                        <Check 
                          className="h-4 w-4 text-primary transition-colors duration-300"
                          style={{ color: isHovered ? benefit.color : undefined }}
                        />
                      </div>

                      {/* Text */}
                      <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-300 flex-1">
                        {benefit.text}
                      </span>

                      {/* Hover shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-700 rounded-lg" />
                    </li>
                  );
                })}
              </ul>

              {/* Card footer stats */}
              <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>10K+ Active Clients</span>
                </div>
                <div className="text-primary font-semibold group-hover:scale-105 transition-transform duration-300">
                  Get Started →
                </div>
              </div>
            </CardContent>

            {/* Card number indicator */}
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              02
            </div>
          </Card>
        </div>

        {/* Bottom trust badges */}
        <div 
          className={`mt-16 flex flex-wrap justify-center gap-8 items-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          {[
            { icon: Shield, text: "Secure Escrow" },
            { icon: Award, text: "Verified Profiles" },
            { icon: Zap, text: "Instant Matching" },
          ].map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <div
                key={index}
                className="group flex items-center gap-3 px-6 py-3 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/30 hover:border-primary/50 hover:bg-secondary transition-all duration-300 cursor-pointer hover:scale-105"
              >
                <IconComponent 
                  className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-12"
                />
                <span className="text-sm font-medium text-foreground">{badge.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}