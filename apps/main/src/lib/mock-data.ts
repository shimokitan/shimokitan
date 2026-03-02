export type ArtifactCategory = 'anime' | 'music' | 'asmr' | 'zines';

export interface Artifact {
    id: string;
    title: string;
    category: ArtifactCategory;
    editorialDescription: string;
    coverImage: string;
    status: 'the_pit' | 'back_alley';
    heatIndex: number;
    metadata: Record<string, any>;
}

export interface Zine {
    id: string;
    artifactId: string;
    authorName: string;
    authorHandle: string;
    authorAvatar?: string;
    content: string; // The response to "What state in your life were you in when you experienced this?"
    createdAt: string;
    resonanceRating: number;
}

export interface User {
    id: string;
    name: string;
    handle: string;
    avatar?: string;
    bio: string;
    collectionArtifactIds: string[]; // IDs of artifacts in the user's collection
    stats: {
        shards: number;
        echoes: number;
        resonance: number;
    };
}

export const MOCK_USER: User = {
    id: 'user_001',
    name: 'Xavier_Dusk',
    handle: '@xavier_shkn',
    avatar: '',
    bio: 'Resonating with distortion and high-fidelity haunts since 2018. Architect of the Pit.',
    collectionArtifactIds: ['art_001', 'art_002', 'art_003'],
    stats: {
        shards: 12,
        echoes: 4,
        resonance: 542
    }
};

export const MOCK_ZINES: Zine[] = [
    {
        id: 'zine_001',
        artifactId: 'art_001',
        authorName: 'Hitori_Fan_99',
        authorHandle: '@pink_trashcan',
        content: 'I was in my second year of college, hiding in the library during lunch breaks. This anime made me feel like my small world was finally loud enough for someone to hear. It wasn\'t just distortion; it was hope.',
        createdAt: '2026-02-01T10:00:00Z',
        resonanceRating: 128
    },
    {
        id: 'zine_002',
        artifactId: 'art_001',
        authorName: 'Gutter_Ghost',
        authorHandle: '@void_walker',
        content: 'Fresh out of a job, guitar gathering dust. Seeing Hitori struggle just to say "hello" felt like looking in a mirror. I started playing again because of this shard.',
        createdAt: '2026-02-10T14:30:00Z',
        resonanceRating: 89
    },
    {
        id: 'zine_003',
        artifactId: 'art_003',
        authorName: 'Ranko_Enjoyer',
        authorHandle: '@blood_maid',
        content: 'Life felt too serious, too rigid. This absolute chaos reminded me that sometimes you just have to pull the trigger on your own path, even if it looks ridiculous to the rest of the world.',
        createdAt: '2026-02-12T09:15:00Z',
        resonanceRating: 245
    }
];

export const MOCK_ARTIFACTS: Record<string, Artifact> = {
    'art_001': {
        id: 'art_001',

        title: 'Bocchi the Rock!',
        category: 'anime',
        editorialDescription: 'A fuzz-drenched anthem for the bedroom guitarists. Best watched when you\'re feeling a little glitchy.',
        coverImage: '',
        status: 'the_pit',
        heatIndex: 892,
        metadata: {
            studio: 'CloverWorks',
            season: 'Fall',
            year: 2022,
            episodes: 12,
            vibe: 'Distortion / Anxiety / Hope',
            crunchyrollUrl: 'https://www.crunchyroll.com/series/G1HWHGN52/bocchi-the-rock'
        }
    },
    'art_002': {
        id: 'art_002',

        title: 'Neon Genesis Evangelion OST',
        category: 'music',
        editorialDescription: 'The high-fidelity haunt of the 90s. Violins meeting industrial static in the shadow of giants.',
        coverImage: '',
        status: 'back_alley',
        heatIndex: 1240,
        metadata: {
            artist: 'Shiro Sagisu',
            label: 'King Records',
            bpm: 128,
            mood: 'Melancholic / Epic',
            appleMusicId: 'id123456789'
        }
    },
    'art_003': {
        id: 'art_003',

        title: 'Akiba Maid War',
        category: 'anime',
        editorialDescription: 'The Gutter-Punk edge of Akihabara. Blood, sweat, and moe in the underground live houses.',
        coverImage: '',
        status: 'back_alley',
        heatIndex: 562,
        metadata: {
            studio: 'P.A. Works',
            season: 'Fall',
            year: 2022,
            episodes: 12,
            vibe: 'Violence / Chaos / Maid',
            crunchyrollUrl: '#'
        }
    },
    'art_004': {
        id: 'art_004',

        title: 'Steins;Gate',
        category: 'anime',
        editorialDescription: 'An urban gothic mystery where time is the greatest friction of all.',
        coverImage: '',
        status: 'back_alley',
        heatIndex: 2105,
        metadata: {
            studio: 'White Fox',
            season: 'Spring',
            year: 2011,
            episodes: 24,
            vibe: 'Time Travel / Grief / Dr. Pepper',
            crunchyrollUrl: '#'
        }
    },
    'art_005': {
        id: 'art_005',

        title: 'FLCL Progressive',
        category: 'anime',
        editorialDescription: 'Pure abstract kinetic energy. A distortion of reality that rejects the linear.',
        coverImage: '',
        status: 'the_pit',
        heatIndex: 742,
        metadata: {
            studio: 'Production I.G',
            season: 'Summer',
            year: 2018,
            episodes: 6,
            vibe: 'Noise / Coming of Age / Chaos',
            crunchyrollUrl: '#'
        }
    },
    'art_006': {
        id: 'art_006',

        title: 'Cowboy Bebop OST 1',
        category: 'music',
        editorialDescription: 'The jazz-punk blueprint for the digital district. Tank! is the anthem of the archive.',
        coverImage: '',
        status: 'back_alley',
        heatIndex: 3500,
        metadata: {
            artist: 'The Seatbelts',
            label: 'Victor Entertainment',
            bpm: 160,
            mood: 'Wild / Cool / Noir',
            appleMusicId: 'id987654321'
        }
    },
    'art_007': {
        id: 'art_007',

        title: 'Duvet / Lain Soundtrack',
        category: 'music',
        editorialDescription: 'The sound of the Wired. Gentle, haunting, and deeply connected to the digital void.',
        coverImage: '',
        status: 'back_alley',
        heatIndex: 1820,
        metadata: {
            artist: 'bôa',
            label: 'Polydor',
            bpm: 82,
            mood: 'Ethereal / Cold',
            appleMusicId: 'id1122334455'
        }
    },
    'art_008': {
        id: 'art_008',

        title: 'Edgerunners Selection',
        category: 'music',
        editorialDescription: 'Electronic static from the Night City gutters. Hard-hitting distortion and synth-wave grief.',
        coverImage: '',
        status: 'the_pit',
        heatIndex: 4201,
        metadata: {
            artist: 'Various Artists',
            label: 'Milan Records',
            bpm: 140,
            mood: 'Violent / Sorrow',
            appleMusicId: 'id5566778899'
        }
    }
};
