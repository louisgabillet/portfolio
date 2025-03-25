import type { App, AppSizeData } from "../types";

const pcGlobal: (AppSizeData & App & { top_bar: string[] })[] = [
    {
        name: 'Finder',
        type: 'Finder',
        src: 'icons/finder_csztph.png',
        top_bar: ['Fichier', 'Édition', 'Présentation', 'Aller', 'Fenêtre', 'Aide'], 
        minSize: {
            width: 40,
            height: 25,
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
        minSize: {
            width: 100,
            height: 100,
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
        minSize: {
            width: 37,
            height: 20,
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
        minSize: {
            width: 22,
            height: 22,
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
        minSize: {
            width: 35,
            height: 25,
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
        minSize: {
            width: 28,
            height: 18,
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
        minSize: {
            width: 50,
            height: 50,
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
        minSize: {
            width: 35,
            height: 20,
        },
        resize: {
            x: true,
            y: true,
        }
    },
];

export default pcGlobal;
