import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/style";
import { badgeVariants } from "@/shared/design-system/variants/badge";
import type { StrictHTMLProps, WithAsChild, WithUnstableClassName } from "@/shared/design-system/types";

export interface BadgeProps
  extends StrictHTMLProps<HTMLDivElement>,
  VariantProps<typeof badgeVariants>,
  WithAsChild,
  WithUnstableClassName { }

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ unstableClassName, intent, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(badgeVariants({ intent, size }), unstableClassName)}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
