"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Users, Shield, TrendingUp, Award, Sparkles } from "lucide-react";

const benefits = [
  { 
    text: "Verified professionals with real reviews",
    icon: Shield,
    color: "#4FA34D"
  },
  { 
    text: "Secure payments and dispute resolution",
    icon: Award,
    color: "#3b82f6"
  },
  { 
    text: "Local community trust networks",
    icon: Users,
    color: "#E84545"
  },
  { 
    text: "Skill-based matching algorithms",
    icon: TrendingUp,
    color: "#f59e0b"
  },
];

export function CommunitySection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [sectorCount, setSectorCount] = useState(0);
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null);
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

  // Counter animation
  useEffect(() => {
    if (isVisible) {
      // Active Professionals counter (0 to 50)
      const activeInterval = setInterval(() => {
        setActiveCount((prev) => {
          if (prev >= 50) {
            clearInterval(activeInterval);
            return 50;
          }
          return prev + 2;
        });
      }, 30);

      // Industry Sectors counter (0 to 16)
      const sectorInterval = setInterval(() => {
        setSectorCount((prev) => {
          if (prev >= 16) {
            clearInterval(sectorInterval);
            return 16;
          }
          return prev + 1;
        });
      }, 80);

      return () => {
        clearInterval(activeInterval);
        clearInterval(sectorInterval);
      };
    }
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 overflow-hidden">
      {/* Background with parallax effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/community-illustration.jpg"
          alt="Professionals networking and building trust"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-[#E84545]/5 opacity-60" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="community-grid"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="25" cy="25" r="1" fill="currentColor" className="text-foreground" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#community-grid)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Illustration Card */}
          <div 
            className={`relative order-2 lg:order-1 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-border/30 shadow-2xl hover:shadow-[0_20px_80px_rgba(79,163,77,0.15)] transition-all duration-500 hover:scale-[1.02]">
              <Image
                src="/community-illustration.jpg"
                alt="Young professionals building community trust"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                boxShadow: "inset 0 0 60px rgba(79,163,77,0.2)"
              }} />
              
              {/* Stats overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex gap-4">
                {/* Active Professionals Card */}
                <div className="group/stat flex-1 bg-card/90 backdrop-blur-md rounded-xl p-4 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 cursor-default">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-primary" />
                    <div className="text-2xl font-bold text-primary group-hover/stat:scale-110 transition-transform duration-300">
                      {activeCount}K+
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Active Professionals</div>
                  
                  {/* Progress indicator */}
                  <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-[#E84545] transition-all duration-1000 ease-out"
                      style={{ width: `${(activeCount / 50) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Industry Sectors Card */}
                <div className="group/stat flex-1 bg-card/90 backdrop-blur-md rounded-xl p-4 border border-border/50 hover:border-[#E84545]/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#E84545]/20 cursor-default">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-[#E84545]" />
                    <div className="text-2xl font-bold text-[#E84545] group-hover/stat:scale-110 transition-transform duration-300">
                      {sectorCount}+
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Industry Sectors</div>
                  
                  {/* Progress indicator */}
                  <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#E84545] to-primary transition-all duration-1000 ease-out"
                      style={{ width: `${(sectorCount / 16) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute top-6 right-6 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-pulse">
                ⭐ Trusted Community
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 top-8 left-8 w-full h-full rounded-3xl bg-gradient-to-br from-primary/20 to-[#E84545]/20 blur-2xl opacity-50" />
          </div>

          {/* Right - Content */}
          <div 
            className={`order-1 lg:order-2 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/50 mb-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer group"
            >
              <Sparkles className="h-4 w-4 text-primary group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-sm font-medium text-foreground">Community Powered</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Join the Trusted{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-[#E84545] to-primary">
                Community
              </span>
            </h2>

            {/* Description */}
            <p 
              className={`text-lg text-muted-foreground mb-8 text-pretty leading-relaxed transition-all duration-1000 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              Our phygital approach combines the warmth of local community networks 
              with the efficiency of digital platforms. Every connection is backed 
              by real verification and community trust.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4 mb-10">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                const isHovered = hoveredBenefit === index;
                
                return (
                  <li
                    key={benefit.text}
                    onMouseEnter={() => setHoveredBenefit(index)}
                    onMouseLeave={() => setHoveredBenefit(null)}
                    className={`group/item flex items-center gap-4 p-4 rounded-xl transition-all duration-500 hover:bg-secondary/50 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${
                      isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                    }`}
                    style={{ 
                      transitionDelay: `${600 + index * 100}ms`,
                      borderLeft: isHovered ? `3px solid ${benefit.color}` : '3px solid transparent',
                    }}
                  >
                    {/* Icon container */}
                    <div 
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-secondary group-hover/item:scale-110 transition-all duration-300 group-hover/item:rotate-12"
                      style={{
                        backgroundColor: isHovered ? `${benefit.color}20` : undefined,
                      }}
                    >
                      <IconComponent 
                        className="h-5 w-5 transition-colors duration-300"
                        style={{ color: isHovered ? benefit.color : undefined }}
                      />
                    </div>

                    {/* Text */}
                    <span className="text-foreground font-medium flex-1 group-hover/item:text-primary transition-colors duration-300">
                      {benefit.text}
                    </span>

                    {/* Check icon */}
                    <CheckCircle2 
                      className="h-5 w-5 flex-shrink-0 transition-all duration-300 group-hover/item:scale-110"
                      style={{ 
                        color: isHovered ? benefit.color : 'currentColor',
                        opacity: isHovered ? 1 : 0.5,
                      }}
                    />

                    {/* Hover shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-700 rounded-xl" />
                  </li>
                );
              })}
            </ul>

            {/* CTA Button */}
            <div 
              className={`transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "1000ms" }}
            >
              <Button
                size="lg"
                className="group relative bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary hover:to-primary px-8 py-6 text-base font-semibold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.05] transition-all duration-300 overflow-hidden"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <span className="relative z-10 flex items-center">
                  Join the Community
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>

                {/* Glow pulse */}
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
              </Button>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-[#E84545] border-2 border-background flex items-center justify-center text-white text-xs font-bold"
                      >
                        {i}K
                      </div>
                    ))}
                  </div>
                  <span>Joined today</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-primary">★★★★★</span>
                  <span>4.9/5 rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}