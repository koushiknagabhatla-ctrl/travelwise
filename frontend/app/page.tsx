"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavHeader from "./components/ui/nav-header";
import { GlassCard } from "./components/ui/glass-card";
import {
  Plane,
  Search,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  TrendingDown,
  Shield,
  Clock,
  Zap,
  Globe,
  BarChart3,
  Sparkles,
  ChevronRight,
} from "lucide-react";

// ─── HERO BACKGROUND ANIMATION (DigitalSerenity-inspired) ───
function HeroBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY, opacity: 1 });
    };
    const handleMouseLeave = () => {
      setMousePos((prev) => ({ ...prev, opacity: 0 }));
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== newRipple.id)), 1000);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      {/* Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="heroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100, 116, 139, 0.06)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGrid)" />
        {/* Animated grid lines */}
        {[20, 50, 80].map((pos, i) => (
          <React.Fragment key={i}>
            <line x1="0" y1={`${pos}%`} x2="100%" y2={`${pos}%`}
              stroke="rgba(148, 163, 184, 0.08)" strokeWidth="0.5"
              strokeDasharray="5 5" style={{ animation: `gridDraw 2s ease-out ${0.5 + i * 0.5}s forwards`, opacity: 0 }} />
            <line x1={`${pos}%`} y1="0" x2={`${pos}%`} y2="100%"
              stroke="rgba(148, 163, 184, 0.08)" strokeWidth="0.5"
              strokeDasharray="5 5" style={{ animation: `gridDraw 2s ease-out ${1 + i * 0.5}s forwards`, opacity: 0 }} />
          </React.Fragment>
        ))}
        {/* Intersection dots */}
        {[[20, 20], [80, 20], [50, 50], [20, 80], [80, 80]].map(([cx, cy], i) => (
          <circle key={i} cx={`${cx}%`} cy={`${cy}%`} r="1.5"
            fill="rgba(6, 214, 160, 0.3)"
            style={{ animation: `pulseGlowDot 3s ease-in-out ${3 + i * 0.3}s infinite`, opacity: 0 }} />
        ))}
      </svg>

      {/* Floating particles */}
      {[
        { top: "15%", left: "10%", delay: 0 },
        { top: "25%", left: "85%", delay: 1 },
        { top: "55%", left: "5%", delay: 2 },
        { top: "70%", left: "90%", delay: 3 },
        { top: "40%", left: "45%", delay: 1.5 },
      ].map((p, i) => (
        <div key={i} className="absolute w-1 h-1 bg-cyan-glow/30 rounded-full animate-float"
          style={{ top: p.top, left: p.left, animationDelay: `${p.delay}s`, animationDuration: `${4 + i}s` }} />
      ))}

      {/* Mouse follower gradient */}
      <div
        className="fixed pointer-events-none rounded-full w-80 h-80 blur-3xl transition-all duration-100 ease-linear"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          opacity: mousePos.opacity * 0.3,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(6, 214, 160, 0.08), rgba(124, 58, 237, 0.04), transparent 70%)",
        }}
      />

      {/* Click ripples */}
      {ripples.map((r) => (
        <div key={r.id} className="fixed w-2 h-2 rounded-full pointer-events-none z-50"
          style={{
            left: r.x, top: r.y,
            background: "rgba(6, 214, 160, 0.5)",
            transform: "translate(-50%, -50%)",
            animation: "rippleOut 0.8s ease-out forwards",
          }} />
      ))}

      {/* Ambient gradient orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-cyan-glow/5 via-transparent to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-glow/5 via-transparent to-transparent rounded-full blur-3xl" />

      <style jsx>{`
        @keyframes gridDraw { 0% { stroke-dashoffset: 1000; opacity: 0; } 50% { opacity: 0.3; } 100% { stroke-dashoffset: 0; opacity: 0.08; } }
        @keyframes pulseGlowDot { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.5); } }
        @keyframes rippleOut { 0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; } 100% { transform: translate(-50%, -50%) scale(40); opacity: 0; } }
      `}</style>
    </>
  );
}

// ─── SEARCH WIDGET ───
function FlightSearchWidget() {
  const router = useRouter();
  const [tripType, setTripType] = useState<"one-way" | "round" | "multi">("one-way");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [pax, setPax] = useState("1");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?mode=flights&from=${from}&to=${to}&date=${date}&pax=${pax}&carrier=All`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard className="max-w-4xl mx-auto p-6 md:p-8 rounded-3xl" glow="subtle">
        {/* Trip Type Toggle */}
        <div className="flex gap-1 mb-6 glass rounded-full p-1 w-fit">
          {(["one-way", "round", "multi"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTripType(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                tripType === type
                  ? "bg-cyan-glow text-void"
                  : "text-silver hover:text-frost"
              }`}
            >
              {type === "one-way" ? "One Way" : type === "round" ? "Round Trip" : "Multi-City"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
              <input
                type="text"
                placeholder="From — City or Airport"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="input-glass pl-10"
                required
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-glow" />
              <input
                type="text"
                placeholder="To — City or Airport"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="input-glass pl-10"
                required
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-glass pl-10"
                required
              />
            </div>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
              <select
                value={pax}
                onChange={(e) => setPax(e.target.value)}
                className="input-glass pl-10 appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n} className="bg-onyx text-frost">
                    {n} {n === 1 ? "Traveler" : "Travelers"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 py-3.5 px-10 text-base cursor-pointer"
          >
            <Search className="w-5 h-5" />
            Search Flights
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </GlassCard>
    </motion.div>
  );
}

// ─── FEATURE CARD ───
function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard className="h-full group" hover>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-glow/20 to-transparent flex items-center justify-center mb-4 group-hover:from-cyan-glow/30 transition-all">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-frost mb-2 font-display">{title}</h3>
        <p className="text-silver text-sm leading-relaxed">{description}</p>
      </GlassCard>
    </motion.div>
  );
}

// ─── STAT BLOCK ───
function StatBlock({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="text-3xl md:text-4xl font-black gradient-text font-display">{value}</div>
      <div className="text-silver text-sm mt-1">{label}</div>
    </motion.div>
  );
}

// ─── MAIN PAGE ───
export default function Home() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.95]);

  useEffect(() => {
    const saved = localStorage.getItem("travelwise_recent");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  return (
    <div className="min-h-screen bg-void overflow-hidden">
      <NavHeader />

      {/* ═══ HERO SECTION ═══ */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-12"
      >
        <HeroBackground />

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse-glow" />
            <span className="text-sm font-medium text-silver">Live flight data across India</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 font-display"
          >
            <span className="gradient-text-frost">Your journey begins</span>
            <br />
            <span className="gradient-text">with a single search.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-lg md:text-xl text-silver max-w-2xl mx-auto leading-relaxed mb-4"
          >
            Real flights. Real prices. Compare fares, track flights live, and book with confidence —
            all powered by real-time airline data.
          </motion.p>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="flex items-center justify-center gap-6 text-xs text-ash mb-8"
          >
            <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-cyan-glow" /> Secure Booking</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-cyan-glow" /> Real-time Data</span>
            <span className="flex items-center gap-1"><TrendingDown className="w-3 h-3 text-cyan-glow" /> Best Price Guarantee</span>
          </motion.div>
        </div>

        {/* Search Widget */}
        <div className="relative z-10 w-full">
          <FlightSearchWidget />
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="relative z-10 mt-6 flex items-center gap-3 text-sm text-ash"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Recent:</span>
            {recentSearches.slice(0, 3).map((s, i) => (
              <span key={i} className="glass rounded-full px-3 py-1 text-xs text-silver hover:text-frost cursor-pointer transition-colors">
                {s}
              </span>
            ))}
          </motion.div>
        )}

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-ash">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 rounded-full bg-cyan-glow/50" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══ STATS BAR ═══ */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-8 rounded-3xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatBlock value="137+" label="Indian Airports" delay={0} />
              <StatBlock value="24/7" label="Live Flight Data" delay={0.1} />
              <StatBlock value="₹0" label="Booking Fee" delay={0.2} />
              <StatBlock value="50K+" label="Routes Tracked" delay={0.3} />
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ═══ FEATURES GRID ═══ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-cyan-glow uppercase tracking-widest mb-3 block">
              Why TravelWise
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-display gradient-text-frost mb-4">
              Everything you need to fly smart
            </h2>
            <p className="text-silver max-w-xl mx-auto">
              From finding the cheapest fare to tracking your flight in real time — we have it all covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-cyan-glow" />}
              title="Live Price Tracker"
              description="Watch price changes over 7 days with interactive charts. Set alerts and book when the price drops."
              delay={0}
            />
            <FeatureCard
              icon={<Calendar className="w-6 h-6 text-cyan-glow" />}
              title="Fare Calendar"
              description="See the cheapest day to fly at a glance. Our monthly grid shows you exactly when to book."
              delay={0.1}
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-cyan-glow" />}
              title="Live Flight Tracking"
              description="Track any flight across India in real time with altitude, speed, and ETA data on an interactive map."
              delay={0.2}
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 text-amber-glow" />}
              title="AI Trip Suggester"
              description="Tell us your budget and vibe — beach, mountains, city — and we'll find the perfect destinations."
              delay={0.3}
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-amber-glow" />}
              title="Flexible Dates"
              description="±3 days flexible search finds you the cheapest date combination automatically."
              delay={0.4}
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-amber-glow" />}
              title="Transparent Pricing"
              description="Total cost upfront with baggage included. No hidden fees, no surprises at checkout."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12 md:p-16 rounded-3xl relative overflow-hidden" glow="cyan">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-glow/5 via-transparent to-indigo-glow/5" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-black font-display gradient-text-frost mb-4">
                  Ready to find your next flight?
                </h2>
                <p className="text-silver mb-8 max-w-md mx-auto">
                  Join thousands of smart travelers who save time and money with TravelWise.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/search" className="btn-primary flex items-center gap-2 py-3 px-8">
                    <Search className="w-4 h-4" /> Search Flights
                  </Link>
                  <Link href="/auth" className="btn-ghost flex items-center gap-2 py-3 px-8">
                    Create Account <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-bold font-display text-frost">
              travel<span className="text-cyan-glow">wise</span>
            </span>
            <p className="text-xs text-ash">© 2024 TravelWise. Smart flights for smart travelers.</p>
          </div>
          <div className="flex gap-8 text-sm">
            <Link href="#" className="text-ash hover:text-frost transition-colors">Privacy</Link>
            <Link href="#" className="text-ash hover:text-frost transition-colors">Terms</Link>
            <Link href="#" className="text-ash hover:text-frost transition-colors">Contact</Link>
            <Link href="#" className="text-ash hover:text-frost transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
