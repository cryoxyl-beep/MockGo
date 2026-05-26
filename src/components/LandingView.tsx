import React from 'react';
import { 
  ArrowRight, 
  GraduationCap, 
  Sparkles, 
  UploadCloud, 
  Sliders, 
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingViewProps {
  onGetStarted: () => void;
}

export default function LandingView({ onGetStarted }: LandingViewProps) {
  return (
    <div id="landing-page" className="min-h-screen bg-[#090909] text-[#EDEDED] flex flex-col justify-between overflow-x-hidden relative font-sans">
      
      {/* Background radial soft light overlay (No neon slop, just soft luxury dark grey glow) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-950 via-transparent to-transparent pointer-events-none" />

      {/* Embedded decorative grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141416_1px,transparent_1px),linear-gradient(to_bottom,#141416_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      {/* Transparent Elegant Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-[#1F1F1F] relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <GraduationCap className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <span className="font-sans font-bold text-sm tracking-tight text-white">InstaMocks</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            id="landing-nav-start-btn"
            onClick={onGetStarted}
            className="bg-white hover:bg-opacity-90 text-black font-sans text-xs font-bold px-4 py-2 rounded shadow-lg transition-all duration-200 cursor-pointer"
          >
            Sign In with Google
          </button>
        </div>
      </header>

      {/* Hero Section Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center justify-center relative z-10">
        
        {/* Top Announcement Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] border border-[#222] rounded-full mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span className="font-mono text-[9px] text-[#888] font-bold tracking-widest uppercase">National Syllabus Analytics Engine</span>
        </motion.div>

        {/* Hero Hook Tagline */}
        <motion.h2 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-sans font-bold text-5xl md:text-6xl text-white tracking-tight leading-[1.1] mb-6 max-w-2xl"
        >
          Turn Syllabus Assets into <br />
          <span className="bg-gradient-to-r from-[#CCC] to-[#FFF] bg-clip-text text-transparent">
            intelligent mock tests.
          </span>
        </motion.h2>

        {/* Clear supportive subtext */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-sans text-base md:text-lg text-[#888] max-w-xl mb-12 font-light leading-relaxed"
        >
          Upload your national curriculum previous papers, syllabus folders, or PYQs. Our platform parses topics and structures verified interactive simulations instantly.
        </motion.p>

        {/* Hero CTA buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full justify-center"
        >
          <button
            id="hero-cta-get-started"
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-sans text-xs font-bold rounded shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 flex items-center justify-center gap-2.5 transition-all duration-200 group cursor-pointer"
          >
            <span>Access Academic Portal</span>
            <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>

        {/* Beautiful high quality minimalist dashboard representation */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full bg-[#0C0C0C] rounded-xl border border-[#1F1F1F] shadow-2xl p-6 text-left relative overflow-hidden"
        >
          {/* Simulated Window Controls */}
          <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-4 mb-6">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#1A1A1A] border border-[#222]" />
              <span className="w-3 h-3 rounded-full bg-[#1A1A1A] border border-[#222]" />
              <span className="w-3 h-3 rounded-full bg-[#1A1A1A] border border-[#222]" />
              <span className="font-mono text-[9px] text-[#555] ml-2">instamocks-engine-loaded</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-[#555] border border-[#1F1F1F] px-1.5 py-0.5 rounded">Core Node Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[#0F0F0F] border border-[#1F1F1F]">
              <div className="flex items-center gap-2 mb-2 text-[#EDEDED]">
                <UploadCloud className="w-3.5 h-3.5 text-[#888]" />
                <span className="font-sans text-xs font-semibold">1. Load Academic Files</span>
              </div>
              <p className="font-sans text-xs text-[#555] leading-relaxed">
                Sync mock papers or standard curriculum guides. We inspect topics, chapter markers, and questions index.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#0F0F0F] border border-[#1F1F1F]">
              <div className="flex items-center gap-2 mb-2 text-[#EDEDED]">
                <Zap className="w-3.5 h-3.5 text-[#888]" />
                <span className="font-sans text-xs font-semibold">2. Set Calibration</span>
              </div>
              <p className="font-sans text-xs text-[#555] leading-relaxed">
                Enforce target distributions, exact difficulty quotas, and custom marking schemes.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#0F0F0F] border border-[#1F1F1F]">
              <div className="flex items-center gap-2 mb-2 text-white">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span className="font-sans text-xs font-semibold text-white">3. Evaluate Skills</span>
              </div>
              <p className="font-sans text-xs text-[#555] leading-relaxed">
                Take timed simulated evaluations and study granular breakdowns with absolute precision.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#1F1F1F] flex items-center justify-between text-[#555] text-[10px] font-mono">
            <span>SECURE CRYPTO-BOUND SESSION AUTH</span>
            <span>VERIFIED WORKSPACE INTEGRATION</span>
          </div>
        </motion.div>
      </main>

      {/* Simple structured footer (no clutter) */}
      <footer className="w-full border-t border-[#1F1F1F] bg-[#0A0A0A] py-8 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-[#555]">
            &copy; {new Date().getFullYear()} InstaMocks Academic. All rights reserved.
          </p>
          <div className="flex gap-6 font-mono text-[10px] text-[#555]">
            <span className="hover:text-white transition-colors">Privacy Codex</span>
            <span className="hover:text-white transition-colors">Terms of Spec</span>
            <span className="hover:text-white transition-colors">Workspace Config</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
