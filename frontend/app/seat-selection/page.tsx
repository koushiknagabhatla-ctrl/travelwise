"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plane, Train, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function SeatSelectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const mode = searchParams.get('mode') || 'flights';
  const price = parseInt(searchParams.get('price') || '0', 10);
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
        const res = await axios.get(`http://localhost:5002/api/booking/availability`, {
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
      const res = await axios.post('http://localhost:5002/api/booking/lock', {
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
    <div className="bg-gray-50 min-h-screen pt-24 pb-32 text-navy">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* CABIN LAYOUT */}
        <div className="lg:col-span-2 flex flex-col items-center bg-white p-12 rounded-3xl shadow-soft border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-2 flex justify-center items-center gap-3">
              {mode === 'flights' ? <Plane className="text-accent" /> : <Train className="text-accent" />}
              Select Your {mode === 'flights' ? 'Seats' : 'Berths'}
            </h2>
            <p className="text-gray-500 font-medium">Flight {operatorNo} to {destination}</p>
          </div>

          <div className="flex gap-6 mb-12">
            <div className="flex items-center gap-2 text-sm font-semibold"><div className="w-4 h-4 bg-accent rounded"></div> Selected</div>
            <div className="flex items-center gap-2 text-sm font-semibold"><div className="w-4 h-4 bg-white border border-gray-300 rounded"></div> Available</div>
            <div className="flex items-center gap-2 text-sm font-semibold"><div className="w-4 h-4 bg-gray-100 rounded"></div> Unavailable</div>
            <div className="flex items-center gap-2 text-sm font-semibold"><div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div> Best View</div>
          </div>

          <div className="bg-gray-100 p-8 rounded-[40px] shadow-inner relative flex flex-col gap-8 w-fit border-8 border-gray-200">
            {/* Plane Nose / Driver Cabin */}
            <div className="w-32 h-16 bg-gray-200 rounded-t-full mx-auto -mt-16 border-t-8 border-x-8 border-gray-300 shadow-inner"></div>

            {rows.map(row => (
              <div key={row} className="flex gap-4 items-center">
                {/* Left Side */}
                <div className="flex gap-2">
                  {mode === 'flights' ? ['A', 'B', 'C'].map(col => renderSeat(`${row}${col}`, col === 'A')) 
                   : ['L', 'M', 'U'].map(col => renderSeat(`${row}${col}`, col === 'L'))}
                </div>
                
                {/* Aisle Spacer */}
                <div className="w-8 font-black text-gray-300 text-center">{row}</div>
                
                {/* Right Side */}
                <div className="flex gap-2">
                  {mode === 'flights' ? ['D', 'E', 'F'].map(col => renderSeat(`${row}${col}`, col === 'F'))
                   : ['SL', 'SU'].map(col => renderSeat(`${row}${col}`, true))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUMMARY SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white p-8 rounded-3xl shadow-soft border border-gray-100">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <CheckCircle2 className="text-accent" /> Booking Summary
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Base Fare (x{selectedSeats.length})</span>
                <span className="text-navy">₹{(price * selectedSeats.length).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Selected {mode === 'flights' ? 'Seats' : 'Berths'}</span>
                <span className="text-navy font-bold">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
              </div>
              <div className="h-px bg-gray-100 my-4" />
              <div className="flex justify-between font-black text-2xl text-navy">
                <span>Total</span>
                <span className="text-accent">₹{(price * selectedSeats.length).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {error && <div className="p-3 mb-6 bg-red-50 text-red-600 rounded-lg text-sm font-semibold border border-red-100">{error}</div>}

            <button 
              onClick={handleLockAndContinue}
              disabled={locking || selectedSeats.length === 0}
              className="w-full btn-primary flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {locking ? <span className="animate-pulse">Locking Seats in Redis...</span> : <><Lock size={18}/> Checkout <ArrowRight size={18}/></>}
            </button>
            <p className="text-center text-xs text-gray-400 font-medium mt-4">
              Seats will be locked for exactly 10 minutes. <br/>You will be redirected to the Razorpay UI wrapper.
            </p>
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
