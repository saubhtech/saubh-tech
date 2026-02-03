"use client";

import Image from "next/image";
import { TrendingUp, Building2, Briefcase, CheckCircle2, Sparkles, ArrowUpRight, Users, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { 
    value: "6.9x", 
    description: "higher conversion rates from UGC vs traditional ads",
    color: "from-blue-500/20 to-cyan-500/20",
    iconBg: "bg-blue-500/10",
  },
  { 
    value: "65%", 
    description: "lower customer acquisition costs compared to paid advertising",
    color: "from-emerald-500/20 to-green-500/20",
    iconBg: "bg-emerald-500/10",
  },
  { 
    value: "82%", 
    description: "more engagement, trust, and conversion through organic leads",
    color: "from-purple-500/20 to-pink-500/20",
    iconBg: "bg-purple-500/10",
  },
  { 
    value: "40%", 
    description: "increase in repeat orders due to peer recommendations",
    color: "from-amber-500/20 to-orange-500/20",
    iconBg: "bg-amber-500/10",
  },
];

const beneficiaries = [
  {
    icon: Building2,
    title: "For Organisations",
    description:
      "Organisations can build iconic brands, generate organic leads, outsource requirements, and streamline operations to become sector leaders and multiply revenue.",
    color: "from-blue-500/20 to-cyan-500/20",
    iconBg: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    benefits: ["Build iconic brands", "Generate organic leads", "Streamline operations"],
  },
  {
    icon: Briefcase,
    title: "For Professionals",
    description:
      "Professionals can procure pre-paid demand, bid on assignments, complete work for instant, escrow-protected payments, creating sustainable, multiple sources of income.",
    color: "from-purple-500/20 to-pink-500/20",
    iconBg: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    benefits: ["Procure pre-paid work", "Instant payments", "Multiple income streams"],
  },
];

