import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @param {...any} inputs - Class names or class objects
 * @returns {string} Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
