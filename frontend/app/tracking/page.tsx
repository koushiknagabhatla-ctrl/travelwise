"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import NavHeader from "../components/ui/nav-header";
import { GlassCard } from "../components/ui/glass-card";
import { Plane, Search, MapPin, Clock, AlertTriangle, CheckCircle2, ArrowRight, Radio } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";

export default function TrackingPage() {
  const [flightNumber, setFlightNumber] = useState("");
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [airlines, setAirlines] = useState<any[]>([]);

  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const res = await axios.get(`${API}/api/tracking/airlines`);
        setAirlines(res.data.data || []);
      } catch (e) { /* ignore */ }
    };
    fetchAirlines();
  }, []);

  const handleTrack = async () => {
    if (!flightNumber) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/tracking/live`, {
        params: { flight: flightNumber.trim().toUpperCase() },
      });
      setTracking(res.data.telemetry);
    } catch (error) {
      console.error("Tracking failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": case "en-route": return "text-cyan-glow";
      case "landed": case "arrived": return "text-cyan-glow";
      case "scheduled": return "text-amber-glow";
      case "delayed": case "cancelled": return "text-rose-glow";
      default: return "text-silver";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": case "en-route": return <Radio className="w-4 h-4 animate-pulse" />;
      case "landed": case "arrived": return <CheckCircle2 className="w-4 h-4" />;
      case "delayed": case "cancelled": return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-void">
      <NavHeader />

      <div className="pt-28 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-black font-display gradient-text-frost mb-3">
              Live Flight Tracker
            </h1>
            <p className="text-silver max-w-md mx-auto">
              Track any flight across India in real time with live status updates
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6 mb-8">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
                  <input
                    type="text"
                    placeholder="Enter flight number (e.g., 6E2341, AI101)"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                    className="input-glass pl-10"
                  />
                </div>
                <button
                  onClick={handleTrack}
                  disabled={loading || !flightNumber}
                  className="btn-primary px-8 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span className="animate-pulse">Tracking...</span>
                  ) : (
                    <>
                      <Search className="w-4 h-4" /> Track
                    </>
                  )}
                </button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Tracking Result */}
          {tracking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="p-8 mb-8" glow={tracking.status === "active" ? "cyan" : "subtle"}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-frost font-display">
                      {tracking.airline || "Flight"} {tracking.flightStr}
                    </h2>
                    <div className={`flex items-center gap-2 text-sm font-semibold mt-1 ${getStatusColor(tracking.status)}`}>
                      {getStatusIcon(tracking.status)}
                      <span className="uppercase">{tracking.status || "Unknown"}</span>
                    </div>
                  </div>
                </div>

                {/* Flight Route */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div>
                    <div className="text-xs text-ash uppercase font-semibold mb-1">Departure</div>
                    <div className="text-xl font-black text-frost">{tracking.departure?.iata || "—"}</div>
                    <div className="text-sm text-silver">{tracking.departure?.airport || ""}</div>
                    {tracking.departure?.terminal && (
                      <div className="text-xs text-ash mt-1">Terminal {tracking.departure.terminal}</div>
                    )}
                    {tracking.departure?.scheduled && (
                      <div className="text-sm text-cyan-glow mt-1 font-mono">
                        {new Date(tracking.departure.scheduled).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    )}
                    {tracking.departure?.delay > 0 && (
                      <div className="text-xs text-rose-glow mt-1">Delayed {tracking.departure.delay} min</div>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent relative">
                      <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-cyan-glow" />
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-ash uppercase font-semibold mb-1">Arrival</div>
                    <div className="text-xl font-black text-frost">{tracking.arrival?.iata || "—"}</div>
                    <div className="text-sm text-silver">{tracking.arrival?.airport || ""}</div>
                    {tracking.arrival?.terminal && (
                      <div className="text-xs text-ash mt-1">Terminal {tracking.arrival.terminal}</div>
                    )}
                    {tracking.arrival?.scheduled && (
                      <div className="text-sm text-cyan-glow mt-1 font-mono">
                        {new Date(tracking.arrival.scheduled).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Data */}
                {tracking.live && (
                  <div className="glass rounded-xl p-4">
                    <h3 className="text-xs font-bold text-ash uppercase tracking-wider mb-3 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-cyan-glow animate-pulse" /> Live Telemetry
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-ash text-xs">Altitude</div>
                        <div className="text-frost font-bold">{Math.round(tracking.live.altitude || 0).toLocaleString()} m</div>
                      </div>
                      <div>
                        <div className="text-ash text-xs">Speed</div>
                        <div className="text-frost font-bold">{Math.round(tracking.live.speed || 0)} km/h</div>
                      </div>
                      <div>
                        <div className="text-ash text-xs">Heading</div>
                        <div className="text-frost font-bold">{Math.round(tracking.live.heading || 0)}°</div>
                      </div>
                      <div>
                        <div className="text-ash text-xs">Position</div>
                        <div className="text-frost font-bold text-xs font-mono">
                          {tracking.live.latitude?.toFixed(2)}, {tracking.live.longitude?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}

          {/* Airlines Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold font-display text-frost mb-4">Indian Airlines</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {airlines.map((airline) => (
                <button
                  key={airline.iata}
                  onClick={() => setFlightNumber(airline.iata)}
                  className="glass rounded-xl p-3 text-center hover:bg-white/5 transition-all cursor-pointer group"
                >
                  <div className="text-lg font-black text-frost group-hover:text-cyan-glow transition-colors">
                    {airline.iata}
                  </div>
                  <div className="text-xs text-ash mt-0.5">{airline.name}</div>
                  <div className="text-[10px] text-ash/60 mt-0.5">{airline.type}</div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
