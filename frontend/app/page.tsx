"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlaneTakeoff, Train, Search, MapPin, Calendar, Users } from 'lucide-react';

const AIRLINES = ['IndiGo', 'Air India', 'Vistara', 'SpiceJet', 'Akasa Air', 'GoFirst', 'Alliance Air', 'Star Air', 'Blue Dart'];
const TRAINS = ['Indian Railways (IRCTC)'];

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'flights' | 'trains'>('flights');
  const [selectedCarrier, setSelectedCarrier] = useState('IndiGo');
  
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('1');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !date) return alert('Please complete the origin, destination, and date fields.');
    router.push(`/search?mode=${activeTab}&carrier=${encodeURIComponent(selectedCarrier)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&pax=${passengers}`);
  };

  return (
    <div className="bg-white min-h-screen text-navy">
      
      {/* ── HERO SECTION ── */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        {/* Subtle Decorative Background Shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-navy/5 text-accent font-bold text-sm tracking-wider mb-6 border border-accent/10">
            INDIA'S PREMIER BOOKING ENGINE
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-navy mb-6 leading-[1.1]">
            Experience Travel <br />
            <span className="text-accent relative inline-block">
              Without Limits.
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-16 font-medium">
            Search live database availability across all major domestic carriers and the entire Indian Railway network securely.
          </p>

          {/* ── SEARCH WIDGET ── */}
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(26,26,46,0.15)] border border-gray-100 p-3 relative">
            
            {/* Mode Selectors */}
            <div className="flex absolute -top-12 left-8 gap-2">
              <button 
                onClick={() => { setActiveTab('flights'); setSelectedCarrier('IndiGo'); }}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-colors ${activeTab === 'flights' ? 'bg-white text-navy shadow-[0_-5px_20px_rgba(0,0,0,0.05)]' : 'bg-gray-100 text-gray-400 hover:bg-gray-50'}`}
              >
                <PlaneTakeoff size={20} className={activeTab === 'flights' ? 'text-accent' : ''} />
                Flights
              </button>
              <button 
                onClick={() => { setActiveTab('trains'); setSelectedCarrier('Indian Railways (IRCTC)'); }}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-colors ${activeTab === 'trains' ? 'bg-white text-navy shadow-[0_-5px_20px_rgba(0,0,0,0.05)]' : 'bg-gray-100 text-gray-400 hover:bg-gray-50'}`}
              >
                <Train size={20} className={activeTab === 'trains' ? 'text-accent' : ''} />
                Trains
              </button>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 bg-gray-50 p-4 rounded-xl">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><MapPin size={20} /></div>
                <input type="text" placeholder={activeTab === 'flights' ? 'Leaving from (e.g. DEL)' : 'Station from'} value={from} onChange={e => setFrom(e.target.value.toUpperCase())} className="w-full pl-12 pr-4 py-4 rounded-lg border-none focus:ring-2 focus:ring-accent outline-none font-semibold text-lg bg-white" required />
              </div>
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><MapPin size={20} /></div>
                <input type="text" placeholder={activeTab === 'flights' ? 'Going to (e.g. BOM)' : 'Station to'} value={to} onChange={e => setTo(e.target.value.toUpperCase())} className="w-full pl-12 pr-4 py-4 rounded-lg border-none focus:ring-2 focus:ring-accent outline-none font-semibold text-lg bg-white" required />
              </div>
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Calendar size={20} /></div>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-lg border-none focus:ring-2 focus:ring-accent outline-none font-semibold text-lg bg-white text-gray-600" required />
              </div>
              <div className="w-40 relative hidden lg:block">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Users size={20} /></div>
                <select value={passengers} onChange={e => setPassengers(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-lg border-none focus:ring-2 focus:ring-accent outline-none font-semibold text-lg bg-white appearance-none cursor-pointer">
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Pax</option>)}
                </select>
              </div>
              <button type="submit" className="bg-accent hover:bg-accent-hover text-white px-10 py-4 rounded-lg font-bold text-lg transition-transform hover:-translate-y-0.5 shadow-accent flex items-center justify-center gap-2">
                <Search size={22} /> Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── CARRIER SELECTION GRID ── */}
      <section className="bg-gray-50/50 border-t border-gray-100 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-navy mb-2">Preferred Partners</h2>
            <p className="text-gray-500 text-lg">Click an airline or railway operator below to filter live API availability immediately during search.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(activeTab === 'flights' ? AIRLINES : TRAINS).map((carrier) => (
              <div 
                key={carrier}
                onClick={() => setSelectedCarrier(carrier)}
                className={`
                  p-6 rounded-xl border flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300
                  ${selectedCarrier === carrier 
                    ? 'border-accent bg-accent/5 shadow-[0_4px_20px_rgba(230,57,70,0.15)] -translate-y-1' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm hover:-translate-y-0.5'
                  }
                `}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedCarrier === carrier ? 'bg-accent text-white' : 'bg-gray-100 text-navy'}`}>
                  {activeTab === 'flights' ? <PlaneTakeoff size={24} /> : <Train size={24} />}
                </div>
                <span className={`font-semibold text-center ${selectedCarrier === carrier ? 'text-accent' : 'text-navy'}`}>
                  {carrier}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-navy pt-20 pb-10 px-6 border-t-[6px] border-accent">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-accent p-2 rounded-lg">
                <PlaneTakeoff className="w-6 h-6 text-white" />
              </div>
              <span className="font-poppins font-black text-3xl tracking-tight text-white">
                Travel<span className="text-accent">Wise</span>
              </span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed text-lg">
              The smartest way to search flights, map seats, and process split settlements across India natively in React.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm">RESOURCES</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Amadeus API Layer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">RailYatri Connector</a></li>
              <li><a href="/airport-info" className="hover:text-white transition-colors">Airport Database</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm">SECURITY</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> PostgreSQL Connected</span></li>
              <li><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Redis Active</span></li>
              <li><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#EA4335]"></div> Firebase Auth Active</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-800 pt-8 flex justify-between items-center text-gray-500 text-sm">
          <p>© 2026 TravelWise. Microservices Architecture Demo.</p>
          <div className="flex gap-4">
            <span>Powered by Razorpay</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
