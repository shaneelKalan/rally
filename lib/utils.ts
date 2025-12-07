import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistance, formatRelative } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, formatStr: string = "PPP"): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, formatStr);
}

export function formatDateTime(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "PPP 'at' p");
}

export function formatTimeAgo(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
}

export function formatRelativeDate(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return formatRelative(dateObj, new Date());
}

export function generateAccessCode(length: number = 6): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous chars
    let code = "";
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export function generateToken(length: number = 32): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "";
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}
