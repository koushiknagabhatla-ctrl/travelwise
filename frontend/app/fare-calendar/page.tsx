"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import NavHeader from "../components/ui/nav-header";
import { GlassCard } from "../components/ui/glass-card";
import { Calendar, MapPin, ArrowRight, ChevronLeft, ChevronRight, TrendingDown } from "lucide-react";

export default function FareCalendarPage() {
  const router = useRouter();
  const [from, setFrom] = useState("DEL");
  const [to, setTo] = useState("BOM");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate mock fare data for the month
  const generateFares = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const fares: { day: number; price: number; level: "low" | "mid" | "high" }[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      if (date < new Date()) continue; // Skip past dates
      const dayOfWeek = date.getDay();
      const basePrice = 3500;
      const weekendSurcharge = dayOfWeek === 0 || dayOfWeek === 6 ? 1500 : 0;
      const randomVariation = Math.floor(Math.random() * 2000) - 500;
      const price = basePrice + weekendSurcharge + randomVariation;
      const level = price < 4000 ? "low" : price < 5500 ? "mid" : "high";
      fares.push({ day: d, price, level });
    }
    return fares;
  };

  const fares = generateFares();
  const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const cheapestFare = fares.length > 0 ? Math.min(...fares.map((f) => f.price)) : 0;

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const handleDayClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = date.toISOString().split("T")[0];
    router.push(`/search?from=${from}&to=${to}&date=${dateStr}&pax=1&carrier=All&mode=flights`);
  };

  return (
    <div className="min-h-screen bg-void">
      <NavHeader />

      <div className="pt-28 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-4xl font-black font-display gradient-text-frost mb-3">Fare Calendar</h1>
            <p className="text-silver">Find the cheapest day to fly at a glance</p>
          </motion.div>

          {/* Route Input */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard className="p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="text-xs font-bold text-ash uppercase tracking-wider block mb-2">From</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
                    <input value={from} onChange={(e) => setFrom(e.target.value.toUpperCase())} className="input-glass pl-10" placeholder="DEL" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-ash uppercase tracking-wider block mb-2">To</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-glow" />
                    <input value={to} onChange={(e) => setTo(e.target.value.toUpperCase())} className="input-glass pl-10" placeholder="BOM" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Calendar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard className="p-6">
              {/* Month Nav */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="glass rounded-lg p-2 hover:bg-white/5 transition-all cursor-pointer">
                  <ChevronLeft className="w-5 h-5 text-frost" />
                </button>
                <h2 className="text-xl font-bold font-display text-frost">
                  {currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </h2>
                <button onClick={nextMonth} className="glass rounded-lg p-2 hover:bg-white/5 transition-all cursor-pointer">
                  <ChevronRight className="w-5 h-5 text-frost" />
                </button>
              </div>

              {/* Legend */}
              <div className="flex gap-4 mb-6 justify-center text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-cyan-glow/30" />
                  <span className="text-silver">Cheap</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-amber-glow/30" />
                  <span className="text-silver">Moderate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-rose-glow/30" />
                  <span className="text-silver">Expensive</span>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="text-center text-xs font-bold text-ash uppercase">{d}</div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const fare = fares.find((f) => f.day === day);
                  const isPast = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) < new Date();
                  const isCheapest = fare?.price === cheapestFare;

                  return (
                    <motion.button
                      key={day}
                      whileHover={fare ? { scale: 1.05 } : undefined}
                      onClick={() => fare && handleDayClick(day)}
                      disabled={!fare || isPast}
                      className={`relative rounded-xl p-2 text-center transition-all cursor-pointer min-h-[72px] flex flex-col justify-between ${
                        isPast || !fare
                          ? "opacity-30 cursor-not-allowed"
                          : fare.level === "low"
                          ? "glass border border-cyan-glow/20 hover:border-cyan-glow/40"
                          : fare.level === "mid"
                          ? "glass border border-amber-glow/20 hover:border-amber-glow/40"
                          : "glass border border-rose-glow/20 hover:border-rose-glow/40"
                      }`}
                    >
                      <span className="text-xs font-semibold text-silver">{day}</span>
                      {fare && (
                        <span className={`text-xs font-bold mt-1 ${
                          fare.level === "low" ? "text-cyan-glow" : fare.level === "mid" ? "text-amber-glow" : "text-rose-glow"
                        }`}>
                          ₹{(fare.price / 1000).toFixed(1)}k
                        </span>
                      )}
                      {isCheapest && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-glow rounded-full flex items-center justify-center">
                          <TrendingDown className="w-2.5 h-2.5 text-void" />
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
