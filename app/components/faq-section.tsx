"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  { id: "marketplace", label: "Verified Marketplace" },
  { id: "business", label: "For Businesses" },
  { id: "payments", label: "Payments & Escrow" },
];

const faqs = {
  marketplace: [
    {
      question: "What is Saubh.Tech?",
      answer:
        "Saubh.Tech is India's first community-verified phygital gig-work marketplace that connects trusted professionals with organizations across 16+ sectors. We combine physical trust networks with digital scalability to create meaningful, verified connections.",
    },
    {
      question: "How does Saubh.Tech work?",
      answer:
        "Professionals sign up and get verified through our community trust network. Organizations post requirements, and verified professionals can bid on assignments. Work is completed with escrow-protected payments, ensuring security for both parties.",
    },
    {
      question: "What does 'Phygital' mean in Saubh.Tech's model?",
      answer:
        "Phygital combines 'Physical' and 'Digital'. It means we leverage real-world community trust and verification while providing digital tools for scalability, payments, and operations.",
    },
  ],
  business: [
    {
      question: "Is Saubh.Tech available across India?",
      answer:
        "Yes! Saubh.Tech operates pan-India with verified professionals available in all major cities and emerging markets.",
    },
    {
      question: "What makes Saubh.Tech different from other Gig platforms?",
      answer:
        "Saubh.Tech focuses on community-verified trust, escrow-protected payments, and a phygital approach.",
    },
  ],
  payments: [
    {
      question: "How are payments protected?",
      answer:
        "All payments are escrow-protected. Clients fund escrow before work begins and payments are released only after approval.",
    },
    {
      question: "What payment methods are supported?",
      answer:
        "UPI, Net Banking, Credit/Debit Cards, and Wallets are supported securely.",
    },
  ],
};

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof faqs>(
    "marketplace"
  );

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* ===== Background Image ===== */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/faq-illustration.png"
          alt="Young professionals in open discussion"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background" />

        {/* Soft ambient glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[140px]" />
      </div>

      {/* ===== Content ===== */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about Saubh.Tech
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {faqCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setActiveCategory(cat.id as keyof typeof faqs)
              }
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="bg-card/40 border border-border/50 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs[activeCategory].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border/30 rounded-xl px-6 bg-secondary/20"
              >
                <AccordionTrigger className="text-left text-base font-medium py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}