"use client";

import Image from "next/image";
import { BookOpen, Video, Award, GraduationCap, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BookOpen,
    title: "Self-paced learning",
    description: "Learn at your own pace with comprehensive course materials.",
  },
  {
    icon: Video,
    title: "Live trainer-led online classes",
    description: "Interactive online sessions with domain experts.",
  },
  {
    icon: Award,
    title: "Certification to boost credibility",
    description: "Validate knowledge that increases your value.",
  },
];

const programs = [
  "Life Counselling Professional (LCP)",
  "Business Consulting Professional (BCP)",
];

export function LearningSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* ===== Background Image ===== */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/learning.png"
          alt="Professionals learning together in a modern workspace"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />

        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[140px]" />
      </div>

      {/* ===== Content ===== */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border/50 mb-6">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Invest in Your Future
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Learning & <span className="text-primary">Skilling</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Saubh.Tech doesn&apos;t just connect you with opportunities but also
            equips you to excel.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-14">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Card
                key={index}
                className="
                  group
                  bg-card/70 backdrop-blur-md
                  border border-border/50
                  rounded-3xl
                  min-h-[260px]
                  hover:border-primary/60
                  hover:-translate-y-2
                  hover:shadow-2xl hover:shadow-primary/20
                  transition-all duration-300
                  cursor-pointer
                "
              >
                <CardContent className="p-10 text-center">
                  {/* Icon */}
                  <div
                    className="
                      mx-auto w-16 h-16 rounded-2xl
                      bg-primary/15
                      border border-primary/30
                      flex items-center justify-center mb-6
                      shadow-lg shadow-primary/20
                      group-hover:scale-110
                      group-hover:bg-primary/25
                      transition-all duration-300
                    "
                  >
                    <Icon className="h-7 w-7 text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Programs & CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Programs */}
          <div className="flex flex-wrap justify-center gap-4">
            {programs.map((program, index) => (
              <div
                key={index}
                className="
                  px-6 py-3
                  rounded-full
                  bg-primary/20
                  border border-primary/40
                  text-base font-semibold text-primary
                  backdrop-blur-md
                  shadow-lg shadow-primary/25
                  hover:scale-110 hover:bg-primary/30
                  hover:shadow-primary/40
                  transition-all duration-300
                  cursor-pointer
                "
              >
                {program}
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button
            size="lg"
            className="
              bg-primary text-primary-foreground
              px-10 py-7
              text-lg font-bold
              rounded-xl
              shadow-2xl shadow-primary/40
              ring-2 ring-primary/40
              hover:scale-105
              hover:shadow-primary/70
              transition-all duration-300
            "
          >
            View Training Prospectus
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
