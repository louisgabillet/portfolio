export interface Playlist {
    //uuid: string,
    id: string,
    track_id: string[],
    metadata: {
        name: string,
        desc: string,
    },
    visual: {
        cover: {
            name: string | null,
            color: string | null,
            background_color: string | null,
        },
        nav_btn: {
            name: string | null,
            color: string | null,
        }
    }
}

export const playlists: Playlist[] = [
    {
        id: '1',
        track_id: ['1'],
        metadata: {
            name: 'Morceaux Favoris',
            desc: 'Mes morceaux favoris.',
        },
        visual: {
            cover: {
                name: 'star_fill',
                color: '#e84f6a',
                background_color: '#fff',
            },
            nav_btn: {
                name: 'star_square',
                color: null,
            },
        }
    },
    {
        id: '2',
        track_id: [],
        metadata: {
            name: 'Test',
            desc: 'un test.',
        },
        visual: {
            cover: {
                name: null,
                color: null, 
                background_color: null, 
            },
            nav_btn: {
                name: null,
                color: null, 
            },
        }
    },
    {
        id: '3',
        track_id: ['2'],
        metadata: {
            name: 'Test 2',
            desc: 'un test n°2.',
        },
        visual: {
            cover: {
                name: null,
                color: null, 
                background_color: null, 
            },
            nav_btn: {
                name: null,
                color: null, 
            },
        },
    },
    {
        id: '4',
        track_id: ['1', '2', '1', '1'],
        metadata: {
            name: 'Rock',
            desc: 'Rock enjoyer.',
        },
        visual: {
            cover: {
                name: null,
                color: null, 
                background_color: null, 
            },
            nav_btn: {
                name: null,
                color: null, 
            },
        },
    },
]
