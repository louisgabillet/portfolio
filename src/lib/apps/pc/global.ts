import { type App } from "../types";

interface Global extends App {
    top_bar: string[],
    sizes: {
        minWidth: number,
        minHeight: number,
    },
    resize: {
        x: boolean,
        y: boolean,
    },
}

const pcGlobal: Global[] = [
    {
        name: 'Finder',
        type: 'Finder',
        src: 'icons/finder_csztph.png',
        top_bar: ['Fichier', 'Édition', 'Présentation', 'Aller', 'Fenêtre', 'Aide'], 
        sizes: {
            minWidth: 40,
            minHeight: 25,
        },
        resize: {
            x: true,
            y: true,
        }
    },
    {
        name: 'Launchpad',
        type: 'Launchpad',
        src: 'icons/launchpad_agpmx0.png',
        top_bar: [],
        desactivated: true,
        sizes: {
            minWidth: 100,
            minHeight: 100,
        },
        resize: {
            x: false,
            y: false,
        }
    },
    {
        name: 'Notes',
        type: 'Notes',
        src: 'icons/notes_emgzfo.png',
        top_bar: ['Fichier', 'Édition', 'Format', 'Présentation', 'Fenêtre', 'Aide'], 
        sizes: {
            minWidth: 37,
            minHeight: 20,
        },
        resize: {
            x: true,
            y: true,
        }
    },
    {
        name: 'Mail',
        type: 'Mail',
        src: 'icons/mail_ipsbfs.png',
        top_bar: ['Fichier', 'Édition', 'Présentation', 'Boîte aux lettres', 'Message', 'Format', 'Fenêtre', 'Aide'],
        sizes: {
            minWidth: 22,
            minHeight: 22,
        },
        resize: {
            x: true,
            y: true,
        }
    },
    {
        name: 'Contacts',
        type: 'Contacts',
        src: 'icons/contact_brown_zm2zyx',
        top_bar: ['Fichier', 'Édition', 'Présentation', 'Fiche', 'Fenêtre', 'Aide'], 
        sizes: {
            minWidth: 35,
            minHeight: 25,
        },
        resize: {
            x: true,
            y: true,
        }
    },
    {
        name: 'Safari',
        type: 'Safari',
        src: 'icons/safari_ttlkov.png',
        top_bar: ['Fichier', 'Édition', 'Présentation', 'Historique', 'Signets', 'Fenêtre', 'Aide'],
        sizes: {
            minWidth: 28,
            minHeight: 18,
        },
        resize: {
            x: true,
            y: true,
        }
    },
    {
        name: 'Musique',
        type: 'Music',
        src: 'icons/music_s8ah6d.png',
        top_bar: ['Fichier', 'Édition', 'Morceau', 'Présentation', 'Commandes', 'Compte', 'Aide'], 
        sizes: {
            minWidth: 50,
            minHeight: 50,
        },
        resize: {
            x: true,
            y: true,
        }
    },
    {
        name: 'Aperçu',
        type: 'Preview',
        src: 'icons/preview_wapni4.png',
        top_bar: ['Fichier', 'Édition', 'Présentation', 'Aller', 'Outils', 'Fenêtre', 'Aide'], 
        desactivated: true,
        sizes: {
            minWidth: 35,
            minHeight: 20,
        },
        resize: {
            x: true,
            y: true,
        }
    },
];

export default pcGlobal;
