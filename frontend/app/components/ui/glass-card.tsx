"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "none" | "cyan" | "amber" | "subtle";
  hover?: boolean;
}

export function GlassCard({
  className,
  glow = "none",
  hover = true,
  children,
  ...props
}: GlassCardProps) {
  const glowClasses = {
    none: "",
    cyan: "glow-cyan",
    amber: "glow-amber",
    subtle: "shadow-[0_0_40px_rgba(255,255,255,0.03)]",
  };

  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-6",
        hover && "glass-card-hover",
        glowClasses[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default GlassCard;
