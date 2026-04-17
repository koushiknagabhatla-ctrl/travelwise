"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function GlassFilter() {
  return (
    <svg className="hidden" aria-hidden="true">
      <defs>
        <filter
          id="liquid-glass-filter"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "cyan" | "amber" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-8 px-4 text-xs",
  md: "h-10 px-6 text-sm",
  lg: "h-12 px-8 text-base",
  xl: "h-14 px-10 text-lg",
};

const variantClasses = {
  default: "text-frost",
  cyan: "text-cyan-glow",
  amber: "text-amber-glow",
  ghost: "text-silver",
};

export function LiquidButton({
  className,
  variant = "default",
  size = "lg",
  children,
  ...props
}: LiquidButtonProps) {
  return (
    <>
      <button
        className={cn(
          "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {/* Liquid glass layer */}
        <div
          className="absolute top-0 left-0 z-0 h-full w-full rounded-full
            shadow-[0_0_6px_rgba(255,255,255,0.03),0_2px_6px_rgba(0,0,0,0.2),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]
            transition-all"
        />
        <div
          className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-full"
          style={{ backdropFilter: 'url("#liquid-glass-filter")' }}
        />

        <span className="relative z-10 pointer-events-none flex items-center gap-2">
          {children}
        </span>
        <GlassFilter />
      </button>
    </>
  );
}

export default LiquidButton;
