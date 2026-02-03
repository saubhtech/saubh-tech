"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Sparkles, TrendingUp, ChevronRight } from "lucide-react";

const categories = [
  { icon: "🌾", label: "Agriculture, Food & Nutrition", color: "#22c55e" },
  { icon: "📢", label: "Branding, Marketing & Sales", color: "#f59e0b" },
  { icon: "💻", label: "Computing, Data & Digital Technology", color: "#3b82f6" },
  { icon: "🎓", label: "Education, Skilling & Career", color: "#8b5cf6" },
  { icon: "💰", label: "Finance, Banking & Insurance", color: "#10b981" },
  { icon: "🏛️", label: "Government, Public Sector & Welfare", color: "#6366f1" },
  { icon: "🩺", label: "Health, Wellness & Personal Care", color: "#ec4899" },
  { icon: "👥", label: "HR, Employment & Gig-Work", color: "#f97316" },
  { icon: "🛠️", label: "Installation, Repair & Tech Support", color: "#14b8a6" },
  { icon: "⚖️", label: "Legal, Police & Protection", color: "#64748b" },
  { icon: "🏭", label: "Manufacturing, Procurement & Production", color: "#84cc16" },
  { icon: "❤️", label: "Matchmaking, Relationships & Guidance", color: "#ef4444" },
  { icon: "🎬", label: "Media, Entertainment & Sports", color: "#a855f7" },
  { icon: "🏠", label: "Real Estate, Infra & Construction", color: "#0ea5e9" },
  { icon: "🚚", label: "Transport, Logistics & Storage", color: "#f59e0b" },
  { icon: "✈️", label: "Travel, Tourism & Hospitality", color: "#06b6d4" },
];

export function CategoriesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 bg-background overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#E84545]/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="category-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-foreground"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#category-grid)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div 
          className={`flex flex-col items-center text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Badge with icon */}
          <div className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/50 mb-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer">
            {/* Animated background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 via-[#E84545]/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <Search className="relative z-10 h-4 w-4 text-primary group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative z-10 text-sm font-medium text-foreground">
              Explore Services Across Sectors
            </span>
            <Sparkles className="relative z-10 h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
          </div>

          {/* Main heading with gradient */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance mb-4">
            Browse by{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-[#E84545] to-primary">
              Category
            </span>
          </h2>

          {/* Subtitle */}
          <p 
            className={`text-muted-foreground text-lg max-w-2xl transition-all duration-1000 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Discover verified professionals across 16+ specialized sectors
          </p>

          {/* Decorative line */}
          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.label}
              icon={category.icon}
              label={category.label}
              color={category.color}
              index={index}
              isVisible={isVisible}
              isActive={activeCategory === index}
              onHover={() => setActiveCategory(index)}
              onLeave={() => setActiveCategory(null)}
            />
          ))}
        </div>

        {/* Stats section */}
        <div 
          className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          {[
            { value: "16+", label: "Categories", icon: "🎯" },
            { value: "500+", label: "Services", icon: "⚡" },
            { value: "24/7", label: "Available", icon: "🕐" },
            { value: "100%", label: "Verified", icon: "✅" },
          ].map((stat, index) => (
            <div
              key={index}
              className="group text-center p-4 rounded-xl bg-card/50 border border-border/30 hover:border-primary/30 hover:bg-card transition-all duration-300 cursor-default"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#E84545] group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  icon,
  label,
  color,
  index,
  isVisible,
  isActive,
  onHover,
  onLeave,
}: {
  icon: string;
  label: string;
  color: string;
  index: number;
  isVisible: boolean;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`group relative flex items-center gap-4 p-5 rounded-xl bg-card border border-border/50 transition-all duration-500 hover:bg-secondary/50 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 text-left overflow-hidden ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: `${index * 50}ms`,
      }}
    >
      {/* Hover background gradient */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{
          background: `radial-gradient(circle at left, ${color}15, transparent)`,
        }}
      />

      {/* Animated border gradient */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${color}20, transparent)`,
        }}
      />

      {/* Icon container with scale effect */}
      <div className="relative z-10 flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-lg bg-secondary/50 group-hover:bg-secondary transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
        <span className="text-3xl transition-transform duration-300 group-hover:scale-110" role="img" aria-hidden="true">
          {icon}
        </span>
        
        {/* Glow effect behind icon */}
        <div 
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Text content */}
      <div className="relative z-10 flex-1 min-w-0">
        <span className="block text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {label}
        </span>
        
        {/* Count indicator (simulated) */}
        <span className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {Math.floor(Math.random() * 50) + 10}+ services
        </span>
      </div>

      {/* Arrow icon */}
      <ChevronRight 
        className="relative z-10 h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
        style={{ color: isActive ? color : undefined }}
      />

      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* Pulse effect for active card */}
      {isActive && (
        <div 
          className="absolute inset-0 rounded-xl animate-pulse"
          style={{ 
            boxShadow: `0 0 20px ${color}40`,
          }}
        />
      )}
    </button>
  );
}