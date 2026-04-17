"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import NavHeader from "../components/ui/nav-header";
import { Card } from "../components/ui/glass-card";
import { MapPin, Cloud, Plane, Search, Globe, Wind, Droplets, Thermometer } from "lucide-react";
import { INDIAN_AIRPORTS } from "../../lib/airports";

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
  const [airports, setAirports] = useState<Airport[]>(INDIAN_AIRPORTS as Airport[]);
  const [search, setSearch] = useState("");
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Relying on static data
  }, []);

  const handleSelectAirport = async (airport: Airport) => {
    setSelectedAirport(airport);
    try {
      const res = await axios.get(`${API}/api/weather`, {
        params: { lat: airport.lat, lon: airport.lng },
      });
      setWeather(res.data.data);
    } catch (e) {
      setWeather(null);
    }
  };

  const filtered = airports.filter(
    (a) =>
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.state && a.state.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-bg-primary">
      <NavHeader />

      {/* Header */}
      <section className="pt-28 pb-8 md:pt-36 md:pb-12 px-4 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold font-display text-text-primary mb-3"
          >
            Indian Airports
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg"
          >
            Explore {airports.length} airports across India with live weather data
          </motion.p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search by airport name, city, state, or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-12 h-13 text-base shadow-md border-border"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Airport Grid */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="bg-bg-secondary rounded-xl h-24 animate-pulse"
                      />
                    ))}
                </div>
              ) : filtered.length === 0 ? (
                <Card variant="flat" padding="lg" className="text-center">
                  <Globe className="w-10 h-10 text-text-light mx-auto mb-3" />
                  <p className="text-text-muted">No airports found matching &quot;{search}&quot;</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filtered.map((airport, idx) => (
                    <motion.div
                      key={airport.code}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                    >
                      <button
                        onClick={() => handleSelectAirport(airport)}
                        className={`w-full text-left rounded-xl p-4 transition-all cursor-pointer border ${
                          selectedAirport?.code === airport.code
                            ? "border-primary bg-primary-50 shadow-md"
                            : "border-border bg-white hover:border-primary/30 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                              selectedAirport?.code === airport.code
                                ? "bg-primary text-white"
                                : "bg-primary-50 text-primary"
                            }`}
                          >
                            {airport.code}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-text-primary truncate">
                              {airport.name}
                            </h3>
                            <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" /> {airport.city}
                              {airport.state ? `, ${airport.state}` : ""}
                            </p>
                            <div className="flex gap-3 mt-1.5 text-[10px] text-text-light">
                              <span className="badge badge-primary !text-[10px] !py-0 !px-1.5">
                                {airport.terminals} Terminal{airport.terminals > 1 ? "s" : ""}
                              </span>
                              <span className="capitalize">
                                {airport.type.replace("_", " ")}
                              </span>
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
              <div className="sticky top-24 space-y-4">
                {selectedAirport ? (
                  <>
                    <Card variant="elevated" padding="lg">
                      <div className="text-center mb-5">
                        <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                          {selectedAirport.code}
                        </div>
                        <h3 className="text-base font-bold text-text-primary">
                          {selectedAirport.name}
                        </h3>
                        <p className="text-sm text-text-muted mt-1">
                          {selectedAirport.city}
                          {selectedAirport.state ? `, ${selectedAirport.state}` : ""}
                        </p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between bg-bg-secondary rounded-lg px-3 py-2.5">
                          <span className="text-text-muted">Terminals</span>
                          <span className="text-text-primary font-semibold">
                            {selectedAirport.terminals}
                          </span>
                        </div>
                        <div className="flex justify-between bg-bg-secondary rounded-lg px-3 py-2.5">
                          <span className="text-text-muted">Type</span>
                          <span className="text-text-primary font-semibold capitalize">
                            {selectedAirport.type.replace("_", " ")}
                          </span>
                        </div>
                        <div className="flex justify-between bg-bg-secondary rounded-lg px-3 py-2.5">
                          <span className="text-text-muted">Coordinates</span>
                          <span className="text-text-primary font-mono text-xs">
                            {selectedAirport.lat.toFixed(2)},{" "}
                            {selectedAirport.lng.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </Card>

                    {weather && (
                      <Card variant="default" padding="md">
                        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-3">
                          <Cloud className="w-4 h-4 text-primary" /> Current Weather
                        </h3>
                        <div className="flex items-center gap-4 mb-4">
                          {weather.iconUrl && (
                            <img src={weather.iconUrl} alt="" className="w-14 h-14" />
                          )}
                          <div>
                            <div className="text-3xl font-extrabold text-text-primary">
                              {weather.temp}°C
                            </div>
                            <div className="text-sm text-text-muted capitalize">
                              {weather.description}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-bg-secondary rounded-lg px-3 py-2 flex items-center gap-1.5">
                            <Droplets className="w-3.5 h-3.5 text-primary" />
                            <span className="text-text-muted">Humidity</span>
                            <span className="text-text-primary font-semibold ml-auto">
                              {weather.humidity}%
                            </span>
                          </div>
                          <div className="bg-bg-secondary rounded-lg px-3 py-2 flex items-center gap-1.5">
                            <Wind className="w-3.5 h-3.5 text-primary" />
                            <span className="text-text-muted">Wind</span>
                            <span className="text-text-primary font-semibold ml-auto">
                              {weather.windSpeed} m/s
                            </span>
                          </div>
                        </div>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card variant="flat" padding="lg" className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-border-light flex items-center justify-center mx-auto mb-3">
                      <Plane className="w-7 h-7 text-text-light" />
                    </div>
                    <p className="text-text-muted text-sm">
                      Select an airport to view details and weather
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
