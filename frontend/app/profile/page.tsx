"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import NavHeader from "../components/ui/nav-header";
import { GlassCard } from "../components/ui/glass-card";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, LogOut, Plane, Clock, Shield, Bell } from "lucide-react";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-glow border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-void">
      <NavHeader />
      <div className="pt-28 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="p-8 mb-8" glow="subtle">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-glow to-indigo-glow flex items-center justify-center text-3xl font-black text-void shadow-lg shadow-cyan-glow/20">
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    user.name?.charAt(0) || "U"
                  )}
                </div>
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-2xl font-black font-display text-frost">{user.name}</h1>
                  <div className="flex flex-col md:flex-row gap-3 mt-2">
                    {user.email && (
                      <span className="flex items-center gap-1.5 text-sm text-silver">
                        <Mail className="w-3.5 h-3.5 text-cyan-glow" /> {user.email}
                      </span>
                    )}
                    {user.phone && (
                      <span className="flex items-center gap-1.5 text-sm text-silver">
                        <Phone className="w-3.5 h-3.5 text-cyan-glow" /> {user.phone}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={async () => { await logout(); router.push("/"); }}
                  className="btn-ghost flex items-center gap-2 text-sm text-rose-glow border-rose-glow/20 hover:bg-rose-glow/5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: <Plane className="w-5 h-5 text-cyan-glow" />, label: "My Bookings", desc: "View past and upcoming flights", href: "/" },
              { icon: <Bell className="w-5 h-5 text-amber-glow" />, label: "Price Alerts", desc: "Manage your fare alerts", href: "/" },
              { icon: <Clock className="w-5 h-5 text-indigo-glow" />, label: "Recent Searches", desc: "Your recent flight searches", href: "/" },
            ].map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                <button
                  onClick={() => router.push(action.href)}
                  className="w-full text-left"
                >
                  <GlassCard className="p-5 h-full" hover>
                    <div className="flex items-center gap-3 mb-2">
                      {action.icon}
                      <h3 className="font-bold text-frost text-sm">{action.label}</h3>
                    </div>
                    <p className="text-xs text-ash">{action.desc}</p>
                  </GlassCard>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Account Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard className="p-6">
              <h2 className="text-lg font-bold font-display text-frost mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-glow" /> Account Details
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between glass rounded-lg px-4 py-3">
                  <span className="text-silver">User ID</span>
                  <span className="text-frost font-mono text-xs">{user.id?.slice(0, 12)}...</span>
                </div>
                <div className="flex justify-between glass rounded-lg px-4 py-3">
                  <span className="text-silver">Auth Provider</span>
                  <span className="text-frost">Supabase</span>
                </div>
                <div className="flex justify-between glass rounded-lg px-4 py-3">
                  <span className="text-silver">Session Status</span>
                  <span className="text-cyan-glow font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" /> Active
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
