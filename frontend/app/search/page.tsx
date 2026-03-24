"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PlaneTakeoff, Train, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

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
        const response = await axios.get(`http://localhost:5002/api/search`, {
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
    router.push(`/seat-selection?mode=${result.mode}&operatorNo=${result.flightNumber}&destination=${to}&price=${price}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen text-navy pb-24">
      {/* HEADER WIDGET */}
      <div className="bg-navy text-white pt-10 pb-16 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              {mode === 'flights' ? <PlaneTakeoff size={32} className="text-accent" /> : <Train size={32} className="text-accent" />}
            </div>
            <div>
              <h1 className="text-3xl font-black mb-1 flex items-center gap-3">
                {from} <ArrowRight className="text-gray-400" /> {to}
              </h1>
              <p className="text-gray-400 font-medium">
                {new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}  ·  {pax} Passenger(s)
              </p>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end gap-1">
            <div className="bg-white text-navy font-bold text-sm px-3 py-1 rounded-full">{carrier}</div>
            <span className="text-green-400 font-semibold text-sm flex items-center gap-1"><ShieldCheck size={16} /> Amadeus Live</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8 flex gap-8 items-start">
        {/* FILTERS SIDEBAR */}
        <div className="hidden lg:block w-72 bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex-shrink-0">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Clock size={20} className="text-accent" /> Filter Results</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-500 mb-3 text-sm">STOPS</h4>
              <label className="flex items-center gap-3 mb-2 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-accent rounded focus:ring-accent" /><span className="text-sm font-medium">Direct</span></label>
              <label className="flex items-center gap-3 mb-2 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-accent rounded focus:ring-accent" /><span className="text-sm font-medium">1 Stop</span></label>
            </div>
            <div className="h-px bg-gray-100 my-4" />
            <div>
              <h4 className="font-semibold text-gray-500 mb-3 text-sm">DEPARTURE TIME</h4>
              <label className="flex items-center gap-3 mb-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-accent" /><span className="text-sm font-medium">Morning (06:00 - 12:00)</span></label>
              <label className="flex items-center gap-3 mb-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-accent" /><span className="text-sm font-medium">Afternoon (12:00 - 18:00)</span></label>
              <label className="flex items-center gap-3 mb-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-accent" /><span className="text-sm font-medium">Evening (18:00 - 00:00)</span></label>
            </div>
          </div>
        </div>

        {/* RESULTS FEED */}
        <div className="flex-1 space-y-4">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white h-48 rounded-2xl border border-gray-100 shadow-sm animate-pulse flex p-6 gap-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full" />
                <div className="flex-1 space-y-4">
                  <div className="h-6 w-1/3 bg-gray-100 rounded" />
                  <div className="h-20 bg-gray-50 rounded" />
                </div>
              </div>
            ))
          ) : results.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl shadow-soft">
              <span className="text-5xl mb-4 block">✈️</span>
              <h3 className="text-2xl font-bold mb-2">No Routes Found</h3>
              <p className="text-gray-500">We couldn't connect to remote Amadeus servers for this date.</p>
            </div>
          ) : (
            results.map((result) => (
              <div key={result.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-soft transition-shadow overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
                
                {/* Flight Data Left */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center font-bold text-navy text-sm border border-navy/10">
                        {result.carrier.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-navy">{result.carrier}</h3>
                        <p className="text-gray-500 text-sm font-medium">{result.flightNumber}  ·  {result.baggage}</p>
                      </div>
                    </div>
                    <div className="bg-green-50 text-green-600 font-bold text-xs px-2 py-1 flex items-center gap-1 rounded">
                      <CheckCircle2 size={14} /> ON TIME {result.onTimeRating}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-center px-4">
                    <div>
                      <div className="text-2xl font-black text-navy">{result.departure}</div>
                      <div className="text-gray-500 font-semibold">{from}</div>
                    </div>
                    <div className="flex-1 px-8 relative flex flex-col items-center">
                      <span className="text-xs font-bold text-gray-400 mb-1">{result.duration}</span>
                      <div className="w-full h-[2px] bg-gray-200 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-400">
                          {mode === 'flights' ? <PlaneTakeoff size={18} /> : <Train size={18} />}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-accent mt-1">{result.stops}</span>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-navy">{result.arrival}</div>
                      <div className="text-gray-500 font-semibold">{to}</div>
                    </div>
                  </div>
                </div>

                {/* Price Interaction Right */}
                <div className="bg-gray-50 p-6 flex flex-col justify-center gap-3 w-full md:w-64 shrink-0">
                  {result.classes.map(cls => (
                    <button 
                      key={cls.name}
                      onClick={() => handleSeatSelection(result, cls.price)}
                      className="w-full bg-white border-2 border-transparent hover:border-accent shadow-sm rounded-xl p-3 text-left transition-all hover:shadow-accent group flex justify-between items-center"
                    >
                      <div>
                        <div className="font-bold text-navy text-sm">{cls.name}</div>
                        <div className="text-accent font-black text-lg group-hover:text-accent-hover">₹{cls.price.toLocaleString('en-IN')}</div>
                      </div>
                      <ArrowRight size={18} className="text-gray-300 group-hover:text-accent transition-colors" />
                    </button>
                  ))}
                  <p className="text-center text-xs text-gray-400 font-medium mt-1">Free 10-Minute UI Seat Lock</p>
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
