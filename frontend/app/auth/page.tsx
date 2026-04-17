"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Plane, Shield } from "lucide-react";
import Link from "next/link";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function AuthPage() {
  const router = useRouter();
  const { loginWithGoogle, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div className="min-h-screen bg-void flex relative overflow-hidden bg-gradient-to-tr from-void via-void to-abyss">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-glow/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-glow/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Left Column: Branding / Info */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-20 relative z-10">
        <Link href="/" className="flex items-center gap-2 mb-16 group w-fit">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-glow to-cyan-dim flex items-center justify-center shadow-lg shadow-cyan-glow/20 transition-transform group-hover:scale-110">
            <Plane className="w-6 h-6 text-void" />
          </div>
          <span className="text-3xl font-black font-display tracking-tight text-frost">
            travel<span className="text-cyan-glow">wise</span>
          </span>
        </Link>

        <h1 className="text-5xl font-black gradient-text tracking-tight mb-8 font-display leading-tight">
          Secure. Fast. <br />
          Cosmic Navigation.
        </h1>
        
        <p className="text-silver text-xl leading-relaxed max-w-lg mb-12">
          Experience hyper-realistic flight telemetry and pricing dynamics instantly across all Indian airspace routing logic.
        </p>

        <div className="space-y-6">
          <div className="flex items-center gap-4 text-silver">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-glow" />
            </div>
            <span className="font-medium">Bank-grade secured identity portal</span>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10 border-l border-white/5 bg-black/20 backdrop-blur-3xl shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, ease: "easeOut" }}
           className="w-full max-w-md p-10 bg-void/60 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          {/* Mobile Header elements inside card */}
          <div className="lg:hidden flex items-center gap-2 mb-12 justify-center">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-glow to-cyan-dim flex items-center justify-center shadow-lg shadow-cyan-glow/20">
              <Plane className="w-5 h-5 text-void" />
            </div>
            <span className="text-2xl font-black tracking-tight text-frost font-display">
              travel<span className="text-cyan-glow">wise</span>
            </span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Initiate Portal</h2>
            <p className="text-silver font-medium text-sm lg:text-base">Identity verification protocol active.</p>
          </div>

          <div className="flex flex-col gap-6">
             <LiquidButton 
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full"
                variant="default"
                size="xxl"
                shape="smooth"
             >
                {isSubmitting ? (
                  <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-6 h-6 mr-2" aria-hidden="true" focusable="false">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      <path d="M1 1h22v22H1z" fill="none"/>
                    </svg>
                    Bypass via Google
                  </>
                )}
             </LiquidButton>
          </div>

          <p className="text-xs text-ash text-center mt-12 px-4 shadow-[0_-10px_10px_rgba(0,0,0,0.5)] leading-relaxed">
            By authenticating, you agree to the Terms of Service and Privacy Policy logic matrix.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
