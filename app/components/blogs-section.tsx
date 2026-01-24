"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

const blogs = [
  {
    category: "Gig Economy & Phygital Work",
    title: "What Is Phygital Work and Why It's the Future of India's Gig Economy",
    date: "2025-01-15",
    description:
      "Discover how phygital work combines physical trust with digital scalability to revolutionize India's gig economy.",
  },
  {
    category: "Branding, UGC & Trust",
    title: "Why User-Generated Content (UGC) Converts Better Than Paid Ads",
    date: "2025-01-07",
    description:
      "Data-driven insights into why UGC outperforms traditional advertising.",
  },
  {
    category: "Social Media Amplification & Organic Growth",
    title: "UGC vs Influencer Marketing: What Works Better for Indian SMEs?",
    date: "2025-01-05",
    description:
      "A practical comparison for small and medium businesses in India.",
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogsSection() {
  return (
    <section className="relative pt-0 pb-12 md:pb-16 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Blogs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Explore insights, tips, and trends in the gig economy, digital
            branding, and phygital work.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogs.map((blog, index) => (
            <Card
              key={index}
              className="group bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <CardContent className="p-6 flex flex-col flex-1">
                {/* Category Badge */}
                <div className="inline-flex self-start px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-4">
                  {blog.category}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
                  {blog.description}
                </p>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto pt-4 border-t border-border/30">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(blog.date)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="border-border/60 text-foreground hover:bg-secondary hover:border-primary/50 px-8 bg-transparent"
          >
            Load More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}