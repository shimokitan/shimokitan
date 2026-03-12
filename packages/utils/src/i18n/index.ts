
import en from './locales/en.json';
import id from './locales/id.json';
import ja from './locales/ja.json';

export const locales = ['en', 'id', 'ja'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

const dictionaries = {
    en,
    id,
    ja,
} as const;

export const getDictionary = (locale: Locale) => {
    return dictionaries[locale] ?? dictionaries[defaultLocale];
};

export type Dictionary = typeof en;

/**
 * Helper to get a nested value from the dictionary
 */
export const getTranslation = (dict: any, path: string) => {
    return path.split('.').reduce((obj, key) => obj?.[key], dict) || path;
};

/**
 * Helper to prefix a path with the locale
 */
export const getLocalePath = (path: string, locale: string) => {
    if (path.startsWith('http') || path.startsWith('//')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Avoid double prefixing
    if (locales.some(l => cleanPath.startsWith(`/${l}/`) || cleanPath === `/${l}`)) {
        return cleanPath;
    }

    return `/${locale}${cleanPath}`;
};

/**
 * Resolves a translation from a list based on target locale and fallback strategy.
 * Priority: Target Locale -> English (en) -> First available translation.
 */
export function resolveTranslation<T extends { locale: string | any } & Record<string, any>>(
    translations: T[] | undefined | null,
    targetLocale: string
): T | undefined {
    if (!translations || translations.length === 0) return undefined;

    // 1. Exact match for target locale
    const perfectMatch = translations.find(t => t.locale === targetLocale);
    if (perfectMatch) return perfectMatch;

    // 2. Fallback to English
    const englishFallback = translations.find(t => t.locale === 'en');
    if (englishFallback) return englishFallback;

    // 3. Last resort: just return the first one available
    return translations[0];
}
