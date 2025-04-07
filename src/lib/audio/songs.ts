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
        id: '2',
        url: 'music/just_the_two_of_us_glfbl4.mp3',
        metadata: {
            name: "Just the Two of Us (feat. Bill Withers)",
            duration: '7:18',
            artist: 'Grover Washington, Jr.',
            album: 'Winelight',
            genre: 'Jazz',
            plays: '',
        },
    },
    {
        id: '4',
        url: 'music/imagine_sfetfb.mp3',
        metadata: {
            name: "Imagine",
            duration: '3:14',
            artist: 'John Lennon',
            album: 'Imagine',
            genre: 'Soft Rock',
            plays: '',
        },
    },
    {
        id: '5',
        url: 'music/my_way_lz7vt6.mp3',
        metadata: {
            name: "My Way",
            duration: '4:36',
            artist: 'Frank Sinatra',
            album: 'My Way',
            genre: 'Musique vocale',
            plays: '',
        },
    },
    {
        id: '1',
        url: 'music/never_gonna_give_you_up_dugl1z.mp3',
        metadata: {
            name: "Le Plus Beau Son De L'histoire",
            duration: '3:32',
            artist: 'Inconnu',
            album: 'Inconnu',
            genre: 'Dance pop',
            plays: '',
            secret: {
                name: 'Never Gonna Give You Up',
                artist: 'Rick Astley',
            },
        },
        favorite: true,
    },
    {
        id: '6',
        url: 'music/cant_help_falling_in_love_xawrxa.mp3',
        metadata: {
            name: "Can’t Help Falling in Love",
            duration: '3:00',
            artist: 'Elvis Presley',
            album: 'Blue Hawaii',
            genre: 'Pop',
            plays: '',
        },
    },
    {
        id: '3',
        url: 'music/hotel_california_ynxdqx.mp3',
        metadata: {
            name: "Hotel California",
            duration: '6:44',
            artist: 'Eagles',
            album: 'Hotel California',
            genre: 'Rock',
            plays: '',
        },
    },
]
