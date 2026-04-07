import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** className を条件結合し、Tailwind の競合を解消する */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
