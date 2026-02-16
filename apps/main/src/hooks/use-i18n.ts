
import { useParams, usePathname } from 'next/navigation';
import { Locale, defaultLocale, getLocalePath } from '@shimokitan/utils';

export function useLocale(): Locale {
    const params = useParams();
    return (params?.locale as Locale) || defaultLocale;
}

export function useLocalePath() {
    const locale = useLocale();
    return (path: string) => getLocalePath(path, locale);
}
