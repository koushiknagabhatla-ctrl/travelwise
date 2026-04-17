"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import NavHeader from "../components/ui/nav-header";
import { GlassCard } from "../components/ui/glass-card";
import { MapPin, Cloud, Plane, Search, ExternalLink, Globe } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";

interface Airport {
  code: string;
  name: string;
  city: string;
  state?: string;
  terminals: number;
  lat: number;
  lng: number;
  type: string;
}

export default function AirportInfoPage() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [search, setSearch] = useState("");
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const res = await axios.get(`${API}/api/airports`);
        setAirports(res.data.data || []);
      } catch (e) { console.error("Failed to fetch airports"); }
      finally { setLoading(false); }
    };
    fetchAirports();
  }, []);

  const handleSelectAirport = async (airport: Airport) => {
    setSelectedAirport(airport);
    try {
      const res = await axios.get(`${API}/api/weather`, { params: { lat: airport.lat, lon: airport.lng } });
      setWeather(res.data.data);
    } catch (e) { setWeather(null); }
  };

  const filtered = airports.filter((a) =>
    a.code.toLowerCase().includes(search.toLowerCase()) ||
    a.city.toLowerCase().includes(search.toLowerCase()) ||
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-void">
      <NavHeader />
      <div className="pt-28 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-4xl font-black font-display gradient-text-frost mb-3">Indian Airports</h1>
            <p className="text-silver">Explore {airports.length} airports across India with live weather data</p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard className="p-4 mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
                <input
                  type="text" placeholder="Search by airport name, city, or code..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="input-glass pl-10"
                />
              </div>
            </GlassCard>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Airport Grid */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="glass-card rounded-xl h-24 animate-shimmer" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filtered.map((airport, idx) => (
                    <motion.div
                      key={airport.code}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <button
                        onClick={() => handleSelectAirport(airport)}
                        className={`w-full text-left glass rounded-xl p-4 transition-all cursor-pointer hover:bg-white/5 ${
                          selectedAirport?.code === airport.code ? "border-cyan-glow/30 glow-cyan" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl glass-md flex items-center justify-center font-black text-cyan-glow text-sm flex-shrink-0">
                            {airport.code}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-frost truncate">{airport.name}</h3>
                            <p className="text-xs text-silver flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" /> {airport.city}{airport.state ? `, ${airport.state}` : ""}
                            </p>
                            <div className="flex gap-3 mt-1.5 text-[10px] text-ash">
                              <span>{airport.terminals} Terminal{airport.terminals > 1 ? "s" : ""}</span>
                              <span>{airport.type.replace("_", " ")}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Detail Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-4">
                {selectedAirport ? (
                  <>
                    <GlassCard className="p-6" glow="subtle">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-black text-cyan-glow font-display mb-1">{selectedAirport.code}</div>
                        <h3 className="text-sm font-bold text-frost">{selectedAirport.name}</h3>
                        <p className="text-xs text-silver mt-1">{selectedAirport.city}{selectedAirport.state ? `, ${selectedAirport.state}` : ""}</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-silver glass rounded-lg px-3 py-2">
                          <span>Terminals</span>
                          <span className="text-frost font-bold">{selectedAirport.terminals}</span>
                        </div>
                        <div className="flex justify-between text-silver glass rounded-lg px-3 py-2">
                          <span>Type</span>
                          <span className="text-frost font-bold capitalize">{selectedAirport.type.replace("_", " ")}</span>
                        </div>
                        <div className="flex justify-between text-silver glass rounded-lg px-3 py-2">
                          <span>Coordinates</span>
                          <span className="text-frost font-mono text-xs">{selectedAirport.lat.toFixed(2)}, {selectedAirport.lng.toFixed(2)}</span>
                        </div>
                      </div>
                    </GlassCard>

                    {weather && (
                      <GlassCard className="p-5">
                        <h3 className="text-sm font-bold text-frost flex items-center gap-2 mb-3">
                          <Cloud className="w-4 h-4 text-cyan-glow" /> Current Weather
                        </h3>
                        <div className="flex items-center gap-4 mb-3">
                          {weather.iconUrl && <img src={weather.iconUrl} alt="" className="w-14 h-14" />}
                          <div>
                            <div className="text-3xl font-black text-frost">{weather.temp}°C</div>
                            <div className="text-sm text-silver capitalize">{weather.description}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="glass rounded-lg px-2 py-1.5"><span className="text-ash">Humidity</span> <span className="text-frost font-bold ml-1">{weather.humidity}%</span></div>
                          <div className="glass rounded-lg px-2 py-1.5"><span className="text-ash">Wind</span> <span className="text-frost font-bold ml-1">{weather.windSpeed} m/s</span></div>
                        </div>
                      </GlassCard>
                    )}
                  </>
                ) : (
                  <GlassCard className="p-8 text-center">
                    <Globe className="w-10 h-10 text-ash mx-auto mb-3" />
                    <p className="text-silver text-sm">Select an airport to view details and weather</p>
                  </GlassCard>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
