import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/style";
import { cardVariants } from "@/shared/design-system/variants/card";

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
  VariantProps<typeof cardVariants> {
  unstableClassName?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ unstableClassName, variant, padding, intent, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, intent }), unstableClassName)}
        {...props}
      />
    );
  }
);
