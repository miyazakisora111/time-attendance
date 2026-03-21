import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/style";
import { typographyVariants } from "@/shared/design-system/variants/typography";

export interface TypographyProps
    extends Omit<React.HTMLAttributes<HTMLElement>, "className">,
    VariantProps<typeof typographyVariants> {
    asChild?: boolean;
    unstableClassName?: string;
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
    ({ unstableClassName, variant, intent, align, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "p";

        return (
            <Comp
                ref={ref as unknown as React.Ref<HTMLParagraphElement>}
                className={cn(typographyVariants({ variant, intent, align }), unstableClassName)}
                {...props}
            />
        );
    }
);
