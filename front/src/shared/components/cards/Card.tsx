import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/style";
import { cardVariants } from "@/shared/design-system/variants/card";
import type { StrictHTMLProps, WithUnstableClassName } from "@/shared/design-system/types";

export interface CardProps
  extends StrictHTMLProps<HTMLDivElement>,
  VariantProps<typeof cardVariants>,
  WithUnstableClassName { }

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
