"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PlaneTakeoff, Train, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SeatClass { name: string; price: number; }
interface TravelResult {
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
  classes: SeatClass[];
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const mode = searchParams.get('mode') || 'flights';
  const carrier = searchParams.get('carrier') || 'IndiGo';
  const from = searchParams.get('from') || 'DEL';
  const to = searchParams.get('to') || 'BOM';
  const date = searchParams.get('date') || '';
  const pax = searchParams.get('pax') || '1';

  const [results, setResults] = useState<TravelResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
        const response = await axios.get(`${API_URL}/api/search`, {
          params: { mode, carrier, from, to, date, pax },
          withCredentials: true
        });
        setResults(response.data.data);
      } catch (error) {
        console.error("Search Gateway Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [mode, carrier, from, to, date, pax]);

  const handleSeatSelection = (result: TravelResult, price: number) => {
    router.push(`/seat-selection?mode=${result.mode}&operatorNo=${result.flightNumber}&from=${from}&destination=${to}&price=${price}&date=${date}`);
  };

  return (
    <div className="bg-[#020617] min-h-screen text-white pb-24">
      {/* HEADER WIDGET */}
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="bg-accent/10 p-5 rounded-3xl border border-accent/20 backdrop-blur-xl">
              {mode === 'flights' ? <PlaneTakeoff size={40} className="text-accent" /> : <Train size={40} className="text-accent" />}
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2 flex items-center gap-4 tracking-tight">
                {from} <ArrowRight className="text-accent" size={24} strokeWidth={3} /> {to}
              </h1>
              <p className="text-gray-400 font-extrabold uppercase tracking-[0.2em] text-xs">
                {new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}  ·  {pax} TRAVELERS
              </p>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end gap-2">
            <div className="bg-accent text-navy font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-widest">{carrier}</div>
            <span className="text-accent font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 px-3 py-1 rounded-lg border border-accent/20 bg-accent/5"><ShieldCheck size={14} /> Amadeus Live</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 flex gap-8 items-start">
        {/* FILTERS SIDEBAR */}
        <div className="hidden lg:block w-72 acrylic-glass p-8 rounded-[32px] flex-shrink-0 animate-fade-up">
          <h3 className="font-black text-xs uppercase tracking-[0.3em] text-accent mb-8 flex items-center gap-3"> Filter Deck</h3>
          <div className="space-y-8">
            <div>
              <h4 className="font-black text-[10px] text-gray-500 uppercase tracking-[0.3em] mb-4">TRANSIT STOPS</h4>
              <label className="flex items-center gap-4 mb-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-accent bg-white/5 border-white/10 rounded-lg" />
                <span className="text-sm font-extrabold text-gray-300 group-hover:text-white transition-colors">Direct Only</span>
              </label>
              <label className="flex items-center gap-4 mb-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-accent bg-white/5 border-white/10 rounded-lg" />
                <span className="text-sm font-extrabold text-gray-300 group-hover:text-white transition-colors">1+ Connecting</span>
              </label>
            </div>
            <div className="h-px bg-white/5" />
            <div>
              <h4 className="font-black text-[10px] text-gray-500 uppercase tracking-[0.3em] mb-4">DEPARTURE WINDOW</h4>
              {['Morning', 'Afternoon', 'Evening'].map(time => (
                <label key={time} className="flex items-center gap-4 mb-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 accent-accent bg-white/5 border-white/10 rounded-lg" />
                  <span className="text-sm font-extrabold text-gray-300 group-hover:text-white transition-colors">{time}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RESULTS FEED */}
        <div className="flex-1 space-y-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="acrylic-glass h-56 rounded-[32px] animate-pulse flex p-8 gap-8">
                <div className="w-20 h-20 bg-white/5 rounded-2xl" />
                <div className="flex-1 space-y-6">
                  <div className="h-8 w-1/3 bg-white/5 rounded-xl" />
                  <div className="h-24 bg-white/5 rounded-2xl" />
                </div>
              </div>
            ))
          ) : results.length === 0 ? (
            <div className="acrylic-glass p-20 text-center rounded-[40px] border-dashed border-white/10">
              <div className="text-6xl mb-8 opacity-50">🛰️</div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">Signal Interrupted</h3>
              <p className="text-gray-500 font-extrabold uppercase tracking-widest text-sm max-w-sm mx-auto">We couldn't negotiate a handshake with the remote Amadeus servers for this sector.</p>
              <button onClick={() => router.push('/')} className="mt-10 px-8 py-4 bg-accent text-navy font-black rounded-2xl hover:scale-105 transition-transform uppercase tracking-tighter">Modify Search</button>
            </div>
          ) : (
            results.map((result) => (
              <div key={result.id} className="acrylic-glass rounded-[32px] hover:border-accent/40 transition-all group/card flex flex-col md:flex-row shadow-2xl overflow-hidden">
                
                {/* Flight Data Left */}
                <div className="p-8 flex-1 flex flex-col justify-between gap-10">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-6 items-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center font-black text-accent text-xl border border-white/10 group-hover/card:bg-accent group-hover/card:text-navy transition-all">
                        {result.carrier.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-black text-2xl text-white tracking-tight">{result.carrier}</h3>
                        <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mt-1">{result.flightNumber}  ·  {result.baggage}</p>
                      </div>
                    </div>
                    <div className="bg-accent/10 text-accent font-black text-[10px] px-3 py-1.5 flex items-center gap-2 rounded-lg border border-accent/20 uppercase tracking-widest">
                      <CheckCircle2 size={14} /> {result.onTimeRating}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-center px-4">
                    <div className="text-left">
                      <div className="text-4xl font-black text-white tracking-tighter mb-1">{result.departure}</div>
                      <div className="text-accent font-black text-xs uppercase tracking-[0.3em]">{from}</div>
                    </div>
                    <div className="flex-1 px-12 relative flex flex-col items-center">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">{result.duration}</span>
                      <div className="w-full h-px bg-white/10 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#020617] px-4 text-accent drop-shadow-[0_0_10px_rgba(0,210,255,0.5)]">
                          {mode === 'flights' ? <PlaneTakeoff size={24} /> : <Train size={24} />}
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mt-3">{result.stops}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black text-white tracking-tighter mb-1">{result.arrival}</div>
                      <div className="text-accent font-black text-xs uppercase tracking-[0.3em]">{to}</div>
                    </div>
                  </div>
                </div>

                {/* Price Interaction Right */}
                <div className="bg-white/[0.02] p-8 flex flex-col justify-center gap-4 w-full md:w-80 shrink-0 border-l border-white/5">
                  {result.classes.map(cls => (
                    <button 
                      key={cls.name}
                      onClick={() => handleSeatSelection(result, cls.price)}
                      className="w-full bg-white/5 border border-white/10 hover:border-accent shadow-xl rounded-[24px] p-5 text-left transition-all hover:bg-white/10 group flex justify-between items-center"
                    >
                      <div>
                        <div className="font-black text-[10px] text-gray-500 uppercase tracking-[0.3em] mb-1">{cls.name} LUXE</div>
                        <div className="text-white font-black text-2xl group-hover:text-accent tracking-tighter transition-colors">₹{cls.price.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-navy transition-all">
                        <ArrowRight size={20} strokeWidth={3} />
                      </div>
                    </button>
                  ))}
                  <p className="text-center text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mt-2">Verified Transit Inventory</p>
                </div>
                
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-navy font-bold">Querying Amadeus Infrastructure...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
