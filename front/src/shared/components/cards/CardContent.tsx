import * as React from "react";
import { cn } from "@/shared/utils/style";
import type { StrictHTMLProps, WithUnstableClassName } from "@/shared/design-system/types";

export interface CardContentProps
    extends StrictHTMLProps<HTMLDivElement>,
    WithUnstableClassName { }

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
    ({ unstableClassName, ...props }, ref) => (
        <div ref={ref} className={cn("p-6 pt-0", unstableClassName)} {...props} />
    )
);

CardContent.displayName = "CardContent";
