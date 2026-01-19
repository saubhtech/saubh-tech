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
          className="relative max-w-6xl mx-auto px-6 pt-28 pb-32 space-y-6"
        >
          <h1 className="text-6xl font-semibold tracking-wide leading-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-teal-300 to-cyan-200 glow-text">
            Community-Verified Marketplace for
            <br />
            Work, Learning & Opportunity.
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl">
            A phygital ecosystem enabling individuals to learn, work, earn and
            build trust from anywhere.
          </p>

          <div className="flex gap-4 mt-4">
            <button className="px-5 py-2.5 rounded-md bg-gradient-to-r from-teal-300 to-sky-400 text-black font-medium shadow-md hover:shadow-lg transition-all">
              Get Started
            </button>
            <button className="px-5 py-2.5 rounded-md neon-outline-btn text-sky-200 transition-all">
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
          <h2 className="text-4xl font-semibold text-sky-300 text-center mb-10">
            Our Platform Modules
          </h2>

          <p className="text-center text-gray-400 max-w-2xl mx-auto">
            Core components powering Saubh.Tech's phygital ecosystem.
          </p>

          <div className="grid md:grid-cols-2 gap-10 mt-12">
            {/* === Operating System === */}
            <div className="neon-card rounded-xl p-8">
              <div className="text-3xl glow-icon text-teal-300 mb-4">
                <FiLayers />
              </div>
              <h3 className="text-2xl font-semibold text-sky-300">
                Operating System
              </h3>
              <p className="text-gray-300 mt-2">
                Decision engine connecting career, education & work
                opportunities.
              </p>

              <ul className="mt-5 space-y-2 text-gray-300">
                <li className="bullet-item">Career Map</li>
                <li className="bullet-item">Education Index</li>
                <li className="bullet-item">Work Opportunities</li>
                <li className="bullet-item">Advisory System</li>
              </ul>
            </div>

            {/* === Branding & Leads === */}
            <div className="neon-card rounded-xl p-8">
              <div className="text-3xl glow-icon text-teal-300 mb-4">
                <FiBriefcase />
              </div>
              <h3 className="text-2xl font-semibold text-sky-300">
                Branding & Leads
              </h3>
              <p className="text-gray-300 mt-2">
                Community-powered trust, visibility and growth engine.
              </p>

              <ul className="mt-5 space-y-2 text-gray-300">
                <li className="bullet-item">UGC Content</li>
                <li className="bullet-item">Social Amplification</li>
                <li className="bullet-item">Lead Routing</li>
                <li className="bullet-item">Community Reputation</li>
              </ul>
            </div>

            {/* === Gig Work === */}
            <div className="neon-card rounded-xl p-8">
              <div className="text-3xl glow-icon text-teal-300 mb-4">
                <FiUsers />
              </div>
              <h3 className="text-2xl font-semibold text-sky-300">
                Phygital Gig-Work
              </h3>
              <p className="text-gray-300 mt-2">
                Distributed work across digital + physical clusters.
              </p>

              <ul className="mt-5 space-y-2 text-gray-300">
                <li className="bullet-item">Local & Remote Tasks</li>
                <li className="bullet-item">Freelance Marketplace</li>
                <li className="bullet-item">Workforce Clusters</li>
                <li className="bullet-item">Verified Matching</li>
              </ul>
            </div>

            {/* === Learning & Skilling === */}
            <div className="neon-card rounded-xl p-8">
              <div className="text-3xl glow-icon text-teal-300 mb-4">
                <FiBook />
              </div>
              <h3 className="text-2xl font-semibold text-sky-300">
                Learning & Skilling
              </h3>
              <p className="text-gray-300 mt-2">
                Outcome-driven professional development pathways.
              </p>

              <ul className="mt-5 space-y-2 text-gray-300">
                <li className="bullet-item">Life Counselling (LCP)</li>
                <li className="bullet-item">Business Consulting (BCP)</li>
                <li className="bullet-item">Skill Certificates</li>
                <li className="bullet-item">Outcome Tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
                POWERED BY INNOVATION — Tech Icons
      ======================================================= */}

      <section className="w-full border-t border-white/5 bg-[#081225] pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-sky-300 text-center mt-14 mb-3">
            Powered by Innovation
          </h2>

          <p className="text-center text-gray-400 mb-12 max-w-xl mx-auto">
            Leading technologies behind Saubh.Tech’s scalable ecosystem.
          </p>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {[
              {
                name: "React",
                shape: (
                  <div className="w-4 h-4 rotate-45 bg-cyan-300 glow-icon" />
                ),
              },
              {
                name: "Node.js",
                shape: (
                  <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-transparent border-b-purple-300 glow-icon" />
                ),
              },
              {
                name: "Python",
                shape: (
                  <div className="w-4 h-4 rounded-full bg-pink-400 glow-icon" />
                ),
              },
              {
                name: "AWS",
                shape: <div className="w-4 h-4 bg-yellow-300 glow-icon" />,
              },
              {
                name: "Docker",
                shape: (
                  <div className="w-[14px] h-[6px] bg-green-300 rotate-[20deg] glow-icon" />
                ),
              },
              {
                name: "Kubernetes",
                shape: (
                  <div className="w-4 h-4 rotate-45 border border-purple-300 glow-icon" />
                ),
              },
            ].map((tech, idx) => (
              <div
                key={idx}
                className="neon-card rounded-xl p-6 text-center flex flex-col items-center gap-3"
              >
                {tech.shape}
                <div className="text-gray-200 text-sm">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
                    BLUEPRINT 01 / 02 / 03 / 04 Section
      ======================================================= */}

      <section className="w-full border-t border-white/5 bg-[#061020] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-sky-300 text-center mb-3">
            Our Blueprint for Success
          </h2>

          <p className="text-center text-gray-400 mb-16">
            A 4-step journey designed to guide individuals toward meaningful
            outcomes.
          </p>

          <div className="grid md:grid-cols-2 gap-14">
            {/* 01 */}
            <div>
              <h1 className="text-[80px] font-bold text-teal-700/40">01</h1>
              <h3 className="text-2xl text-sky-300 font-semibold -mt-6">
                Discover & Decide
              </h3>
              <p className="text-gray-300 mt-2">
                Analyze career possibilities using verified pathways, real-world
                data and community recommendations.
              </p>
            </div>

            {/* 02 */}
            <div>
              <h1 className="text-[80px] font-bold text-teal-700/40">02</h1>
              <h3 className="text-2xl text-sky-300 font-semibold -mt-6">
                Learn & Prepare
              </h3>
              <p className="text-gray-300 mt-2">
                Build skills through guided learning, professional
                certifications and personalized development tracks.
              </p>
            </div>

            {/* 03 */}
            <div>
              <h1 className="text-[80px] font-bold text-teal-700/40">03</h1>
              <h3 className="text-2xl text-sky-300 font-semibold -mt-6">
                Work & Earn
              </h3>
              <p className="text-gray-300 mt-2">
                Engage in gig-work, hybrid roles and verified community-led
                opportunities across India.
              </p>
            </div>

            {/* 04 */}
            <div>
              <h1 className="text-[80px] font-bold text-teal-700/40">04</h1>
              <h3 className="text-2xl text-sky-300 font-semibold -mt-6">
                Grow & Support
              </h3>
              <p className="text-gray-300 mt-2">
                Build your reputation, support the community & move up the
                opportunity ladder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMPLIANCE ================= */}
      <section className="w-full bg-[#061020] py-12 text-center text-gray-300 text-sm">
        <b className="text-sky-300">AIPTTAT</b>
        <br />
        Registered under section 8 (1) of the MCA, Govt of India
        <br />
        Licence Number XXXXX
      </section>

      <Footer />
    </>
  );
}
