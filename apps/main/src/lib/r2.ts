
import { getCloudflareContext } from "@opennextjs/cloudflare";
import sharp from 'sharp';
import { storagePaths, nanoid } from '@shimokitan/utils';

// Helper to get R2 domain
const R2_DOMAIN = process.env.NEXT_PUBLIC_R2_DOMAIN || 'https://assets.shimokitan.com';

/**
 * Uploads an image from a URL to R2, processing it with Sharp.
 * Returns the public URL of the uploaded asset.
 */
export async function uploadImageFromUrl(
    url: string,
    contextId: string,
    type: 'artifact' | 'zine' | 'profile' | 'collection' = 'artifact'
): Promise<string> {
    try {
        console.log(`[R2] Processing image from: ${url}`);

        // 1. Fetch the image
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Process with Sharp (Resize/Format) -> WebP
        // We convert to WebP as requested
        const processedBuffer = await sharp(buffer)
            .webp({ quality: 80 })
            .toBuffer();

        // 3. Generate Path
        const filename = `${nanoid()}.webp`;
        let key = '';

        if (type === 'artifact') {
            key = storagePaths.artifactImage(contextId, filename);
        } else if (type === 'zine') {
            key = storagePaths.zineImage(contextId, filename);
        } else if (type === 'profile') {
            key = storagePaths.userAvatar(contextId, filename);
        } else if (type === 'collection') {
            key = storagePaths.collectionImage(contextId, filename);
        } else {
            throw new Error('Invalid upload context type');
        }

        // 4. Upload to R2 via Binding
        // In OpenNext/Cloudflare, we access bindings via getCloudflareContext
        const { env } = await getCloudflareContext();
        const bucket = (env as any).MY_BUCKET;

        if (!bucket) {
            throw new Error("MY_BUCKET binding not found in Cloudflare context");
        }

        await bucket.put(key, processedBuffer, {
            httpMetadata: {
                contentType: 'image/webp',
            }
        });

        console.log(`[R2] Uploaded to: ${key}`);

        // 5. Return Public URL
        return `${R2_DOMAIN}/${key}`;

    } catch (error) {
        console.error('[R2] Upload failed:', error);
        // Fallback: If upload fails, just return the original URL so the app doesn't break,
        // but log the error. Or should we throw?
        // User said "keep the link/url > download > upload".
        // If processing fails, typically we want to know.
        throw error;
    }
}
