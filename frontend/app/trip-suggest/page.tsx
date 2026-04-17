"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import NavHeader from "../components/ui/nav-header";
import { GlassCard } from "../components/ui/glass-card";
import { Sparkles, Plane, Palmtree, Mountain, Building2, ArrowRight, IndianRupee } from "lucide-react";

interface Destination {
  city: string;
  airport: string;
  description: string;
  price: number;
  vibe: string;
  duration: string;
  bestMonth: string;
}

const DESTINATIONS: Record<string, Destination[]> = {
  beach: [
    { city: "Goa", airport: "GOI", description: "Golden beaches, vibrant nightlife, and Portuguese heritage", price: 3500, vibe: "beach", duration: "2-4 days", bestMonth: "Nov-Feb" },
    { city: "Andaman Islands", airport: "IXZ", description: "Crystal-clear waters, coral reefs, and untouched nature", price: 8500, vibe: "beach", duration: "4-6 days", bestMonth: "Oct-May" },
    { city: "Kochi", airport: "COK", description: "Serene backwaters, spice gardens, and coastal cuisine", price: 4200, vibe: "beach", duration: "3-5 days", bestMonth: "Sep-Mar" },
    { city: "Thiruvananthapuram", airport: "TRV", description: "Kovalam beach, temples, and Ayurvedic retreats", price: 4800, vibe: "beach", duration: "3-4 days", bestMonth: "Oct-Mar" },
  ],
  mountain: [
    { city: "Dharamshala", airport: "DHM", description: "Himalayan views, Tibetan culture, and trekking trails", price: 5200, vibe: "mountain", duration: "3-5 days", bestMonth: "Mar-Jun" },
    { city: "Dehradun", airport: "DED", description: "Gateway to Mussoorie and Rishikesh adventures", price: 4000, vibe: "mountain", duration: "3-5 days", bestMonth: "Mar-Jun" },
    { city: "Srinagar", airport: "SXR", description: "Dal Lake houseboats, Mughal gardens, and snow peaks", price: 6000, vibe: "mountain", duration: "4-6 days", bestMonth: "Apr-Oct" },
    { city: "Bagdogra", airport: "IXB", description: "Gateway to Darjeeling, tea gardens, and Sikkim", price: 5500, vibe: "mountain", duration: "4-7 days", bestMonth: "Oct-Mar" },
  ],
  city: [
    { city: "Jaipur", airport: "JAI", description: "Pink City palaces, vibrant markets, and royal heritage", price: 3200, vibe: "city", duration: "2-4 days", bestMonth: "Oct-Mar" },
    { city: "Varanasi", airport: "VNS", description: "Ancient ghats, spiritual experiences, and street food", price: 3800, vibe: "city", duration: "2-3 days", bestMonth: "Oct-Mar" },
    { city: "Hyderabad", airport: "HYD", description: "Biryani capital, Charminar, and tech city vibes", price: 3000, vibe: "city", duration: "2-4 days", bestMonth: "Sep-Mar" },
    { city: "Bengaluru", airport: "BLR", description: "Garden city, great food, pleasant weather year-round", price: 3500, vibe: "city", duration: "2-4 days", bestMonth: "Sep-Feb" },
  ],
};

export default function TripSuggestPage() {
  const router = useRouter();
  const [budget, setBudget] = useState("");
  const [vibe, setVibe] = useState<"beach" | "mountain" | "city" | "">("");
  const [days, setDays] = useState("3");
  const [results, setResults] = useState<Destination[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSuggest = () => {
    if (!vibe) return;
    const budgetNum = parseInt(budget) || 99999;
    const filtered = DESTINATIONS[vibe].filter((d) => d.price <= budgetNum);
    setResults(filtered.length > 0 ? filtered : DESTINATIONS[vibe]);
    setSearched(true);
  };

  const vibeOptions = [
    { key: "beach", icon: <Palmtree className="w-6 h-6" />, label: "Beach", color: "text-cyan-glow" },
    { key: "mountain", icon: <Mountain className="w-6 h-6" />, label: "Mountains", color: "text-amber-glow" },
    { key: "city", icon: <Building2 className="w-6 h-6" />, label: "City", color: "text-indigo-glow" },
  ];

  return (
    <div className="min-h-screen bg-void">
      <NavHeader />
      <div className="pt-28 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="w-4 h-4 text-amber-glow" />
              <span className="text-sm font-medium text-silver">AI-Powered</span>
            </div>
            <h1 className="text-4xl font-black font-display gradient-text-frost mb-3">Trip Suggester</h1>
            <p className="text-silver">Tell us your vibe and we'll find the perfect destination</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard className="p-8 mb-8">
              {/* Vibe Selection */}
              <label className="text-sm font-bold text-frost block mb-3">What's your vibe?</label>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {vibeOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setVibe(opt.key as typeof vibe)}
                    className={`glass rounded-xl p-4 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      vibe === opt.key ? `border-white/20 bg-white/5 ${opt.color}` : "text-ash hover:text-frost hover:bg-white/[0.02]"
                    }`}
                  >
                    {opt.icon}
                    <span className="text-sm font-semibold">{opt.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-bold text-frost block mb-2">Budget (per person)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
                    <input
                      type="number" placeholder="e.g., 10000" value={budget}
                      onChange={(e) => setBudget(e.target.value)} className="input-glass pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-frost block mb-2">Duration</label>
                  <select value={days} onChange={(e) => setDays(e.target.value)} className="input-glass appearance-none cursor-pointer">
                    {[2, 3, 4, 5, 7, 10].map((d) => (
                      <option key={d} value={d} className="bg-onyx">{d} days</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleSuggest}
                disabled={!vibe}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> Find My Trip
              </button>
            </GlassCard>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {searched && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold font-display text-frost mb-2">
                  {results.length} destination{results.length !== 1 ? "s" : ""} found
                </h2>
                {results.map((dest, idx) => (
                  <motion.div
                    key={dest.city}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <GlassCard className="p-6" hover>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl glass-md flex items-center justify-center text-sm font-bold text-cyan-glow">
                              {dest.airport}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-frost">{dest.city}</h3>
                              <p className="text-xs text-ash">{dest.duration} · Best: {dest.bestMonth}</p>
                            </div>
                          </div>
                          <p className="text-sm text-silver">{dest.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-ash">from</div>
                            <div className="text-2xl font-black text-cyan-glow">₹{dest.price.toLocaleString("en-IN")}</div>
                          </div>
                          <button
                            onClick={() => router.push(`/search?from=DEL&to=${dest.airport}&date=&pax=1&carrier=All&mode=flights`)}
                            className="btn-primary px-4 py-2 flex items-center gap-1 cursor-pointer"
                          >
                            <Plane className="w-4 h-4" /> <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
