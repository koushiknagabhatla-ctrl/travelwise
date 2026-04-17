"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavHeader from "./components/ui/nav-header";
import { Card } from "./components/ui/glass-card";
import { Button } from "./components/ui/liquid-glass-button";
import {
  Plane,
  Search,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  TrendingDown,
  Shield,
  Clock,
  BarChart3,
  Star,
  ChevronRight,
  Globe,
  Headphones,
  CheckCircle2,
} from "lucide-react";

import { INDIAN_AIRPORTS } from "../lib/airports";

// ─── POPULAR DESTINATIONS DATA ───
const DESTINATIONS = [
  { city: "Goa", tagline: "Sun, Sand & Serenity", price: "₹2,499", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80" },
  { city: "Jaipur", tagline: "The Pink City of Rajasthan", price: "₹2,199", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80" },
  { city: "Kerala", tagline: "God's Own Country", price: "₹3,299", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80" },
  { city: "Udaipur", tagline: "City of Lakes", price: "₹2,899", image: "/images/udaipur.png" },
  { city: "Varanasi", tagline: "Spiritual Heart of India", price: "₹2,599", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80" },
  { city: "Andaman", tagline: "Tropical Island Paradise", price: "₹5,499", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" },
  { city: "Manali", tagline: "Gateway to the Himalayas", price: "₹3,799", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80" },
  { city: "Leh Ladakh", tagline: "Land of High Passes", price: "₹4,999", image: "/images/leh.png" },
];

const AIRLINES = [
  "IndiGo", "Air India", "SpiceJet", "Vistara", "Go First", "AirAsia India", "Akasa Air", "Air India Express"
];

// ─── AUTOCOMPLETE INPUT ───
function AutocompleteInput({
  value,
  onChange,
  placeholder,
  airports,
  icon: Icon,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  airports: any[];
  icon: any;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = airports
    .filter(
      (a) =>
        a.city.toLowerCase().includes(search.toLowerCase()) ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.code.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
      <input
        type="text"
        placeholder={placeholder}
        value={open ? search : value}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onClick={() => {
          if (!open) setSearch(value);
          setOpen(true);
        }}
        className="input-field pl-11 h-13 text-base"
        required
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute top-full mt-1.5 left-0 w-full z-50 bg-white rounded-xl border border-border shadow-xl overflow-hidden max-h-[280px] overflow-y-auto custom-scrollbar"
          >
            {filtered.length === 0 ? (
              <div className="p-4 text-sm text-text-muted text-center">
                No airports found
              </div>
            ) : (
              filtered.map((a, i) => (
                <button
                  key={a.code + i}
                  type="button"
                  onClick={() => {
                    onChange(a.city ? `${a.city} (${a.code})` : a.code);
                    setSearch("");
                    setOpen(false);
                  }}
                  className="w-full text-left p-3 border-b border-border-light last:border-b-0 hover:bg-primary-50 cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div>
                    <span className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {a.city}
                    </span>
                    <span className="text-xs text-text-muted ml-1 block mt-0.5">
                      {a.name}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-primary-50 text-xs font-bold text-primary">
                    {a.code}
                  </span>
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── DUAL MONTH CALENDAR PICKER ───
function DatePickerInput({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simple current month tracking
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const generateDays = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  const m1Days = generateDays(currentMonth.getFullYear(), currentMonth.getMonth());
  const m2Days = generateDays(nextMonthDate.getFullYear(), nextMonthDate.getMonth());
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Prevent going behind current actual month
  const isPrevDisabled = currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth();

  const formatDisplayDate = (val: string) => {
    if (!val) return <span className="text-gray-400">Select Date</span>;
    const parts = val.split('-');
    if (parts.length !== 3) return val;
    return `${parseInt(parts[2])} ${monthNames[parseInt(parts[1])-1]} ${parts[0]}`;
  };

  return (
    <div className="relative w-full z-50" ref={wrapperRef}>
      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
      <div 
        onClick={() => setOpen(!open)}
        className="input-field pl-11 h-13 text-base flex items-center cursor-pointer select-none bg-white font-medium"
      >
        {formatDisplayDate(value)}
      </div>

      <AnimatePresence>
        {open && (
           <motion.div
             initial={{ opacity: 0, y: 10, scale: 0.98 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: 5 }}
             className="absolute top-full mt-2 left-0 md:left-auto md:right-0 z-50 bg-white p-6 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-border w-[320px] md:w-[680px]"
           >
             <div className="flex justify-between items-center mb-6">
                <button 
                  type="button" 
                  disabled={isPrevDisabled}
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} 
                  className={`p-2 rounded-full transition-colors flex items-center justify-center ${isPrevDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Select Departure</div>
                <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center">
                  <ChevronRight className="w-5 h-5" />
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Month 1 */}
               <div>
                  <div className="text-center font-semibold text-text-primary mb-4 text-lg">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-text-secondary mb-2">
                    {dayNames.map(d => <div key={d}>{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-sm">
                    {m1Days.map((d, i) => {
                      if (!d) return <div key={i} className="h-10 w-10"></div>;
                      const cDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
                      const isPast = cDate < new Date(new Date().setHours(0,0,0,0));
                      const isSelected = value === cDate.toISOString().split('T')[0];
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={isPast}
                          onClick={() => {
                            onChange(cDate.toISOString().split('T')[0]);
                            setOpen(false);
                          }}
                          className={`h-10 w-10 flex items-center justify-center rounded-lg font-medium transition-all ${isPast ? 'text-gray-300 cursor-not-allowed' : isSelected ? 'bg-primary text-white shadow-md scale-105' : 'hover:bg-primary-50 hover:text-primary text-text-primary'}`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
               </div>
               
               {/* Month 2 */}
               <div className="hidden md:block">
                  <div className="text-center font-semibold text-text-primary mb-4 text-lg">
                    {monthNames[nextMonthDate.getMonth()]} {nextMonthDate.getFullYear()}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-text-secondary mb-2">
                    {dayNames.map(d => <div key={d}>{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-sm">
                    {m2Days.map((d, i) => {
                      if (!d) return <div key={i} className="h-10 w-10"></div>;
                      const cDate = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), d);
                      const isSelected = value === cDate.toISOString().split('T')[0];
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            onChange(cDate.toISOString().split('T')[0]);
                            setOpen(false);
                          }}
                          className={`h-10 w-10 flex items-center justify-center rounded-lg font-medium transition-all ${isSelected ? 'bg-primary text-white shadow-md scale-105' : 'hover:bg-primary-50 hover:text-primary text-text-primary'}`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
               </div>
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── FLIGHT SEARCH WIDGET ───
function FlightSearchWidget() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [pax, setPax] = useState("1");
  const [airports, setAirports] = useState<any[]>(INDIAN_AIRPORTS);

  useEffect(() => {
    setAirports(INDIAN_AIRPORTS);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !date) return;
    router.push(
      `/search?mode=flights&from=${from}&to=${to}&date=${date}&pax=${pax}&carrier=All`
    );
  };

  return (
    <Card variant="elevated" padding="lg" className="max-w-5xl mx-auto rounded-2xl">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <AutocompleteInput
            value={from}
            onChange={setFrom}
            placeholder="Where from?"
            airports={airports}
            icon={MapPin}
          />
          <AutocompleteInput
            value={to}
            onChange={setTo}
            placeholder="Where to?"
            airports={airports}
            icon={MapPin}
          />

          <DatePickerInput value={date} onChange={setDate} />

          <div className="relative">
            <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <select
              value={pax}
              onChange={(e) => setPax(e.target.value)}
              className="input-field pl-11 h-13 appearance-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "Traveler" : "Travelers"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button type="submit" variant="default" size="lg" className="w-full md:w-auto">
          <Search className="w-5 h-5" />
          Search Flights
        </Button>
      </form>
    </Card>
  );
}

// ─── FEATURE CARD ───
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card variant="outlined" hover padding="lg" className="text-center lg:text-left">
      <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center mb-5 mx-auto lg:mx-0">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
    </Card>
  );
}

// ─── MAIN PAGE ───
export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <NavHeader />

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-4 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 -z-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-5xl mx-auto text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-primary-50 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Plane className="w-4 h-4" />
              India&apos;s Smart Flight Booking Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-text-primary tracking-tight mb-5 leading-[1.1]"
          >
            Find & Book Your{" "}
            <span className="gradient-text">Perfect Flight</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Compare prices across all major Indian airlines. Track flights in
            real-time. Book with confidence.
          </motion.p>
        </div>

        {/* Search Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <FlightSearchWidget />
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mt-10 text-sm text-text-muted"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-success" /> 75+ Indian Airports
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-success" /> Real-Time Tracking
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-success" /> Best Price Guarantee
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-success" /> Secure Payments
          </span>
        </motion.div>
      </section>

      {/* ═══ POPULAR DESTINATIONS ═══ */}
      <section className="py-20 px-4 bg-bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-text-primary mb-3">
              Popular Destinations
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Explore India&apos;s most loved travel destinations with great flight deals
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DESTINATIONS.map((dest, i) => (
              <motion.div
                key={dest.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card variant="default" padding="none" hover className="overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.city}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-lg">{dest.city}</h3>
                      <p className="text-white/80 text-xs">{dest.tagline}</p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-text-muted">Starting from</span>
                      <p className="text-lg font-bold text-accent">{dest.price}</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      Explore <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY TRAVELWISE ═══ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-text-primary mb-3">
              Why Choose TravelWise?
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Everything you need for a seamless flight booking experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<TrendingDown className="w-7 h-7 text-primary" />}
              title="Best Prices"
              description="Compare fares across all major Indian airlines in real-time to find the cheapest flights available."
            />
            <FeatureCard
              icon={<Globe className="w-7 h-7 text-primary" />}
              title="Live Flight Tracking"
              description="Track any flight in real-time with accurate coordinates, altitude, and speed data from AviationStack."
            />
            <FeatureCard
              icon={<BarChart3 className="w-7 h-7 text-primary" />}
              title="Fare Calendar"
              description="View price trends across dates to pick the cheapest day to fly. Set alerts for price drops."
            />
            <FeatureCard
              icon={<Shield className="w-7 h-7 text-primary" />}
              title="Secure & Trusted"
              description="Protected by bank-grade encryption with Supabase authentication. Your data stays safe."
            />
          </div>
        </div>
      </section>

      {/* ═══ TRUSTED AIRLINES ═══ */}
      <section className="py-16 px-4 bg-bg-secondary border-y border-border-light">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-medium text-text-muted uppercase tracking-wider mb-8">
            Compare fares across all major Indian airlines
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {AIRLINES.map((airline) => (
              <span
                key={airline}
                className="text-text-muted font-semibold text-sm md:text-base hover:text-primary transition-colors cursor-default"
              >
                {airline}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <Card variant="default" padding="none" className="overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light" />
            <div className="relative z-10 p-10 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white mb-4">
                Ready to Explore India?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
                Join thousands of travelers who trust TravelWise for their
                flight bookings. Start your journey today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/auth">
                  <Button variant="white" size="lg">
                    Get Started <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-white/90 hover:text-white hover:bg-white/10"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-text-primary text-white pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Plane className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold font-display">
                  travel<span className="text-primary-light">wise</span>
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                India&apos;s smart flight booking platform. Compare prices, track
                flights, and book with confidence.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/search" className="text-gray-300 hover:text-white transition-colors">Search Flights</Link></li>
                <li><Link href="/tracking" className="text-gray-300 hover:text-white transition-colors">Track Flight</Link></li>
                <li><Link href="/airport-info" className="text-gray-300 hover:text-white transition-colors">Airports</Link></li>
                <li><Link href="/fare-calendar" className="text-gray-300 hover:text-white transition-colors">Fare Calendar</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
                Company
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
                Support
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <Headphones className="w-4 h-4" /> 24/7 Customer Support
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Shield className="w-4 h-4" /> Secure Booking
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4" /> Instant Confirmation
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-sm text-gray-400">
              © {new Date().getFullYear()} TravelWise. All rights reserved.
            </span>
            <span className="text-xs text-gray-500">
              Built with ❤️ for Indian travelers
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
