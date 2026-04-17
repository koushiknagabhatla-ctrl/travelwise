"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-accent text-white hover:bg-accent-dark shadow-sm hover:shadow-md active:scale-[0.98]",
        primary: "bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md active:scale-[0.98]",
        outline: "border-1.5 border-primary text-primary bg-transparent hover:bg-primary-50 active:scale-[0.98]",
        secondary: "bg-bg-secondary text-text-primary hover:bg-border-light border border-border active:scale-[0.98]",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-secondary",
        destructive: "bg-error text-white hover:bg-red-700 active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
        white: "bg-white text-primary hover:bg-gray-50 shadow-sm active:scale-[0.98]",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        default: "h-10 px-5 py-2",
        lg: "h-12 px-8 text-base rounded-xl",
        xl: "h-14 px-10 text-lg rounded-xl",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
