import * as _ from 'lodash';
export { _ };
import dayjs from 'dayjs';
export { dayjs };
export * from './nanoid';
export * from './storage';
export * from './media';
export * from './i18n';
export * from './routing';

export function slugify(text: string) {
    const base = text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');

    // If slugify results in an empty string (e.g. Japanese Kanji/Kana), 
    // we return the original string with whitespace replaced to avoid DB constraint failures
    // while keeping URLs human-readable (modern browsers handle encoded Japanese slugs well).
    if (!base || base === '-') {
        const fallback = text
            .toString()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf-]+/g, '')
            .replace(/--+/g, '-');
        
        // Final shield: if it's STILL empty (e.g. only symbols like "!!!"), return a short ID
        if (!fallback || fallback === '-') {
            return `id-${Math.random().toString(36).substring(2, 8)}`;
        }
        return fallback;
    }

    return base;
}
