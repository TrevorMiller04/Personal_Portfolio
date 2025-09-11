import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "destructive" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-white hover:bg-primary/80":
            variant === "default",
          "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80":
            variant === "secondary",
          "border-transparent bg-green-100 text-green-800 hover:bg-green-100/80":
            variant === "success",
          "border-transparent bg-red-100 text-red-800 hover:bg-red-100/80":
            variant === "destructive",
          "text-gray-700 border-gray-300 hover:bg-gray-50":
            variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }