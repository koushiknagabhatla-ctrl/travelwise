"use client";

import { useEffect, useState, Suspense } from 'react';
import { io } from 'socket.io-client';
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
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
    const socket = io(API_URL, {
      transports: ['websocket'], // Force WebSocket for better real-time performance
    });

    socket.on('connect', () => {
      console.log('📡 Connected to Satellite Core');
    });

    socket.on('telemetryUpdate', (data: Telemetry) => {
      setTelemetry(data);
      setPulse(true);
      // Faster pulse reset for more responsive feeling
      const timer = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(timer);
    });

    socket.on('connect_error', (err: { message: string }) => {
      console.error('🛰 Satellite Link Interrupted:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="bg-[#020617] min-h-screen pt-32 pb-24 text-white flex flex-col">
      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col items-center">
        
        <div className="text-center mb-16 animate-fade-up">
          <span className={`inline-block py-2 px-6 rounded-full font-black text-[10px] uppercase tracking-[0.4em] mb-6 border transition-all duration-500 ${pulse ? 'bg-green-500/20 text-green-400 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-accent/10 text-accent border-accent/20'}`}>
            {pulse ? 'SATELLITE SYNC ACTIVE' : 'OPEN SKY NETWORK · ADS-B'}
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">Geospatial Intercept Radar</h1>
          <p className="text-gray-500 font-extrabold uppercase tracking-[0.3em] text-xs max-w-2xl mx-auto leading-relaxed">
            Live telemetry tracking <span className="text-white">{telemetry?.flightStr || 'Transit Identification...'}</span> via encrypted Mapbox GL layers.
          </p>
        </div>

        {/* MOCK MAPBOX GL JS RENDERER */}
        <div className="w-full max-w-5xl h-[550px] bg-[#0f172a] rounded-[60px] shadow-2xl relative overflow-hidden border-[16px] border-white/5 mb-12 group flex items-center justify-center backdrop-blur-3xl">
            {/* Visual simulation of Mapbox GL dark style */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e0/Map_of_India_showing_borders_and_major_cities.png')] bg-cover bg-center pointer-events-none filter invert mix-blend-screen scale-110 group-hover:scale-100 transition-transform duration-[10s]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617] opacity-90 pointer-events-none" />
            
            {/* Radar Sweep Effect */}
            <div className="absolute w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,rgba(230,57,70,0.1)_0deg,transparent_90deg)] animate-[spin_4s_linear_infinite] pointer-events-none opacity-20" />

            {telemetry ? (
              <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-up">
                <div className={`p-8 rounded-[32px] bg-white/5 backdrop-blur-3xl border border-white/10 transition-all duration-1000 ease-in-out shadow-2xl ${pulse ? 'scale-110 border-accent/40 shadow-[0_0_50px_rgba(230,57,70,0.2)]' : 'scale-100'}`}>
                  <Plane className="text-accent w-12 h-12 drop-shadow-[0_0_15px_rgba(230,57,70,0.5)] transition-transform duration-500" style={{ transform: `rotate(${telemetry.heading - 45}deg)` }} />
                </div>
                <div className="acrylic-glass px-8 py-5 rounded-[32px] border border-white/10 shadow-2xl text-center group-hover:border-accent/30 transition-all">
                  <div className="text-xl font-black tracking-tighter text-white mb-1">IDENT: {telemetry.flightStr}</div>
                  <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] font-mono">POS: {telemetry.coordinates[1].toFixed(4)}N / {telemetry.coordinates[0].toFixed(4)}E</div>
                </div>
              </div>
            ) : (
              <div className="text-accent font-black uppercase tracking-[0.5em] animate-pulse text-sm">Targeting Satlink...</div>
            )}

            {/* Corner Metadata */}
            <div className="absolute top-8 left-8 text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] pointer-events-none">
                GRID_REF: NW.90.11 <br/>
                ZOOM: 09.522_X
            </div>
        </div>

        {/* METRICS DASHBOARD */}
        {telemetry && (
          <div className="max-w-5xl w-full grid grid-cols-2 md:grid-cols-4 gap-6">
             {[
               { icon: Navigation, label: 'AZIMUTH', value: `${telemetry.heading}°` },
               { icon: Plane, label: 'ALTITUDE', value: telemetry.altitude.toLocaleString(), unit: 'FT' },
               { icon: Zap, label: 'VELOCITY', value: telemetry.velocity, unit: 'KMPH' },
               { icon: Clock, label: 'TIME_TO_GATE', value: telemetry.eta, premium: true }
             ].map((m, idx) => (
               <div key={idx} className="acrylic-glass p-8 rounded-[32px] border border-white/5 text-center group hover:border-accent/30 transition-all shadow-xl">
                 <m.icon size={24} className={`mx-auto mb-4 transition-transform group-hover:scale-110 ${m.premium ? 'text-accent' : 'text-gray-500'}`} />
                 <div className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2">{m.label}</div>
                 <div className={`text-3xl font-black tracking-tighter ${m.premium ? 'text-accent' : 'text-white'}`}>
                   {m.value} {m.unit && <span className="text-xs font-extra-bold opacity-30 ml-1">{m.unit}</span>}
                 </div>
               </div>
             ))}
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
