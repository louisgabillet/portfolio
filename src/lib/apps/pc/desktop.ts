import { type App } from "../types";

const pcDesktop: App[] = [
    {
        name: 'Projets',
        type: 'Finder',
        src: 'icons/folder_ptfrl4.png',
        props: {
            finderPath: ['iCloud Drive', 'Projets'],
        },
        shortcut: true,
    },
    {
        name: 'Notes',
        type: 'Notes',
        src: 'icons/notes_emgzfo.png',
        shortcut: true,
    },
    {
        name: 'Contacts',
        type: 'Contacts',
        src: 'icons/contact_brown_zm2zyx',
        shortcut: true,
    },
    {
        name: 'Mail',
        type: 'Mail',
        src: 'icons/mail_ipsbfs.png',
        shortcut: true,
    },
];

export default pcDesktop;
