"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plane, CheckCircle2, Lock, ArrowRight, Info } from "lucide-react";
import axios from "axios";
import NavHeader from "../components/ui/nav-header";
import { GlassCard } from "../components/ui/glass-card";
import { useAuth } from "../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";

function SeatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const mode = searchParams.get("mode") || "flights";
  const price = parseInt(searchParams.get("price") || "0", 10);
  const operatorNo = searchParams.get("operatorNo") || "";
  const from = searchParams.get("from") || "";
  const destination = searchParams.get("destination") || "";
  const date = searchParams.get("date") || "";

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [locking, setLocking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/api/booking/availability`, {
          params: { operatorNo, date },
        });
        if (res.data.success) setBookedSeats(res.data.bookedSeats);
      } catch (e) { /* ignore */ }
    };
    if (operatorNo && date) fetch();
  }, [operatorNo, date]);

  const rows = [1, 2, 3, 4, 5, 6, 7, 8];

  const toggleSeat = (seat: string) => {
    setError("");
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleLockAndContinue = async () => {
    if (selectedSeats.length === 0) return setError("Select at least one seat");
    if (!user) return setError("Please sign in to continue");

    setLocking(true);
    try {
      const res = await axios.post(`${API}/api/booking/lock`, {
        flightId: operatorNo,
        seats: selectedSeats,
        userId: user.id,
      });
      if (res.data.success) {
        const totalPrice = price * selectedSeats.length;
        router.push(
          `/checkout?mode=${mode}&operatorNo=${operatorNo}&from=${from}&destination=${destination}&price=${totalPrice}&seat=${selectedSeats.join(",")}&date=${date}`
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to lock seats");
    } finally {
      setLocking(false);
    }
  };

  // Seat zone colors
  const getZone = (row: number, col: string) => {
    if (row <= 2) return "premium";
    if (col === "A" || col === "F") return "window";
    return "standard";
  };

  const renderSeat = (seatId: string, row: number, col: string) => {
    const isSelected = selectedSeats.includes(seatId);
    const isBooked = bookedSeats.includes(seatId);
    const zone = getZone(row, col);

    return (
      <motion.button
        key={seatId}
        disabled={isBooked}
        onClick={() => toggleSeat(seatId)}
        whileHover={!isBooked ? { scale: 1.1 } : undefined}
        whileTap={!isBooked ? { scale: 0.95 } : undefined}
        className={`relative w-10 h-12 md:w-12 md:h-14 rounded-t-xl rounded-b-md flex items-center justify-center font-bold text-xs md:text-sm transition-all cursor-pointer ${
          isBooked
            ? "bg-white/[0.02] border border-white/5 text-white/10 cursor-not-allowed"
            : isSelected
            ? "bg-cyan-glow border border-cyan-glow text-void shadow-[0_4px_20px_rgba(6,214,160,0.4)] -translate-y-1"
            : zone === "premium"
            ? "glass-md border border-amber-glow/20 text-amber-glow hover:border-amber-glow/40"
            : "glass border border-white/10 text-silver hover:border-cyan-glow/30 hover:text-frost"
        }`}
      >
        {seatId}
        {zone === "premium" && !isBooked && !isSelected && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-glow rounded-full" />
        )}
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-void">
      <NavHeader />

      {/* Progress Bar */}
      <div className="pt-20 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-2 py-4">
          {["Search", "Select Seat", "Pay", "Done"].map((step, i) => (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                i <= 1 ? "bg-cyan-glow text-void" : "glass text-ash"
              }`}>
                {i < 1 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden md:block ${
                i <= 1 ? "text-frost" : "text-ash"
              }`}>
                {step}
              </span>
              {i < 3 && <div className={`flex-1 h-px ${i < 1 ? "bg-cyan-glow/40" : "bg-white/5"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cabin Layout */}
        <div className="lg:col-span-2">
          <GlassCard className="p-8 flex flex-col items-center">
            <h2 className="text-2xl font-black font-display text-frost mb-2 flex items-center gap-2">
              <Plane className="text-cyan-glow" /> Choose Your Seat
            </h2>
            <p className="text-silver text-sm mb-6">
              Flight {operatorNo} · {from} → {destination}
            </p>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-8 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-cyan-glow" /> Selected
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded glass border border-white/10" /> Available
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded glass-md border border-amber-glow/20" />
                <span className="text-amber-glow">Premium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white/[0.02] border border-white/5" /> Taken
              </div>
            </div>

            {/* Aircraft body */}
            <div className="glass-md p-6 md:p-8 rounded-[40px] relative">
              {/* Nose */}
              <div className="w-24 h-12 bg-gradient-to-b from-white/5 to-transparent rounded-t-full mx-auto -mt-12 border-t border-x border-white/5" />

              <div className="space-y-3 mt-4">
                {rows.map((row) => (
                  <div key={row} className="flex gap-2 md:gap-3 items-center justify-center">
                    <div className="flex gap-1.5 md:gap-2">
                      {["A", "B", "C"].map((col) => renderSeat(`${row}${col}`, row, col))}
                    </div>
                    <div className="w-6 md:w-8 text-center text-xs font-bold text-ash">{row}</div>
                    <div className="flex gap-1.5 md:gap-2">
                      {["D", "E", "F"].map((col) => renderSeat(`${row}${col}`, row, col))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-frost flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <CheckCircle2 className="text-cyan-glow" /> Booking Summary
              </h3>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-silver">
                  <span>Base Fare (×{selectedSeats.length || 0})</span>
                  <span className="text-frost font-semibold">
                    ₹{(price * selectedSeats.length).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-silver">
                  <span>Selected Seats</span>
                  <span className="text-frost font-bold">
                    {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                  </span>
                </div>
                <div className="h-px bg-white/5 my-3" />
                <div className="flex justify-between text-lg font-black">
                  <span className="text-frost">Total</span>
                  <span className="text-cyan-glow">
                    ₹{(price * selectedSeats.length).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-rose-glow/10 border border-rose-glow/20 text-rose-glow rounded-xl px-3 py-2 text-sm mb-4"
                >
                  {error}
                </motion.div>
              )}

              <button
                onClick={handleLockAndContinue}
                disabled={locking || selectedSeats.length === 0}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
              >
                {locking ? (
                  <span className="animate-pulse">Locking seats...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-xs text-ash text-center mt-3 flex items-center justify-center gap-1">
                <Info className="w-3 h-3" /> Seats locked for 10 minutes
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SeatSelection() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-glow border-t-transparent animate-spin" />
      </div>
    }>
      <SeatContent />
    </Suspense>
  );
}
