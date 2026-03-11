import React from "react";
import { cn } from "@/shared/utils/style";
import { AlertCircle } from "lucide-react";

export interface DataErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  minHeight?: string;
}

export const DataErrorState = React.forwardRef<HTMLDivElement, DataErrorStateProps>(
  ({ message = "データの取得に失敗しました", minHeight = "min-h-[200px]", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-50/50 text-red-600 gap-2 w-full",
          minHeight,
          className
        )}
        {...props}
      >
        <AlertCircle size={24} />
        <p className="font-medium text-sm">{message}</p>
      </div>
    );
  }
);

DataErrorState.displayName = "DataErrorState";
