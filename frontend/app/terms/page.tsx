import React from "react";
import NavHeader from "@/components/ui/nav-header";
import { GlassCard } from "@/components/ui/glass-card";
import { CosmicParallaxBg } from "@/components/ui/parallax-cosmic-background";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-void overflow-hidden relative">
      <NavHeader />
      <div className="fixed inset-0 z-0">
         <CosmicParallaxBg head="" text="" loop={true} className="opacity-20" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-40 pb-20">
         <GlassCard className="p-10 md:p-16 rounded-[2rem] bg-void/80 backdrop-blur-3xl border border-white/10">
            <h1 className="text-4xl md:text-5xl font-black font-display text-white mb-8 border-b border-white/10 pb-8">
               Terms of Service Protocol
            </h1>
            
            <div className="space-y-8 text-silver font-medium leading-relaxed">
               <section>
                 <h2 className="text-2xl font-bold text-[#7c3aed] mb-4">1. Access Parameters</h2>
                 <p>
                   By executing login mechanisms on the TravelWise portal, the user agrees to utilize flight telemetry accurately. Scrape-bots or automated payload delivery is restricted.
                 </p>
               </section>

               <section>
                 <h2 className="text-2xl font-bold text-[#7c3aed] mb-4">2. Liability of Displayed Telemetry</h2>
                 <p>
                   Aviation pricing and path coordinates are provided by third-party vendor links (Duffel API, AviationStack). TravelWise is an interface aggregator. Real-time shifts in pricing or delays are not legally bound to the TravelWise execution layer.
                 </p>
               </section>

               <section>
                 <h2 className="text-2xl font-bold text-[#7c3aed] mb-4">3. Execution of External Routing</h2>
                 <p>
                   When executing a transaction, you will be heavily redirected to encrypted payment layers. TravelWise does not directly execute node transactions.
                 </p>
               </section>
            </div>
         </GlassCard>
      </div>
    </div>
  );
}
