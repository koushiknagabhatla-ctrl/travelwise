"use client";

import React from "react";

export default function AuthCallbackPage() {
  React.useEffect(() => {
    // Supabase automatically handles the callback and sets the session.
    // We just redirect home after a moment.
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-void">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-glow to-indigo-glow mx-auto mb-4 animate-pulse" />
        <p className="text-frost font-semibold text-lg">Authenticating...</p>
        <p className="text-ash text-sm mt-1">Securing your session</p>
      </div>
    </div>
  );
}
