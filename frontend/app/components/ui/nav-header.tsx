"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Plane, Menu, X, User, LogOut } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Flights", href: "/search" },
  { name: "Track", href: "/tracking" },
  { name: "Airports", href: "/airport-info" },
  { name: "Fare Calendar", href: "/fare-calendar" },
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

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-void/60 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-glow to-cyan-dim flex items-center justify-center shadow-lg shadow-cyan-glow/20 transition-transform group-hover:scale-110">
              <Plane className="w-5 h-5 text-void" />
            </div>
            <span className="text-xl font-bold tracking-tight text-frost font-display">
              travel<span className="text-cyan-glow">wise</span>
            </span>
          </Link>

          {/* Desktop Nav — Pill with Cursor */}
          <nav className="hidden lg:block">
            <ul
              className="relative flex rounded-full glass px-1.5 py-1.5"
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
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 glass rounded-full px-3 py-2 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-glow to-indigo-glow flex items-center justify-center text-xs font-bold text-void">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm font-medium text-frost hidden md:block">
                    {user.name?.split(" ")[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-14 glass-card rounded-xl p-2 min-w-[200px] z-50"
                    >
                      <div className="px-3 py-2 border-b border-white/5 mb-1">
                        <p className="text-sm font-semibold text-frost">{user.name}</p>
                        <p className="text-xs text-ash">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-silver hover:bg-white/5 hover:text-frost transition-all"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-rose-glow hover:bg-white/5 transition-all cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth"
                className="btn-primary text-sm px-6 py-2.5"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              className="lg:hidden glass rounded-xl p-2 hover:bg-white/10 transition-all cursor-pointer"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5 text-frost" />
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
              className="fixed inset-0 z-[60] bg-void/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-80 z-[61] glass-card border-l border-white/5 p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold font-display text-frost">
                  travel<span className="text-cyan-glow">wise</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="glass rounded-lg p-1.5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5 text-frost" />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-silver hover:text-frost hover:bg-white/5 font-medium transition-all"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto">
                {!user && (
                  <Link
                    href="/auth"
                    className="btn-primary w-full text-center block py-3"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
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
        className="block px-4 py-2 text-sm font-medium text-silver hover:text-frost transition-colors whitespace-nowrap"
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
      className="absolute z-0 h-full top-0 rounded-full bg-white/10"
    />
  );
};

export default NavHeader;
