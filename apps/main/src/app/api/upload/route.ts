
import { NextResponse } from 'next/server';
import { getPresignedUploadUrl } from '@/lib/r2';
import { requireArchitect } from '@/app/[locale]/(pedalboard)/pedalboard/auth-helpers';
import { storagePaths, nanoid } from '@shimokitan/utils';

/**
 * Enterprise-Grade Upload API
 * Generates presigned URLs for direct browser-to-R2 uploads.
 * 
 * Pattern: cdn.shimokitan.live/[type]/[context]/[context_id]/[filename].[ext]
 */
export async function POST(req: Request) {
    try {
        await requireArchitect();

        const { filename, contentType, context, contextId, role } = await req.json();

        if (!filename || !contentType || !context || !contextId) {
            return NextResponse.json({ error: 'MISSING_REQUIRED_FIELDS' }, { status: 400 });
        }

        const extension = filename.split('.').pop() || 'bin';
        const uniqueFilename = `${nanoid()}.${extension}`;
        
        let key = '';

        switch (context) {
            case 'artifacts':
                if (contentType.startsWith('image/')) {
                    key = storagePaths.artifactImage(contextId, uniqueFilename);
                } else if (contentType.startsWith('audio/')) {
                    key = storagePaths.artifactAudio(contextId, uniqueFilename);
                } else {
                    key = `raw/artifacts/${contextId}/${uniqueFilename}`;
                }
                break;
            case 'profiles':
                key = storagePaths.userAvatar(contextId, uniqueFilename);
                break;
            case 'zines':
                key = storagePaths.zineImage(contextId, uniqueFilename);
                break;
            case 'collections':
                key = storagePaths.collectionImage(contextId, uniqueFilename);
                break;
            default:
                return NextResponse.json({ error: 'INVALID_CONTEXT' }, { status: 400 });
        }

        const uploadUrl = await getPresignedUploadUrl(key, contentType);

        return NextResponse.json({
            uploadUrl,
            key,
            url: `${process.env.NEXT_PUBLIC_R2_DOMAIN || 'https://cdn.shimokitan.live'}/${key}`,
            filename: uniqueFilename
        });

    } catch (error: any) {
        console.error('[UPLOAD_API_FAILURE]', error);
        return NextResponse.json({ 
            error: error.message === 'UNAUTHORIZED' ? 'UNAUTHORIZED' : 'UPLOAD_INITIALIZATION_FAILED' 
        }, { status: error.message === 'UNAUTHORIZED' ? 401 : 500 });
    }
}
