"use client";

import Image from "next/image";
import { Users, Globe, Layers, Zap, ArrowRight } from "lucide-react";

const features = [
  {
    title: "Physical Trust",
    description:
      "Build relationships through personal connections and meet clients face-to-face to establish genuine trust",
    icon: Users,
    color: "from-blue-500/20 to-cyan-500/20",
    iconBg: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    stats: "Face-to-face",
    highlight: "Personal connections",
  },
  {
    title: "Digital Scalability",
    description:
      "Access gig assignments, bid on projects, and scale beyond geographical boundaries using technology",
    icon: Globe,
    color: "from-purple-500/20 to-pink-500/20",
    iconBg: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    stats: "Unlimited reach",
    highlight: "Global access",
  },
  {
    title: "Phygital Synergy",
    description:
      "Work from anywhere, anytime to manage both demand and supply with the perfect blend of physical and digital",
    icon: Layers,
    color: "from-emerald-500/20 to-green-500/20",
    iconBg: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    stats: "Best of both",
    highlight: "Perfect blend",
  },
];

export function PhygitalSection() {
  return (
    <section className="relative pt-0 pb-12 md:pb-16 lg:pb-20 overflow-hidden">
      {/* Enhanced Background with animations */}
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float-slower" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          {/* New: Top badge with animation */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6 animate-in fade-in slide-in-from-top-3 duration-700">
            <Zap className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Revolutionary Approach</span>
            <div className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-primary animate-ping" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 rounded-full bg-primary animate-ping" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 rounded-full bg-primary animate-ping" style={{ animationDelay: '300ms' }} />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance animate-in fade-in slide-in-from-bottom-4 duration-1000">
            The Future is{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">Phygital</span>
              {/* Animated underline */}
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 -skew-x-12 animate-in fade-in slide-in-from-left duration-1000 delay-300" />
            </span>{" "}
            <span className="text-muted-foreground animate-in fade-in duration-1000 delay-500">
              (Physical + Digital)
            </span>
          </h2>

          {/* New: Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-6 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
            Experience the perfect harmony of human touch and digital efficiency
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative animate-in fade-in slide-in-from-bottom-6"
              style={{
                animationDelay: `${index * 150}ms`,
                animationDuration: '800ms',
              }}
            >
              <div className="relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8 h-full hover:border-primary/50 hover:bg-card/90 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/15">
                
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                
                {/* Animated border glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
                
                {/* Top accent line with animation */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/60 to-transparent transition-all duration-500 rounded-t-2xl" />

                {/* Content wrapper */}
                <div className="relative">
                  {/* New: Stats badge */}
                  <div className="absolute -top-4 -right-4 px-3 py-1 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-500 delay-100">
                    {feature.stats}
                  </div>

                  {/* Enhanced Icon with multiple animation layers */}
                  <div className="relative mb-6">
                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 w-16 h-16 rounded-2xl border-2 border-primary/20 group-hover:scale-125 group-hover:rotate-180 transition-all duration-700 ease-out" />
                    
                    {/* Middle pulsing ring */}
                    <div className="absolute inset-0 w-16 h-16 rounded-2xl border border-primary/10 group-hover:scale-150 transition-all duration-500 delay-75 animate-pulse-slow" />
                    
                    {/* Icon container */}
                    <div className={`relative w-16 h-16 rounded-2xl ${feature.iconBg} border ${feature.borderColor} flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-primary/0 group-hover:shadow-primary/20`}>
                      <feature.icon className="w-8 h-8 text-primary group-hover:scale-125 transition-all duration-500" />
                    </div>

                    {/* Glow effect behind icon */}
                    <div className={`absolute inset-0 w-16 h-16 rounded-2xl ${feature.iconBg} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  </div>

                  {/* Title with letter spacing animation */}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary group-hover:tracking-wide transition-all duration-300">
                    {feature.title}
                  </h3>

                  {/* New: Highlight tag */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/50 border border-border/50 text-xs font-medium text-muted-foreground mb-4 group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary transition-all duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    {feature.highlight}
                  </div>

                  {/* Description with line height animation */}
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* New: Hover action indicator */}
                  <div className="mt-6 pt-4 border-t border-border/0 group-hover:border-border/50 transition-all duration-500">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary/0 group-hover:text-primary transition-all duration-500 group-hover:translate-x-1">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Bottom shine effect */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/40 to-transparent transition-all duration-500" />
                </div>

                {/* Corner accents */}
                <div className="absolute top-3 right-3 w-2 h-2 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/40 transition-colors duration-500 rounded-tr" />
                <div className="absolute bottom-3 left-3 w-2 h-2 border-b-2 border-l-2 border-primary/0 group-hover:border-primary/40 transition-colors duration-500 rounded-bl" />

                {/* Enhanced glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl scale-110" />
              </div>

              {/* Card number indicator */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border-2 border-background">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* New: Bottom visual connector */}
        <div className="mt-16 lg:mt-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-700">
          <div className="relative max-w-4xl mx-auto">
            {/* Connection visualization */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-card/40 backdrop-blur-sm border border-primary/30 group hover:bg-card/60 hover:border-primary/50 transition-all duration-300 cursor-pointer">
                <Users className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-foreground">Physical</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                <Layers className="w-6 h-6 text-primary animate-pulse" />
                <div className="w-8 h-0.5 bg-gradient-to-r from-primary/20 to-primary/50" />
              </div>
              
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-card/40 backdrop-blur-sm border border-primary/30 group hover:bg-card/60 hover:border-primary/50 transition-all duration-300 cursor-pointer">
                <Globe className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-foreground">Digital</span>
              </div>
            </div>

            {/* Bottom tagline */}
            <p className="text-center text-sm text-muted-foreground mt-6 italic">
              Where human connection meets technological innovation
            </p>
          </div>
        </div>
      </div>

      {/* Add these animations to your global CSS or component styles */}
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

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}