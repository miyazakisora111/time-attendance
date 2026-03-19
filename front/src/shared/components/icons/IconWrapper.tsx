import React from "react";
import { cn } from "@/shared/utils/style";
import type { LucideIcon } from "lucide-react";

export interface IconWrapperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  icon: LucideIcon;
  size?: number;
  iconColor?: string;
  bgColor?: string;
  strokeWidth?: number;
  unstableClassName?: string;
}

export const IconWrapper = React.forwardRef<HTMLDivElement, IconWrapperProps>(
  ({
    icon: Icon,
    size = 20,
    iconColor = "text-gray-600",
    bgColor = "bg-gray-100",
    strokeWidth = 2.5,
    unstableClassName,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          bgColor,
          unstableClassName
        )}
        {...props}
      >
        <Icon size={size} className={iconColor} strokeWidth={strokeWidth} />
      </div>
    );
  }
);
