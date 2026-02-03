"use client";
import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Header shadow on scroll
      setScrolled(currentScrollY > 10);
      
      // Hide/show header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);

      // Active section detection
      const sections = navItems.map(item => item.href.substring(1));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
    }
    
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled 
          ? "bg-background/80 backdrop-blur-lg shadow-lg shadow-primary/5" 
          : "bg-background/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur"
      } ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className={`container flex items-center justify-between px-4 transition-all duration-300 ${
        scrolled ? "h-14" : "h-16"
      }`}>
        {/* ===== Logo ===== */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <Image
              src="/Saubh-Good.png"
              alt="Saubh.Tech Logo"
              width={40}
              height={40}
              className={`transition-all duration-300 ${
                scrolled ? "h-8 w-8" : "h-10 w-10"
              } group-hover:scale-110 group-hover:rotate-12`}
            />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex items-center gap-1">
            <span className={`font-bold text-foreground transition-all duration-300 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text ${
              scrolled ? "text-lg" : "text-xl"
            }`}>
              Saubh
            </span>
            <span className={`font-bold transition-all duration-300 bg-gradient-to-r from-primary via-primary to-[#ef4444] bg-clip-text text-transparent ${
              scrolled ? "text-lg" : "text-xl"
            }`}>
              .Tech
            </span>
          </div>
        </Link>

        {/* ===== Desktop Navigation ===== */}
        <nav className="hidden md:flex md:items-center md:gap-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.href;
            
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`group relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                  isActive 
                    ? "text-primary" 
                    : "text-foreground/70 hover:text-primary"
                }`}
              >
                {/* Hover background effect */}
                <div 
                  className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                    isActive ? "opacity-10" : ""
                  }`}
                  style={{ 
                    backgroundColor: item.color,
                    boxShadow: `0 0 20px ${item.color}40`
                  }}
                />
                
                {/* Icon with glow */}
                <div className="relative">
                  <IconComponent 
                    className={`${item.label === "Academy" ? "h-5 w-5" : "h-4 w-4"} transition-all duration-300 relative z-10 ${
                      isActive ? "scale-110" : "group-hover:scale-110 group-hover:-rotate-12"
                    }`}
                    style={{ 
                      color: isActive ? item.color : undefined,
                      filter: isActive ? `drop-shadow(0 0 8px ${item.color})` : undefined
                    }}
                  />
                  <div 
                    className={`absolute inset-0 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300 ${
                      isActive ? "opacity-40" : ""
                    }`}
                    style={{ backgroundColor: item.color }}
                  />
                </div>
                
                <span className="relative z-10">{item.label}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                )}
                
                {/* Hover underline */}
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-8 rounded-full transition-all duration-300"
                  style={{ backgroundColor: item.color }}
                />
              </a>
            );
          })}
        </nav>

        {/* ===== CTA ===== */}
        <div className="flex items-center gap-4">
          <Button
            asChild
            className="hidden md:inline-flex bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-white shadow-lg shadow-[#ef4444]/20 hover:shadow-xl hover:shadow-[#ef4444]/30 transition-all duration-300 hover:scale-105 relative overflow-hidden group"
          >
            <Link href="/login">
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Link>
          </Button>

          {/* ===== Mobile Menu Button ===== */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-primary/10 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative">
              {mobileMenuOpen ? (
                <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-300" />
              )}
            </div>
          </Button>
        </div>
      </div>

      {/* ===== Mobile Navigation ===== */}
      <div 
        className={`md:hidden border-t overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Backdrop overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 top-16 bg-background/60 backdrop-blur-sm -z-10"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        
        <nav className="container flex flex-col gap-2 p-4 bg-background/95">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.href;
            
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 relative overflow-hidden group ${
                  isActive ? "bg-primary/10" : "hover:bg-primary/5"
                }`}
                style={{
                  animation: mobileMenuOpen ? `slideIn 0.3s ease-out ${index * 0.1}s both` : undefined
                }}
              >
                {/* Background glow on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ 
                    background: `radial-gradient(circle at left, ${item.color}15, transparent)` 
                  }}
                />
                
                <IconComponent 
                  className={`${item.label === "Academy" ? "h-5 w-5" : "h-4 w-4"} relative z-10 transition-all duration-300 group-hover:scale-110`}
                  style={{ 
                    color: isActive ? item.color : undefined,
                    filter: isActive ? `drop-shadow(0 0 6px ${item.color})` : undefined
                  }}
                />
                <span className={`relative z-10 ${isActive ? "text-primary" : ""}`}>
                  {item.label}
                </span>
                
                {isActive && (
                  <div 
                    className="ml-auto h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                )}
              </a>
            );
          })}
          
          <Button
            asChild
            className="w-full mt-2 bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-white shadow-lg shadow-[#ef4444]/20 hover:shadow-xl hover:shadow-[#ef4444]/30 transition-all duration-300 relative overflow-hidden group"
          >
            <Link href="/login">
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Link>
          </Button>
        </nav>
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  );
}