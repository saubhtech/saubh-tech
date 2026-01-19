export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-10 text-sm text-gray-400">

        {/* COLUMN 1 — BRAND */}
        <div>
          <h4 className="font-medium text-white mb-2">Saubh.Tech</h4>
          <p className="leading-relaxed">
            Community-Verified Marketplace for Work, Learning & Opportunity.
          </p>
        </div>

        {/* COLUMN 2 — PRODUCT */}
        <div>
          <h4 className="font-medium text-white mb-2">Product</h4>
          <ul className="space-y-1">
            <li>Operating System</li>
            <li>Branding & Leads</li>
            <li>Phygital Gig-Work</li>
            <li>Learning & Skilling</li>
          </ul>
        </div>

        {/* COLUMN 3 — LEGAL */}
        <div>
          <h4 className="font-medium text-white mb-2">Legal</h4>
          <ul className="space-y-1">
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Refund Policy</li>
            <li>DPDPA & GDPR Compliance</li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT ROW */}
      <div className="text-center text-xs text-gray-500 py-6 border-t border-white/5">
        © {year} Saubh.Tech — All Rights Reserved.
      </div>
    </footer>
  );
}
