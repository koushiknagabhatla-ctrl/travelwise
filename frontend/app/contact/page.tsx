import React from "react";
import NavHeader from "@/components/ui/nav-header";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { Code2, Rocket, Globe } from "lucide-react";
import Link from "next/link";
import { CosmicParallaxBg } from "@/components/ui/parallax-cosmic-background";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center overflow-hidden relative">
      <NavHeader />
      <CosmicParallaxBg head="" text="" loop={true} className="opacity-40" />

      <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center">
         <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-cyan-glow to-[#7c3aed] flex items-center justify-center p-[1px] shadow-[0_0_50px_rgba(6,214,160,0.3)] mb-10">
            <div className="w-full h-full bg-void rounded-[30px] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="currentColor">
                   <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            </div>
         </div>

         <h1 className="text-5xl font-black font-display text-white mb-2 drop-shadow-lg">Developer Portal</h1>
         <p className="text-silver mb-12 font-medium text-center">Connection to main creator matrix established.</p>

         <div className="w-full flex flex-col gap-4">
             <Link href="https://github.com/koushiknagabhatla-ctrl" target="_blank" rel="noopener noreferrer" className="w-full">
                 <LiquidButton variant="default" size="xxl" shape="smooth" className="w-full">
                    <Code2 className="w-6 h-6 mr-2 text-cyan-glow" /> 
                    Access Default Root &gt; koushiknagabhatla-ctrl
                 </LiquidButton>
             </Link>
             
             <Link href="/" className="w-full">
                 <LiquidButton variant="outline" size="xl" shape="smooth" className="w-full">
                    <Rocket className="w-5 h-5 mr-2" /> Return to Sequence
                 </LiquidButton>
             </Link>
         </div>
      </div>
    </div>
  );
}
