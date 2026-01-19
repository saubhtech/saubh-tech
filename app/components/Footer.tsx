export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#06172F] border-t border-white/10 text-sm text-gray-300 mt-32">
      
      {/* TOP AREA */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* BRAND */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-lg font-semibold text-white">Saubh.Tech</h4>
          <p className="text-gray-400">
            Community-Verified Marketplace for Work, Learning & Opportunity.
          </p>
        </div>

        {/* COMMUNITY */}
        <div className="space-y-2">
          <h4 className="text-white font-medium mb-1">Community</h4>
          <ul className="space-y-1">
            <li>Success Stories</li>
            <li>Work From Anywhere</li>
            <li>Phygital Workplace</li>
            <li>Escrow System</li>
          </ul>
        </div>

        {/* BUSINESS */}
        <div className="space-y-2">
          <h4 className="text-white font-medium mb-1">Business</h4>
          <ul className="space-y-1">
            <li>Branding & Leads</li>
            <li>Outsource Requirements</li>
            <li>Calculate Earnings</li>
            <li>Subscription</li>
          </ul>
        </div>

        {/* LEGAL */}
        <div className="space-y-2">
          <h4 className="text-white font-medium mb-1">Legal</h4>
          <ul className="space-y-1">
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Refund Policy</li>
            <li>DPDPA & GDPR Compliance</li>
          </ul>
        </div>
      </div>

      {/* MID AREA */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <div className="space-y-2">
            <h4 className="text-white font-medium mb-1">About Us</h4>
            <ul className="space-y-1">
              <li>How It Works</li>
              <li>Certification</li>
              <li>Owners Team</li>
              <li>Be an Advisor</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-medium mb-1">Team Support</h4>
            <ul className="space-y-1">
              <li>Country → State → District → Pincode</li>
              <li>Support & Ticket</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-medium mb-1">Get Started</h4>
            <ul className="space-y-1">
              <li>Register</li>
              <li>Login</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-medium mb-1">Contact</h4>
            <ul className="space-y-1">
              <li>Call</li>
              <li>WhatsApp</li>
              <li>Email</li>
            </ul>
          </div>

        </div>
      </div>

      {/* SOCIAL */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap gap-4">
          Facebook • Instagram • Pinterest • LinkedIn • X • YouTube
        </div>
      </div>

      {/* ADDRESS + YEAR */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 text-xs text-gray-400 space-y-1">
          <div>Address (Put here)</div>
          <div>GSTIN (Put here)</div>
          <div className="pt-2">© {year} Saubh.Tech — All Rights Reserved.</div>
        </div>
      </div>
    </footer>
  );
}
