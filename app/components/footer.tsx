import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

const communityLinks = [
  { label: "Founding Co-owners", href: "/community/founding-coowners" },
  { label: "Certified Professionals", href: "/community/certified-professionals" },
  { label: "Success Voice", href: "/community/success-voice" },
  { label: "Calculate Earnings", href: "/community/calculate-earnings" },
];

const businessLinks = [
  { label: "Branding & Leads", href: "/business/branding-leads" },
  { label: "Outsource Requirements", href: "/business/outsource-requirements" },
  { label: "Phygital Workplace", href: "/business/phygital-workplace" },
  { label: "@Lowest", href: "/business/lowest" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Terms of Service", href: "/legal/terms-of-service" },
  { label: "Escrow System", href: "/legal/escrow-system" },
  { label: "DPDPA & GDPR", href: "/legal/dpdpa-gdpr" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "X (Twitter)" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

// Pinterest icon (lucide me nahi hai)
function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-border/30 bg-card/30">
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* ===== TABLE GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          {/* Logo column */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold">
                Saubh<span className="text-primary">.Tech</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground mb-4">
              GSTN: <span className="font-medium">10AAUPS8603H1ZH</span>
            </p>

            <ul className="space-y-3">
              <li>
                <Link href="/about-us" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/team-saubh" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Team Saubh
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
              Community
            </h3>
            <ul className="space-y-3">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
              Business
            </h3>
            <ul className="space-y-3">
              {businessLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ===== CONTACT (TABLE KE NICHE) ===== */}
        <div className="text-sm text-muted-foreground text-center space-y-2 mb-8">
          <p>
            <MapPin className="inline h-4 w-4 mr-2 text-primary" />
            92 Deepali Building, Nehru Place, New Delhi - 110019
          </p>
          <p>
            <Mail className="inline h-4 w-4 mr-2 text-primary" />
            mail@saubh.in
            <span className="mx-2">|</span>
            <Phone className="inline h-4 w-4 mr-2 text-primary" />
            +91 8800607598
          </p>
        </div>

        {/* ===== SOCIAL ICONS ===== */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="w-10 h-10 rounded-full bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all"
            >
              <social.icon className="h-5 w-5" />
            </a>
          ))}
          <a
            href="#"
            aria-label="Pinterest"
            className="w-10 h-10 rounded-full bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all"
          >
            <PinterestIcon className="h-5 w-5" />
          </a>
        </div>

        {/* ===== FOOTER LINE ===== */}
        <div className="pt-8 border-t border-border/30 text-center space-y-2">
          <p className="text-sm text-muted-foreground italic">
            &ldquo;Envisioned by Mani, a jewel on the earth.&rdquo;
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Saubh.Tech | All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
