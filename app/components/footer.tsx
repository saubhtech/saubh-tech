import Link from "next/link";
import Image from "next/image";

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

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "X (Twitter)" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/30 bg-card/30">
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* ===== TABLE LAYOUT ===== */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse border border-border/50">
            <thead>
              <tr className="bg-secondary/30">
                <th className="border border-border/50 px-4 py-3 text-left text-sm font-semibold">
                  <Link href="/" className="inline-flex items-center gap-2">
                    <Image
                      src="/Saubh-Good.png"
                      alt="Saubh.Tech Logo"
                      width={24}
                      height={24}
                      priority
                      className="h-6 w-6 object-contain"
                    />
                    <span className="text-base font-bold">
                      Saubh<span className="text-primary">.Tech</span>
                    </span>
                  </Link>
                </th>
                <th className="border border-border/50 px-4 py-3 text-left text-sm font-semibold">
                  Community
                </th>
                <th className="border border-border/50 px-4 py-3 text-left text-sm font-semibold">
                  Business
                </th>
                <th className="border border-border/50 px-4 py-3 text-left text-sm font-semibold">
                  Legal
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <span className="text-muted-foreground">GSTN:</span>{" "}
                  <span className="font-medium">10AAUPS8603H1ZH</span>
                </td>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Link
                    href="/community/about-saubh"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    About Saubh
                  </Link>
                </td>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Link
                    href="/business/global-data"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Global Data
                  </Link>
                </td>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Link
                    href="/legal/privacy-dpdpa-gdpr"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy, DPDPA & GDPR
                  </Link>
                </td>
              </tr>

              {/* Row 2 */}
              <tr>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <span className="text-muted-foreground">UDYAM:</span>{" "}
                  <span className="font-medium">BR-31-0066281</span>
                </td>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Link
                    href="/community/founding-coowners"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Founding Co-owners
                  </Link>
                </td>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Link
                    href="/business/unified-communication"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Unified Communication
                  </Link>
                </td>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Link
                    href="/legal/terms-of-service"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </td>
              </tr>

              {/* Row 3 */}
              <tr>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Mail className="inline h-3.5 w-3.5 mr-1 text-primary" />
                  <a
                    href="mailto:mail@saubh.in"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    mail@saubh.in
                  </a>
                </td>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Link
                    href="/community/certified-advisor"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Be a Certified Advisor
                  </Link>
                </td>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Link
                    href="/business/marketing-sales"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Marketing & Sales
                  </Link>
                </td>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Link
                    href="/legal/escrow-system"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Escrow System
                  </Link>
                </td>
              </tr>

              {/* Row 4 */}
              <tr>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Phone className="inline h-3.5 w-3.5 mr-1 text-primary" />
                  <span className="text-muted-foreground">Call:</span>{" "}
                  <a
                    href="tel:918800607598"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    918800607598
                  </a>
                </td>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Link
                    href="/community/team-saubh"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Team Saubh
                  </Link>
                </td>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Link
                    href="/business/hr-recruitment"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    HR & Recruitment
                  </Link>
                </td>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Link
                    href="/legal/refund-policy"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Refund Policy
                  </Link>
                </td>
              </tr>

              {/* Row 5 */}
              <tr>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Phone className="inline h-3.5 w-3.5 mr-1 text-primary" />
                  <span className="text-muted-foreground">WhatsApp:</span>{" "}
                  <a
                    href="https://wa.me/918800607598"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    918800607598
                  </a>
                </td>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Link
                    href="/community/calculate-earnings"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Calculate Earnings
                  </Link>
                </td>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Link
                    href="/business/counselling-admission"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Counselling & Admission
                  </Link>
                </td>
                <td className="border border-border/50 px-4 py-2 text-sm">
                  <Link
                    href="/legal/online-payment"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Online Payment
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ===== ADDRESS ===== */}
        <div className="text-sm text-muted-foreground text-center mb-6">
          <MapPin className="inline h-4 w-4 mr-1 text-primary" />
          01 Tola-Tari, Sarha, Dahiawan, Chapra, Saran, Bihar - 841301
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
        <div className="pt-6 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground">
            Envisioned by Mani, a jewel on the earth. || &copy; 2026 Saubh.Tech
            || All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
