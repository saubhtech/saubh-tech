"use client";

import Image from "next/image";
import { Database, HeadphonesIcon, Users, Compass, Cpu, Sparkles, ArrowUpRight, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Database,
    title: "Data & Marketing",
    description:
      "Extract, upload, clean and manage raw data based on tasks and lists. Generate targeted leads into CRM via Email, WhatsApp, SMS/RCM, Calls, Virtual meetings, Social media, and Physical visits.",
    color: "from-blue-500/20 to-cyan-500/20",
    iconBg: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    highlight: "Lead Generation",
  },
  {
    icon: HeadphonesIcon,
    title: "Sales & Support",
    description:
      "Unified communication system to manage leads, set follow-ups, offer deals, generate invoices, and get paid seamlessly.",
    color: "from-emerald-500/20 to-green-500/20",
    iconBg: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    highlight: "Unified System",
  },
  {
    icon: Users,
    title: "HR & Recruitment",
    description:
      "Automate HR based on bespoke requirements. Post requirements, receive direct candidate applications, and hire the best talent.",
    color: "from-purple-500/20 to-pink-500/20",
    iconBg: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    highlight: "Talent Acquisition",
  },
  {
    icon: Compass,
    title: "Career Choice",
    description:
      "Comprehensive career exploration system covering ~1500 occupations across ability, interest, skills, industry, technology, traits, pathways, and zones.",
    color: "from-amber-500/20 to-orange-500/20",
    iconBg: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    highlight: "1500+ Careers",
  },
];

export function SaubhOSSection() {
  return (
    <section className="relative pt-0 pb-12 md:pb-16 lg:pb-20 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-float-reverse" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          {/* Enhanced badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border/50 mb-6 backdrop-blur-sm hover:bg-secondary/90 hover:border-primary/30 transition-all duration-300 group cursor-pointer animate-in fade-in slide-in-from-top-3 duration-700">
            <Cpu className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-foreground">
              All-in-One Platform
            </span>
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance animate-in fade-in slide-in-from-bottom-4 duration-1000">
            SaubhOS –{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">Saubh Operating System</span>
              {/* Animated underline */}
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 -skew-x-12 animate-in fade-in slide-in-from-left duration-1000 delay-300" />
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty mt-6 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
            A unified ecosystem powering your entire business operations
          </p>
        </div>

        {/* Enhanced Feature Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative animate-in fade-in slide-in-from-bottom-6"
              style={{
                animationDelay: `${index * 150}ms`,
                animationDuration: '800ms',
              }}
            >
              <Card className="relative bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/60 to-transparent transition-all duration-500" />
                
                {/* Animated corner glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-12 translate-x-12" />

                <CardContent className="relative p-8">
                  <div className="flex items-start gap-4">
                    {/* Enhanced icon container */}
                    <div className="relative shrink-0">
                      {/* Rotating ring */}
                      <div className="absolute inset-0 p-3 rounded-xl border-2 border-primary/20 group-hover:scale-125 group-hover:rotate-180 transition-all duration-700" />
                      
                      {/* Pulsing ring */}
                      <div className="absolute inset-0 p-3 rounded-xl border border-primary/10 animate-pulse-slow" />
                      
                      {/* Icon container */}
                      <div className={`relative p-3 rounded-xl ${feature.iconBg} border ${feature.borderColor} group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-primary/0 group-hover:shadow-primary/20`}>
                        <feature.icon className="h-6 w-6 text-primary group-hover:scale-125 transition-transform duration-500" />
                      </div>

                      {/* Glow behind icon */}
                      <div className={`absolute inset-0 p-3 rounded-xl ${feature.iconBg} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {/* Title with arrow */}
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                        {feature.title}
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                      </h3>

                      {/* Highlight badge */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/50 border border-border/50 text-xs font-medium text-muted-foreground mb-3 group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary transition-all duration-300">
                        <Zap className="w-3 h-3" />
                        {feature.highlight}
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom shine */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/40 to-transparent transition-all duration-500" />
                </CardContent>

                {/* Corner accents */}
                <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/40 transition-all duration-500 rounded-tr" />
                <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-primary/0 group-hover:border-primary/40 transition-all duration-500 rounded-bl" />

                {/* Card number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border-2 border-background">
                  {index + 1}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* New: Platform Features Overview */}
        <div className="mt-16 lg:mt-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-700">
          <div className="relative max-w-5xl mx-auto">
            {/* Integration banner */}
            <div className="relative bg-gradient-to-r from-card/60 via-card/40 to-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-8 md:p-10 overflow-hidden group hover:border-primary/40 transition-all duration-500">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:32px_32px]" />

              {/* Content */}
              <div className="relative text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Seamless Integration</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Everything You Need in One Place
                </h3>
                
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                  SaubhOS seamlessly integrates all your business operations into a single, powerful platform. No more juggling between multiple tools and systems.
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm font-medium text-foreground hover:bg-secondary/80 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                    CRM Integration
                  </div>
                  <div className="px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm font-medium text-foreground hover:bg-secondary/80 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                    Workflow Automation
                  </div>
                  <div className="px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm font-medium text-foreground hover:bg-secondary/80 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                    Real-time Analytics
                  </div>
                  <div className="px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm font-medium text-foreground hover:bg-secondary/80 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                    Cloud Storage
                  </div>
                  <div className="px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm font-medium text-foreground hover:bg-secondary/80 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                    AI-Powered Insights
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
              <div className="absolute top-8 right-8 w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-4 left-12 w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
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
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 10s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}