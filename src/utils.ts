import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for merging class names with Tailwind CSS
 * Combines clsx and tailwind-merge for clean class generation
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 