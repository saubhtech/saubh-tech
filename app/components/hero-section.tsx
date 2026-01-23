import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div
  className="absolute inset-0 z-0 bg-no-repeat bg-cover"
  style={{
    backgroundImage: "url('/hero-bg.png')",
    backgroundPosition: "35% center",
  }}
>
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/80 via-[#0a1628]/75 to-background" />

  {/* Very subtle network dots */}
  <div className="absolute inset-0 opacity-[0.08]">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="network-grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="40" cy="40" r="1.2" fill="currentColor" className="text-primary" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#network-grid)" />
    </svg>
  </div>
</div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-28 w-full text-center">
        {/* Community-Verified Marketplace Badge */}
        {/* Community-Verified Marketplace Badge */}
{/* Community-Verified Marketplace – HERO EMPHASIS */}
<div className="relative mb-14 flex justify-center">
  {/* halo beam */}
  <div className="absolute -top-6 h-24 w-[420px] rounded-full bg-primary/20 blur-3xl opacity-70" />

  {/* badge */}
  <div
    className="
      relative z-10
      inline-flex items-center gap-3
      px-8 py-3.5 rounded-full

      bg-gradient-to-r from-primary via-primary/90 to-primary
      text-primary-foreground

      shadow-[0_0_40px_rgba(16,185,129,0.45)]
      ring-2 ring-primary/50

      animate-in fade-in slide-in-from-top-6 duration-700
    "
  >
    {/* shimmer overlay */}
    <span
      className="
        absolute inset-0 rounded-full
        bg-gradient-to-r
        from-transparent via-white/25 to-transparent
        opacity-40
        animate-[shimmer_2.8s_linear_infinite]
      "
    />

    <ShieldCheck className="relative h-5 w-5 text-white" />

    <span className="relative text-sm font-bold tracking-widest uppercase">
      Community-Verified Marketplace
    </span>
  </div>
</div>




        {/* Headline */}
        <h1 className="font-bold tracking-tight text-foreground mb-8">
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            Phygital Gig-Work
          </span>
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary mt-2">
            Marketplace
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Connect with trusted, verified professionals across India’s fastest-growing
          sectors — blending <span className="text-foreground font-medium">physical trust</span>{" "}
          with <span className="text-foreground font-medium">digital scalability</span>.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-7 text-lg font-bold shadow-lg shadow-primary/30"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border border-foreground/30 text-foreground hover:bg-foreground/10 px-10 py-7 text-lg font-semibold backdrop-blur-sm"
          >
            Learn More
          </Button>
        </div>

        {/* Trust Indicators */}
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
