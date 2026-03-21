import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/style";
import { buttonVariants } from "@/shared/design-system/variants/button";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  unstableClassName?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ unstableClassName, variant, intent, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, intent, size, fullWidth }), unstableClassName)}
        {...props}
      />
    );
  }
);