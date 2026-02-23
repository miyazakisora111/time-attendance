import { cva } from "class-variance-authority";

export const buttonVariants = cva(
    [
        "inline-flex items-center justify-center gap-2",
        "whitespace-nowrap rounded-md text-sm font-medium",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
    ],
    {
        variants: {
            variant: {
                primary: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary",
                secondary: "bg-secondary text-white hover:opacity-90",
                danger: "bg-danger text-white hover:opacity-90",
                outline: "border border-primary text-primary hover:bg-primary/10",
                ghost: "text-primary hover:bg-primary/10",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                sm: "h-8 px-3 text-xs",
                md: "h-9 px-4",
                lg: "h-10 px-6 text-base",
                icon: "h-9 w-9 p-0",
            },
        },
        defaultVariants: { variant: "primary", size: "md" },
    }
);
