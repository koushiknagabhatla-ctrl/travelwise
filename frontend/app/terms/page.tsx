"use client";

import React from "react";
import NavHeader from "@/components/ui/nav-header";
import { Card } from "@/components/ui/glass-card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <NavHeader />

      <section className="pt-28 pb-8 md:pt-36 md:pb-12 px-4 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold font-display text-text-primary tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-text-secondary">Last updated: April 2026</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card variant="default" padding="lg">
            <div className="prose prose-gray max-w-none space-y-8">
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">1. Acceptance of Terms</h2>
                <p className="text-text-secondary leading-relaxed">
                  By accessing and using TravelWise, you agree to be bound by these Terms of Service. If you do not
                  agree with any part of these terms, please do not use our platform. TravelWise reserves the right
                  to update these terms at any time.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">2. Service Description</h2>
                <p className="text-text-secondary leading-relaxed">
                  TravelWise is a flight search and comparison platform that aggregates flight data from third-party
                  providers including Duffel API and AviationStack. We provide tools for searching flights, comparing
                  prices, tracking live flights, and viewing fare calendars. TravelWise acts as an information
                  aggregator and does not directly sell airline tickets.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">3. User Accounts</h2>
                <p className="text-text-secondary leading-relaxed">
                  To access certain features, you must create an account using Google OAuth authentication provided
                  by Supabase. You are responsible for maintaining the security of your account and all activities
                  that occur under your account. You must not share your account credentials with third parties.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">4. Pricing & Availability</h2>
                <p className="text-text-secondary leading-relaxed">
                  Flight prices and availability displayed on TravelWise are sourced from third-party APIs and may
                  change at any time. We strive to show accurate information but cannot guarantee that prices shown
                  will be available at the time of booking. Final prices are determined by the airline or booking
                  provider at the time of purchase.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">5. Limitation of Liability</h2>
                <p className="text-text-secondary leading-relaxed">
                  TravelWise is provided &quot;as is&quot; without any warranties, express or implied. We are not
                  liable for any direct, indirect, incidental, or consequential damages arising from your use of the
                  platform, including but not limited to inaccurate flight information, price discrepancies, or
                  service interruptions.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">6. Prohibited Activities</h2>
                <p className="text-text-secondary leading-relaxed">
                  You may not use TravelWise for any unlawful purpose, attempt to reverse-engineer the platform,
                  use automated bots or scrapers to extract data, or interfere with the normal operation of the
                  service. Violation of these terms may result in immediate account termination.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">7. Contact</h2>
                <p className="text-text-secondary leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us through our
                  Contact page or reach out via our GitHub repository.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
