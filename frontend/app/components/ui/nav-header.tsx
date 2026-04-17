"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Plane, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "./liquid-glass-button";

const allNavItems = [
  { name: "Home", href: "/", protected: false },
  { name: "Flights", href: "/search", protected: true },
  { name: "Track", href: "/tracking", protected: true },
  { name: "Airports", href: "/airport-info", protected: false },
  { name: "About", href: "/about", protected: false },
];

function NavHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (item: typeof allNavItems[0], e: React.MouseEvent) => {
    if (item.protected && !user) {
      e.preventDefault();
      router.push("/auth");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "navbar py-2"
            : "bg-white/80 backdrop-blur-sm py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-text-primary font-display">
              travel<span className="text-primary">wise</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {allNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(item, e)}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-bg-secondary transition-all cursor-pointer border border-transparent hover:border-border"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-sm font-bold text-white">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm font-medium text-text-primary hidden md:block">
                    {user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 bg-white rounded-xl p-1.5 min-w-[220px] z-50 border border-border shadow-xl"
                    >
                      <div className="px-3 py-2.5 border-b border-border-light mb-1">
                        <p className="text-sm font-semibold text-text-primary">{user.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-all"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium text-error hover:bg-red-50 transition-all cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-bg-secondary transition-colors cursor-pointer"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5 text-text-primary" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[85vw] sm:w-[320px] z-[61] bg-white border-l border-border shadow-2xl p-5 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold font-display text-text-primary">
                  travel<span className="text-primary">wise</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-bg-secondary transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-text-primary" />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {allNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      handleNavClick(item, e);
                      setMobileOpen(false);
                    }}
                    className="px-4 py-3 rounded-lg text-base font-medium text-text-secondary hover:text-primary hover:bg-primary-50 transition-all"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-6 border-t border-border-light">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-sm font-bold text-white">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{user.name}</p>
                        <p className="text-xs text-text-muted">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                ) : (
                  <Link href="/auth" onClick={() => setMobileOpen(false)} className="block">
                    <Button variant="primary" size="lg" className="w-full">
                      Sign In
                    </Button>
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

export default NavHeader;
