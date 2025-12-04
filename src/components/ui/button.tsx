import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:scale-[1.02]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-[0_0_20px_hsl(var(--destructive)/0.3)]",
        outline: "border border-border bg-card/30 backdrop-blur-sm text-foreground hover:bg-card/60 hover:border-primary/50 hover:text-foreground hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)] hover:scale-[1.02]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-[1.02]",
        ghost: "text-foreground hover:bg-card/50 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary",
        hero: "bg-primary text-primary-foreground font-semibold hover:bg-primary hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] hover:scale-[1.03] active:scale-[0.98]",
        heroOutline: "border border-border/50 bg-card/30 backdrop-blur-sm text-foreground font-semibold hover:bg-card/60 hover:border-primary/50 hover:text-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] hover:scale-[1.03] active:scale-[0.98]",
        glow: "bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold hover:shadow-[0_0_40px_hsl(var(--primary)/0.5),0_0_60px_hsl(var(--secondary)/0.3)] hover:scale-[1.03] active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
