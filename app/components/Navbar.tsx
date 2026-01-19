"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-700/40 backdrop-blur bg-background/60">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        
        <div className="font-semibold text-lg tracking-tight">
          Saubh.Tech
        </div>

        <div className="hidden md:flex gap-8 text-sm text-gray-300">
          <Link href="/os">Operating System</Link>
          <Link href="/branding">Branding & Leads</Link>
          <Link href="/gig-work">Gig-Work</Link>
          <Link href="/learning">Learning & Skilling</Link>
          <Link href="/team">Team Support</Link>
        </div>

        <div className="flex gap-4 text-sm text-gray-300">
          <Link href="/auth/register" className="hover:text-white">Register</Link>
          <Link href="/auth/login" className="hover:text-white">Login</Link>
        </div>
      </div>
    </nav>
  );
}
