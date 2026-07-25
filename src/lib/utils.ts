import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as Russian ruble currency, e.g. 1 250 ₽
 */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats a count with correct Russian plural form.
 * forms: [one, few, many] e.g. ["отзыв", "отзыва", "отзывов"]
 */
export function pluralizeRu(count: number, forms: [string, string, string]): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU", { notation: "compact" }).format(value);
}
