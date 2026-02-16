
import en from './locales/en.json';
import id from './locales/id.json';
import jp from './locales/jp.json';

export const locales = ['en', 'id', 'jp'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

const dictionaries = {
    en,
    id,
    jp,
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
