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
  (
    { variant, padding, intent, unstableClassName, ...restProps },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding, intent }),
          unstableClassName
        )}
        {...restProps}
      />
    );
  }
);

Card.displayName = "Card";


// TODO: 全部Card.displayName = "Card";つけたい
