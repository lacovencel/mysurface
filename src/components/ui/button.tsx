import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 box-border",
  {
    variants: {
      variant: {
        default: "bg-mid_blue text-white dark:text-white hover:bg-dark_blue transition-all duration-300 ease-in-out",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        delete: "bg-accent_delete px-2 py-1 rounded-md text-white hover:bg-accent_delete_hover transition-all duration-300 ease-in-out",
        login: "w-full py-2 px-4 font-medium tracking-wider bg-accent_color text-white rounded-md hover:bg-accent_hover transition-all duration-300 ease-in-out hover:tracking-widest hover:drop-shadow-lg",
        signup: "w-full py-2 px-4 font-medium tracking-wider bg-transparent text-black rounded-md hover:bg-accent_light transition-all duration-300 ease-in-out hover:tracking-widest hover:drop-shadow-lg border-2 border-accent_color",
        outline_blue: "bg-transparent text-black px-2 py-1 rounded-md hover:bg-accent_light transition-all duration-300 ease-in-out border-2 border-accent_color dark:text-white dark:hover:bg-gray-800",
        blue: "w-auto py-2 px-4 bg-accent_color text-white rounded-md hover:bg-accent_hover transition-all duration-200 ease-in-out",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
