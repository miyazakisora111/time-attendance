import * as React from "react";
import { cn } from "@/shared/utils/style";

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
    unstableClassName?: string;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ unstableClassName, ...props }, ref) => (
        <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", unstableClassName)} {...props} />
    )
);
