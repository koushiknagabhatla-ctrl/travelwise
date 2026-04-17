"use client";

import React from "react";
import NavHeader from "@/components/ui/nav-header";
import { Card } from "@/components/ui/glass-card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <NavHeader />

      <section className="pt-28 pb-8 md:pt-36 md:pb-12 px-4 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold font-display text-text-primary tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-text-secondary">Last updated: April 2026</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card variant="default" padding="lg">
            <div className="prose prose-gray max-w-none space-y-8">
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">1. Information We Collect</h2>
                <p className="text-text-secondary leading-relaxed">
                  When you sign in with Google, we receive your name, email address, and profile photo from
                  your Google account. We use this information to create and manage your TravelWise account.
                  We also collect usage data such as search queries and page visits to improve our service.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">2. How We Use Your Information</h2>
                <p className="text-text-secondary leading-relaxed">
                  Your information is used to provide and improve our flight search and tracking services,
                  personalize your experience, and communicate important updates about the platform. We do not
                  sell your personal information to third parties.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">3. Data Storage & Security</h2>
                <p className="text-text-secondary leading-relaxed">
                  Your account data is stored securely through Supabase, which provides enterprise-grade security
                  and encryption. We do not store passwords locally — all authentication is handled through Google
                  OAuth. We implement appropriate technical measures to protect your data against unauthorized access.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">4. Third-Party Services</h2>
                <p className="text-text-secondary leading-relaxed">
                  TravelWise uses the following third-party services that may collect data according to their
                  own privacy policies: Google OAuth (authentication), Supabase (database and auth),
                  AviationStack (flight data), Duffel (flight search), and OpenWeather (weather data).
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">5. Cookies</h2>
                <p className="text-text-secondary leading-relaxed">
                  We use essential cookies to maintain your login session and preferences. We do not use tracking
                  cookies or third-party advertising cookies. You can disable cookies in your browser settings,
                  but this may affect your ability to use certain features.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">6. Your Rights</h2>
                <p className="text-text-secondary leading-relaxed">
                  You have the right to access, update, or delete your personal information at any time. You can
                  do this through your profile settings or by contacting us directly. You may also request a copy
                  of all data we hold about you.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">7. Contact</h2>
                <p className="text-text-secondary leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us through our Contact page
                  or reach out via our GitHub repository.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
