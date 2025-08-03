import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Vibrant glass card variant
const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "glass-card rounded-2xl p-6 floating",
      "hover:scale-105 transition-all duration-300",
      "border border-white/20 backdrop-blur-lg",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
GlassCard.displayName = "GlassCard"

// Neon card variant
const NeonCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-black/50 backdrop-blur-md rounded-2xl p-6",
      "border-2 border-pink-500 shadow-[0_0_20px_rgba(255,20,147,0.3)]",
      "hover:shadow-[0_0_30px_rgba(255,20,147,0.6)] transition-all duration-300",
      "hover:scale-105 transform",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
NeonCard.displayName = "NeonCard"

// Cyber card variant
const CyberCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-2xl p-6",
      "border border-cyan-400/50 cyber-grid relative overflow-hidden",
      "hover:border-cyan-400 transition-all duration-300",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-cyan-400/10 before:to-transparent",
      "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
CyberCard.displayName = "CyberCard"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, GlassCard, NeonCard, CyberCard }
