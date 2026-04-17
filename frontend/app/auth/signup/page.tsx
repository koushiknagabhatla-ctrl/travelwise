"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Plane, Mail, Lock, Eye, EyeClosed, ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const { loginWithGoogle, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  // 3D card tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      await loginWithGoogle();
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Email/password not implemented — redirect to Google
    handleGoogleSignIn();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#001a4d] via-[#003B95] to-[#0055d4] relative overflow-hidden flex items-center justify-center">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vh] h-[50vh] rounded-b-[50%] bg-[#1a6fff]/20 blur-[80px]" />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vh] h-[40vh] rounded-b-full bg-[#3d8bff]/15 blur-[60px]"
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
      />
      <div className="absolute bottom-0 right-0 w-[40vh] h-[40vh] bg-[#FF6B00]/10 rounded-full blur-[100px]" />
      <div className="absolute left-1/4 top-1/3 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />

      {/* Left branding (desktop) */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-1/2 flex-col justify-center px-16 xl:px-24 z-10">
        <Link href="/" className="flex items-center gap-2 mb-12 group w-fit">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold font-display text-white">
            travel<span className="text-[#FF8533]">wise</span>
          </span>
        </Link>

        <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight mb-6 leading-[1.15]">
          Your Journey<br />Starts Here.
        </h1>

        <p className="text-white/70 text-lg leading-relaxed max-w-md mb-10">
          Search, compare, and book flights across India with real-time prices and live tracking. Trusted by thousands of travelers.
        </p>

        <div className="space-y-4">
          {[
            "Compare fares across 8+ airlines",
            "Real-time flight tracking",
            "Secure Google authentication",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-white/80">
              <CheckCircle2 className="w-5 h-5 text-[#FF8533] flex-shrink-0" />
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sign-in card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm relative z-20 lg:ml-auto lg:mr-[12%] px-4"
        style={{ perspective: 1200 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative group">
            {/* Traveling light beam */}
            <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-[2px] w-[40%] bg-gradient-to-r from-transparent via-white/60 to-transparent"
                animate={{ left: ["-40%", "100%"] }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.5 }}
              />
              <motion.div
                className="absolute top-0 right-0 h-[40%] w-[2px] bg-gradient-to-b from-transparent via-white/60 to-transparent"
                animate={{ top: ["-40%", "100%"] }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.5, delay: 0.75 }}
              />
              <motion.div
                className="absolute bottom-0 right-0 h-[2px] w-[40%] bg-gradient-to-r from-transparent via-white/60 to-transparent"
                animate={{ right: ["-40%", "100%"] }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.5, delay: 1.5 }}
              />
              <motion.div
                className="absolute bottom-0 left-0 h-[40%] w-[2px] bg-gradient-to-b from-transparent via-white/60 to-transparent"
                animate={{ bottom: ["-40%", "100%"] }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.5, delay: 2.25 }}
              />
            </div>

            {/* Card */}
            <div className="relative bg-white/[0.07] backdrop-blur-xl rounded-2xl p-7 border border-white/[0.1] shadow-2xl">
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center gap-2 justify-center mb-6">
                <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center border border-white/20">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold font-display text-white">
                  travel<span className="text-[#FF8533]">wise</span>
                </span>
              </div>

              {/* Header */}
              <div className="text-center space-y-1 mb-6">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-white"
                >
                  Create an Account
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/50 text-sm"
                >
                  Sign up to unlock real-time flight data
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="relative">
                  <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedInput === "name" ? "text-white" : "text-white/40"} border-2 border-current rounded-full opacity-70`} />
                  <input
                    type="text"
                    placeholder="Full name"
                    onFocus={() => setFocusedInput("name")}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full bg-white/[0.06] border border-white/10 focus:border-[#FF8533]/50 rounded-lg h-11 pl-10 pr-3 text-white placeholder:text-white/30 text-sm outline-none transition-all focus:bg-white/[0.1] focus:ring-1 focus:ring-[#FF8533]/30"
                    required
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedInput === "email" ? "text-white" : "text-white/40"}`} />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full bg-white/[0.06] border border-white/10 focus:border-[#FF8533]/50 rounded-lg h-11 pl-10 pr-3 text-white placeholder:text-white/30 text-sm outline-none transition-all focus:bg-white/[0.1] focus:ring-1 focus:ring-[#FF8533]/30"
                    required
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedInput === "password" ? "text-white" : "text-white/40"}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full bg-white/[0.06] border border-white/10 focus:border-[#FF8533]/50 rounded-lg h-11 pl-10 pr-10 text-white placeholder:text-white/30 text-sm outline-none transition-all focus:bg-white/[0.1] focus:ring-1 focus:ring-[#FF8533]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <Eye className="w-4 h-4 text-white/40 hover:text-white transition-colors" />
                    ) : (
                      <EyeClosed className="w-4 h-4 text-white/40 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>

                {/* Remember me & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="w-4 h-4 rounded border border-white/20 bg-white/5 accent-[#FF8533] cursor-pointer"
                    />
                    <span className="text-xs text-white/50">Remember me</span>
                  </label>
                  <Link href="#" className="text-xs text-white/50 hover:text-white/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {/* Sign up button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF6B00] hover:bg-[#FF8533] text-white font-semibold h-11 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B00]/20 cursor-pointer mt-2"
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </motion.div>
                    ) : (
                      <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-sm">
                        Create Account <ArrowRight className="w-4 h-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-grow border-t border-white/10" />
                  <span className="text-xs text-white/30">or</span>
                  <div className="flex-grow border-t border-white/10" />
                </div>

                {/* Google Sign in */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full bg-white/[0.06] hover:bg-white/[0.1] text-white/80 hover:text-white font-medium h-11 rounded-lg border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="text-sm">Continue with Google</span>
                </motion.button>

                {/* Sign up link */}
                <p className="text-center text-xs text-white/50 mt-3">
                  Already have an account?{" "}
                  <Link href="/auth" className="text-[#FF8533] font-medium hover:text-[#FF6B00] transition-colors">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom text */}
      <p className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/30 z-10">
        By signing in, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-white/50">Terms</Link> and{" "}
        <Link href="/privacy" className="underline hover:text-white/50">Privacy Policy</Link>
      </p>
    </div>
  );
}
