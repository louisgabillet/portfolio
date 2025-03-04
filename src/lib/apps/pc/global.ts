import { type App } from "../types";

export const apps: (App & { top_bar: string[] })[] = [
    {
        name: 'Finder',
        type: 'Finder',
        src: 'icons/finder_csztph.png',
        top_bar: ['Fichier', 'Édition', 'Présentation', 'Aller', 'Fenêtre', 'Aide'], 
    },
    {
        name: 'Launchpad',
        type: 'Launchpad',
        src: 'icons/launchpad_agpmx0.png',
        top_bar: [],
        desactivated: true,
    },
    {
        name: 'Notes',
        type: 'Notes',
        src: 'icons/notes_emgzfo.png',
        top_bar: ['Fichier', 'Édition', 'Format', 'Présentation', 'Fenêtre', 'Aide'], 
    },
    {
        name: 'Mail',
        type: 'Mail',
        src: 'icons/mail_ipsbfs.png',
        top_bar: ['Fichier', 'Édition', 'Présentation', 'Boîte aux lettres', 'Message', 'Format', 'Fenêtre', 'Aide'],
    },
    {
        name: 'Contacts',
        type: 'Contacts',
        src: 'icons/contact_brown_zm2zyx',
        top_bar: ['Fichier', 'Édition', 'Présentation', 'Fiche', 'Fenêtre', 'Aide'], 
    },
    {
        name: 'Safari',
        type: 'Safari',
        src: 'icons/safari_ttlkov.png',
        top_bar: ['Fichier', 'Édition', 'Présentation', 'Historique', 'Signets', 'Fenêtre', 'Aide'],
    },
    {
        name: 'Musique',
        type: 'Music',
        src: 'icons/music_s8ah6d.png',
        top_bar: ['Fichier', 'Édition', 'Morceau', 'Présentation', 'Commandes', 'Compte', 'Aide'], 
    },
    {
        name: 'Aperçu',
        type: 'Preview',
        src: 'icons/preview_wapni4.png',
        top_bar: ['Fichier', 'Édition', 'Présentation', 'Aller', 'Outils', 'Fenêtre', 'Aide'], 
        desactivated: true,
    },
    //{
    //    name: 'TextEdit',
    //    app_name: 'TextEdit',
    //    src: 'icons/textedit_dgcxyr.png',
    //    top_bar: ['File', 'Edit', 'Format', 'View', 'Window', 'Help'], 
    //},
    //{ 
    //    name: 'System Settings',
    //    app_name: 'System_Settings',
    //    src: 'icons/system_settings_jgbute.png',
    //    top_bar: ['Files', 'Edit', 'View', 'Window', 'Help'], 
    //},
];
