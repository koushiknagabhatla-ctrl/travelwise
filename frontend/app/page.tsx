"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlaneTakeoff, Train, Search, MapPin, Calendar, Users, Sparkles, ChevronRight, ArrowRight } from 'lucide-react';
import axios from 'axios';

const AIRLINES = ['IndiGo', 'Air India', 'Vistara', 'SpiceJet', 'Akasa Air', 'GoFirst', 'Alliance Air', 'Star Air', 'Blue Dart'];
const TRAINS = ['Indian Railways (IRCTC)'];

interface Airport {
  code: string;
  name: string;
  city: string;
  state: string;
}

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'flights' | 'trains'>('flights');
  const [selectedCarrier, setSelectedCarrier] = useState('IndiGo');
  
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [passengers, setPassengers] = useState('1');

  const [airports, setAirports] = useState<Airport[]>([
    { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', state: 'Delhi' },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj', city: 'Mumbai', state: 'Maharashtra' },
    { code: 'BLR', name: 'Kempegowda International', city: 'Bengaluru', state: 'Karnataka' },
    { code: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', state: 'Telangana' },
    { code: 'MAA', name: 'Chennai International', city: 'Chennai', state: 'Tamil Nadu' },
    { code: 'CCU', name: 'Netaji Subhash Chandra Bose', city: 'Kolkata', state: 'West Bengal' },
    { code: 'AMD', name: 'Sardar Vallabhbhai Patel', city: 'Ahmedabad', state: 'Gujarat' },
    { code: 'COK', name: 'Cochin International', city: 'Kochi', state: 'Kerala' },
    { code: 'PNQ', name: 'Pune Airport', city: 'Pune', state: 'Maharashtra' },
    { code: 'GOI', name: 'Dabolim Airport', city: 'Goa', state: 'Goa' },
    { code: 'TRV', name: 'Thiruvananthapuram Int.', city: 'Thiruvananthapuram', state: 'Kerala' },
    { code: 'CCJ', name: 'Calicut International', city: 'Kozhikode', state: 'Kerala' },
    { code: 'JAI', name: 'Jaipur International', city: 'Jaipur', state: 'Rajasthan' },
    { code: 'LKO', name: 'Chaudhary Charan Singh', city: 'Lucknow', state: 'Uttar Pradesh' },
    { code: 'CJB', name: 'Coimbatore International', city: 'Coimbatore', state: 'Tamil Nadu' },
    { code: 'TRZ', name: 'Tiruchirappalli Int.', city: 'Tiruchirappalli', state: 'Tamil Nadu' },
    { code: 'IXB', name: 'Bagdogra Airport', city: 'Siliguri', state: 'West Bengal' },
    { code: 'GAU', name: 'Gopinath Bordoloi Int.', city: 'Guwahati', state: 'Assam' },
    { code: 'VTZ', name: 'Visakhapatnam Airport', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
    { code: 'ATQ', name: 'Sri Guru Ram Dass Jee', city: 'Amritsar', state: 'Punjab' },
    { code: 'IXM', name: 'Madurai Airport', city: 'Madurai', state: 'Tamil Nadu' },
    { code: 'NAG', name: 'Dr. Babasaheb Ambedkar', city: 'Nagpur', state: 'Maharashtra' },
    { code: 'IXE', name: 'Mangaluru International', city: 'Mangaluru', state: 'Karnataka' },
    { code: 'BHO', name: 'Raja Bhoj Airport', city: 'Bhopal', state: 'Madhya Pradesh' },
    { code: 'BBI', name: 'Biju Patnaik Int.', city: 'Bhubaneswar', state: 'Odisha' },
    { code: 'IXZ', name: 'Veer Savarkar Int.', city: 'Port Blair', state: 'Andaman & Nicobar' },
    { code: 'IXC', name: 'Chandigarh International', city: 'Chandigarh', state: 'Punjab/Haryana' },
    { code: 'IXA', name: 'Agartala Airport', city: 'Agartala', state: 'Tripura' },
    { code: 'IXR', name: 'Ranchi Airport', city: 'Ranchi', state: 'Jharkhand' },
    { code: 'PAT', name: 'Patna Airport', city: 'Patna', state: 'Bihar' },
    { code: 'DED', name: 'Dehradun Airport', city: 'Dehradun', state: 'Uttarakhand' },
    { code: 'RJA', name: 'Rajahmundry Airport', city: 'Rajahmundry', state: 'Andhra Pradesh' },
    { code: 'TIR', name: 'Tirupati Airport', city: 'Tirupati', state: 'Andhra Pradesh' },
    { code: 'VGA', name: 'Vijayawada Airport', city: 'Vijayawada', state: 'Andhra Pradesh' },
    { code: 'IXL', name: 'Kushok Bakula Rimpochee', city: 'Leh', state: 'Ladakh' },
    { code: 'AGX', name: 'Agatti Island Airport', city: 'Agatti Island', state: 'Lakshadweep' },
    { code: 'DIB', name: 'Dibrugarh Airport', city: 'Dibrugarh', state: 'Assam' },
    { code: 'JDH', name: 'Jodhpur Airport', city: 'Jodhpur', state: 'Rajasthan' },
    { code: 'IXU', name: 'Aurangabad Airport', city: 'Aurangabad', state: 'Maharashtra' },
    { code: 'GWL', name: 'Gwalior Airport', city: 'Gwalior', state: 'Madhya Pradesh' }
  ]);
  const [showFromDrop, setShowFromDrop] = useState(false);
  const [showToDrop, setShowToDrop] = useState(false);
  const [isSearching, setIsSearching] = useState(false);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !date) return alert('Please complete the origin, destination, and select a travel date from the availability grid.');
    
    setIsSearching(true);
    
    // Extract the 3-letter code if the user selected a recommended city (e.g. "MUMBAI (BOM)" -> "BOM")
    const originCode = from.match(/\(([^)]+)\)/)?.[1] || from;
    const destCode = to.match(/\(([^)]+)\)/)?.[1] || to;
    
    // Artificial delay for premium 'interrogation' feel (optional, but requested for WOW factor)
    setTimeout(() => {
      router.push(`/search?mode=${activeTab}&carrier=${encodeURIComponent(selectedCarrier)}&from=${encodeURIComponent(originCode)}&to=${encodeURIComponent(destCode)}&date=${date}&pax=${passengers}`);
    }, 800);
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 60; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        full: d.toISOString().split('T')[0],
        display: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        price: 3000 + Math.floor(Math.random() * 5000)
      });
    }
    return dates;
  };

  const filteredAirports = (val: string) => {
    if (!val) return airports; // Show all for full coverage
    const term = val.toLowerCase();
    return airports
      .filter(a => 
        a.city.toLowerCase().includes(term) || 
        a.code.toLowerCase().includes(term) ||
        a.name.toLowerCase().includes(term)
      )
      .sort((a, b) => {
        const aScore = a.city.toLowerCase().startsWith(term) ? 2 : a.code.toLowerCase().startsWith(term) ? 1 : 0;
        const bScore = b.city.toLowerCase().startsWith(term) ? 2 : b.code.toLowerCase().startsWith(term) ? 1 : 0;
        return bScore - aScore;
      });
  };

  return (
    <div className="bg-[#020617] min-h-screen text-white font-poppins selection:bg-accent/30 pt-20">
      
      {/* HERO SECTION */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(0,210,255,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-24 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -ml-48 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -mr-48 animate-pulse delay-700" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent font-black text-[10px] uppercase tracking-[0.4em] mb-10 shadow-2xl">
              <Sparkles size={14} strokeWidth={3} /> Elevating Indian Transit Architecture
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-10 leading-[0.9] tracking-tighter">
              Discover Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-accent to-white/50">Next Horizon</span>
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg font-extrabold uppercase tracking-[0.2em] leading-relaxed mb-20">
              Precision Logistics · Elite Discovery · Seamless Settlement
            </p>
          </div>

          {/* ── UNIFIED SEARCH CORRIDOR ── */}
          <div className="max-w-6xl mx-auto relative mt-16 animate-fade-up delay-200">
            
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-0 ml-4">
              <button 
                onClick={() => { setActiveTab('flights'); setSelectedCarrier('IndiGo'); }}
                className={`flex items-center gap-3 px-10 py-5 rounded-t-[32px] font-black text-[10px] uppercase tracking-[0.3em] transition-all ${activeTab === 'flights' ? 'bg-white/5 text-accent border border-white/10 border-b-0 backdrop-blur-3xl' : 'bg-transparent text-gray-500 hover:text-white'}`}
              >
                <PlaneTakeoff size={18} strokeWidth={2.5}/> Aerial Fleet
              </button>
              <button 
                onClick={() => { setActiveTab('trains'); setSelectedCarrier('Indian Railways (IRCTC)'); }}
                className={`flex items-center gap-3 px-10 py-5 rounded-t-[32px] font-black text-[10px] uppercase tracking-[0.3em] transition-all ${activeTab === 'trains' ? 'bg-white/5 text-accent border border-white/10 border-b-0 backdrop-blur-3xl' : 'bg-transparent text-gray-500 hover:text-white'}`}
              >
                <Train size={18} strokeWidth={2.5}/> Rail Corridor
              </button>
            </div>

            <div className="acrylic-glass rounded-[48px] overflow-visible border border-white/10 shadow-2xl relative">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch p-2">
                
                {/* FROM SECTION */}
                <div className="flex-1 relative border-b lg:border-b-0 lg:border-r border-white/5 p-4 group/box hover:bg-white/[0.02] transition-all rounded-l-[40px]">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] pl-10 mb-3">Origin Node</label>
                  <div className="flex items-center gap-4">
                    <MapPin size={24} className="text-accent ml-2 flex-shrink-0" strokeWidth={2.5} />
                    <input 
                      type="text" 
                      placeholder="SELECT ORIGIN" 
                      value={from} 
                      onChange={e => { setFrom(e.target.value); setShowFromDrop(true); }}
                      onFocus={() => setShowFromDrop(true)}
                      onBlur={() => setTimeout(() => setShowFromDrop(false), 200)}
                      className="w-full bg-transparent border-none outline-none font-black text-xl text-white placeholder:text-white/10 py-2 tracking-tighter uppercase" 
                    />
                  </div>
                  {showFromDrop && (
                    <div className="absolute bottom-full left-0 w-[400px] mb-4 glass-dropdown rounded-[40px] z-50 py-6 max-h-[500px] overflow-y-auto custom-scrollbar animate-fade-in border border-white/10 shadow-2xl">
                      <div className="px-8 py-3 text-[10px] uppercase tracking-[0.5em] text-accent font-black border-b border-white/5 mb-4">Strategically Mapped Hubs</div>
                      {filteredAirports(from).map(a => (
                        <button key={a.code} type="button" onMouseDown={() => { setFrom(`${a.city} (${a.code})`); setShowFromDrop(false); }} className="w-full px-8 py-5 text-left hover:bg-white/5 flex justify-between items-center transition-all border-b border-white/5 last:border-0 group/item">
                          <div>
                            <div className="font-black text-white text-xl tracking-tighter group-hover/item:text-accent transition-colors">{a.city}</div>
                            <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{a.name}</div>
                          </div>
                          <div className="font-black text-[#020617] bg-white px-4 py-2 rounded-2xl text-[10px] tracking-widest shadow-xl shadow-accent/20 transition-all group-hover/item:scale-110">{a.code}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* TO SECTION */}
                <div className="flex-1 relative border-b lg:border-b-0 lg:border-r border-white/5 p-4 group/box hover:bg-white/[0.02] transition-all">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] pl-10 mb-3">Target Sector</label>
                  <div className="flex items-center gap-4">
                    <MapPin size={24} className="text-accent ml-2 flex-shrink-0" strokeWidth={2.5} />
                    <input 
                      type="text" 
                      placeholder="SELECT DESTINATION" 
                      value={to} 
                      onChange={e => { setTo(e.target.value); setShowToDrop(true); }}
                      onFocus={() => setShowToDrop(true)}
                      onBlur={() => setTimeout(() => setShowToDrop(false), 200)}
                      className="w-full bg-transparent border-none outline-none font-black text-xl text-white placeholder:text-white/10 py-2 tracking-tighter uppercase" 
                    />
                  </div>
                  {showToDrop && (
                    <div className="absolute bottom-full left-0 w-[400px] mb-4 glass-dropdown rounded-[40px] z-50 py-6 max-h-[500px] overflow-y-auto custom-scrollbar animate-fade-in border border-white/10 shadow-2xl">
                      <div className="px-8 py-3 text-[10px] uppercase tracking-[0.5em] text-accent font-black border-b border-white/5 mb-4">Tactical Intercept Nodes</div>
                      {filteredAirports(to).map(a => (
                        <button key={a.code} type="button" onMouseDown={() => { setTo(`${a.city} (${a.code})`); setShowToDrop(false); }} className="w-full px-8 py-5 text-left hover:bg-white/5 flex justify-between items-center transition-all border-b border-white/5 last:border-0 group/item">
                          <div>
                            <div className="font-black text-white text-xl tracking-tighter group-hover/item:text-accent transition-colors">{a.city}</div>
                            <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{a.name}</div>
                          </div>
                          <div className="font-black text-[#020617] bg-white px-4 py-2 rounded-2xl text-[10px] tracking-widest shadow-xl shadow-accent/20 transition-all group-hover/item:scale-110">{a.code}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* DATE SECTION */}
                <div className="flex-1 relative border-b lg:border-b-0 lg:border-r border-white/5 p-4 group/box hover:bg-white/[0.02] transition-all">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] pl-10 mb-3">Launch Window</label>
                  <button 
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="w-full pl-2 pr-5 py-2 flex items-center gap-5 text-left"
                  >
                    <Calendar size={24} className="text-accent flex-shrink-0" strokeWidth={2.5} />
                    <span className={`font-black text-xl tracking-tighter ${date ? 'text-white' : 'text-white/10'}`}>
                      {date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'SELECT DATE'}
                    </span>
                  </button>
                  
                  {showDatePicker && (
                    <div className="absolute bottom-full right-0 w-[650px] mb-4 glass-dropdown rounded-[48px] z-50 p-10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] animate-fade-in border border-white/20">
                      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                        <h3 className="text-3xl font-black tracking-tighter text-white">Select Temporal Window</h3>
                        <button onClick={() => setShowDatePicker(false)} className="text-gray-500 hover:text-white bg-white/5 p-3 rounded-full transition-all hover:scale-110">✕</button>
                      </div>
                      <div className="grid grid-cols-4 md:grid-cols-7 gap-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                        {generateDates().map((d) => (
                          <div 
                            key={d.full}
                            onClick={() => { setDate(d.full); setShowDatePicker(false); }}
                            className={`
                              p-4 rounded-2xl border transition-all cursor-pointer text-center group
                              ${date === d.full ? 'border-accent bg-accent shadow-[0_0_30px_rgba(0,210,255,0.3)]' : 'border-white/5 bg-white/5 hover:border-accent/50 hover:bg-white/10'}
                            `}
                          >
                            <div className={`text-[10px] uppercase font-black mb-1 ${date === d.full ? 'text-[#020617]/60' : 'text-gray-600'}`}>{d.day}</div>
                            <div className={`text-lg font-black tracking-tighter mb-1 ${date === d.full ? 'text-[#020617]' : 'text-white'}`}>{d.display}</div>
                            <div className={`text-[10px] font-black ${date === d.full ? 'text-[#020617]' : 'text-accent'}`}>₹{d.price.toLocaleString('en-IN')}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SEARCH BUTTON */}
                <div className="p-2 flex items-center">
                  <button 
                    type="submit" 
                    disabled={isSearching}
                    className={`w-full lg:w-44 h-16 ${isSearching ? 'bg-white/20 text-white/40 cursor-not-allowed' : 'bg-white text-[#020617] hover:scale-[1.05] active:scale-[0.95]'} font-black text-sm px-8 rounded-[28px] flex items-center justify-center gap-3 transition-all shadow-xl shadow-white/5 uppercase tracking-widest`}
                  >
                    {isSearching ? (
                      <div className="flex items-center gap-2 animate-pulse">
                         INTERROGATING...
                      </div>
                    ) : (
                      <>
                        <Search size={24} strokeWidth={3} /> Interrogate Fleet
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARRIER SELECTION GRID ── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none opacity-30" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-24 text-center">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">Strategic Partnerships</h2>
            <p className="text-gray-500 text-xs font-extrabold uppercase tracking-[0.4em] max-w-2xl mx-auto">Interrogate live API availability across elite domestic carriers with zero network latency.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {(activeTab === 'flights' ? AIRLINES : TRAINS).map((carrier) => (
              <div 
                key={carrier}
                onClick={() => setSelectedCarrier(carrier)}
                className={`
                  p-12 rounded-[48px] border flex flex-col items-center justify-center gap-8 cursor-pointer transition-all duration-700 group shadow-2xl
                  ${selectedCarrier === carrier 
                    ? 'border-accent bg-accent/10 -translate-y-3 shadow-[0_20px_60px_rgba(230,57,70,0.1)]' 
                    : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10 hover:-translate-y-3'
                  }
                `}
              >
                <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center transition-all duration-500 scale-90 group-hover:scale-110 ${selectedCarrier === carrier ? 'bg-accent text-[#020617] shadow-2xl' : 'bg-white/5 text-gray-500'}`}>
                  {activeTab === 'flights' ? <PlaneTakeoff size={48} strokeWidth={2.5} /> : <Train size={48} strokeWidth={2.5} />}
                </div>
                <span className={`font-black text-xs text-center uppercase tracking-[0.3em] transition-all ${selectedCarrier === carrier ? 'text-accent' : 'text-gray-500'}`}>
                  {carrier}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-96 bg-[radial-gradient(circle_at_50%_100%,rgba(0,210,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-accent p-3 rounded-2xl shadow-xl shadow-accent/20">
                  <PlaneTakeoff className="w-8 h-8 text-[#020617]" strokeWidth={3} />
                </div>
                <span className="font-manrope font-black text-4xl tracking-tighter text-white">
                  Travel<span className="text-accent underline decoration-accent/20 underline-offset-8">Wise</span>
                </span>
              </div>
              <p className="text-gray-500 font-extrabold uppercase tracking-[0.2em] text-[10px] leading-relaxed max-w-sm">
                The strategic standard for domestic transit discovery, geospatial asset allocation, and multi-service settlement pipelines in the Indian territory.
              </p>
            </div>
            <div>
              <h4 className="text-accent font-black mb-10 tracking-[0.4em] text-[10px] uppercase">Infrastructure</h4>
              <ul className="space-y-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                <li><a href="#" className="hover:text-white transition-all">Satellite Telemetry</a></li>
                <li><a href="#" className="hover:text-white transition-all">Railway Node NTES</a></li>
                <li><a href="/airport-info" className="hover:text-white transition-all">Global Gateways</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-accent font-black mb-10 tracking-[0.4em] text-[10px] uppercase">Telemetry Status</h4>
              <ul className="space-y-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                <li><span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div> POSTGRES_ACTIVE</span></li>
                <li><span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div> REDIS_SYNC_IO</span></li>
                <li><span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></div> FIREBASE_OAUTH_200</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-gray-700 text-[9px] font-black uppercase tracking-[0.5em]">TravelWise Intelligence © 2026 · Distributed Microservice Architecture · All Rights Reserved</p>
            <div className="flex gap-10 items-center">
                <span className="text-gray-700 text-[9px] font-black uppercase tracking-[0.5em]">Settlements via Razorpay Node_41</span>
                <div className="w-12 h-[1px] bg-white/10"></div>
                <span className="text-accent text-[9px] font-black uppercase tracking-[0.5em]">System Status: Nominal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
