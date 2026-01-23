"use client";

import React from "react"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Phone, Mail, Send, MessageCircle } from "lucide-react";

export function NewsletterSection() {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Very light background glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Stay <span className="text-primary">Connected</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
              Get the latest updates on gig opportunities, platform features,
              and exclusive insights delivered to your inbox.
            </p>

            {/* Side visual - connected icons */}
            <div className="hidden lg:flex items-center gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/30">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  WhatsApp Updates
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/30">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Email Newsletter
                </span>
              </div>
            </div>
          </div>

          {/* Glassmorphism form container */}
          <div className="w-full max-w-md lg:max-w-lg">
            <div className="relative p-8 rounded-3xl bg-card/30 border border-border/30 backdrop-blur-xl shadow-2xl shadow-primary/5">
              {/* Subtle glow behind form */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl blur-xl -z-10" />

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name field */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="pl-12 h-14 bg-secondary/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20"
                  />
                </div>

                {/* WhatsApp field */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Phone className="h-5 w-5" />
                  </div>
                  <Input
                    type="tel"
                    placeholder="WhatsApp Number"
                    value={formData.whatsapp}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsapp: e.target.value })
                    }
                    className="pl-12 h-14 bg-secondary/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20"
                  />
                </div>

                {/* Email field */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-12 h-14 bg-secondary/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20"
                  />
                </div>

                {/* Subscribe button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold text-base shadow-lg shadow-primary/25"
                >
                  Subscribe
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
