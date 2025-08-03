import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 font-space",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-retro-pink to-retro-orange text-white hover:from-retro-pink/80 hover:to-retro-orange/80 shadow-lg hover:shadow-retro-pink/25",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/25",
        outline: "border-2 border-retro-cyan bg-transparent text-retro-cyan hover:bg-retro-cyan hover:text-black shadow-lg hover:shadow-retro-cyan/25",
        secondary: "bg-gradient-to-r from-retro-cyan to-retro-purple text-white hover:from-retro-cyan/80 hover:to-retro-purple/80 shadow-lg hover:shadow-retro-cyan/25",
        ghost: "text-white hover:bg-white/10 hover:text-retro-cyan",
        link: "text-retro-cyan underline-offset-4 hover:underline hover:text-retro-pink",
        retro: "bg-black border-2 border-retro-pink text-retro-pink hover:bg-retro-pink hover:text-black shadow-[0_0_20px_rgba(255,51,102,0.5)] hover:shadow-[0_0_30px_rgba(255,51,102,0.8)] font-bold retro-glow",
        glass: "glass-morphism text-white hover:bg-white/20 border border-white/20 hover:border-white/40",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-md px-4",
        lg: "h-14 rounded-lg px-10 text-lg",
        icon: "h-12 w-12",
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
