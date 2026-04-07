import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/style";
import { typographyVariants } from "@/shared/design-system/variants/typography";
import type { StrictHTMLProps, WithAsChild, WithUnstableClassName } from "@/shared/design-system/types";

export interface TypographyProps
    extends StrictHTMLProps<HTMLElement>,
    VariantProps<typeof typographyVariants>,
    WithAsChild,
    WithUnstableClassName { }

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

Typography.displayName = "Typography";
