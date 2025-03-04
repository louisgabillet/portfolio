export type Song = {
    id: string,
    url: string,
    metadata: {
        name: string,
        duration: string,
        artist: string,
        album: string,
        genre: string,
        plays: string,
        secret?: {
            name?: string,
            artist?: string,
        },
    },
    favorite?: boolean
}

export const songs: Song[] = [
    {
        id: '1',
        url: 'music/never_gonna_give_you_up_dugl1z.mp3',
        metadata: {
            name: "Le Plus Beau Son De L'histoire",
            duration: '3:32',
            artist: 'Inconnu',
            album: '',
            genre: '',
            plays: '',
            secret: {
                name: 'Never Gonna Give You Up',
                artist: 'Rick Astley',
            },
        },
        favorite: true,
    },
    {
        id: '2',
        url: 'music/test.mp3',
        metadata: {
            name: "Test 2",
            duration: '3:32',
            artist: 'Inconnu',
            album: '',
            genre: '',
            plays: '',
        },
    },
]
