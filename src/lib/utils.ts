import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateCode(length: number = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

export function isValidCode(code: string): boolean {
    return /^[A-Za-z0-9]{6,8}$/.test(code);
}
