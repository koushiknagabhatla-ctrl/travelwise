"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "flat";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  className,
  variant = "default",
  hover = false,
  padding = "md",
  children,
  ...props
}: CardProps) {
  const variants = {
    default: "bg-white border border-border rounded-xl shadow-card",
    elevated: "bg-white rounded-xl shadow-lg",
    outlined: "bg-white border border-border rounded-xl",
    flat: "bg-bg-secondary rounded-xl",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        variants[variant],
        paddings[padding],
        hover && "transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
