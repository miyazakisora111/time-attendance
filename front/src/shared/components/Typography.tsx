import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/style";

const typographyVariants = cva("text-gray-900", {
    variants: {
        variant: {
            h1: "text-4xl font-bold tracking-tight",
            h2: "text-3xl font-semibold tracking-tight",
            h3: "text-2xl font-semibold",
            body: "text-base leading-relaxed",
            paragraph: "text-base leading-7",
            caption: "text-sm text-gray-500",
            label: "text-sm font-medium",
            small: "text-xs",
        },
        intent: {
            default: "text-gray-900",
            muted: "text-gray-500",
            primary: "text-blue-600",
            success: "text-green-600",
            warning: "text-amber-600",
            danger: "text-red-600",
            white: "text-white",
        },
        align: {
            left: "text-left",
            center: "text-center",
            right: "text-right",
        },
    },
    defaultVariants: {
        variant: "paragraph",
        intent: "default",
        align: "left",
    },
});

export interface TypographyProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
    asChild?: boolean;
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant, intent, align, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "p";

        return (
            <Comp
                ref={ref as any}
                className={cn(typographyVariants({ variant, intent, align }), className)}
                {...props}
            />
        );
    }
);
