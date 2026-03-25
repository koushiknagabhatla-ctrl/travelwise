"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, PlaneTakeoff, Navigation, Crosshair } from 'lucide-react';

interface Airport {
  code: string;
  name: string;
  city: string;
  terminals: number;
  lat: number;
  lng: number;
}

export default function AirportInfo() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
        const res = await axios.get(`${API_URL}/api/airports`);
        if (res.data.success) {
          setAirports(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch OpenFlights data');
      } finally {
        setLoading(false);
      }
    };
    fetchAirports();
  }, []);

  return (
    <div className="bg-[#020617] min-h-screen pt-32 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-20 animate-fade-up">
          <span className="inline-block py-2 px-6 rounded-full bg-accent/10 text-accent font-black text-[10px] uppercase tracking-[0.4em] mb-6 border border-accent/20">
            OpenFlights Global Infrastructure · 2026
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">Strategic Gateways Portfolio</h1>
          <p className="text-gray-500 font-extrabold uppercase tracking-[0.3em] text-xs max-w-3xl mx-auto leading-relaxed">
            Live metadata exposing coordinate geometry, terminal density, and operational operational footprints across our Indian transit corridors.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="acrylic-glass h-72 rounded-[32px] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {airports.map(apt => (
              <div key={apt.code} className="acrylic-glass rounded-[40px] border border-white/5 p-8 flex flex-col relative overflow-hidden group hover:border-accent/40 transition-all hover:-translate-y-2 shadow-2xl">
                
                {/* Decorative Map BG Simulation */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000 pointer-events-none" />

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <div className="flex items-center gap-3 text-accent font-black text-[10px] uppercase tracking-[0.3em] mb-3">
                      <MapPin size={16} strokeWidth={3} /> {apt.city}, IN
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter leading-tight line-clamp-2">{apt.name}</h3>
                  </div>
                  <div className="bg-white text-navy px-4 py-2 rounded-2xl font-black text-sm shadow-xl shadow-accent/10">
                    {apt.code}
                  </div>
                </div>

                <div className="mt-auto space-y-4 relative z-10">
                  <div className="bg-white/5 p-4 rounded-2xl flex justify-between items-center border border-white/5">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3"><Crosshair size={16} className="text-accent"/> COORDINATES</span>
                    <span className="text-xs font-black font-mono text-white tracking-widest">{apt.lat.toFixed(4)}N, {apt.lng.toFixed(4)}E</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl flex justify-between items-center border border-white/5">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3"><Navigation size={16} className="text-accent"/> TERMINAL LOAD</span>
                    <span className="text-xs font-black text-accent bg-accent/10 px-3 py-1 rounded-lg border border-accent/20">OPERATIONAL T{apt.terminals}</span>
                  </div>
                </div>

                {/* Simulated Google Maps/OpenWeather button action */}
                <button 
                  onClick={() => window.location.href = `/tracking?flightId=${apt.code}-AIR-CORRIDOR`}
                  className="mt-8 w-full bg-white text-navy hover:scale-105 active:scale-95 py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest"
                >
                  <PlaneTakeoff size={18} strokeWidth={3} /> Interrogate Flight Corridors
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
