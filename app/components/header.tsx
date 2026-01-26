"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, PuzzleIcon, Sparkles, PuzzleIcon as Puzzle2, GraduationCap, Headset } from "lucide-react";

const navItems = [
  { label: "Gig-Work", href: "#gig-work", icon: PuzzleIcon, color: "#00f7ff" },
  { label: "Branding", href: "#branding", icon: Sparkles, color: "#ff00ff" },
  { label: "SaubhOS", href: "#saubhos", icon: Puzzle2, color: "#00ff9d" },
  { label: "Academy", href: "#academy", icon: GraduationCap, color: "#ffb800" },
  { label: "Support", href: "#support", icon: Headset, color: "#ff2e63" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* ===== Logo ===== */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/Saubh-Good.png"
            alt="Saubh.Tech Logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold text-foreground">
              Saubh
            </span>
            <span className="text-xl font-bold text-primary">
              .Tech
            </span>
          </div>
        </Link>

        {/* ===== Desktop Navigation ===== */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
              >
                <IconComponent 
                  className={`${item.label === "Academy" ? "h-5 w-5" : "h-4 w-4"} transition-all duration-300 group-hover:drop-shadow-[0_0_8px_var(--icon-glow)]`}
                  style={{ '--icon-glow': item.color } as React.CSSProperties}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ===== CTA ===== */}
        <div className="flex items-center gap-4">
          <Button
            asChild
            className="hidden md:inline-flex bg-[#ef4444] hover:bg-[#dc2626] text-white"
          >
            <Link href="/login">Login</Link>
          </Button>

          {/* ===== Mobile Menu Button ===== */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* ===== Mobile Navigation ===== */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container flex flex-col gap-4 p-4">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <IconComponent 
                    className={`${item.label === "Academy" ? "h-5 w-5" : "h-4 w-4"}`}
                    style={{ color: item.color }}
                  />
                  {item.label}
                </Link>
              );
            })}
            <Button
              asChild
              className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white"
            >
              <Link href="/login">Login</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}