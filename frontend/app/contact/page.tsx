"use client";

import React from "react";
import { motion } from "framer-motion";
import NavHeader from "@/components/ui/nav-header";
import { Card } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/liquid-glass-button";
import { Mail, Globe, MapPin, ExternalLink, Code } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <NavHeader />

      <section className="pt-28 pb-16 md:pt-36 md:pb-20 px-4 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold font-display text-text-primary tracking-tight mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-text-secondary max-w-xl mx-auto"
          >
            Have questions, feedback, or want to contribute? We&apos;d love to hear from you.
          </motion.p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card variant="default" padding="lg" hover className="h-full">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-text-primary" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">GitHub</h3>
              <p className="text-text-secondary text-sm mb-4">
                Check out the source code, report issues, or contribute to the project.
              </p>
              <Link href="https://github.com/koushiknagabhatla-ctrl" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm">
                  View Profile <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="default" padding="lg" hover className="h-full">
              <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Email</h3>
              <p className="text-text-secondary text-sm mb-4">
                For business inquiries, support requests, or general feedback.
              </p>
              <Link href="mailto:contact@travelwise.app">
                <Button variant="secondary" size="sm">
                  Send Email <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="default" padding="lg" hover className="h-full">
              <div className="w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Website</h3>
              <p className="text-text-secondary text-sm mb-4">
                Visit our main website for the latest updates, features, and announcements.
              </p>
              <Link href="/">
                <Button variant="secondary" size="sm">
                  Visit Home <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="default" padding="lg" hover className="h-full">
              <div className="w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Location</h3>
              <p className="text-text-secondary text-sm mb-4">
                Based in India, building for Indian travelers across all states and cities.
              </p>
              <span className="text-sm font-medium text-text-muted">🇮🇳 India</span>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-10 px-4 bg-bg-secondary border-t border-border-light">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} TravelWise. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
}
