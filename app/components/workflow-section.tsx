"use client";

import {
  UserCheck,
  FileSearch,
  Gavel,
  CheckCircle,
  Wallet,
  ArrowRight,
  Sparkles,
  Shield,
} from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Sign Up, Get Verified",
    description: "Create account and complete identity verification",
    icon: UserCheck,
    color: "from-blue-500/20 to-cyan-500/20",
    iconBg: "bg-blue-500/10",
    time: "2 mins",
  },
  {
    number: 2,
    title: "Procure Demand",
    description:
      "Connect with businesses to list pre-paid service and product needs",
    icon: FileSearch,
    color: "from-violet-500/20 to-purple-500/20",
    iconBg: "bg-violet-500/10",
    time: "Instant",
  },
  {
    number: 3,
    title: "Bid on Assignments",
    description: "Browse opportunities and bid based on skills and interests",
    icon: Gavel,
    color: "from-amber-500/20 to-orange-500/20",
    iconBg: "bg-amber-500/10",
    time: "24/7",
  },
  {
    number: 4,
    title: "Complete & Deliver",
    description: "Fulfil requirements and ensure client satisfaction",
    icon: CheckCircle,
    color: "from-emerald-500/20 to-green-500/20",
    iconBg: "bg-emerald-500/10",
    time: "Your pace",
  },
  {
    number: 5,
    title: "Get Paid Instantly",
    description: "Receive payments securely through escrow account",
    icon: Wallet,
    color: "from-pink-500/20 to-rose-500/20",
    iconBg: "bg-pink-500/10",
    time: "Instant",
  },
];

export function WorkflowSection() {
  return (
    <section className="relative py-28 md:py-36 lg:py-40 overflow-hidden">
      {/* Enhanced Background */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/workflow-illustration1.png')",
          backgroundPosition: "50% center",
        }}
      >
        {/* Gradient overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />

        {/* Multiple ambient glows for depth */}
        <div className="absolute top-1/4 left-1/3 w-[520px] h-[320px] bg-primary/10 rounded-full blur-[160px] animate-pulse" 
             style={{ animationDuration: '5s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-[420px] h-[280px] bg-primary/5 rounded-full blur-[140px]" />
        
        {/* Animated particles effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          {/* New: Top badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6 animate-in fade-in slide-in-from-top-3 duration-700">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Secure & Transparent Process</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Work from anywhere, anytime
            <br />
            <span className="relative inline-block text-primary mt-2">
              guaranteed escrow payment
              {/* Underline decoration */}
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </span>
          </h2>
          
          {/* New: Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-6 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
            Follow these simple steps to start earning with complete payment protection
          </p>
        </div>

        {/* Enhanced Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 relative">
          {/* Connecting line (desktop) - NEW */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 mx-12">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-border/20 via-border/60 to-border/20" />
              {/* Animated flow indicator */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-flow" />
            </div>
          </div>

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative animate-in fade-in slide-in-from-bottom-6"
              style={{
                animationDelay: `${index * 100}ms`,
                animationDuration: '800ms',
              }}
            >
              <div className="relative bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl p-6 h-full hover:border-primary/40 hover:bg-card/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10">
                
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                
                {/* Top glow effect */}
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/50 to-transparent transition-all duration-500" />

                {/* Content wrapper */}
                <div className="relative">
                  {/* Enhanced Step Number */}
                  <div className="absolute -top-9 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border-2 border-background">
                    {step.number}
                  </div>

                  {/* New: Time badge */}
                  <div className="absolute -top-9 -right-3 px-2.5 py-1 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/50 text-xs font-medium text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30 transition-all duration-500">
                    {step.time}
                  </div>

                  {/* Enhanced Icon */}
                  <div className="relative mb-4 mt-2">
                    {/* Icon glow ring */}
                    <div className={`absolute inset-0 w-14 h-14 rounded-xl ${step.iconBg} blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className={`relative w-14 h-14 rounded-xl ${step.iconBg} border border-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <step.icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* New: Progress indicator on hover */}
                  <div className="mt-4 pt-4 border-t border-border/0 group-hover:border-border/50 transition-all duration-500">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/0 group-hover:text-primary transition-all duration-500">
                      <Sparkles className="w-3 h-3" />
                      <span className="font-medium">Step {step.number} of {steps.length}</span>
                    </div>
                  </div>

                  {/* Bottom shine effect */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/30 to-transparent transition-all duration-500" />
                </div>

                {/* Enhanced Connector Arrow (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-20 -right-2 items-center justify-center z-20">
                    <div className="w-8 h-8 rounded-full bg-background border-2 border-border/40 flex items-center justify-center group-hover:border-primary/60 group-hover:bg-primary/10 group-hover:scale-125 transition-all duration-500">
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-500" />
                    </div>
                  </div>
                )}

                {/* Mobile connector (vertical) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                    <div className="w-8 h-8 rounded-full bg-background border-2 border-border/40 flex items-center justify-center group-hover:border-primary/60 group-hover:bg-primary/10 transition-all duration-300">
                      <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* New: Bottom CTA or Trust Indicators */}
        <div className="mt-16 lg:mt-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            {/* Trust badge 1 */}
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-card/40 backdrop-blur-sm border border-border/40 hover:border-primary/30 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <Shield className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">100% Secure</div>
                <div className="text-xs text-muted-foreground">Escrow Protected</div>
              </div>
            </div>

            {/* Trust badge 2 */}
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-card/40 backdrop-blur-sm border border-border/40 hover:border-primary/30 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <CheckCircle className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">Verified Jobs</div>
                <div className="text-xs text-muted-foreground">Pre-paid Only</div>
              </div>
            </div>

            {/* Trust badge 3 */}
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-card/40 backdrop-blur-sm border border-border/40 hover:border-primary/30 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                <Wallet className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">Instant Payout</div>
                <div className="text-xs text-muted-foreground">No Delays</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add this to your global CSS or component styles */}
      <style jsx>{`
        @keyframes flow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-flow {
          animation: flow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}