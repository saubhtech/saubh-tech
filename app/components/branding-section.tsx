"use client";

import Image from "next/image";
import { Users, Megaphone, Workflow, TrendingUp, ArrowUpRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    badge: "Aggregation",
    icon: Users,
    title: "User Generated Content (UGC) Hub",
    description:
      "Real users creating authentic content including reviews, testimonials, and videos that resonate with your audience.",
    color: "from-blue-500/20 to-cyan-500/20",
    iconBg: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    stats: "10x Engagement",
    metric: "+350%",
  },
  {
    badge: "Amplification",
    icon: Megaphone,
    title: "Social Media Amplification (SMA) Network",
    description:
      "Multi-channel people-to-people content distribution that multiplies reach, drives engagement, and visibility.",
    color: "from-purple-500/20 to-pink-500/20",
    iconBg: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    stats: "Multi-Channel",
    metric: "5x Reach",
  },
  {
    badge: "Automation",
    icon: Workflow,
    title: "Organic Leads Generation (OLG) Engine",
    description:
      "Embedded widgets, landing pages, and sign-ups delivering pre-qualified leads directly to your CRM sales funnel.",
    color: "from-emerald-500/20 to-green-500/20",
    iconBg: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    stats: "Pre-Qualified",
    metric: "+240%",
  },
];

export function BrandingSection() {
  return (
    <section className="relative pt-0 pb-8 md:pb-16 lg:pb-20 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-float-reverse" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          {/* New: Top badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6 animate-in fade-in slide-in-from-top-3 duration-700">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Social Proof Marketing</span>
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance animate-in fade-in slide-in-from-bottom-4 duration-1000">
            No Business Without a Brand.
            <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 text-primary">No Brand Without Social Proof.</span>
              {/* Animated highlight */}
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 -skew-x-12 animate-in fade-in slide-in-from-left duration-1000 delay-300" />
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty mt-6 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
            Build authentic connections that drive real business growth
          </p>
        </div>

        {/* Enhanced Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative animate-in fade-in slide-in-from-bottom-6"
              style={{
                animationDelay: `${index * 150}ms`,
                animationDuration: '800ms',
              }}
            >
              <Card className="relative bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 h-full overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/60 to-transparent transition-all duration-500" />
                
                {/* Animated corner glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-12 translate-x-12" />

                <CardContent className="relative p-8 text-center">
                  {/* Enhanced Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-6 group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:scale-105 transition-all duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    {feature.badge}
                  </div>

                  {/* Enhanced Icon with animations */}
                  <div className="relative mx-auto mb-6 w-fit">
                    {/* Rotating outer ring */}
                    <div className="absolute inset-0 w-14 h-14 rounded-2xl border-2 border-primary/20 group-hover:scale-125 group-hover:rotate-180 transition-all duration-700" />
                    
                    {/* Pulsing middle ring */}
                    <div className="absolute inset-0 w-14 h-14 rounded-2xl border border-primary/10 animate-pulse-slow" />
                    
                    {/* Icon container */}
                    <div className={`relative mx-auto w-14 h-14 rounded-2xl ${feature.iconBg} border ${feature.borderColor} flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-primary/0 group-hover:shadow-primary/20`}>
                      <feature.icon className="h-7 w-7 text-primary group-hover:scale-125 transition-transform duration-500" />
                    </div>

                    {/* Glow behind icon */}
                    <div className={`absolute inset-0 w-14 h-14 rounded-2xl ${feature.iconBg} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  </div>

                  {/* Stats badge - NEW */}
                  <div className="flex items-center justify-center gap-2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {feature.metric}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-secondary/80 border border-border/50 text-xs font-medium text-muted-foreground">
                      {feature.stats}
                    </div>
                  </div>

                  {/* Enhanced Title */}
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* New: Hover action */}
                  <div className="mt-6 pt-4 border-t border-border/0 group-hover:border-border/50 transition-all duration-500">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary/0 group-hover:text-primary transition-all duration-500">
                      <span>Explore feature</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Bottom shine */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/40 to-transparent transition-all duration-500" />
                </CardContent>

                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-primary/0 group-hover:border-primary/40 transition-all duration-500 rounded-tl" />
                <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-primary/0 group-hover:border-primary/40 transition-all duration-500 rounded-br" />

                {/* Card number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border-2 border-background">
                  {index + 1}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* New: Process Flow Visualization */}
        <div className="mt-16 lg:mt-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-700">
          <div className="relative max-w-5xl mx-auto">
            {/* Flow diagram */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
              {/* Step 1 */}
              <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-card/50 backdrop-blur-sm border border-primary/30 group hover:bg-card/80 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer">
                <Users className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-foreground">Aggregate</span>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center gap-2">
                <div className="w-12 h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                <ArrowUpRight className="w-5 h-5 text-primary animate-bounce-slow" />
              </div>

              {/* Arrow vertical mobile */}
              <div className="md:hidden flex flex-col items-center gap-2">
                <div className="w-0.5 h-8 bg-gradient-to-b from-primary/50 to-primary/20" />
                <ArrowUpRight className="w-5 h-5 text-primary rotate-90 animate-bounce-slow" />
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-card/50 backdrop-blur-sm border border-primary/30 group hover:bg-card/80 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer">
                <Megaphone className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-foreground">Amplify</span>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center gap-2">
                <div className="w-12 h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                <ArrowUpRight className="w-5 h-5 text-primary animate-bounce-slow" />
              </div>

              {/* Arrow vertical mobile */}
              <div className="md:hidden flex flex-col items-center gap-2">
                <div className="w-0.5 h-8 bg-gradient-to-b from-primary/50 to-primary/20" />
                <ArrowUpRight className="w-5 h-5 text-primary rotate-90 animate-bounce-slow" />
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-card/50 backdrop-blur-sm border border-primary/30 group hover:bg-card/80 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer">
                <Workflow className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-foreground">Automate</span>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center gap-2">
                <div className="w-12 h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                <TrendingUp className="w-5 h-5 text-emerald-500 animate-bounce-slow" />
              </div>

              {/* Arrow vertical mobile */}
              <div className="md:hidden flex flex-col items-center gap-2">
                <div className="w-0.5 h-8 bg-gradient-to-b from-primary/50 to-primary/20" />
                <TrendingUp className="w-5 h-5 text-emerald-500 rotate-90 animate-bounce-slow" />
              </div>

              {/* Result */}
              <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-bold text-emerald-500">Growth</span>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-center text-sm text-muted-foreground mt-8 italic">
              A proven framework for authentic brand building
            </p>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(20px, -20px) scale(1.05);
          }
        }
        
        @keyframes float-reverse {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-20px, 20px) scale(1.05);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(4px);
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 10s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}