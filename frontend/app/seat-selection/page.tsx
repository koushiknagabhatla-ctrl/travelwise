"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plane, Train, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function SeatSelectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const mode = searchParams.get('mode') || 'flights';
  const rawPrice = searchParams.get('price') || '0';
  const price = isNaN(parseInt(rawPrice, 10)) ? 0 : parseInt(rawPrice, 10);
  const operatorNo = searchParams.get('operatorNo') || '';
  const from = searchParams.get('from') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [locking, setLocking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
        const res = await axios.get(`${API_URL}/api/booking/availability`, {
          params: { operatorNo, date }
        });
        if (res.data.success) setBookedSeats(res.data.bookedSeats);
      } catch (e) {
        console.error("Failed to fetch availability");
      }
    };
    if (operatorNo && date) fetchAvailability();
  }, [operatorNo, date]);

  // Generate 6 rows for airplanes, or specific berths for trains
  const rows = [1, 2, 3, 4, 5, 6];
  const flightCols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const trainCols = ['L', 'M', 'U', 'SL', 'SU'];

  const toggleSeat = (seat: string) => {
    setError('');
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleLockAndContinue = async () => {
    if (selectedSeats.length === 0) return setError('Please select at least one seat.');
    if (!user) return setError('You must log in to lock seats.');
    
    setLocking(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
      const res = await axios.post(`${API_URL}/api/booking/lock`, {
        flightId: operatorNo,
        seats: selectedSeats,
        userId: user.id
      });
      if (res.data.success) {
        const finalPrice = price * selectedSeats.length;
        router.push(`/checkout?mode=${mode}&operatorNo=${operatorNo}&from=${from}&destination=${destination}&price=${finalPrice}&seat=${selectedSeats.join(',')}&date=${date}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to lock seats in Redis.');
    } finally {
      setLocking(false);
    }
  };

  const renderSeat = (num: string, isBestView: boolean) => {
    const isSelected = selectedSeats.includes(num);
    const isBooked = bookedSeats.includes(num);

    return (
      <button
        key={num}
        disabled={isBooked}
        onClick={() => toggleSeat(num)}
        className={`
          relative w-12 h-14 rounded-t-xl rounded-b-md border transition-all flex items-center justify-center font-bold text-sm
          ${isBooked ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed hidden-best-view' : 
            isSelected ? 'bg-accent border-accent text-white shadow-[0_4px_15px_rgba(230,57,70,0.4)] -translate-y-1' :
            'bg-white border-gray-300 text-navy hover:border-accent hover:text-accent'}
        `}
      >
        {num}
        {isBestView && !isBooked && !isSelected && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full animate-pulse shadow-sm" />
        )}
      </button>
    );
  };

  return (
    <div className="bg-[#020617] min-h-screen pt-24 pb-32 text-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* CABIN LAYOUT */}
        <div className="lg:col-span-2 flex flex-col items-center acrylic-glass p-12 rounded-[40px] border border-white/5 animate-fade-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-3 flex justify-center items-center gap-4 tracking-tighter">
              {mode === 'flights' ? <Plane className="text-accent" size={32} /> : <Train className="text-accent" size={32} />}
              Configure Your Space
            </h2>
            <p className="text-gray-500 font-extrabold uppercase tracking-[0.3em] text-xs">Sector {operatorNo} · Orbiting {destination}</p>
          </div>

          <div className="flex gap-8 mb-16 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"><div className="w-5 h-5 bg-accent rounded-lg shadow-[0_0_15px_rgba(230,57,70,0.5)]"></div> Selected</div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"><div className="w-5 h-5 bg-white/5 border border-white/20 rounded-lg"></div> Available</div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"><div className="w-5 h-5 bg-white/10 opacity-30 rounded-lg"></div> Booked</div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"><div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div> Prime View</div>
          </div>

          <div className="bg-[#0f172a]/50 p-12 rounded-[60px] shadow-2xl relative flex flex-col gap-10 w-fit border-[16px] border-white/5 backdrop-blur-3xl">
            {/* Plane Nose / Driver Cabin */}
            <div className="w-48 h-24 bg-gradient-to-b from-white/10 to-transparent rounded-t-full mx-auto -mt-32 border-t-8 border-x-8 border-white/10 flex items-center justify-center">
                <div className="w-24 h-4 bg-accent/20 rounded-full blur-xl animate-pulse"></div>
            </div>

            {rows.map(row => (
              <div key={row} className="flex gap-6 items-center">
                {/* Left Side */}
                <div className="flex gap-3">
                  {mode === 'flights' ? ['A', 'B', 'C'].map(col => renderSeat(`${row}${col}`, col === 'A')) 
                   : ['L', 'M', 'U'].map(col => renderSeat(`${row}${col}`, col === 'L'))}
                </div>
                
                {/* Aisle Spacer */}
                <div className="w-10 font-black text-gray-700 text-sm tracking-widest uppercase">{row}</div>
                
                {/* Right Side */}
                <div className="flex gap-3">
                  {mode === 'flights' ? ['D', 'E', 'F'].map(col => renderSeat(`${row}${col}`, col === 'F'))
                   : ['SL', 'SU'].map(col => renderSeat(`${row}${col}`, true))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUMMARY SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 acrylic-glass p-10 rounded-[40px] border border-white/5 shadow-2xl overflow-hidden relative">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>
            
            <h3 className="font-black text-xs uppercase tracking-[0.4em] text-accent mb-10 border-b border-white/5 pb-6">
              Inventory Summary
            </h3>
            
            <div className="space-y-6 mb-12">
              <div className="flex justify-between text-gray-500 font-extrabold text-[10px] uppercase tracking-widest">
                <span>RESERVATION TIER (x{selectedSeats.length})</span>
                <span className="text-white">₹{(price * selectedSeats.length).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-extrabold text-[10px] uppercase tracking-widest">
                <span>ALLOCATED COORDINATES</span>
                <span className="text-accent font-black">{selectedSeats.length > 0 ? selectedSeats.join(' · ') : 'WAITING...'}</span>
              </div>
              <div className="h-px bg-white/5 my-8" />
              <div className="flex justify-between items-baseline font-black">
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.4em]">TOTAL PAYLOAD</span>
                <span className="text-4xl text-white tracking-tighter">₹{(price * selectedSeats.length).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {error && (
              <div className="p-4 mb-8 bg-red-500/10 text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 animate-shake">
                {error}
              </div>
            )}

            <button 
              onClick={handleLockAndContinue}
              disabled={locking || selectedSeats.length === 0}
              className="w-full h-16 bg-white text-navy font-black rounded-2xl flex justify-center items-center gap-4 disabled:opacity-20 disabled:grayscale hover:scale-[1.02] active:scale-[0.98] transition-all text-sm uppercase tracking-widest"
            >
              {locking ? <span className="animate-pulse">NEGOTIATING LOCK...</span> : <><Lock size={20} strokeWidth={3}/> INITIATE CHECKOUT <ArrowRight size={20} strokeWidth={3}/></>}
            </button>
            
            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-center text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] leading-relaxed">
                  TRANSIT LOCK ACTIVE: 600s <br/>REDIRECTING TO SECURE GATEWAY
                </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SeatSelection() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center font-bold text-navy">Loading Interactive Cabin Array...</div>}>
      <SeatSelectionContent />
    </Suspense>
  );
}
