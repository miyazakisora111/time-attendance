import * as React from "react";
import { cn } from "@/shared/utils/style";
import type { StrictHTMLProps, WithUnstableClassName } from "@/shared/design-system/types";

export interface CardHeaderProps
    extends StrictHTMLProps<HTMLDivElement>,
    WithUnstableClassName { }

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ unstableClassName, ...props }, ref) => (
        <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", unstableClassName)} {...props} />
    )
);

CardHeader.displayName = "CardHeader";
