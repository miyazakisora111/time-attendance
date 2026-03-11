import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/style";

const typographyVariants = cva(
    "text-gray-900",
    {
        variants: {
            variant: {
                h1: "text-3xl font-bold",
                h2: "text-2xl font-semibold",
                h3: "text-xl font-semibold",
                body: "text-base",
                caption: "text-sm text-gray-500",
            },
        },
        defaultVariants: {
            variant: "body",
        },
    }
);

export interface TypographyProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
    asChild?: boolean;
}

export const Typography = React.forwardRef<any, TypographyProps>(
    ({ className, variant, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "p";

        return (
            <Comp
                ref={ref}
                className={cn(typographyVariants({ variant }), className)}
                {...props}
            />
        );
    }
);

Typography.displayName = "Typography";
