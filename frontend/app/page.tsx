"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavHeader from "./components/ui/nav-header";
import { GlassCard } from "./components/ui/glass-card";
import { CosmicParallaxBg } from "./components/ui/parallax-cosmic-background";
import { LiquidButton } from "./components/ui/liquid-glass-button";
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
  Check
} from "lucide-react";

// ─── AUTOCOMPLETE INPUT WIDGET ───
function AutocompleteInput({ 
  value, 
  onChange, 
  placeholder, 
  airports, 
  icon: Icon,
  iconColor
}: { 
  value: string; 
  onChange: (val: string) => void; 
  placeholder: string; 
  airports: any[]; 
  icon: any;
  iconColor: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = airports.filter(a => 
    a.city.toLowerCase().includes(search.toLowerCase()) || 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.code.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 10); // show top 10 matches

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${iconColor}`} />
      <input
        type="text"
        placeholder={placeholder}
        value={open ? search : value}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onClick={() => {
          if(!open) setSearch(value);
          setOpen(true);
        }}
        className="input-glass pl-12 h-14 w-full bg-void/40 backdrop-blur-md rounded-xl border border-white/10 text-white focus:border-cyan-glow/50 focus:ring-1 focus:ring-cyan-glow/50 transition-all font-bold tracking-wide"
        required
      />
      
      <AnimatePresence>
        {open && (
           <motion.div 
             initial={{ opacity: 0, y: 10, scale: 0.98 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: 5, scale: 0.98 }}
             className="absolute top-16 left-0 w-full z-50 glass-card rounded-xl border border-white/10 overflow-hidden shadow-2xl max-h-[300px] overflow-y-auto custom-scrollbar"
           >
             {filtered.length === 0 ? (
                <div className="p-4 text-sm text-silver text-center">No airports found</div>
             ) : (
                filtered.map((a, i) => (
                  <div 
                    key={a.code + i} 
                    onClick={() => {
                      onChange(a.city ? `${a.city} (${a.code})` : a.code);
                      setSearch("");
                      setOpen(false);
                    }}
                    className="p-3 border-b border-white/5 hover:bg-white/10 cursor-pointer flex flex-col transition-colors group"
                  >
                     <div className="flex justify-between items-center w-full">
                       <span className="font-bold text-white group-hover:text-cyan-glow transition-colors">{a.city}</span>
                       <span className="px-2 py-0.5 rounded-md bg-void/50 text-xs font-bold text-cyan-glow border border-cyan-glow/20">{a.code}</span>
                     </div>
                     <span className="text-xs text-silver mt-1 truncate">{a.name}</span>
                  </div>
                ))
             )}
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── SEARCH WIDGET ───
function FlightSearchWidget() {
  const router = useRouter();
  const [tripType, setTripType] = useState<"one-way" | "round" | "multi">("one-way");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [pax, setPax] = useState("1");
  const [airports, setAirports] = useState<any[]>([]);

  useEffect(() => {
    // Fetch comprehensive airport list for autocomplete
    // If backend is active it will pull from /api/airports. We use a fallback if not.
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002'}/api/airports`)
      .then(res => res.json())
      .then(data => {
         if(data.success && data.data) setAirports(data.data);
      })
      .catch(e => console.error("Could not fetch airports", e));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !date) return;
    router.push(`/search?mode=flights&from=${from}&to=${to}&date=${date}&pax=${pax}&carrier=All`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 w-full"
    >
      <GlassCard className="max-w-5xl mx-auto p-4 md:p-8 rounded-[2rem] border border-white/15 shadow-[0_0_40px_rgba(6,214,160,0.1)] backdrop-blur-3xl" glow="subtle">
        {/* Trip Type Toggle */}
        <div className="flex gap-2 mb-6 glass-md rounded-[18px] p-1.5 w-fit border border-white/10 shadow-inner">
          {(["one-way", "round", "multi"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTripType(type)}
              className={`px-5 py-2 rounded-[14px] text-sm font-bold transition-all cursor-pointer ${
                tripType === type
                  ? "bg-cyan-glow text-void shadow-md"
                  : "text-silver hover:text-white hover:bg-white/5"
              }`}
            >
              {type === "one-way" ? "One Way" : type === "round" ? "Round Trip" : "Multi-City"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <AutocompleteInput 
              value={from} 
              onChange={setFrom} 
              placeholder="From City/Airport" 
              airports={airports} 
              icon={MapPin} 
              iconColor="text-silver"
            />
            <AutocompleteInput 
              value={to} 
              onChange={setTo} 
              placeholder="To City/Airport" 
              airports={airports} 
              icon={MapPin} 
              iconColor="text-cyan-glow"
            />
            
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-silver" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-glass pl-12 h-14 bg-void/40 backdrop-blur-md rounded-xl border border-white/10 text-white focus:border-cyan-glow/50 focus:ring-1 focus:ring-cyan-glow/50 font-bold"
                required
              />
            </div>
            
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-silver" />
              <select
                value={pax}
                onChange={(e) => setPax(e.target.value)}
                className="input-glass pl-12 h-14 appearance-none cursor-pointer bg-void/40 backdrop-blur-md rounded-xl border border-white/10 text-white font-bold"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n} className="bg-void text-white">
                    {n} {n === 1 ? "Traveler" : "Travelers"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <LiquidButton
            type="submit"
            variant="default"
            size="xl"
            shape="smooth"
            className="w-full md:w-auto mt-2"
          >
            <Search className="w-5 h-5 mr-1" />
            Find Best Flights
          </LiquidButton>
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
      <GlassCard className="h-full group p-8 rounded-[2rem] border border-white/10 transition-all hover:bg-white/5" hover>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#06d6a0]/20 to-transparent flex items-center justify-center mb-6 group-hover:from-cyan-glow/40 transition-all border border-cyan-glow/10 shadow-[0_0_15px_rgba(6,214,160,0.1)]">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{title}</h3>
        <p className="text-silver text-sm leading-relaxed font-medium">{description}</p>
      </GlassCard>
    </motion.div>
  );
}

// ─── MAIN PAGE ───
export default function Home() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 800], [1, 0.95]);

  return (
    <div className="min-h-screen bg-void overflow-hidden">
      <NavHeader />

      {/* ═══ HERO SECTION ═══ */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-12"
      >
        <CosmicParallaxBg 
          head="TravelWise" 
          text="Easy, Customizable, Best Flights" 
          loop={true} 
          className="z-0"
        />

        <div className="w-full relative z-20 mt-[40vh] md:mt-[30vh]">
          <FlightSearchWidget />
        </div>
      </motion.section>

      {/* ═══ STATS & FEATURES ═══ */}
      <section className="relative z-10 py-32 px-6 bg-gradient-to-b from-void via-void to-abyss">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <span className="text-sm font-bold text-cyan-glow uppercase tracking-[0.2em] mb-4 block drop-shadow-[0_0_8px_rgba(6,214,160,0.4)]">
              Welcome to the future of travel
            </span>
            <h2 className="text-4xl md:text-6xl font-black font-display text-white mb-6 tracking-tight">
              A Universal Flight Ecosystem
            </h2>
            <p className="text-xl text-silver max-w-2xl mx-auto font-medium leading-relaxed">
              Experience zero lag autocomplete, real-time telemetry, and predictive pricing algorithms.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 className="w-7 h-7 text-cyan-glow drop-shadow-lg" />}
              title="Predictive Pricing"
              description="Watch price changes with high accuracy charts. Set constraints and let our system alert you immediately when flights drop."
              delay={0}
            />
            <FeatureCard
              icon={<Globe className="w-7 h-7 text-[#7c3aed] drop-shadow-lg" />}
              title="Aviation Data Feed"
              description="AviationStack integration provides live coordinates, altitudes, and speeds for nearly all civilian Indian aviation routes."
              delay={0.1}
            />
             <FeatureCard
              icon={<Zap className="w-7 h-7 text-[#ef476f] drop-shadow-lg" />}
              title="Liquid UI Acceleration"
              description="A hyper-responsive, glass-morphism interface powered by Framer Motion and custom turbulent displacement algorithms."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="relative z-10 py-32 px-6 bg-void">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-1" style={{ background: "linear-gradient(135deg, rgba(6,214,160,0.4), rgba(124,58,237,0.2), transparent)", borderRadius: "2.2rem" }}>
              <GlassCard className="p-16 md:p-24 rounded-[2rem] relative overflow-hidden bg-void">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] mix-blend-overlay opacity-20 bg-cover bg-center" />
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-black font-display text-white mb-6 tracking-tight drop-shadow-xl border-b border-white/10 pb-6 inline-block">
                    Ready to initiate sequence?
                  </h2>
                  <p className="text-xl text-silver mb-12 max-w-xl mx-auto font-medium">
                    Thousands of synchronized routes. One terminal.
                  </p>
                  <div className="flex flex-wrap gap-6 justify-center">
                    <LiquidButton variant="default" size="xl" shape="smooth">
                      <Link href="/auth" className="flex items-center">
                        Initialize Session <ChevronRight className="w-5 h-5 ml-1" />
                      </Link>
                    </LiquidButton>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 border-t border-white/5 bg-void pb-12 pt-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
          <div className="flex flex-col items-center md:items-start gap-3 flex-1 text-center md:text-left">
            <span className="text-3xl font-black font-display text-white">
              travel<span className="text-cyan-glow drop-shadow-[0_0_8px_rgba(6,214,160,0.5)]">wise</span>
            </span>
            <p className="text-sm text-ash font-medium max-w-sm leading-relaxed">
              The next-generation terminal for flight telemetry, analysis, and execution. Developed with absolute precision.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-12 text-md font-bold">
            <Link href="/about" className="text-silver hover:text-white hover:-translate-y-1 transition-all duration-300">About</Link>
            <Link href="/privacy" className="text-silver hover:text-white hover:-translate-y-1 transition-all duration-300">Privacy Policy</Link>
            <Link href="/terms" className="text-silver hover:text-white hover:-translate-y-1 transition-all duration-300">Terms of Service</Link>
            <Link href="/contact" className="text-silver hover:text-cyan-glow hover:-translate-y-1 transition-all duration-300">Contact</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center flex flex-col items-center justify-center gap-2">
           <span className="text-sm font-bold text-silver">© 2024 TravelWise Systems</span>
           <span className="text-xs text-ash flex items-center gap-1 font-medium"><Check className="w-3 h-3 text-cyan-glow"/> Secure AES-256 Infrastructure</span>
        </div>
      </footer>
    </div>
  );
}
