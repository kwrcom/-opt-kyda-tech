import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Утилита для объединения классов Tailwind CSS
 * Позволяет удобно комбинировать условные классы и разрешать конфликты
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Форматирование даты
 */
export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

/**
 * Форматирование валюты (KZT)
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("ru-KZ", {
        style: "currency",
        currency: "KZT",
        minimumFractionDigits: 0,
    }).format(amount);
}
