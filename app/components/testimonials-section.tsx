"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Play, Users } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Business Associate",
    location: "Mumbai",
    quote:
      "Saubh.Tech transformed how I work. The escrow system gives me peace of mind, and the community support is incredible.",
  },
  {
    name: "Rahul Verma",
    role: "Content Creator",
    location: "Delhi",
    quote:
      "Being part of this phygital marketplace has opened doors I never knew existed. My income has grown 3x in 6 months.",
  },
  {
    name: "Ananya Reddy",
    role: "Digital Marketer",
    location: "Bangalore",
    quote:
      "The verified client network means I only work with serious businesses. No more chasing payments or dealing with unreliable clients.",
  },
];

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += 0.5;
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with side illustration */}
        <div className="flex items-center justify-between mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Community <span className="text-primary">Voice</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Real stories from Associates and clients.
            </p>
          </div>

          {/* Side illustration - people sharing */}
          <div className="hidden lg:flex items-center gap-2 p-4 rounded-2xl bg-card/30 border border-border/30 backdrop-blur-sm">
            <div className="flex -space-x-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 border-2 border-background flex items-center justify-center"
                >
                  <Users className="h-4 w-4 text-primary" />
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              500+ sharing experiences
            </span>
          </div>
        </div>

        {/* Auto-scrolling testimonial carousel */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-6 overflow-hidden"
        >
          {/* Duplicate testimonials for infinite scroll effect */}
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <Card
              key={index}
              className="flex-shrink-0 w-[350px] sm:w-[400px] bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <CardContent className="p-6">
                {/* 5-star rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-primary text-primary"
                    />
                  ))}
                </div>

                {/* Video thumbnail placeholder */}
                <div className="relative aspect-video rounded-xl bg-secondary/50 border border-border/30 mb-4 overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <Play className="h-6 w-6 text-primary fill-primary" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-background/80 text-xs text-muted-foreground">
                    2:34
                  </div>
                </div>

                {/* Quote */}
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Name and role */}
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} &bull; {testimonial.location}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
