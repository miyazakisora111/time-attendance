import { cn } from "@/shared/utils/style";

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  unstableClassName?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export const Spinner = ({ size = 'md', unstableClassName }: SpinnerProps) => (
  <svg className={cn("animate-spin text-current", sizeClasses[size], unstableClassName)} viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" fill="none" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
);
