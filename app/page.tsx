"use client";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { motion } from "framer-motion";
import { FiLayers, FiBriefcase, FiUsers, FiBook } from "react-icons/fi";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-grid opacity-[0.07]" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-6xl mx-auto px-6 pt-32 pb-40 space-y-6"
        >
          <h1 className="text-6xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
            Community-Verified Marketplace for
            <br />
            Work, Learning & Opportunity.
          </h1>

          <p className="text-lg text-gray-200 max-w-2xl">
            A phygital ecosystem enabling individuals to learn, work, earn and
            build trust from anywhere.
          </p>

          <div className="flex gap-4 mt-4">
            <button className="px-5 py-2.5 rounded-md bg-gradient-to-r from-teal-300 to-sky-400 text-black font-semibold shadow-md hover:shadow-lg active:scale-[.97] transition-all">
              Get Started
            </button>

            <button className="px-5 py-2.5 rounded-md border border-sky-300/60 text-sky-200 hover:bg-sky-300/10 shadow-sm active:scale-[.97] transition-all">
              Explore Marketplace
            </button>
          </div>
        </motion.div>
      </section>

      {/* ================= METRICS ================= */}
      <section className="w-full border-t border-white/5 bg-[#0B132B]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 px-6 py-14 text-center gap-6">
          {[
            { num: "10K+", label: "Learners & Users" },
            { num: "500+", label: "Career Choices" },
            { num: "2K+", label: "Verified Advisors" },
            { num: "24/7", label: "Support System" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="text-4xl font-semibold text-sky-300">{s.num}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= PLATFORM MODULES ================= */}
      <section className="w-full border-t border-white/5 bg-[#081225]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-semibold text-white text-center mb-3">
            Our Platform Modules
          </h2>

          <p className="text-center text-gray-400 max-w-2xl mx-auto mb-10">
            Core components powering Saubh.Tech's phygital ecosystem.
          </p>

          <div className="grid md:grid-cols-2 gap-10 mt-12">
            {/* === Operating System === */}
            <div className="neon-card rounded-xl p-8">
              <div className="text-3xl text-teal-300 mb-4">
                <FiLayers />
              </div>
              <h3 className="text-2xl font-semibold text-white">Operating System</h3>
              <p className="text-gray-300 mt-2">
                Decision engine connecting career, education & work opportunities.
              </p>

              <ul className="mt-5 space-y-2 text-gray-300">
                <li>Career Map</li>
                <li>Education Index</li>
                <li>Work Opportunities</li>
                <li>Advisory System</li>
              </ul>
            </div>

            {/* === Branding & Leads === */}
            <div className="neon-card rounded-xl p-8">
              <div className="text-3xl text-teal-300 mb-4">
                <FiBriefcase />
              </div>
              <h3 className="text-2xl font-semibold text-white">Branding & Leads</h3>
              <p className="text-gray-300 mt-2">
                Community-powered trust, visibility and growth engine.
              </p>

              <ul className="mt-5 space-y-2 text-gray-300">
                <li>UGC Content</li>
                <li>Social Amplification</li>
                <li>Lead Routing</li>
                <li>Community Reputation</li>
              </ul>
            </div>

            {/* === Gig Work === */}
            <div className="neon-card rounded-xl p-8">
              <div className="text-3xl text-teal-300 mb-4">
                <FiUsers />
              </div>
              <h3 className="text-2xl font-semibold text-white">Phygital Gig-Work</h3>
              <p className="text-gray-300 mt-2">
                Distributed work across digital + physical clusters.
              </p>

              <ul className="mt-5 space-y-2 text-gray-300">
                <li>Local & Remote Tasks</li>
                <li>Freelance Marketplace</li>
                <li>Workforce Clusters</li>
                <li>Verified Matching</li>
              </ul>
            </div>

            {/* === Learning & Skilling === */}
            <div className="neon-card rounded-xl p-8">
              <div className="text-3xl text-teal-300 mb-4">
                <FiBook />
              </div>
              <h3 className="text-2xl font-semibold text-white">Learning & Skilling</h3>
              <p className="text-gray-300 mt-2">
                Outcome-driven professional development pathways.
              </p>

              <ul className="mt-5 space-y-2 text-gray-300">
                <li>Life Counselling (LCP)</li>
                <li>Business Consulting (BCP)</li>
                <li>Skill Certificates</li>
                <li>Outcome Tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- rest of your sections unchanged ---------------- */}

      <Footer />
    </>
  );
}
