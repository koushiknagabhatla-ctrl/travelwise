"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Plane, Menu, X, User, LogOut } from "lucide-react";
import { LiquidButton } from "./liquid-glass-button";

const allNavItems = [
  { name: "Home", href: "/" },
  { name: "Flights", href: "/search" },
  { name: "Track", href: "/tracking" },
  { name: "Airports", href: "/airport-info" },
  { name: "Fare Calendar", href: "/fare-calendar" },
  { name: "About", href: "/about" },
];

function NavHeader() {
  const { user, logout } = useAuth();
  const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Strict Auth Guarding logic for Navbar mapping
  const navItems = user 
    ? allNavItems 
    : allNavItems.filter(item => item.name === "Home" || item.name === "About");

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-void/40 backdrop-blur-3xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#06d6a0] to-[#04a57b] p-[1px] shadow-lg shadow-cyan-glow/30 transition-transform group-hover:scale-110">
              <div className="w-full h-full rounded-[14px] bg-void/40 backdrop-blur-md flex items-center justify-center">
                 <Plane className="w-5 h-5 text-white" fill="currentColor" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight text-frost font-display drop-shadow-md">
              travel<span className="text-[#06d6a0]">wise</span>
            </span>
          </Link>

          {/* Desktop Nav — Pill with Cursor */}
          <nav className="hidden lg:block relative z-10">
            <ul
              className="relative flex rounded-[24px] bg-void/20 backdrop-blur-xl border border-white/10 px-1.5 py-1.5 shadow-inner shadow-white/5"
              onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
            >
              {navItems.map((item) => (
                <Tab key={item.name} setPosition={setPosition} href={item.href}>
                  {item.name}
                </Tab>
              ))}
              <Cursor position={position} />
            </ul>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4 relative z-20">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 glass-md rounded-[20px] px-3 py-2 hover:bg-white/10 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,214,160,0.1)] hover:shadow-[0_0_20px_rgba(6,214,160,0.2)]"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#06d6a0] to-[#7c3aed] flex items-center justify-center text-sm font-black text-void shadow-inner">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm font-bold text-white hidden md:block tracking-wide">
                    {user.name?.split(" ")[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, type: "spring", bounce: 0.4 }}
                      className="absolute right-0 top-16 glass-card rounded-[24px] p-2 min-w-[220px] z-50 border border-white/10 shadow-2xl"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <p className="text-md font-black text-white">{user.name}</p>
                        <p className="text-xs text-silver mt-1">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-silver hover:bg-white/10 hover:text-white transition-all mb-1"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="w-[18px] h-[18px]" /> Profile
                      </Link>
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-[#ef476f] hover:bg-rose-glow/10 hover:text-rose-glow transition-all cursor-pointer"
                      >
                        <LogOut className="w-[18px] h-[18px]" /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth">
                <LiquidButton 
                  variant="default"
                  size="sm"
                  shape="smooth"
                  className="font-bold text-sm"
                >
                  Sign In
                </LiquidButton>
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              className="lg:hidden bg-void/50 backdrop-blur-md rounded-[16px] p-2 hover:bg-white/10 transition-all cursor-pointer border border-white/10"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-void/80 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[85vw] sm:w-[350px] z-[61] glass-card border-l border-white/10 p-6 flex flex-col pt-12"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-2xl font-black font-display text-white">
                  travel<span className="text-cyan-glow">wise</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="bg-white/5 rounded-xl p-2 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <nav className="flex flex-col gap-2 relative z-10">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-5 py-4 rounded-[16px] text-lg font-bold text-silver hover:text-white hover:bg-white/10 transition-all active:scale-95"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto relative z-10">
                {!user && (
                  <Link href="/auth" onClick={() => setMobileOpen(false)} className="w-full">
                    <LiquidButton 
                      variant="default" 
                      size="xl" 
                      shape="smooth"
                      className="w-full text-center"
                    >
                       Sign In Securely
                    </LiquidButton>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

const Tab = ({
  children,
  setPosition,
  href,
}: {
  children: React.ReactNode;
  setPosition: React.Dispatch<React.SetStateAction<{ left: number; width: number; opacity: number }>>;
  href: string;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({ width, opacity: 1, left: ref.current.offsetLeft });
      }}
      className="relative z-10 cursor-pointer"
    >
      <Link
        href={href}
        className="block px-5 py-2 text-sm font-bold tracking-wide text-silver hover:text-white transition-colors whitespace-nowrap"
      >
        {children}
      </Link>
    </li>
  );
};

const Cursor = ({ position }: { position: { left: number; width: number; opacity: number } }) => {
  return (
    <motion.li
      animate={position}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute z-0 h-full top-0 rounded-full bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)] border border-white/5"
    />
  );
};

export default NavHeader;
