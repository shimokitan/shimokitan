
export interface AnilistMedia {
    id: number;
    title: {
        romaji: string;
        english: string;
        native: string;
    };
    description: string;
    coverImage: {
        extraLarge: string;
    };
    startDate: {
        year: number;
        month: number;
        day: number;
    };
    status: string;
    episodes: number;
    genres: string[];
    averageScore: number;
    format: string;
    season: string;
    seasonYear: number;
}

const query = `
query ($id: Int, $search: String) {
  Media (id: $id, search: $search, type: ANIME) {
    id
    title {
      romaji
      english
      native
    }
    description
    coverImage {
      extraLarge
    }
    startDate {
      year
      month
      day
    }
    status
    episodes
    genres
    averageScore
    format
    season
    seasonYear
  }
}
`;

export async function fetchAnilistMetadata(identifier: string | number): Promise<AnilistMedia | null> {
    const isId = typeof identifier === 'number' || !isNaN(Number(identifier));
    const variables = isId ? { id: Number(identifier) } : { search: identifier };

    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });

        const result = await response.json();

        if (result.errors) {
            console.error('AniList API Error:', result.errors);
            return null;
        }

        return result.data.Media;
    } catch (error) {
        console.error('Failed to fetch from AniList:', error);
        return null;
    }
}
