import * as React from "react";
import { cn } from "@/shared/utils/style";
import type { StrictHTMLProps, WithUnstableClassName } from "@/shared/design-system/types";

export interface CardTitleProps
    extends StrictHTMLProps<HTMLHeadingElement>,
    WithUnstableClassName { }

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ unstableClassName, ...props }, ref) => (
        <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", unstableClassName)} {...props} />
    )
);

CardTitle.displayName = "CardTitle";
