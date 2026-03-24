"use client";

import { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { Plane, Navigation, Zap, Clock } from 'lucide-react';

interface Telemetry {
  flightStr: string;
  velocity: number;
  altitude: number;
  heading: number;
  coordinates: [number, number];
  eta: string;
}

function LiveTrackingContent() {
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await axios.get('http://localhost:5002/api/tracking/live?flightId=IG-305');
        if (res.data.success) {
          setTelemetry(res.data.telemetry);
          setPulse(true);
          setTimeout(() => setPulse(false), 1000);
        }
      } catch (error) {
        console.error('Tracking Interrupted');
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 30000); // Poll every 30s strictly mapped to requirements
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 text-navy flex flex-col">
      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col items-center">
        
        <div className="text-center mb-8">
          <span className={`inline-block py-1 px-4 rounded-full font-bold text-xs tracking-widest mb-4 border transition-colors ${pulse ? 'bg-green-100 text-green-600 border-green-200' : 'bg-accent/10 text-accent border-accent/20'}`}>
            OPENSKY NETWORK ADS-B ACTIVE
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Geospatial Radar</h1>
          <p className="text-gray-500 font-medium">Tracking {telemetry?.flightStr || 'Flight...'} via Mapbox GL Integrations.</p>
        </div>

        {/* MOCK MAPBOX GL JS RENDERER */}
        <div className="w-full max-w-5xl h-[500px] bg-[#1A1A2E] rounded-3xl shadow-soft relative overflow-hidden border-4 border-white mb-8 group flex items-center justify-center">
            {/* Visual simulation of Mapbox GL dark style */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e0/Map_of_India_showing_borders_and_major_cities.png')] bg-cover bg-center pointer-events-none filter grayscale mix-blend-screen" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] via-transparent to-[#1A1A2E] opacity-80 pointer-events-none" />

            {telemetry ? (
              <div className="relative z-10 flex flex-col items-center gap-2 animate-fade-up">
                <div className={`p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-transform duration-1000 ease-in-out ${pulse ? 'scale-110 shadow-[0_0_30px_rgba(255,255,255,0.4)]' : 'scale-100'}`}>
                  <Plane className="text-white w-8 h-8" style={{ transform: `rotate(${telemetry.heading}deg)` }} />
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-soft font-bold text-sm text-center">
                  <div className="text-accent">{telemetry.flightStr}</div>
                  <div className="text-gray-400 text-xs">Lat: {telemetry.coordinates[1].toFixed(2)}  ·  Lng: {telemetry.coordinates[0].toFixed(2)}</div>
                </div>
              </div>
            ) : (
              <div className="text-white font-bold animate-pulse">Establishing Satlink...</div>
            )}
        </div>

        {/* METRICS DASHBOARD */}
        {telemetry && (
          <div className="max-w-5xl w-full grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
               <Navigation size={24} className="mx-auto text-accent mb-2" />
               <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Heading</div>
               <div className="text-2xl font-black text-navy">{telemetry.heading}°</div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
               <Plane size={24} className="mx-auto text-accent mb-2" />
               <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Altitude</div>
               <div className="text-2xl font-black text-navy">{telemetry.altitude.toLocaleString()} <span className="text-sm font-semibold">FT</span></div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
               <Zap size={24} className="mx-auto text-accent mb-2" />
               <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Ground Speed</div>
               <div className="text-2xl font-black text-navy">{telemetry.velocity} <span className="text-sm font-semibold">KMPH</span></div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
               <Clock size={24} className="mx-auto text-accent mb-2" />
               <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Current ETA</div>
               <div className="text-2xl font-black text-accent">{telemetry.eta}</div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function LiveTracking() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold">Initializing Mapbox...</div>}>
      <LiveTrackingContent />
    </Suspense>
  );
}
