"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Plane, Mail, Phone, ArrowRight, ChevronDown, Shield, Lock } from "lucide-react";

// Country codes with flags
const COUNTRIES = [
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "+63", name: "Philippines", flag: "🇵🇭" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳" },
  { code: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "+90", name: "Turkey", flag: "🇹🇷" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
  { code: "+92", name: "Pakistan", flag: "🇵🇰" },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "+977", name: "Nepal", flag: "🇳🇵" },
  { code: "+95", name: "Myanmar", flag: "🇲🇲" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "+48", name: "Poland", flag: "🇵🇱" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "+47", name: "Norway", flag: "🇳🇴" },
  { code: "+45", name: "Denmark", flag: "🇩🇰" },
  { code: "+358", name: "Finland", flag: "🇫🇮" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "+43", name: "Austria", flag: "🇦🇹" },
  { code: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "+30", name: "Greece", flag: "🇬🇷" },
  { code: "+353", name: "Ireland", flag: "🇮🇪" },
  { code: "+972", name: "Israel", flag: "🇮🇱" },
  { code: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "+233", name: "Ghana", flag: "🇬🇭" },
  { code: "+56", name: "Chile", flag: "🇨🇱" },
  { code: "+57", name: "Colombia", flag: "🇨🇴" },
  { code: "+54", name: "Argentina", flag: "🇦🇷" },
  { code: "+51", name: "Peru", flag: "🇵🇪" },
];

