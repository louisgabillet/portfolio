import { type App } from "../types";

const mobileGlobal: (App & { top_bar: string[] })[] = [
    {
        name: 'Fichier',
        type: 'Finder',
        src: 'icons/finder_csztph.png',
        top_bar: ['Fichier', 'Édition', 'Présentation', 'Aller', 'Fenêtre', 'Aide'], 
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
    //    name: 'System Settings',
    //    app_name: 'System_Settings',
    //    src: 'icons/system_settings_jgbute.png',
    //    top_bar: ['Files', 'Edit', 'View', 'Window', 'Help'], 
    //},
];

export default mobileGlobal;
