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
        track_id: ['2', '4', '5', '1', '6', '3'],
        metadata: {
            name: 'Grands Classiques',
            desc: 'Des classiques qui nous font voyager dans des époques révolues.',
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
