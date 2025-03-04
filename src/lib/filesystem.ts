import { apps } from "./apps";
import { type App } from "./apps/types";
import { loadProjects } from "./projects";
import { songs } from "./audio/songs";


export type Type = 'Folder' | 'Webloc' | 'Music' | 'Document' | 'Image' | 'Finder' | 'Launchpad' | 'Notes' | 'Contacts' | 'Mail' | 'Safari' | 'Plist' | 'Preview';
type Children = FileSystem[] | App[];

export interface FileSystem {
    name: string,
    type: Type,
    src: string,
    children: Children,
    desactivated?: boolean,
}

const projects = await loadProjects();

const secretSongData = songs.find(song => song.id === '1')?.metadata; 
const defaultName = 'Inconnu';
const { name, album, artist } = secretSongData ?? { name: defaultName, album: defaultName, artist: defaultName };
const getName = (name: string, type: 'Album' | 'Artiste') => !name || name === 'Inconnu' ? `${type} Inconnu` : name;

const secretSong = {
    album: getName(album, 'Album'),
    artist: getName(artist, 'Artiste'),
    app: {
        name: name,
        type: 'Music',
        src: 'icons/document_mp3_plgb0u.png',
    }, 
}

export const fileSystem: FileSystem[] = [
    {
        name: 'Macintosh HD',
        type: 'Folder',
        src: 'icons/hard_drive_m1y2n4.png',
        children: [
            {
                name: 'Applications',
                type: 'Folder',
                src: 'icons/folder_apps_g8xulm.png',
                children: apps.pc.global,
            },
            {
                name: 'Librairie',
                type: 'Folder',
                src: 'icons/folder_library_cldshb.png',
                children: [
                    {
                        name: 'Préferences',
                        type: 'Folder',
                        src: 'icons/folder_ptfrl4.png',
                        children: [
                            //{
                            //    name: 'com.apple.mobile.dock.plist',
                            //    type: 'Plist',
                            //    src: 'icons/document_plist_mj3qmz.png',
                            //    desactivated: true,
                            //    children: [],
                            //},
                        ],
                    },
                ],
            },
            {
                name: 'Système',
                type: 'Folder',
                src: 'icons/folder_system_xt6rgj.png',
                children: [],
            },
            {
                name: 'Utilisateur',
                type: 'Folder',
                src: 'icons/folder_users_iqods9.png',
                children: [
                    {
                        name: 'louisgabillet',
                        type: 'Folder',
                        src: 'icons/folder_home_hqnwvk.png',
                        children: [
                            {
                                name: 'Applications',
                                type: 'Folder',
                                src: 'icons/folder_apps_g8xulm.png',
                                children: [],
                            },
                            {
                                name: 'Bureau',
                                type: 'Folder',
                                src: 'icons/folder_desktop_fml6fh.png',
                                children : apps.pc.desktop,
                            },
                            {
                                name: 'Documents',
                                type: 'Folder',
                                src: 'icons/folder_ptfrl4.png',
                                children: [],
                            },
                            {
                                name: 'Images',
                                type: 'Folder',
                                src: 'icons/folder_pictures_mdk5iz.png',
                                children: [],
                            },
                            {
                                name: 'Musique',
                                type: 'Folder',
                                src: 'icons/folder_music_ay7wx8.png',
                                children: [
                                    {
                                        name: 'Media',
                                        type: 'Folder',
                                        src: 'icons/folder_ptfrl4.png',
                                        children: [
                                            {
                                                name: 'Ajouté automatiquement à Musique',
                                                type: 'Folder',
                                                src: 'icons/folder_ptfrl4.png',
                                                children: [],
                                            },
                                            {
                                                name: 'Musique',
                                                type: 'Folder',
                                                src: 'icons/folder_ptfrl4.png',
                                                children: [
                                                    {
                                                        name: secretSong.artist,
                                                        type: 'Folder',
                                                        src: 'icons/folder_ptfrl4.png',
                                                        children: [
                                                            {
                                                                name: secretSong.album,
                                                                type: 'Folder',
                                                                src: 'icons/folder_ptfrl4.png',
                                                                children: [
                                                                    secretSong.app
                                                                ],
                                                            }
                                                        ],
                                                    }
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        name: 'Librairie Musique',
                                        type: 'Music',
                                        src: 'icons/document_musiclibrary_t2b1jc.png',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                name: 'Publique',
                                type: 'Folder',
                                src: 'icons/folder_public_gv0dca.png',
                                children: [
                                    {
                                        name: 'Drop Box',
                                        type: 'Folder',
                                        src: 'icons/folder_ptfrl4.png',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                name: 'Téléchargements',
                                type: 'Folder',
                                src: 'icons/folder_downloads_fjswrg.png',
                                children: [
                                    secretSong.app
                                ],
                            },
                            {
                                name: 'Films',
                                type: 'Folder',
                                src: 'icons/folder_movies_ij9aed.png',
                                children: [],
                            },
                        ],
                    },
                    {
                        name: 'Partagé',
                        type: 'Folder',
                        src: 'icons/folder_ptfrl4.png',
                        children: [],
                    },
                ],
            },
        ],
    },
    {
        name: 'iCloud Drive',
        type: 'Folder',
        src: 'icons/folder_ptfrl4.png',
        children: [
            {
                name: 'Projets',
                type: 'Folder',
                src: 'icons/folder_ptfrl4.png',
                children: projects,
            },
        ],
    },
    {
        name: 'Poubelle',
        type: 'Folder',
        src: 'icons/trash_empty_atuxjv.png',
        children: [],
    }
]
