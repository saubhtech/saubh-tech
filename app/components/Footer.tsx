"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full text-gray-300 mt-32 relative overflow-hidden">

      {/* === GRID BACKGROUND === */}
      <div className="absolute inset-0 bg-grid opacity-[0.08] pointer-events-none" />

      {/* ====== GOVT SECTION ====== */}
      <section className="w-full bg-[#08233F] border-t border-white/10 py-14 text-center">
        <p className="text-[13px] font-semibold tracking-wide text-white">AIPTTAT</p>
        <p className="text-[14px] text-gray-200 leading-relaxed mt-1">
          Registered under section 8 (1) of the MCA, Govt of India <br />
          Licence Number 128032
        </p>
      </section>

      {/* ===== TABLE SECTION ===== */}
      <section className="w-full bg-[#06172F] border-t border-white/10 py-20 relative">
  <div className="absolute inset-0 bg-grid opacity-[0.12]" />

  <div className="relative max-w-6xl mx-auto px-6 text-sm">

    {/* TABLE */}
    <div className="grid grid-cols-4 gap-0 border border-white/10 rounded-lg overflow-hidden text-left">

      {/* HEAD */}
      <div className="px-4 py-3 font-semibold text-white border-b border-white/10">Saubh.Tech</div>
      <div className="px-4 py-3 font-semibold text-white border-b border-white/10">Community</div>
      <div className="px-4 py-3 font-semibold text-white border-b border-white/10">Business</div>
      <div className="px-4 py-3 font-semibold text-white border-b border-white/10">Legal</div>

      {/* ROW1 */}
      <div className="px-4 py-3 border-b border-white/10">About Us</div>
      <div className="px-4 py-3 border-b border-white/10">Be an Advisor</div>
      <div className="px-4 py-3 border-b border-white/10">Branding & Leads</div>
      <div className="px-4 py-3 border-b border-white/10">Privacy Policy</div>

      {/* ROW2 */}
      <div className="px-4 py-3 border-b border-white/10">How It Works</div>
      <div className="px-4 py-3 border-b border-white/10">Certification</div>
      <div className="px-4 py-3 border-b border-white/10">Outsource Requirements</div>
      <div className="px-4 py-3 border-b border-white/10">Terms of Service</div>

      {/* ROW3 */}
      <div className="px-4 py-3 border-b border-white/10">Success Stories</div>
      <div className="px-4 py-3 border-b border-white/10">Work from Anywhere</div>
      <div className="px-4 py-3 border-b border-white/10">Phygital Workplace</div>
      <div className="px-4 py-3 border-b border-white/10">Escrow System</div>

      {/* ROW4 */}
      <div className="px-4 py-3 border-b border-white/10">Owners Team</div>
      <div className="px-4 py-3 border-b border-white/10">Calculate Earnings</div>
      <div className="px-4 py-3 border-b border-white/10">Subscription</div>
      <div className="px-4 py-3 border-b border-white/10">Refund Policy</div>

      {/* GDPR MERGED */}
      <div className="col-span-3 border-b border-white/10" />
      <div className="px-4 py-3 text-[13px] text-gray-300">
        DPDPA & GDPR Compliance
      </div>
    </div>

    {/* SOCIAL */}
    <div className="border-t border-white/10 mt-10 pt-8 flex flex-wrap justify-center gap-6">
      <span>Call</span>
      <span>WhatsApp</span>
      <span>Email</span>
      <span>Facebook</span>
      <span>Instagram</span>
      <span>Pinterest</span>
      <span>LinkedIn</span>
    </div>

    <div className="flex justify-center gap-6 mt-3">
      <span>X</span>
      <span>YouTube</span>
    </div>

    {/* ADDRESS + COPYRIGHT */}
    <div className="border-t border-white/10 mt-10 pt-8 text-center text-xs text-gray-400 space-y-1">
      <div>(Logo) Address (Put here)</div>
      <div>GSTN (Put here)</div>
      <div className="pt-2">© {year} Saubh.Tech, All Rights Reserved.</div>
    </div>

  </div>
</section>


    </footer>
  );
}
