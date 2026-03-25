"use client";

import Link from 'next/link';
import { useAuth } from './context/AuthContext';
import { Plane, LogOut, Code, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, loading, loginWithGoogle, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-2xl border-b border-white/10 h-24 mb-px">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="bg-accent p-3 rounded-2xl shadow-xl shadow-accent/20 transition-all group-hover:scale-110">
            <Plane className="w-6 h-6 text-[#020617]" strokeWidth={3} />
          </div>
          <span className="font-manrope font-black text-3xl tracking-tighter text-white">
            Travel<span className="text-accent underline decoration-accent/20 underline-offset-8">Wise</span>
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-12 font-black text-[10px] uppercase tracking-[0.3em] text-gray-500">
          <Link href="/" className="hover:text-white transition-all">Aerial Fleet</Link>
          <Link href="/airport-info" className="hover:text-white transition-all">Global Hubs</Link>
          <Link href="/tracking" className="flex items-center gap-3 hover:text-white transition-all text-accent">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
            </span>
            Live Radar
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {loading ? (
            <div className="w-32 h-10 bg-white/5 rounded-full animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 p-1 rounded-full transition-all group pr-5"
              >
                <img 
                  src={user.profilePhoto || 'https://www.gravatar.com/avatar?d=mp'} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full border border-white/10 shadow-2xl"
                />
                <span className="font-black text-[10px] uppercase tracking-widest text-white">{user.name?.split(' ')[0]}</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-14 right-0 w-56 glass-dropdown rounded-xl py-2 z-50 animate-fade-up origin-top-right">
                  <div className="px-4 py-2 border-b border-white/10 mb-2">
                    <div className="font-bold text-white truncate">{user.name}</div>
                    <div className="text-xs text-gray-400 truncate">{user.email}</div>
                  </div>
                  
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-gray-200 font-medium text-sm transition-colors cursor-pointer" onClick={() => setDropdownOpen(false)}>
                    <UserIcon className="w-4 h-4 text-gray-400" /> My Bookings
                  </Link>
                  
                  <button 
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-accent font-medium text-sm transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-accent" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={loginWithGoogle}
              className="px-6 py-2.5 rounded-xl bg-white text-navy font-bold text-sm hover:scale-[1.05] transition-all flex items-center gap-2"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
