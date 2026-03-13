
import { useQuery } from '@tanstack/react-query';
import { fetchAnilistMetadata } from '../services/anilist';

export function useAnilistSync(identifier: string | number | null) {
    return useQuery({
        queryKey: ['anilist', identifier],
        queryFn: async () => {
            if (!identifier) return null;
            return fetchAnilistMetadata(identifier);
        },
        enabled: !!identifier,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
