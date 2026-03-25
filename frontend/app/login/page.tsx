"use client";

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { PlaneTakeoff } from 'lucide-react';

export default function LoginPage() {
  const { loginWithGoogle, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#020617] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(0,210,255,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -mr-48 animate-pulse" />

      <div className="max-w-md w-full acrylic-glass rounded-[48px] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 text-center relative z-10 transition-all duration-500">
        <div className="bg-white/5 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-10 border border-white/10 shadow-2xl">
          <PlaneTakeoff className="h-12 w-12 text-accent" strokeWidth={2.5}/>
        </div>
        <h2 className="text-4xl font-black text-white mb-6 tracking-tighter">Strategic Access</h2>
        <p className="text-gray-500 mb-12 font-extrabold uppercase tracking-[0.2em] text-xs leading-relaxed">Interrogate global fleet dynamics with secure identity verification via Google Node_01.</p>
        
        <button 
          onClick={loginWithGoogle}
          className="w-full bg-white text-[#020617] font-black text-sm py-6 rounded-[24px] flex items-center justify-center gap-4 hover:scale-[1.05] active:scale-[0.95] transition-all shadow-xl shadow-white/5 uppercase tracking-widest"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
          Authenticate with Google
        </button>
      </div>
    </div>
  );
}
