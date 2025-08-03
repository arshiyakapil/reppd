import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// Notebook-themed input variant
const NotebookInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full bg-transparent border-0 border-b-2 border-blue-300 px-2 py-2",
          "text-blue-900 placeholder:text-blue-400 font-handwriting text-lg",
          "focus:outline-none focus:border-blue-500 focus:bg-blue-50/30",
          "bg-[linear-gradient(to_bottom,transparent_0px,transparent_23px,#e5e7eb_24px,#e5e7eb_25px,transparent_26px)]",
          "bg-[length:100%_26px]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
NotebookInput.displayName = "NotebookInput"

export { Input, NotebookInput }
