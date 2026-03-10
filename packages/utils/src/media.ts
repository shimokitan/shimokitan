/**
 * Extracts the video/content ID from various platform URLs.
 * Focuses on YouTube, but designed to be extensible.
 */
export function extractMediaId(url: string, platform: string): string | null {
    if (!url) return null;

    const trimmedUrl = url.trim();

    switch (platform.toLowerCase()) {
        case 'youtube':
        case 'youtube_music': {
            // Patterns matched:
            // youtube.com/watch?v=ID
            // youtu.be/ID
            // youtube.com/embed/ID
            // youtube.com/v/ID
            // music.youtube.com/watch?v=ID
            const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
            const match = trimmedUrl.match(regex);
            return match ? match[1] : null;
        }

        case 'bilibili': {
            // Patterns matched:
            // bilibili.com/video/BV...
            // bilibili.com/video/av...
            const bvidMatch = trimmedUrl.match(/\/video\/(BV[a-zA-Z0-9]+)/i);
            if (bvidMatch) return bvidMatch[1];

            const avidMatch = trimmedUrl.match(/\/video\/(av[0-9]+)/i);
            if (avidMatch) return avidMatch[1];

            return null;
        }

        case 'niconico': {
            // Patterns matched:
            // nicovideo.jp/watch/sm...
            const match = trimmedUrl.match(/\/watch\/(sm[0-9]+)/i);
            return match ? match[1] : null;
        }

        default:
            return null;
    }
}

/**
 * Generates a thumbnail URL for a given platform ID.
 */
export function getThumbnailUrl(id: string | null, platform: string): string | null {
    if (!id) return null;

    switch (platform.toLowerCase()) {
        case 'youtube':
        case 'youtube_music':
            return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
        case 'bilibili':
            // Bilibili doesn't have a simple predictable thumbnail pattern like YouTube 
            // without API calls, so we return null for now.
            return null;
        case 'niconico':
            return `https://nicovideo.cdn.nimg.jp/thumbnails/${id}/${id}.L`;
        default:
            return null;
    }
}

/**
 * Generates a Cloudflare-optimized image URL.
 * Applies WebP format and 80% quality by default as per Phase 1 requirements.
 * 
 * @param url - The original image URL (R2 or external)
 * @param options - Transformation options (width, height, fit, quality)
 */
export function getOptimizedImageUrl(
    url: string | null,
    options: { width?: number; height?: number; fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad'; quality?: number } = {}
): string | null {
    if (!url) return null;

    // Use default quality 80 if not specified
    const quality = options.quality ?? 80;
    const params = [`format=webp`, `quality=${quality}`];

    if (options.width) params.push(`width=${options.width}`);
    if (options.height) params.push(`height=${options.height}`);
    if (options.fit) params.push(`fit=${options.fit}`);

    // Cloudflare Image Resizing endpoint
    // Format: /cdn-cgi/image/{params}/{url}
    return `/cdn-cgi/image/${params.join(',')}/${url}`;
}

/**
 * Returns the CDN URL for a brand icon.
 * Assets are served from cdn.shimokitan.live/images/brand/*.webp
 */
export function getBrandIconUrl(platform: string): string | null {
    if (!platform) return null;

    const p = platform.toLowerCase();

    // Map internal slugs to CDN filenames
    const mapping: Record<string, string> = {
        'ko_fi': 'ko-fi',
        'twitter': 'x',
        'apple_music': 'apple-music', // check if apple-music exists, user didn't mention it but good to have
        'buymeacoffee': 'buymeacoffee',
        'youtube_music': 'youtube',
    };

    const fileName = mapping[p] || p.replace(/_/g, '-');

    // List of supported brand icons provided by user
    const supported = [
        'niconico', 'youtube', 'x', 'ko-fi', 'booth', 'vgen', 'patreon',
        'buymeacoffee', 'fanbox', 'fiverr',
        'gumroad', 'etsy', 'society6', 'redbubble', 'artstation',
        'behance', 'bandcamp', 'soundcloud',
        'skeb', 'pixiv'
    ];

    if (!supported.includes(fileName)) return null;

    return `https://cdn.shimokitan.live/images/brand/${fileName}.webp`;
}
