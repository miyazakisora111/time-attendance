import * as React from "react";
import { cn } from "@/shared/utils/style";

export interface CardContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
    unstableClassName?: string;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
    ({ unstableClassName, ...props }, ref) => (
        <div ref={ref} className={cn("p-6 pt-0", unstableClassName)} {...props} />
    )
);
