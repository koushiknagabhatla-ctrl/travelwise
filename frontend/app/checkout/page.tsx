"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, CreditCard, Banknote, Smartphone, CheckCircle2 } from 'lucide-react';
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
  const destination = searchParams.get('destination') || '';
  const operatorNo = searchParams.get('operatorNo') || '';
  const mode = searchParams.get('mode') || 'flights';
  const seat = searchParams.get('seat') || 'Assigned at check-in';

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Session expired.');
    
    setProcessing(true);
    try {
      // 1. Hit Payment Microservice (Razorpay Order creation simulation)
      const rzpRes = await axios.post('http://localhost:5002/api/payment/create-order', {
        amount: price + BOOKING_FEE,
        currency: 'INR'
      });

      if (rzpRes.data.success) {
        // 2. Hit Booking Microservice to finalize Postgres Commit
        await axios.post('http://localhost:5002/api/booking/create', {
          userId: user.id || 'usr_anonymous',
          operatorMode: mode,
          operatorNo,
          origin: 'DEL', // Hardcoded safely for workflow demo
          destination,
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-navy">
        <div className="bg-white p-12 text-center max-w-lg w-full rounded-3xl shadow-soft border border-gray-100 flex flex-col items-center animate-fade-up">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-soft">
            <CheckCircle2 size={40} className="drop-shadow-sm" />
          </div>
          <h2 className="text-3xl font-black mb-3 text-navy">Booking Confirmed!</h2>
          <p className="text-gray-500 font-medium mb-8">
            Your {mode === 'flights' ? 'flight ✈️' : 'train 🚆'} <strong className="text-navy">{operatorNo}</strong> to <strong className="text-navy">{destination}</strong> is instantly confirmed.
            <br />Seat(s): <strong className="text-navy">{seat.split(',').join(', ')}</strong>
          </p>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 mb-8 flex flex-col gap-2">
            <div>✅ ₹{(price).toLocaleString('en-IN')} routed to Carrier Nodal Acc</div>
            <div>✅ ₹{BOOKING_FEE} platform fee collected securely</div>
            <div className="text-xs text-gray-400 font-normal mt-1">Simulated via Razorpay Webhooks into Postgres</div>
          </div>
          <button onClick={() => router.push('/')} className="btn-primary w-full">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-32 text-navy">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PAYMENT FORMS */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden flex flex-col">
          <div className="bg-navy p-6 flex justify-between items-center text-white">
            <div>
              <h2 className="text-2xl font-black flex items-center gap-2"><ShieldCheck className="text-accent" /> Secure Checkout</h2>
              <p className="text-gray-400 text-sm font-medium">PCI-DSS Compliant Gateway powered by Razorpay</p>
            </div>
          </div>

          <div className="flex border-b border-gray-100 bg-gray-50">
            <button onClick={() => setPaymentMethod('upi')} className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold transition-all ${paymentMethod === 'upi' ? 'bg-white text-accent border-b-2 border-accent shadow-[0_-5px_15px_rgba(0,0,0,0.03)]' : 'text-gray-400 hover:text-navy'}`}><Smartphone size={18}/> UPI App</button>
            <button onClick={() => setPaymentMethod('card')} className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold transition-all ${paymentMethod === 'card' ? 'bg-white text-accent border-b-2 border-accent shadow-[0_-5px_15px_rgba(0,0,0,0.03)]' : 'text-gray-400 hover:text-navy'}`}><CreditCard size={18}/> Debit / Credit Card</button>
            <button onClick={() => setPaymentMethod('netbanking')} className={`flex-1 hidden md:flex items-center justify-center gap-2 py-4 font-bold transition-all ${paymentMethod === 'netbanking' ? 'bg-white text-accent border-b-2 border-accent shadow-[0_-5px_15px_rgba(0,0,0,0.03)]' : 'text-gray-400 hover:text-navy'}`}><Banknote size={18}/> Net Banking</button>
          </div>

          <form onSubmit={handlePayment} className="p-8 flex flex-col gap-6 flex-1">
            {paymentMethod === 'upi' && (
              <div className="space-y-4 animate-fade-in">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Virtual Payment Address (VPA)</label>
                <input type="text" placeholder="username@okicici" required className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-accent outline-none font-medium text-navy transition-all" />
              </div>
            )}
            {paymentMethod === 'card' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2">Cardholder Name</label>
                  <input type="text" placeholder="Name on Card" required className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-accent outline-none font-medium text-navy transition-all" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2">Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} required className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-accent outline-none font-medium text-navy transition-all font-mono" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" maxLength={5} required className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-accent outline-none font-medium text-navy transition-all" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2">Security Code</label>
                    <input type="password" placeholder="CVV" maxLength={3} required className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-accent outline-none font-medium text-navy transition-all tracking-widest" />
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={processing} className="btn-primary w-full mt-auto py-4 text-lg">
              {processing ? 'Processing Razorpay Settlement...' : `Pay Securely ₹${(price + BOOKING_FEE).toLocaleString('en-IN')}`}
            </button>
          </form>
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 flex flex-col gap-6">
            <h3 className="font-black text-xl border-b border-gray-100 pb-4">Itinerary Invoice</h3>
            <div className="space-y-3 font-medium">
              <div className="flex justify-between items-center text-sm"><span className="text-gray-400">Destination</span> <span className="text-navy">{destination}</span></div>
              <div className="flex justify-between items-center text-sm"><span className="text-gray-400">Operator Code</span> <span className="text-navy">{operatorNo}</span></div>
              <div className="flex justify-between items-center text-sm"><span className="text-gray-400">Selected Seats</span> <span className="text-navy font-bold">{seat.split(',').join(', ')}</span></div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100 text-sm font-medium">
              <div className="flex justify-between"><span className="text-gray-500">Base Operator Fare</span> <span className="text-navy">₹{price.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Platform Convenience Fee</span> <span className="text-navy">₹{BOOKING_FEE}</span></div>
            </div>
            <div className="flex justify-between items-center font-black text-2xl border-t border-gray-100 pt-4">
              <span>Total Price</span>
              <span className="text-accent">₹{(price + BOOKING_FEE).toLocaleString('en-IN')}</span>
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
