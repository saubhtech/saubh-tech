import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const benefits = [
  "Verified professionals with real reviews",
  "Secure payments and dispute resolution",
  "Local community trust networks",
  "Skill-based matching algorithms",
];

export function CommunitySection() {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/community-illustration.jpg"
          alt="Professionals networking and building trust"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Illustration Card */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border/30 shadow-2xl">
              <Image
                src="/community-illustration.jpg"
                alt="Young professionals building community trust"
                fill
                className="object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              
              {/* Stats overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex gap-4">
                <div className="flex-1 bg-card/90 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-xs text-muted-foreground">Active Professionals</div>
                </div>
                <div className="flex-1 bg-card/90 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                  <div className="text-2xl font-bold text-primary">16+</div>
                  <div className="text-xs text-muted-foreground">Industry Sectors</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Join the Trusted <span className="text-primary">Community</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Our phygital approach combines the warmth of local community networks 
              with the efficiency of digital platforms. Every connection is backed 
              by real verification and community trust.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4 mb-10">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold"
            >
              Join the Community
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}