export default function AuthPage() {
  const router = useRouter();
  const { user, loginWithGoogle, loginWithPhone, verifyOTP } = useAuth();
  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch)
  );

  const selectedCountry = COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0];

  const handleSendOTP = async () => {
    if (!phone || phone.length < 6) {
      setError("Please enter a valid phone number");
      return;
    }
    setLoading(true);
    setError("");
    const fullPhone = `${countryCode}${phone}`;
    const result = await loginWithPhone(fullPhone);
    if (result.success) {
      setOtpSent(true);
    } else {
      setError(result.error || "Failed to send OTP");
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    const token = otp.join("");
    if (token.length !== 6) {
      setError("Please enter the full 6-digit code");
      return;
    }
    setLoading(true);
    setError("");
    const fullPhone = `${countryCode}${phone}`;
    const result = await verifyOTP(fullPhone, token);
    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Invalid OTP");
    }
    setLoading(false);
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-void flex relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-glow/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-glow/5 rounded-full blur-[100px]" />
      </div>

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-obsidian to-void" />
        {/* Grid overlay */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="authGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(100, 116, 139, 0.04)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#authGrid)" />
        </svg>
        
        <div className="relative z-10 p-16 max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-glow to-cyan-dim flex items-center justify-center shadow-lg shadow-cyan-glow/20">
                <Plane className="w-6 h-6 text-void" />
              </div>
              <span className="text-2xl font-bold font-display text-frost">
                travel<span className="text-cyan-glow">wise</span>
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black font-display leading-tight mb-6">
              <span className="gradient-text-frost">Travel smarter,</span>
              <br />
              <span className="gradient-text">not harder.</span>
            </h1>

            <p className="text-silver text-lg leading-relaxed mb-10">
              Compare real-time fares, track live flights, and book with confidence.
              Your entire journey — one powerful platform.
            </p>

            <div className="space-y-4">
              {[
                { icon: <Shield className="w-4 h-4" />, text: "Bank-grade security for your data" },
                { icon: <Lock className="w-4 h-4" />, text: "End-to-end encrypted bookings" },
                { icon: <Plane className="w-4 h-4" />, text: "137+ airports across India" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="flex items-center gap-3 text-ash"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-cyan-glow">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-glow to-cyan-dim flex items-center justify-center shadow-lg shadow-cyan-glow/20">
              <Plane className="w-5 h-5 text-void" />
            </div>
            <span className="text-xl font-bold font-display text-frost">
              travel<span className="text-cyan-glow">wise</span>
            </span>
          </div>

          <h2 className="text-3xl font-black font-display text-frost mb-2">
            {otpSent ? "Verify your number" : "Welcome aboard"}
          </h2>
          <p className="text-silver mb-8">
            {otpSent
              ? `We sent a 6-digit code to ${countryCode} ${phone}`
              : "Sign in to access your flights and bookings"}
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-glow/10 border border-rose-glow/20 text-rose-glow rounded-xl px-4 py-3 text-sm mb-6"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {otpSent ? (
              /* OTP Input */
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex gap-3 justify-center">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(i, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold input-glass rounded-xl focus:border-cyan-glow/60 focus:shadow-[0_0_0_3px_rgba(6,214,160,0.15)]"
                    />
                  ))}
                </div>

                <button
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span className="animate-pulse">Verifying...</span>
                  ) : (
                    <>Verify & Sign In <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                <button
                  onClick={() => { setOtpSent(false); setOtp(["", "", "", "", "", ""]); setError(""); }}
                  className="text-sm text-silver hover:text-frost w-full text-center transition-colors cursor-pointer"
                >
                  ← Change number
                </button>
              </motion.div>
            ) : (
              /* Sign In Form */
              <motion.div
                key="signin"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Google Sign In */}
                <button
                  onClick={loginWithGoogle}
                  className="w-full glass-md rounded-xl px-4 py-3.5 flex items-center justify-center gap-3 font-semibold text-frost hover:bg-white/10 transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-xs text-ash font-medium">or sign in with</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* Mode Toggle */}
                <div className="flex gap-1 glass rounded-full p-1">
                  <button
                    onClick={() => setMode("phone")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                      mode === "phone" ? "bg-cyan-glow text-void" : "text-silver hover:text-frost"
                    }`}
                  >
                    <Phone className="w-4 h-4" /> Phone
                  </button>
                  <button
                    onClick={() => setMode("email")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                      mode === "email" ? "bg-cyan-glow text-void" : "text-silver hover:text-frost"
                    }`}
                  >
                    <Mail className="w-4 h-4" /> Email
                  </button>
                </div>

                {mode === "phone" ? (
                  /* Phone Input with Country Code Picker */
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-silver block">Phone Number</label>
                    <div className="flex gap-2">
                      {/* Country Code Dropdown */}
                      <div className="relative" ref={dropdownRef}>
                        <button
                          onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                          className="input-glass flex items-center gap-1.5 px-3 h-full min-w-[100px] whitespace-nowrap cursor-pointer"
                          type="button"
                        >
                          <span className="text-lg">{selectedCountry.flag}</span>
                          <span className="text-sm font-medium text-frost">{countryCode}</span>
                          <ChevronDown className="w-3 h-3 text-ash" />
                        </button>

                        <AnimatePresence>
                          {countryDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              className="absolute top-full left-0 mt-2 w-72 glass-card rounded-xl overflow-hidden z-50 max-h-64 flex flex-col"
                            >
                              <div className="p-2 border-b border-white/5">
                                <input
                                  type="text"
                                  placeholder="Search country..."
                                  value={countrySearch}
                                  onChange={(e) => setCountrySearch(e.target.value)}
                                  className="w-full bg-white/5 border-none rounded-lg px-3 py-2 text-sm text-frost outline-none placeholder:text-ash"
                                  autoFocus
                                />
                              </div>
                              <div className="overflow-y-auto max-h-48">
                                {filteredCountries.map((country) => (
                                  <button
                                    key={country.code}
                                    onClick={() => {
                                      setCountryCode(country.code);
                                      setCountryDropdownOpen(false);
                                      setCountrySearch("");
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors cursor-pointer ${
                                      countryCode === country.code ? "bg-white/5 text-frost" : "text-silver"
                                    }`}
                                  >
                                    <span className="text-lg">{country.flag}</span>
                                    <span className="flex-1 text-left">{country.name}</span>
                                    <span className="text-ash font-mono text-xs">{country.code}</span>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Phone Input */}
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        className="input-glass flex-1"
                      />
                    </div>

                    <button
                      onClick={handleSendOTP}
                      disabled={loading || !phone}
                      className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <span className="animate-pulse">Sending OTP...</span>
                      ) : (
                        <>Send OTP <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                ) : (
                  /* Email Input */
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-silver block mb-2">Email Address</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-glass"
                      />
                    </div>
                    <button
                      onClick={async () => {
                        setLoading(true);
                        setError("");
                        try {
                          const { supabase } = await import("@/lib/supabase");
                          const { error } = await supabase.auth.signInWithOtp({ email });
                          if (error) setError(error.message);
                          else setOtpSent(true);
                        } catch (err: any) {
                          setError(err.message);
                        }
                        setLoading(false);
                      }}
                      disabled={loading || !email}
                      className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <span className="animate-pulse">Sending link...</span>
                      ) : (
                        <>Send Magic Link <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                )}

                <p className="text-xs text-ash text-center leading-relaxed">
                  By signing in, you agree to our{" "}
                  <span className="text-silver underline cursor-pointer">Terms of Service</span> and{" "}
                  <span className="text-silver underline cursor-pointer">Privacy Policy</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
