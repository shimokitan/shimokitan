export type ArtifactCategory = 'anime' | 'music' | 'asmr' | 'manga' | 'doujinshi' | 'mv';

export interface Artifact {
    id: string;
    slug: string;
    title: string;
    category: ArtifactCategory;
    editorialDescription: string;
    coverImage: string;
    status: 'the_pit' | 'back_alley';
    heatIndex: number;
    metadata: Record<string, any>;
}

export const MOCK_ARTIFACTS: Record<string, Artifact> = {
    'bocchi-the-rock': {
        id: 'art_001',
        slug: 'bocchi-the-rock',
        title: 'Bocchi the Rock!',
        category: 'anime',
        editorialDescription: 'A fuzz-drenched anthem for the bedroom guitarists. Best watched when you\'re feeling a little glitchy.',
        coverImage: 'https://images.unsplash.com/photo-1548502669-522718227b26?w=1200&q=80',
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
    'neon-genesis-ost': {
        id: 'art_002',
        slug: 'neon-genesis-ost',
        title: 'Neon Genesis Evangelion OST',
        category: 'music',
        editorialDescription: 'The high-fidelity haunt of the 90s. Violins meeting industrial static in the shadow of giants.',
        coverImage: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=1200&q=80',
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
    'akiba-maid-war': {
        id: 'art_003',
        slug: 'akiba-maid-war',
        title: 'Akiba Maid War',
        category: 'anime',
        editorialDescription: 'The Gutter-Punk edge of Akihabara. Blood, sweat, and moe in the underground live houses.',
        coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80',
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
    'steins-gate': {
        id: 'art_004',
        slug: 'steins-gate',
        title: 'Steins;Gate',
        category: 'anime',
        editorialDescription: 'An urban gothic mystery where time is the greatest friction of all.',
        coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80',
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
    'flcl-progressive': {
        id: 'art_005',
        slug: 'flcl-progressive',
        title: 'FLCL Progressive',
        category: 'anime',
        editorialDescription: 'Pure abstract kinetic energy. A distortion of reality that rejects the linear.',
        coverImage: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&q=80',
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
    'cowboy-bebop-ost-1': {
        id: 'art_006',
        slug: 'cowboy-bebop-ost-1',
        title: 'Cowboy Bebop OST 1',
        category: 'music',
        editorialDescription: 'The jazz-punk blueprint for the digital district. Tank! is the anthem of the archive.',
        coverImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80',
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
    'serial-experiments-lain-soundtrack': {
        id: 'art_007',
        slug: 'serial-experiments-lain-soundtrack',
        title: 'Duvet / Lain Soundtrack',
        category: 'music',
        editorialDescription: 'The sound of the Wired. Gentle, haunting, and deeply connected to the digital void.',
        coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80',
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
    'cyberpunk-edgerunners-ost': {
        id: 'art_008',
        slug: 'cyberpunk-edgerunners-ost',
        title: 'Edgerunners Selection',
        category: 'music',
        editorialDescription: 'Electronic static from the Night City gutters. Hard-hitting distortion and synth-wave grief.',
        coverImage: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&q=80',
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
