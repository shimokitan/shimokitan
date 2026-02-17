import * as _ from 'lodash';
export { _ };
import dayjs from 'dayjs';
export { dayjs };
export * from './nanoid';
export * from './storage';
export * from './media';
export * from './i18n';

export function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}
