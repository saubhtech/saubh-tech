"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ================= Background ================= */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/hero-illustration1.png')",
          backgroundPosition: "center",
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
                  className="text-primary"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#network-grid)" />
          </svg>
        </div>
      </div>

      {/* ================= Content ================= */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full text-center">
        {/* ===== COMMUNITY VERIFIED BADGE ===== */}
        <div className="relative mb-12 flex justify-center">
          {/* RED aura (logo inspired – controlled) */}
          <div className="absolute -top-10 h-28 w-[420px] rounded-full bg-[#E84545]/30 blur-3xl opacity-70" />

          <div
            className="
              relative z-10
              inline-flex items-center gap-3
              px-8 py-3.5 rounded-full
              bg-secondary/75 backdrop-blur-md
              ring-1 ring-[#E84545]/50
              shadow-[0_0_40px_rgba(232,69,69,0.45)]
            "
          >
            {/* 🌍 Globe icon */}
            <svg
              className="h-4.5 w-4.5 text-[#E84545]"
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
              Community-Verified
            </span>
          </div>
        </div>

        {/* ===== HEADING ===== */}
        <h1 className="font-bold tracking-tight text-foreground mb-8">
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            Phygital Gig-Work
          </span>
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary mt-2">
            Marketplace
          </span>
        </h1>

        

        {/* ===== CTA ===== */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground px-10 py-7 text-lg font-bold shadow-xl shadow-primary/35 hover:scale-[1.03] transition"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border border-foreground/25 text-foreground px-10 py-7 text-lg font-semibold backdrop-blur-sm hover:bg-foreground/10"
          >
            Learn More
          </Button>
        </div>

        {/* ===== TRUST ===== */}
        <div className="flex flex-wrap justify-center gap-6 mt-16 text-sm text-muted-foreground">
          <span>● Escrow Protected</span>
          <span>● Verified Professionals</span>
          <span>● Pan-India Network</span>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}