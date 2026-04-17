"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Smartphone, CheckCircle2, ArrowRight, Plane, Lock } from "lucide-react";
import axios from "axios";
import NavHeader from "../components/ui/nav-header";
import { GlassCard } from "../components/ui/glass-card";
import { useAuth } from "../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";
const BOOKING_FEE = 299;

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [pnr, setPnr] = useState("");

  const price = parseInt(searchParams.get("price") || "0", 10);
  const from = searchParams.get("from") || "DEL";
  const destination = searchParams.get("destination") || "";
  const operatorNo = searchParams.get("operatorNo") || "";
  const mode = searchParams.get("mode") || "flights";
  const seat = searchParams.get("seat") || "";
  const date = searchParams.get("date") || "";

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Please sign in");
    setProcessing(true);
    try {
      const rzpRes = await axios.post(`${API}/api/payment/create-order`, {
        amount: price + BOOKING_FEE,
        currency: "INR",
      });
      if (rzpRes.data.success) {
        const bookRes = await axios.post(`${API}/api/booking/create`, {
          userId: user.id || "usr_anonymous",
          operatorMode: mode,
          operatorNo,
          origin: from,
          destination,
          travelDate: date,
          totalFare: price + BOOKING_FEE,
          seats: seat.split(","),
        });
        if (bookRes.data.booking?.pnr) setPnr(bookRes.data.booking.pnr);
        setTimeout(() => { setSuccess(true); setProcessing(false); }, 1200);
      }
    } catch (err) {
      alert("Payment processing failed");
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <GlassCard className="max-w-lg w-full p-10 text-center" glow="cyan">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-cyan-glow/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-cyan-glow" />
            </motion.div>
            <h2 className="text-3xl font-black font-display text-frost mb-2">Booking Confirmed!</h2>
            <p className="text-silver mb-6">
              Flight <span className="text-frost font-bold">{operatorNo}</span> to{" "}
              <span className="text-frost font-bold">{destination}</span>
            </p>
            {pnr && (
              <div className="glass rounded-xl px-4 py-3 mb-6">
                <span className="text-xs text-ash">PNR</span>
                <div className="text-xl font-mono font-black text-cyan-glow tracking-wider">{pnr}</div>
              </div>
            )}
            <div className="glass rounded-xl p-4 text-sm text-silver space-y-2 mb-6 text-left">
              <div className="flex justify-between">
                <span>Seats</span>
                <span className="text-frost font-bold">{seat.split(",").join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span>Fare</span>
                <span className="text-frost">₹{price.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Booking fee</span>
                <span className="text-frost">₹{BOOKING_FEE}</span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex justify-between font-bold text-lg">
                <span className="text-frost">Total paid</span>
                <span className="text-cyan-glow">₹{(price + BOOKING_FEE).toLocaleString("en-IN")}</span>
              </div>
            </div>
            <button
              onClick={() => router.push("/")}
              className="btn-primary w-full py-3 cursor-pointer"
            >
              Back to Home
            </button>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void">
      <NavHeader />

      {/* Progress Bar */}
      <div className="pt-20 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-2 py-4">
          {["Search", "Select Seat", "Pay", "Done"].map((step, i) => (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                i <= 2 ? "bg-cyan-glow text-void" : "glass text-ash"
              }`}>
                {i < 2 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden md:block ${i <= 2 ? "text-frost" : "text-ash"}`}>
                {step}
              </span>
              {i < 3 && <div className={`flex-1 h-px ${i < 2 ? "bg-cyan-glow/40" : "bg-white/5"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <GlassCard className="p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-glow/10 to-transparent p-6 border-b border-white/5">
              <h2 className="text-xl font-black font-display text-frost flex items-center gap-2">
                <ShieldCheck className="text-cyan-glow" /> Secure Checkout
              </h2>
              <p className="text-sm text-silver mt-1">256-bit encrypted payment processing</p>
            </div>

            {/* Payment Method Tabs */}
            <div className="flex border-b border-white/5">
              <button
                onClick={() => setPaymentMethod("upi")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all cursor-pointer ${
                  paymentMethod === "upi"
                    ? "text-cyan-glow border-b-2 border-cyan-glow bg-white/[0.02]"
                    : "text-ash hover:text-frost"
                }`}
              >
                <Smartphone className="w-4 h-4" /> UPI
              </button>
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all cursor-pointer ${
                  paymentMethod === "card"
                    ? "text-cyan-glow border-b-2 border-cyan-glow bg-white/[0.02]"
                    : "text-ash hover:text-frost"
                }`}
              >
                <CreditCard className="w-4 h-4" /> Card
              </button>
            </div>

            <form onSubmit={handlePayment} className="p-6 md:p-8 space-y-6 flex flex-col min-h-[250px]">
              {paymentMethod === "upi" ? (
                <div>
                  <label className="text-xs font-bold text-ash uppercase tracking-wider block mb-2">UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    required
                    className="input-glass"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-ash uppercase tracking-wider block mb-2">Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} required className="input-glass font-mono" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-ash uppercase tracking-wider block mb-2">Expiry</label>
                      <input type="text" placeholder="MM/YY" maxLength={5} required className="input-glass" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-ash uppercase tracking-wider block mb-2">CVV</label>
                      <input type="password" placeholder="•••" maxLength={3} required className="input-glass tracking-widest" />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 mt-auto cursor-pointer disabled:opacity-50"
              >
                {processing ? (
                  <span className="animate-pulse">Processing payment...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay ₹{(price + BOOKING_FEE).toLocaleString("en-IN")} Securely
                  </>
                )}
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-frost mb-4 pb-3 border-b border-white/5">
                Itinerary
              </h3>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-silver">
                  <span>Route</span>
                  <span className="text-frost font-semibold">{from} → {destination}</span>
                </div>
                <div className="flex justify-between text-silver">
                  <span>Flight</span>
                  <span className="text-frost">{operatorNo}</span>
                </div>
                <div className="flex justify-between text-silver">
                  <span>Seats</span>
                  <span className="text-frost font-bold">{seat.split(",").join(", ")}</span>
                </div>
                <div className="flex justify-between text-silver">
                  <span>Date</span>
                  <span className="text-frost">{date}</span>
                </div>
              </div>
              <div className="glass rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-silver">
                  <span>Base fare</span>
                  <span className="text-frost">₹{price.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-silver">
                  <span>Platform fee</span>
                  <span className="text-frost">₹{BOOKING_FEE}</span>
                </div>
                <div className="h-px bg-white/5 my-1" />
                <div className="flex justify-between font-black text-xl">
                  <span className="text-frost">Total</span>
                  <span className="text-cyan-glow">₹{(price + BOOKING_FEE).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-glow border-t-transparent animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
