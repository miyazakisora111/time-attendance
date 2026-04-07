import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/style";
import type { StrictHTMLProps, WithUnstableClassName } from "@/shared/design-system/types";

const containerVariants = cva(
    "mx-auto w-full px-6",
    {
        variants: {
            size: {
                sm: "max-w-md",
                md: "max-w-3xl",
                lg: "max-w-6xl",
                full: "max-w-full min-h-screen",
            },
            center: {
                true: "flex min-h-screen items-center justify-center",
            },
            tone: {
                default: "",
                light: "bg-zinc-50 text-zinc-900",
                dark: "bg-zinc-900 text-white",
                blue: "bg-linear-to-br from-blue-600 to-blue-800 text-white",
                indigo: "bg-linear-to-br from-indigo-600 to-indigo-800 text-white",
                brand: "bg-linear-to-br from-primary to-primary/80 text-primary-foreground",
                success: "bg-emerald-600 text-white",
                warning: "bg-amber-500 text-zinc-900",
                danger: "bg-rose-600 text-white",
                muted: "bg-zinc-100 text-zinc-900",
                surface: "bg-white text-zinc-900",
            },
        },
        defaultVariants: {
            size: "md",
            tone: "default",
        },
    }
);

export interface ContainerProps
    extends StrictHTMLProps<HTMLDivElement>,
    VariantProps<typeof containerVariants>,
    WithUnstableClassName { }

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ size, center, tone, unstableClassName, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(containerVariants({ size, center, tone }), unstableClassName)}
            {...props}
        />
    )
);

Container.displayName = "Container";