import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function mergeClasses(...inputs) {
  return twMerge(clsx(inputs));
}
