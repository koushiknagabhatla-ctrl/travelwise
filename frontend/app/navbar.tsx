"use client";

import Link from 'next/link';
import { useAuth } from './context/AuthContext';
import { Plane, LogOut, Code, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, loading, loginWithGoogle, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-header">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-accent p-2 rounded-lg group-hover:-translate-y-1 transition-transform">
            <Plane className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-poppins font-black text-2xl tracking-tight text-navy">
            Travel<span className="text-accent">Wise</span>
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-navy/80">
          <Link href="/" className="hover:text-accent transition-colors">Flights</Link>
          <Link href="/airport-info" className="hover:text-accent transition-colors">Airports</Link>
          <Link href="/tracking" className="flex items-center gap-1 hover:text-accent transition-colors">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Live Radar
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-32 h-10 bg-gray-100 rounded-lg animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 py-1.5 pl-1.5 pr-4 rounded-full transition-colors"
              >
                <img 
                  src={user.profilePhoto || 'https://www.gravatar.com/avatar?d=mp'} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-gray-200 bg-white"
                />
                <span className="font-semibold text-sm text-navy">{user.name?.split(' ')[0]}</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-14 right-0 w-56 bg-white border border-gray-100 rounded-xl shadow-soft py-2 z-50 animate-fade-up origin-top-right">
                  <div className="px-4 py-2 border-b border-gray-100 mb-2">
                    <div className="font-bold text-navy truncate">{user.name}</div>
                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  </div>
                  
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-navy font-medium text-sm transition-colors cursor-pointer" onClick={() => setDropdownOpen(false)}>
                    <UserIcon className="w-4 h-4 text-gray-400" /> My Bookings
                  </Link>
                  
                  <button 
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-accent font-medium text-sm transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-accent" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={loginWithGoogle}
              className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm hover:shadow-md py-2 px-5 rounded-lg transition-all hover:bg-gray-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-semibold text-navy text-sm">Continue with Google</span>
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}
