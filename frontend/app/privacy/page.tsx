import React from "react";
import NavHeader from "@/components/ui/nav-header";
import { GlassCard } from "@/components/ui/glass-card";
import { CosmicParallaxBg } from "@/components/ui/parallax-cosmic-background";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-void overflow-hidden relative">
      <NavHeader />
      <div className="fixed inset-0 z-0">
         <CosmicParallaxBg head="" text="" loop={true} className="opacity-20" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-40 pb-20">
         <GlassCard className="p-10 md:p-16 rounded-[2rem] bg-void/80 backdrop-blur-3xl border border-white/10">
            <h1 className="text-4xl md:text-5xl font-black font-display text-white mb-8 border-b border-white/10 pb-8">
               Privacy Policy Protocol
            </h1>
            
            <div className="space-y-8 text-silver font-medium leading-relaxed">
               <section>
                 <h2 className="text-2xl font-bold text-cyan-glow mb-4">1. Information Collection Architecture</h2>
                 <p>
                   When utilizing the TravelWise portal, telemetry data such as session IP, interaction vectors, and Google OAuth payload tokens are generated. This platform does not directly manipulate unencrypted personal identification data outside of the Supabase boundary node.
                 </p>
               </section>

               <section>
                 <h2 className="text-2xl font-bold text-cyan-glow mb-4">2. Usage of Data</h2>
                 <p>
                   Locally stored parameters (such as recent destinations or UI display variables) remain inside `localStorage`. We do not sell query data to external analytics layers.
                 </p>
               </section>

               <section>
                 <h2 className="text-2xl font-bold text-cyan-glow mb-4">3. Security Nodes</h2>
                 <p>
                   SSL/TLS encryption manages transit routes between the Next JS Edge Network and the Express.js Render backend node. We utilize industry-standard cryptographic techniques to verify sessions.
                 </p>
               </section>
            </div>
         </GlassCard>
      </div>
    </div>
  );
}
