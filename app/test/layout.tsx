import type { Metadata } from "next";
import "./test.css";

export const metadata: Metadata = {
  title: "Saubh.Tech – Phygital Gig-Work Marketplace | Verified People, Secured Income",
  description:
    "Connect with verified individuals and businesses worldwide for secure gig work payments. Phygital Gig-Work Marketplace – work locally, scale globally.",
  keywords:
    "gig work, phygital marketplace, freelance, escrow payment, verified providers, UGC, branding, India gig economy, SaubhOS",
  authors: [{ name: "Saubh.Tech" }],
  robots: "index, follow, max-image-preview:large, max-snippet:-1",
  alternates: {
    canonical: "https://saubh.tech/test",
  },
  openGraph: {
    title: "Saubh.Tech – Phygital Gig-Work Marketplace",
    description:
      "Connect with verified individuals and businesses worldwide for secure gig work payments.",
    type: "website",
    url: "https://saubh.tech/test",
    siteName: "Saubh.Tech",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saubh.Tech – Phygital Gig-Work Marketplace",
    description:
      "Connect with verified individuals and businesses worldwide for secure gig work payments.",
  },
  other: {
    "theme-color": "#6DB33F",
  },
};

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
