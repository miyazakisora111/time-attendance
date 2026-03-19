import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/style";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      intent: {
        default: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80",
        primary: "border-transparent bg-blue-600 text-white hover:bg-blue-600/80",
        success: "border-transparent bg-green-600 text-white hover:bg-green-600/80",
        warning: "border-transparent bg-amber-500 text-white hover:bg-amber-500/80",
        danger: "border-transparent bg-red-600 text-white hover:bg-red-600/80",
        outline: "text-gray-900 border border-gray-200 bg-transparent hover:bg-gray-50",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
      },
    },
    defaultVariants: {
      intent: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  unstableClassName?: string;
}

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
