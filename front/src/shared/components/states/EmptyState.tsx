import React from "react";
import { cn } from "@/shared/utils/style";
import type { LucideIcon } from "lucide-react";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description?: string;
  minHeight?: string;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon: Icon, title, description, minHeight = "min-h-[200px]", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center p-8 text-gray-500 gap-2 w-full",
          minHeight,
          className
        )}
        {...props}
      >
        <Icon size={32} className="text-gray-300" strokeWidth={1.5} />
        <p className="font-medium text-sm mt-2">{title}</p>
        {description && <p className="text-xs text-gray-400 mt-1 text-center">{description}</p>}
      </div>
    );
  }
);