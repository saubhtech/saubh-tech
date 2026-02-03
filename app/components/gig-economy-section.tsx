"use client";

import { Users, IndianRupee, TrendingUp, Clock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    icon: Users,
    value: "13M+",
    label: "Gig Workers",
    description: "Active professionals across India",
    trend: "+23%",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: IndianRupee,
    value: "₹1.85T",
    label: "Gig Market",
    description: "Total market valuation",
    trend: "+18%",
    color: "from-emerald-500/20 to-green-500/20",
  },
  {
    icon: TrendingUp,
    value: "₹24K Cr",
    label: "UGC + SMA",
    description: "User-generated content economy",
    trend: "+31%",
    color: "from-violet-500/20 to-purple-500/20",
  },
  {
    icon: Clock,
    value: "24×7",
    label: "Phygital Availability",
    description: "Round-the-clock access",
    trend: "∞",
    color: "from-amber-500/20 to-orange-500/20",
  },
];

export function GigEconomySection() {
  return (
    <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Enhanced gradient background with animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      {/* Multiple decorative glows for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '4s' }} />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />

      {/* Animated grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header with badge */}
        <div className="text-center mb-12 lg:mb-16">
          {/* New: Floating badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Live Market Data</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4 text-balance animate-in fade-in slide-in-from-bottom-4 duration-1000">
            India&apos;s Booming Gig Economy:{" "}
            <span className="text-primary bg-clip-text">Unprecedented Opportunities</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
            Join the revolution transforming how India works
          </p>
        </div>

        {/* Enhanced Stats Grid with stagger animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="group relative bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-6"
              style={{
                animationDelay: `${index * 150}ms`,
                animationDuration: '800ms',
              }}
            >
              {/* New: Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`} />
              
              {/* New: Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-lg" />

              <CardContent className="relative p-6 text-center">
                {/* Enhanced Icon with animated ring */}
                <div className="relative inline-flex items-center justify-center mb-4">
                  {/* Animated ring */}
                  <div className="absolute inset-0 w-14 h-14 rounded-2xl border-2 border-primary/20 group-hover:scale-125 group-hover:border-primary/40 transition-all duration-500" />
                  <div className="absolute inset-0 w-14 h-14 rounded-2xl border border-primary/10 group-hover:scale-150 group-hover:border-primary/20 transition-all duration-700 delay-75" />
                  
                  <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <stat.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
                
                {/* Value with counter animation effect */}
                <div className="relative">
                  <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2 tracking-tight group-hover:scale-105 transition-transform duration-500">
                    {stat.value}
                  </div>
                  
                  {/* New: Trend indicator */}
                  <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-0 translate-x-2">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-500">{stat.trend}</span>
                  </div>
                </div>
                
                {/* Label */}
                <div className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                  {stat.label}
                </div>
                
                {/* Description with enhanced spacing */}
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {stat.description}
                </div>

                {/* New: Bottom shine effect */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Supporting Section with decorative elements */}
        <div className="relative text-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500">
          {/* Decorative quotes */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl text-primary/10 font-serif">"</div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Background card for quote */}
            <div className="relative px-8 py-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
              <p className="text-xl md:text-2xl lg:text-3xl font-medium text-muted-foreground">
                Gig-work empowers you to work{" "}
                <span className="relative inline-block text-primary font-semibold">
                  locally
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
                </span>{" "}
                and scale{" "}
                <span className="relative inline-block text-primary font-semibold">
                  globally
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
                </span>
              </p>

              {/* New: Attribution or data source */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground/60">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-muted-foreground/30" />
                <span>Powered by real-time market insights</span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-muted-foreground/30" />
              </div>
            </div>
          </div>
        </div>

        {/* New: Optional CTA section */}
        <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-700">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 cursor-pointer group">
            <span className="text-sm font-medium text-foreground">Explore opportunities in your area</span>
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
              <svg className="w-3 h-3 text-primary group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}