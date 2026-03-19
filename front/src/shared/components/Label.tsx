import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/utils/style"

const labelVariants = cva(
    "text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    {
        variants: {
            required: {
                true: "after:content-['*'] after:ml-0.5 after:text-red-500",
                false: "",
            },
        },
        defaultVariants: {
            required: false,
        },
    }
)

export interface LabelProps
    extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "className">,
    VariantProps<typeof labelVariants> {
    unstableClassName?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ unstableClassName, required, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={cn(labelVariants({ required }), unstableClassName)}
                {...props}
            />
        )
    }
)