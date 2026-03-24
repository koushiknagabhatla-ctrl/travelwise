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
        const res = await axios.get('http://localhost:5002/api/airports');
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
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 text-navy">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-4 rounded-full bg-accent/10 text-accent font-bold text-sm tracking-wider mb-4 border border-accent/20">
            OPEN FLIGHTS DATABASE 2026
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Indian Airport Coverage Directory</h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg hover:text-navy transition-colors">
            Comprehensive dataset exposing coordinates, terminal footprints, and live operational stats across our microservice API.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-64 shadow-sm border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {airports.map(apt => (
              <div key={apt.code} className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 flex flex-col relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(26,26,46,0.12)] transition-all hover:-translate-y-1">
                
                {/* Decorative Map BG Simulation */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-40 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm mb-1">
                      <MapPin size={16} className="text-accent" /> {apt.city}, IN
                    </div>
                    <h3 className="text-xl font-bold leading-tight line-clamp-2">{apt.name}</h3>
                  </div>
                  <div className="bg-navy text-white px-3 py-1.5 rounded-lg font-black text-sm shadow-sm ring-1 ring-white/10">
                    {apt.code}
                  </div>
                </div>

                <div className="mt-auto space-y-3 relative z-10">
                  <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center border border-gray-100">
                    <span className="text-sm font-semibold text-gray-500 flex items-center gap-2"><Crosshair size={14}/> Geometry</span>
                    <span className="text-sm font-bold font-mono text-navy">{apt.lat.toFixed(4)}, {apt.lng.toFixed(4)}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center border border-gray-100">
                    <span className="text-sm font-semibold text-gray-500 flex items-center gap-2"><Navigation size={14}/> Active Terminals</span>
                    <span className="text-sm font-bold text-navy bg-white px-2 py-0.5 rounded shadow-sm border border-gray-200">T{apt.terminals}</span>
                  </div>
                </div>

                {/* Simulated Google Maps/OpenWeather button action */}
                <button className="mt-4 w-full bg-navy hover:bg-black text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm">
                  <PlaneTakeoff size={16} className="text-white" /> View Flight Corridors
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
