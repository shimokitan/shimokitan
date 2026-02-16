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
