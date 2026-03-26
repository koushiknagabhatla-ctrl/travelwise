"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BOOKING_FEE = 299; // Split Settlement Platform Fee Platform

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('upi');
  
  const price = parseInt(searchParams.get('price') || '0', 10);
  const from = searchParams.get('from') || 'DEL';
  const destination = searchParams.get('destination') || '';
  const operatorNo = searchParams.get('operatorNo') || '';
  const mode = searchParams.get('mode') || 'flights';
  const seat = searchParams.get('seat') || 'Assigned at check-in';
  const date = searchParams.get('date') || '';

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Session expired.');
    
    setProcessing(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
      // 1. Hit Payment Microservice (Razorpay Order creation simulation)
      const rzpRes = await axios.post(`${API_URL}/api/payment/create-order`, {
        amount: price + BOOKING_FEE,
        currency: 'INR'
      });

      if (rzpRes.data.success) {
        // 2. Hit Booking Microservice to finalize Postgres Commit
        await axios.post(`${API_URL}/api/booking/create`, {
          userId: user.id || 'usr_anonymous',
          operatorMode: mode,
          operatorNo,
          origin: from,
          destination,
          travelDate: date,
          totalFare: price + BOOKING_FEE,
          seats: seat.split(',')
        });

        // 3. Show Success Page
        setTimeout(() => { setSuccess(true); setProcessing(false); }, 1500);
      }
    } catch (err) {
      alert("Microservice Gateway timed out handling the secure payload.");
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white">
        <div className="acrylic-glass p-16 text-center max-w-xl w-full rounded-[48px] border border-white/10 flex flex-col items-center animate-fade-up shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
          
          <div className="w-24 h-24 bg-green-500/10 text-green-400 rounded-3xl border border-green-500/20 flex items-center justify-center mb-10 shadow-lg">
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </div>
          
          <h2 className="text-4xl font-black mb-4 tracking-tighter">Reservation Confirmed</h2>
          <p className="text-gray-400 font-extrabold uppercase tracking-[0.3em] text-[10px] mb-12">Handshake Successful · Assets Allocated</p>
          
          <div className="w-full space-y-4 mb-12 text-left">
            <div className="acrylic-glass p-6 rounded-3xl border border-white/5 space-y-3">
                <div className="flex justify-between items-center"><span className="text-xs font-black text-gray-500 uppercase tracking-widest">ASSET ID</span> <span className="text-accent font-black uppercase">{operatorNo}</span></div>
                <div className="flex justify-between items-center"><span className="text-xs font-black text-gray-500 uppercase tracking-widest">SECTOR</span> <span className="text-white font-black uppercase text-sm tracking-tight">{from} ⟫ {destination}</span></div>
                <div className="flex justify-between items-center"><span className="text-xs font-black text-gray-500 uppercase tracking-widest">COORDINATES</span> <span className="text-white font-black uppercase">{seat.split(',').join(' · ')}</span></div>
            </div>
            <div className="bg-green-500/5 p-4 rounded-2xl border border-green-500/10 text-[10px] font-black text-green-400 uppercase tracking-widest text-center">
                Blockchain Proof: razorpay_sim_{Date.now().toString(36)}
            </div>
          </div>
          
          <button onClick={() => router.push('/')} className="w-full h-16 bg-white text-navy font-black rounded-2xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest">
            Return to Command Center
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#020617] min-h-screen pt-32 pb-32 text-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* PAYMENT FORMS */}
        <div className="lg:col-span-2 acrylic-glass rounded-[40px] border border-white/5 overflow-hidden flex flex-col shadow-2xl">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black flex items-center gap-4 tracking-tighter">
                <ShieldCheck className="text-accent" size={28} /> 
                Secure Settlement
              </h2>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">PCI-DSS Encrypted Pipeline · Razorpay Node</p>
            </div>
          </div>

          <div className="flex bg-white/5 border-b border-white/5">
            {[
                {id: 'upi', label: 'UPI INSTANT'},
                {id: 'card', label: 'CREDIT CARD'},
                {id: 'netbanking', label: 'NETWORK BANK'}
            ].map((m) => (
                <button 
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)} 
                  className={`flex-1 py-5 font-black text-[10px] uppercase tracking-[0.3em] transition-all ${paymentMethod === m.id ? 'bg-white/5 text-accent border-b-2 border-accent' : 'text-gray-500 hover:text-white'}`}
                >
                  {m.label}
                </button>
            ))}
          </div>

          <form onSubmit={handlePayment} className="p-10 flex flex-col gap-10 flex-1">
            {paymentMethod === 'upi' && (
              <div className="space-y-6 animate-fade-in">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">VIRTUAL PAYMENT ADDRESS</label>
                <input 
                  type="text" 
                  placeholder="ID@GATEWAY" 
                  required 
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-accent outline-none font-black text-white transition-all tracking-widest placeholder:text-white/10" 
                />
              </div>
            )}
            {paymentMethod === 'card' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] block mb-3">HOLDER NAME</label>
                  <input type="text" placeholder="IDENTITY ON CARD" required className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-accent outline-none font-black text-white transition-all tracking-widest placeholder:text-white/10 uppercase" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] block mb-3">CARD NUMBER</label>
                  <input type="text" placeholder="XXXX XXXX XXXX XXXX" maxLength={19} required className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-accent outline-none font-black text-white transition-all tracking-[0.3em] font-mono placeholder:text-white/10" />
                </div>
                <div className="flex gap-6">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] block mb-3">EXPIRY</label>
                    <input type="text" placeholder="MM / YY" maxLength={5} required className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-accent outline-none font-black text-white transition-all text-center tracking-widest placeholder:text-white/10" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] block mb-3">SECURITY</label>
                    <input type="password" placeholder="CVV" maxLength={3} required className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-accent outline-none font-black text-white transition-all text-center tracking-[0.5em] placeholder:text-white/10" />
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={processing} className="w-full h-18 bg-white text-navy font-black rounded-2xl mt-auto transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20 uppercase tracking-[0.2em] text-sm">
              {processing ? 'SYNCING TRANSACTION...' : `AUTHORIZE ₹${(price + BOOKING_FEE).toLocaleString('en-IN')}`}
            </button>
          </form>
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:col-span-1">
          <div className="acrylic-glass p-8 rounded-[40px] border border-white/5 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl"></div>
            
            <h3 className="font-black text-xs uppercase tracking-[0.4em] text-accent border-b border-white/5 pb-6">Payload Summary</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-500">Destination</span> 
                <span className="text-white">{destination}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-500">Fleet ID</span> 
                <span className="text-white">{operatorNo}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-500">Coordinates</span> 
                <span className="text-accent">{seat.split(',').join(' · ')}</span>
              </div>
            </div>

            <div className="p-5 bg-white/5 rounded-2xl space-y-4 border border-white/5 text-[10px] font-black uppercase tracking-widest">
              <div className="flex justify-between"><span className="text-gray-500">Carrier Fare</span> <span className="text-white">₹{price.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Convenience</span> <span className="text-white">₹{BOOKING_FEE}</span></div>
            </div>

            <div className="flex justify-between items-baseline font-black border-t border-white/5 pt-8">
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.4em]">TOTAL FEE</span>
              <span className="text-4xl text-white tracking-tighter">₹{(price + BOOKING_FEE).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center font-bold text-navy">Connecting to Payment Gateway...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
