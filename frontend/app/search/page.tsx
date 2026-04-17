"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import NavHeader from "../components/ui/nav-header";
import { Card } from "../components/ui/glass-card";
import {
  Plane, Clock, ArrowRight, Shield, CheckCircle2, Filter,
  Cloud, TrendingDown, Eye, Luggage, ChevronDown,
  Users, Star, Wind, Droplets
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";

interface FlightResult {
  id: string;
  mode: string;
  carrier: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: string;
  onTimeRating: string;
  baggage: string;
  classes: { name: string; price: number; currency?: string }[];
  totalAmount?: string;
  currency?: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from") || "DEL";
  const to = searchParams.get("to") || "BOM";
  const date = searchParams.get("date") || "";
  const pax = searchParams.get("pax") || "1";
  const carrier = searchParams.get("carrier") || "All";

  const [results, setResults] = useState<FlightResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"price" | "duration">("price");
  const [viewerCount] = useState(Math.floor(Math.random() * 40) + 12);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${API}/api/search`, {
          params: { mode: "flights", carrier, from, to, date, pax },
          withCredentials: true,
        });
        setResults(response.data.data || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [from, to, date, pax, carrier]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const airportsRes = await axios.get(`${API}/api/airports`);
        const airport = airportsRes.data.data?.find((a: any) => a.code === to);
        if (airport) {
          const weatherRes = await axios.get(`${API}/api/weather`, {
            params: { lat: airport.lat, lon: airport.lng },
          });
          setWeather(weatherRes.data.data);
        }
      } catch (e) {
        console.log("Weather unavailable");
      }
    };
    fetchWeather();
  }, [to]);

  const handleSelect = (result: FlightResult, price: number) => {
    const recent = JSON.parse(localStorage.getItem("travelwise_recent") || "[]");
    const searchStr = `${from} → ${to}`;
    if (!recent.includes(searchStr)) {
      recent.unshift(searchStr);
      localStorage.setItem("travelwise_recent", JSON.stringify(recent.slice(0, 5)));
    }
    router.push(
      `/seat-selection?mode=flights&operatorNo=${result.flightNumber}&from=${from}&destination=${to}&price=${price}&date=${date}`
    );
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "price") return (a.classes[0]?.price || 0) - (b.classes[0]?.price || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-bg-secondary">
      <NavHeader />

      {/* Header */}
      <div className="pt-24 pb-6 px-4 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold font-display text-text-primary flex items-center gap-3">
                {from} <ArrowRight className="text-accent w-5 h-5" /> {to}
              </h1>
              <p className="text-text-muted text-sm mt-1">
                {date &&
                  new Date(date).toLocaleDateString("en-IN", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric",
                  })}{" "}
                · {pax} Traveler{Number(pax) > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-accent-50 text-accent rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold">
                <Eye className="w-3.5 h-3.5" /> {viewerCount} viewing
              </span>
              <span className="bg-primary-50 text-primary rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" /> Price Guarantee
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            {/* Weather */}
            {weather && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card variant="default" padding="md">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-3">
                    <Cloud className="w-4 h-4 text-primary" /> Weather at {to}
                  </h3>
                  <div className="flex items-center gap-3">
                    {weather.iconUrl && (
                      <img src={weather.iconUrl} alt={weather.description} className="w-12 h-12" />
                    )}
                    <div>
                      <div className="text-2xl font-extrabold text-text-primary">{weather.temp}°C</div>
                      <div className="text-xs text-text-muted capitalize">{weather.description}</div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> {weather.humidity}%</span>
                    <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> {weather.windSpeed} m/s</span>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Filters */}
            <Card variant="default" padding="md">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-primary" /> Filters
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Stops</h4>
                  {["Direct", "1 Stop", "2+ Stops"].map((stop) => (
                    <label key={stop} className="flex items-center gap-2 mb-2 cursor-pointer text-sm text-text-secondary hover:text-text-primary transition-colors">
                      <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded accent-primary" />
                      {stop}
                    </label>
                  ))}
                </div>
                <div className="h-px bg-border" />
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "price" | "duration")}
                    className="input-field text-sm py-2"
                  >
                    <option value="price">Lowest Price</option>
                    <option value="duration">Shortest Duration</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Trust badges */}
            <Card variant="default" padding="md" className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <Shield className="w-4 h-4 text-success" />
                <span className="text-text-secondary">Free cancellation on select fares</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <TrendingDown className="w-4 h-4 text-primary" />
                <span className="text-text-secondary">Best price guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Luggage className="w-4 h-4 text-accent" />
                <span className="text-text-secondary">Baggage included in price</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 space-y-3">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-40 animate-pulse border border-border" />
            ))
          ) : sortedResults.length === 0 ? (
            <Card variant="default" padding="lg" className="text-center">
              <Plane className="w-12 h-12 text-text-light mx-auto mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">No flights found</h3>
              <p className="text-text-muted">Try adjusting your search dates or route.</p>
            </Card>
          ) : (
            <AnimatePresence>
              {sortedResults.map((result, idx) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <Card variant="default" padding="none" hover className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* Flight Info */}
                      <div className="flex-1 p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-sm font-bold text-primary">
                              {result.carrier.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-bold text-text-primary">{result.carrier}</h3>
                              <p className="text-xs text-text-muted">{result.flightNumber} · {result.baggage}</p>
                            </div>
                          </div>
                          {idx === 0 && (
                            <span className="bg-accent-50 text-accent rounded-full px-2.5 py-1 text-xs font-bold flex items-center gap-1">
                              <Star className="w-3 h-3" /> Best Value
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-xl font-extrabold text-text-primary">{result.departure}</div>
                            <div className="text-xs text-text-muted font-medium">{from}</div>
                          </div>
                          <div className="flex-1 flex flex-col items-center px-4">
                            <span className="text-xs text-text-muted mb-1">{result.duration}</span>
                            <div className="w-full h-px bg-border relative">
                              <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary bg-white rounded-full p-0.5" />
                            </div>
                            <span className="text-xs text-primary font-semibold mt-1">{result.stops}</span>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-extrabold text-text-primary">{result.arrival}</div>
                            <div className="text-xs text-text-muted font-medium">{to}</div>
                          </div>
                        </div>
                      </div>

                      {/* Price Panel */}
                      <div className="md:w-56 p-4 md:border-l border-t md:border-t-0 border-border bg-bg-secondary/50 flex flex-col justify-center gap-2">
                        {result.classes.map((cls) => (
                          <button
                            key={cls.name}
                            onClick={() => handleSelect(result, cls.price)}
                            className="w-full bg-white border border-border rounded-xl p-3 text-left hover:border-primary/40 hover:shadow-sm transition-all group cursor-pointer flex justify-between items-center"
                          >
                            <div>
                              <div className="text-xs text-text-muted">{cls.name}</div>
                              <div className="text-lg font-extrabold text-accent">
                                {cls.currency || "₹"}{cls.price.toLocaleString("en-IN")}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-text-light group-hover:text-primary transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-text-primary font-semibold">Searching flights...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
