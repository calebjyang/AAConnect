import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Robustly parses a Firestore Timestamp, ISO string, or Date object to a Date.
 * @param date Any date value from Firestore or the app
 * @returns Date object or null if invalid
 */
export function parseEventDate(date: any): Date | null {
  if (!date) return null;
  // Firestore Timestamp
  if (typeof date === 'object' && 'seconds' in date) {
    return new Date(date.seconds * 1000);
  }
  // ISO string
  if (typeof date === 'string') {
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d;
  }
  // Already a Date object
  if (date instanceof Date) return date;
  return null;
}

/**
 * Converts a Firestore Timestamp, ISO string, number, or Date to a Date object.
 * Returns null if the value is invalid or missing.
 */
export function toDateSafe(value: any): Date | null {
  if (!value) return null;
  if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof value.toDate === 'function') return value.toDate();
  if (value.seconds) return new Date(value.seconds * 1000);
  return null;
}
