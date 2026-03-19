import * as React from "react";
import { cn } from "@/shared/utils/style";

export interface CardTitleProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, "className"> {
    unstableClassName?: string;
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ unstableClassName, ...props }, ref) => (
        <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", unstableClassName)} {...props} />
    )
);