export function ProvenResultsSection() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* ================= Enhanced Background ================= */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/proven-results-bg.png"
          alt="Professionals celebrating growth and success"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Primary dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/75 via-[#0a1628]/70 to-background/95" />

        {/* Enhanced center light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%)]" />

        {/* Vignette for depth */}
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.6)]" />

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float-slower" />

        {/* Enhanced dots pattern */}
        <div className="absolute inset-0 opacity-[0.06]">
          <svg className="w-full h-full">
            <defs>
              <pattern id="dots" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle
                  cx="50"
                  cy="50"
                  r="1.3"
                  fill="currentColor"
                  className="text-primary"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* Subtle grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* ================= Content ================= */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-16 lg:mb-20">
          {/* Enhanced badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/70 border border-border/50 mb-6 backdrop-blur-sm hover:bg-secondary/90 hover:border-primary/30 transition-all duration-300 group cursor-pointer animate-in fade-in slide-in-from-top-3 duration-700">
            <TrendingUp className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold text-foreground">
              Data-Driven Success
            </span>
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative inline-block">
              Proven Results
              {/* Animated underline */}
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-in fade-in slide-in-from-left duration-1000 delay-300" />
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
            Real metrics that demonstrate the power of community-driven growth
          </p>
        </div>

        {/* ================= Enhanced Stats ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-16 lg:mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative animate-in fade-in slide-in-from-bottom-6"
              style={{
                animationDelay: `${index * 100}ms`,
                animationDuration: '800ms',
              }}
            >
              <Card className="relative bg-card/70 backdrop-blur-md border border-border/50 rounded-2xl hover:-translate-y-2 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/25 transition-all duration-500 overflow-hidden h-full">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Top glow */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/60 to-transparent transition-all duration-500" />

                {/* Animated corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-10 translate-x-10" />

                <CardContent className="relative p-7 text-center">
                  {/* Enhanced value with animation */}
                  <div className="relative mb-3">
                    {/* Glow behind number */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl md:text-5xl font-bold text-primary/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {stat.value}
                      </div>
                    </div>
                    
                    <div className="relative text-4xl md:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-500">
                      {stat.value}
                    </div>
                  </div>

                  {/* Enhanced description */}
                  <div className="flex items-start gap-2 justify-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                      {stat.description}
                    </p>
                  </div>

                  {/* Bottom shine */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/40 to-transparent transition-all duration-500" />
                </CardContent>

                {/* Number badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-xs font-bold shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-background">
                  {index + 1}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* ================= Enhanced Beneficiaries ================= */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {beneficiaries.map((item, index) => (
            <div
              key={index}
              className="group relative animate-in fade-in slide-in-from-bottom-6"
              style={{
                animationDelay: `${400 + index * 150}ms`,
                animationDuration: '800ms',
              }}
            >
              <Card className="relative bg-card/70 backdrop-blur-md border border-border/50 rounded-2xl hover:-translate-y-2 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/25 transition-all duration-500 overflow-hidden h-full">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/60 to-transparent transition-all duration-500" />

                <CardContent className="relative p-8 flex gap-5">
                  {/* Enhanced icon container */}
                  <div className="relative flex-shrink-0">
                    {/* Rotating ring */}
                    <div className="absolute inset-0 p-4 rounded-xl border-2 border-primary/20 group-hover:scale-125 group-hover:rotate-180 transition-all duration-700" />
                    
                    {/* Icon container */}
                    <div className="relative p-4 rounded-xl bg-primary/15 border border-primary/25 shadow-lg group-hover:bg-primary/25 group-hover:border-primary/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <item.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    {/* Glow effect */}
                    <div className="absolute inset-0 p-4 rounded-xl bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                      {item.title}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed mb-4 group-hover:text-foreground/80 transition-colors duration-300">
                      {item.description}
                    </p>

                    {/* New: Key benefits list */}
                    <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      <div className="h-px bg-gradient-to-r from-border/50 to-transparent mb-3" />
                      {item.benefits.map((benefit, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                          style={{
                            transitionDelay: `${idx * 50}ms`,
                          }}
                        >
                          <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>

                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-primary/0 group-hover:border-primary/40 transition-all duration-500 rounded-tl" />
                <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-primary/0 group-hover:border-primary/40 transition-all duration-500 rounded-br" />

                {/* Bottom shine */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/40 to-transparent transition-all duration-500" />
              </Card>
            </div>
          ))}
        </div>

        {/* ================= EXPANDED Trust Indicators ================= */}
        <div className="mt-16 lg:mt-24 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-700">
          {/* Optional section title */}
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
              Trusted by Millions
            </h3>
            <p className="text-sm text-muted-foreground">
              Join a community that&apos;s transforming the gig economy
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Trust Badge 1 - Expanded */}
            <div className="group relative">
              <div className="relative bg-card/50 backdrop-blur-sm border border-border/40 rounded-2xl p-8 hover:bg-card/70 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/0 group-hover:via-blue-500/60 to-transparent transition-all duration-500" />

                {/* Content */}
                <div className="relative text-center">
                  {/* Icon with animation */}
                  <div className="relative mx-auto mb-6 w-fit">
                    <div className="absolute inset-0 w-16 h-16 rounded-2xl border-2 border-blue-500/20 group-hover:scale-125 group-hover:rotate-180 transition-all duration-700" />
                    <div className="relative w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <Users className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Stats */}
                  <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2 group-hover:scale-110 transition-transform duration-500">
                    13M+
                  </div>
                  <div className="text-lg font-semibold text-foreground mb-1 group-hover:text-blue-500 transition-colors duration-300">
                    Users
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active Community
                  </div>
                </div>

                {/* Bottom shine */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500/0 group-hover:via-blue-500/40 to-transparent transition-all duration-500" />
              </div>
            </div>

            {/* Trust Badge 2 - Expanded */}
            <div className="group relative">
              <div className="relative bg-card/50 backdrop-blur-sm border border-border/40 rounded-2xl p-8 hover:bg-card/70 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/0 group-hover:via-emerald-500/60 to-transparent transition-all duration-500" />

                {/* Content */}
                <div className="relative text-center">
                  {/* Icon with animation */}
                  <div className="relative mx-auto mb-6 w-fit">
                    <div className="absolute inset-0 w-16 h-16 rounded-2xl border-2 border-emerald-500/20 group-hover:scale-125 group-hover:rotate-180 transition-all duration-700" />
                    <div className="relative w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <Target className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-emerald-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Stats */}
                  <div className="text-4xl md:text-5xl font-bold text-emerald-500 mb-2 group-hover:scale-110 transition-transform duration-500">
                    6.9x
                  </div>
                  <div className="text-lg font-semibold text-foreground mb-1 group-hover:text-emerald-500 transition-colors duration-300">
                    Proven ROI
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Data-Backed Results
                  </div>
                </div>

                {/* Bottom shine */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/0 group-hover:via-emerald-500/40 to-transparent transition-all duration-500" />
              </div>
            </div>

            {/* Trust Badge 3 - Expanded */}
            <div className="group relative">
              <div className="relative bg-card/50 backdrop-blur-sm border border-border/40 rounded-2xl p-8 hover:bg-card/70 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/0 group-hover:via-purple-500/60 to-transparent transition-all duration-500" />

                {/* Content */}
                <div className="relative text-center">
                  {/* Icon with animation */}
                  <div className="relative mx-auto mb-6 w-fit">
                    <div className="absolute inset-0 w-16 h-16 rounded-2xl border-2 border-purple-500/20 group-hover:scale-125 group-hover:rotate-180 transition-all duration-700" />
                    <div className="relative w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:border-purple-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <Sparkles className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Stats */}
                  <div className="text-4xl md:text-5xl font-bold text-purple-500 mb-2 group-hover:scale-110 transition-transform duration-500">
                    #1
                  </div>
                  <div className="text-lg font-semibold text-foreground mb-1 group-hover:text-purple-500 transition-colors duration-300">
                    Industry Leader
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Trusted Platform
                  </div>
                </div>

                {/* Bottom shine */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-500/0 group-hover:via-purple-500/40 to-transparent transition-all duration-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -30px) scale(1.1);
          }
        }
        
        @keyframes float-slower {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-30px, 30px) scale(1.1);
          }
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        
        .animate-float-slower {
          animation: float-slower 12s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}