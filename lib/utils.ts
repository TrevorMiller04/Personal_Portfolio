import { type ClassValue } from "clsx"

// Simple utility function for class name merging
export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(' ')
}