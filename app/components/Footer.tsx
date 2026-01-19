"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full text-gray-300 mt-32 relative overflow-hidden">

      {/* === TOP GOVT SECTION === */}
      <section className="w-full bg-[#08233F] border-t border-white/10 relative py-16 text-center">
        <div className="absolute inset-0 bg-grid opacity-[0.10] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 space-y-3">
          <p className="text-[13px] font-semibold tracking-wide text-white">
            AIPTTAT
          </p>
          <p className="text-[15px] leading-relaxed text-gray-200">
            Registered under section 8 (1) of the MCA, Govt of India <br />
            Licence Number 128032
          </p>
        </div>
      </section>


      {/* === MAIN NAV + BRAND === */}
      <section className="w-full bg-[#06172F] border-t border-white/10 relative py-24 text-center">
        <div className="absolute inset-0 bg-grid opacity-[0.10] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6">

          {/* BRAND */}
          <h2 className="text-4xl font-bold text-sky-300 tracking-wide mb-8">
            Soubh Tech
          </h2>

          {/* NAV */}
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-gray-300 mb-8">
            <span>Services</span>
            <span>Technology</span>
            <span>Process</span>
            <span>Portfolio</span>
            <span>Careers</span>
            <span>Blog</span>
            <span>Contact</span>
          </div>

          {/* COPYRIGHT */}
          <p className="text-xs text-gray-400 tracking-wide">
            © {year} Soubh Tech. Engineering tomorrow’s digital reality.
          </p>
        </div>
      </section>
    </footer>
  );
}
