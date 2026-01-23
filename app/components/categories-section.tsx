"use client";

import { Search } from "lucide-react";

const categories = [
  { icon: "🌾", label: "Agriculture, Food & Nutrition" },
  { icon: "📢", label: "Branding, Marketing & Sales" },
  { icon: "💻", label: "Computing, Data & Digital Technology" },
  { icon: "🎓", label: "Education, Skilling & Career" },
  { icon: "💰", label: "Finance, Banking & Insurance" },
  { icon: "🏛️", label: "Government, Public Sector & Welfare" },
  { icon: "🩺", label: "Health, Wellness & Personal Care" },
  { icon: "👥", label: "HR, Employment & Gig-Work" },
  { icon: "🛠️", label: "Installation, Repair & Tech Support" },
  { icon: "⚖️", label: "Legal, Police & Protection" },
  { icon: "🏭", label: "Manufacturing, Procurement & Production" },
  { icon: "❤️", label: "Matchmaking, Relationships & Guidance" },
  { icon: "🎬", label: "Media, Entertainment & Sports" },
  { icon: "🏠", label: "Real Estate, Infra & Construction" },
  { icon: "🚚", label: "Transport, Logistics & Storage" },
  { icon: "✈️", label: "Travel, Tourism & Hospitality" },
];

export function CategoriesSection() {
  return (
    <section className="relative py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border/50 mb-6">
            <Search className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Explore Services Across Sectors
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance">
            Browse by Category
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.label}
              icon={category.icon}
              label={category.label}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  icon,
  label,
  index,
}: {
  icon: string;
  label: string;
  index: number;
}) {
  return (
    <button
      type="button"
      className="group relative flex items-center gap-4 p-5 rounded-xl bg-card border border-border/50 transition-all duration-300 hover:bg-secondary hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 text-left"
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      <span className="text-3xl flex-shrink-0" role="img" aria-hidden="true">
        {icon}
      </span>
      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
        {label}
      </span>
    </button>
  );
}
