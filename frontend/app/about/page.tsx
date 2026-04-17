"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import NavHeader from "@/components/ui/nav-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Shield, Plane, Zap, Server, Globe } from "lucide-react";
import { CosmicParallaxBg } from "@/components/ui/parallax-cosmic-background";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="min-h-[200vh] bg-void overflow-hidden relative" ref={containerRef}>
      <NavHeader />

      {/* Hero Parallax */}
      <div className="fixed inset-0 z-0">
         <CosmicParallaxBg head="" text="" loop={true} className="opacity-80" />
      </div>

      <motion.div 
        style={{ opacity }}
        className="relative z-10 w-full h-screen flex flex-col items-center justify-center pointer-events-none"
      >
         <h1 className="text-6xl md:text-8xl font-black font-display text-white mb-6 tracking-tight drop-shadow-2xl">
           ABOUT <span className="text-cyan-glow">MATRIX</span>
         </h1>
         <p className="text-xl md:text-2xl text-silver font-bold uppercase tracking-[0.3em]">
           Scroll to initialize
         </p>
         <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-16 bg-gradient-to-b from-cyan-glow to-transparent mt-12 rounded-full"
         />
      </motion.div>

      {/* Main Content Sections */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-6 py-32 space-y-32">
         {/* Section 1 */}
         <motion.div 
           style={{ y: y1 }}
           className="p-[1px] bg-gradient-to-br from-cyan-glow/40 to-indigo-glow/20 rounded-[3rem]"
         >
           <GlassCard className="p-10 md:p-16 rounded-[3rem] bg-void/60 backdrop-blur-3xl overflow-hidden relative group border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-glow/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150" />
              <Plane className="w-16 h-16 text-cyan-glow mb-8" />
              <h2 className="text-4xl md:text-5xl font-black font-display text-white mb-6">Redefining Flight Telemetry</h2>
              <p className="text-lg text-silver font-medium leading-relaxed">
                TravelWise is not just a booking engine; it is a full-stack telemetry node designed to securely fetch, map, and output highly accurate real-time data from Indian and Global aviation networks. Built primarily for speed and fluidity, the liquid-glass UI architecture guarantees a seamless interaction protocol.
              </p>
           </GlassCard>
         </motion.div>

         {/* Section 2 */}
         <motion.div 
           style={{ y: y2 }}
           className="p-[1px] bg-gradient-to-br from-[#ef476f]/40 to-amber-glow/20 rounded-[3rem]"
         >
           <GlassCard className="p-10 md:p-16 rounded-[3rem] bg-void/60 backdrop-blur-3xl overflow-hidden relative group border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 w-64 h-64 bg-rose-glow/10 rounded-full blur-[80px] -ml-32 -mt-32 transition-transform duration-1000 group-hover:scale-150" />
              <Shield className="w-16 h-16 text-rose-glow mb-8" />
              <h2 className="text-4xl md:text-5xl font-black font-display text-white mb-6">Absolute Security.</h2>
              <p className="text-lg text-silver font-medium leading-relaxed">
                Integrated tightly with Supabase infrastructure, user payload delivery is sanitized entirely through secure external Google OAuth mechanisms. We store 0 credit card inputs locally. You are isolated securely from payload injection at all node levels.
              </p>
           </GlassCard>
         </motion.div>

         {/* Section 3 Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-20">
             <GlassCard className="p-10 rounded-[2rem] bg-void/60 backdrop-blur-2xl border border-white/10 hover:bg-white/5 transition-all">
                <Globe className="w-10 h-10 text-[#7c3aed] mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">AirportDb Integrated</h3>
                <p className="text-silver font-medium text-sm">Real API syncing over 50,000+ airports natively for Zero-Lag mapping.</p>
             </GlassCard>
             <GlassCard className="p-10 rounded-[2rem] bg-void/60 backdrop-blur-2xl border border-white/10 hover:bg-white/5 transition-all">
                <Server className="w-10 h-10 text-cyan-glow mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">NodeJS Micro-Gateways</h3>
                <p className="text-silver font-medium text-sm">Separated backend pipelines fetching OpenWeather, Exchange Rates, and AviationStack synchronously.</p>
             </GlassCard>
         </div>

       </div>
    </div>
  );
}
