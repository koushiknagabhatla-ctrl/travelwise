"use client";

import React from "react";
import { motion } from "framer-motion";
import NavHeader from "@/components/ui/nav-header";
import { Card } from "@/components/ui/glass-card";
import { Shield, Plane, Globe, Server, Users, Target, Zap, Heart } from "lucide-react";

const FEATURES = [
  {
    icon: <Globe className="w-6 h-6 text-primary" />,
    title: "75+ Indian Airports",
    description: "Comprehensive coverage of all major and regional airports across India, from metros to tier-2 cities."
  },
  {
    icon: <Zap className="w-6 h-6 text-accent" />,
    title: "Real-Time Data",
    description: "Live flight tracking powered by AviationStack API with accurate coordinates, altitude, and speed data."
  },
  {
    icon: <Shield className="w-6 h-6 text-success" />,
    title: "Secure Authentication",
    description: "Your account is protected with Google OAuth via Supabase. We never store passwords or sensitive data locally."
  },
  {
    icon: <Server className="w-6 h-6 text-primary" />,
    title: "Modern Architecture",
    description: "Built with Next.js and Node.js microservices for fast response times and reliable performance."
  },
];

const STATS = [
  { number: "75+", label: "Airports Covered" },
  { number: "8+", label: "Airlines Compared" },
  { number: "10K+", label: "Routes Available" },
  { number: "24/7", label: "Customer Support" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <NavHeader />

      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 px-4 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary-100 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
          >
            <Plane className="w-4 h-4" /> About TravelWise
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold font-display text-text-primary tracking-tight mb-5"
          >
            Making Flight Booking<br />Simple & Transparent
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            TravelWise was built with a simple mission: help Indian travelers find the best flights
            at the best prices, without the complexity and hidden fees that plague traditional booking platforms.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-white border-y border-border-light">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-primary font-display">{stat.number}</div>
              <div className="text-sm text-text-muted mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge badge-accent mb-4">Our Mission</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-text-primary mb-5">
              Building India&apos;s Most User-Friendly Flight Platform
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              We believe booking a flight should be as easy as ordering food online. No confusing interfaces,
              no hidden charges, no bait-and-switch pricing. Just honest prices and a clean experience.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              TravelWise aggregates flight data from multiple sources to give you a comprehensive view of
              available options. Whether you&apos;re flying from Delhi to Mumbai or from Chennai to Goa,
              we help you compare and choose the best option.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Our real-time flight tracking feature lets you monitor any commercial flight across Indian
              airspace, giving you live updates on position, altitude, and estimated arrival times.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800&q=80"
                alt="Airplane wing view at sunset"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg border border-border-light">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-text-primary">Built for India</p>
                  <p className="text-xs text-text-muted">By Indian developers</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 px-4 bg-bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-text-primary mb-3">
              What We Offer
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Powerful features designed to make your travel planning effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card variant="default" padding="lg" hover className="h-full">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary mb-2">{feature.title}</h3>
                      <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-text-primary mb-5">
            Our Technology Stack
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-12">
            TravelWise is built with modern, production-grade technologies to ensure
            speed, reliability, and security.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Next.js", desc: "Frontend" },
              { name: "Node.js", desc: "Backend API" },
              { name: "Supabase", desc: "Authentication" },
              { name: "AviationStack", desc: "Flight Data" },
              { name: "OpenWeather", desc: "Weather API" },
              { name: "Duffel", desc: "Flight Search" },
              { name: "Framer Motion", desc: "Animations" },
              { name: "Tailwind CSS", desc: "Styling" },
            ].map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card variant="outlined" padding="md" className="text-center">
                  <p className="font-bold text-text-primary text-sm">{tech.name}</p>
                  <p className="text-xs text-text-muted">{tech.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer bottom */}
      <section className="py-12 px-4 bg-bg-secondary border-t border-border-light">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} TravelWise. Helping Indian travelers fly smarter.
          </p>
        </div>
      </section>
    </div>
  );
}
