"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Fade in animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ================= Background ================= */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-no-repeat transition-transform duration-300 ease-out"
        style={{
          backgroundImage: "url('/hero-illustration1.png')",
          backgroundPosition: "center",
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px) scale(1.05)`,
        }}
      >
        {/* DARK overlay – premium feel maintained */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060c18]/70 via-[#0a1628]/65 to-background/95" />

        {/* soft mid glow – image khulti hai, light nahi hoti */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_65%)]" />

        {/* corner vignette – depth */}
        <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.55)]" />

        {/* minimal network dots */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="network-grid"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="1.3"
                  fill="currentColor"
                  className="text-primary animate-pulse"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#network-grid)" />
          </svg>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary/20 blur-sm"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatParticle ${Math.random() * 10 + 10}s ease-in-out ${Math.random() * 5}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Spotlight effect */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 600px at ${50 + mousePosition.x}% ${50 + mousePosition.y}%, rgba(79,163,77,0.15), transparent)`,
          }}
        />
      </div>

      {/* ================= Content ================= */}
      <div 
        className={`relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full pt-20 sm:pt-24 md:pt-28 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* ===== BADGES ROW ===== */}
        <div className="relative mb-12 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          {/* LEFT: COMMUNITY VERIFIED BADGE */}
          <div 
            className={`relative group transition-all duration-800 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            {/* RED aura (logo inspired – controlled) */}
            <div className="absolute -top-10 h-28 w-[420px] rounded-full bg-[#E84545]/30 blur-3xl opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
            
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full bg-[#E84545]/20 animate-ping" />

            <div
              className="
                relative z-10
                inline-flex items-center gap-3
                px-8 py-3.5 rounded-full
                bg-secondary/75 backdrop-blur-md
                ring-1 ring-[#E84545]/50
                shadow-[0_0_40px_rgba(232,69,69,0.45)]
                hover:shadow-[0_0_50px_rgba(232,69,69,0.6)]
                hover:scale-105
                transition-all duration-300
                cursor-pointer
              "
            >
              {/* 🌍 Globe icon with rotation */}
              <svg
                className="h-4.5 w-4.5 text-[#E84545] group-hover:rotate-180 transition-transform duration-700"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
                  10-4.48 10-10S17.52 2 12 2zm6.93 6h-2.02
                  a15.53 15.53 0 00-1.01-2.54A8.03 8.03 0 0118.93 8zM12 4
                  c.69.83 1.41 2.07 1.88 4H10.1c.49-1.93 1.21-3.17 1.9-4zM4.26 14
                  a7.9 7.9 0 010-4h2.16a17.8 17.8 0 000 4H4.26zm.81 2h2.02
                  a15.53 15.53 0 001.01 2.54A8.03 8.03 0 015.07 16zM6.42 8H4.4
                  a8.03 8.03 0 013.01-2.54A15.53 15.53 0 006.42 8zM12 20
                  c-.69-.83-1.41-2.07-1.88-4h3.78c-.49 1.93-1.21 3.17-1.9 4zm2.45-6H9.55
                  a15.9 15.9 0 010-4h4.9a15.9 15.9 0 010 4zm.13 4
                  a15.53 15.53 0 001.01-2.54h2.02a8.03 8.03 0 01-3.03 2.54zM17.58 14
                  a17.8 17.8 0 000-4h2.16a7.9 7.9 0 010 4h-2.16z"
                />
              </svg>

              {/* TEXT */}
              <span
                className="
                  text-sm font-extrabold tracking-[0.18em] uppercase
                  text-[#E84545]
                  drop-shadow-[0_0_10px_rgba(232,69,69,0.85)]
                "
              >
                Community Verified
              </span>

              {/* Sparkle effect */}
              <Sparkles className="h-3.5 w-3.5 text-[#E84545] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
            </div>
          </div>

          {/* RIGHT: ESCROW PROTECTED BADGE */}
          <div 
            className={`relative group transition-all duration-800 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            {/* GREEN aura (escrow = trust = green) */}
            <div className="absolute -top-10 -right-10 h-28 w-[380px] rounded-full bg-primary/30 blur-3xl opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
            
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDelay: "500ms" }} />

            <div
              className="
                relative z-10
                inline-flex items-center gap-3
                px-8 py-3.5 rounded-full
                bg-secondary/75 backdrop-blur-md
                ring-1 ring-primary/50
                shadow-[0_0_40px_rgba(79,163,77,0.45)]
                hover:shadow-[0_0_50px_rgba(79,163,77,0.6)]
                hover:scale-105
                transition-all duration-300
                cursor-pointer
              "
            >
              {/* 🛡️ Shield Check icon with bounce */}
              <ShieldCheck className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />

              {/* TEXT */}
              <span
                className="
                  text-sm font-extrabold tracking-[0.18em] uppercase
                  text-primary
                  drop-shadow-[0_0_10px_rgba(79,163,77,0.85)]
                "
              >
                Escrow Protected
              </span>

              {/* Shield pulse effect */}
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* ===== HEADING ===== */}
        <div 
          className={`mb-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <h1 className="font-bold tracking-tight text-foreground text-center">
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              Phygital Gig-Work
            </span>
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl mt-2 relative inline-block">
              {/* Animated gradient text */}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-[#E84545] to-primary">
                Marketplace
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p 
            className={`text-center mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-1000 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            Connect with verified professionals across India for seamless gig work experiences
          </p>
        </div>

        {/* ===== CTA ===== */}
        <div 
          className={`flex flex-col sm:flex-row justify-center gap-4 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          <Button
            size="lg"
            className="group relative bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-10 py-7 text-lg font-bold shadow-xl shadow-primary/35 hover:shadow-2xl hover:shadow-primary/50 hover:scale-[1.03] transition-all duration-300 overflow-hidden"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <span className="relative z-10 flex items-center">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>

            {/* Glow pulse */}
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="group relative border-2 border-foreground/25 text-foreground px-10 py-7 text-lg font-semibold backdrop-blur-sm hover:bg-foreground/10 hover:border-foreground/40 hover:scale-[1.03] transition-all duration-300 overflow-hidden"
          >
            {/* Border glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-[#E84545]/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            
            <span className="relative z-10 flex items-center">
              Learn More
              <TrendingUp className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            </span>
          </Button>
        </div>

        {/* ===== TRUST INDICATORS ===== */}
        <div 
          className={`flex flex-wrap justify-center gap-6 mt-16 text-sm text-muted-foreground transition-all duration-1000 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "1100ms" }}
        >
          {[
            { icon: "●", text: "Verified Professionals", color: "text-[#4FA34D]" },
            { icon: "●", text: "Pan-India Network", color: "text-[#E84545]" },
            { icon: "●", text: "24/7 Support", color: "text-[#4FA34D]" },
          ].map((item, index) => (
            <span 
              key={index}
              className="flex items-center gap-2 hover:text-foreground transition-colors duration-300 cursor-default group"
            >
              <span className={`animate-pulse group-hover:scale-150 transition-transform duration-300 ${item.color}`}>
                {item.icon}
              </span>
              {item.text}
            </span>
          ))}
        </div>

        {/* Stats counter */}
        <div 
          className={`grid grid-cols-3 gap-8 mt-12 max-w-3xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "1200ms" }}
        >
          {[
            { value: "10K+", label: "Active Gigs" },
            { value: "5K+", label: "Professionals" },
            { value: "98%", label: "Satisfaction" },
          ].map((stat, index) => (
            <div 
              key={index}
              className="text-center group cursor-default"
            >
              <div className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#E84545] group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1 group-hover:text-foreground transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />

      {/* Global styles for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes floatParticle {
            0%, 100% {
              transform: translateY(0) translateX(0);
            }
            25% {
              transform: translateY(-20px) translateX(10px);
            }
            50% {
              transform: translateY(-40px) translateX(-10px);
            }
            75% {
              transform: translateY(-20px) translateX(10px);
            }
          }
        `
      }} />
    </section>
  );
}