import { type App } from "../types";
import Pricing from "$lib/components/pricing.svelte";

const mobileDesktop: App[] = [
    //{
    //    name: 'Projets',
    //    type: 'Finder',
    //    src: 'icons/folder_ptfrl4.png',
    //    path: ['iCloud Drive', 'Projets'],
    //    shortcut: true,
    //},
    {
        name: 'Fichiers',
        type: 'Finder',
        src: 'icons/Files_molorj',
    },
    {
        name: 'Notes',
        type: 'Notes',
        src: 'icons/notes_emgzfo.png',
        shortcut: true,
    },
    //{
    //    name: 'Tarif',
    //    type: 'Safari',
    //    src: 'icons/document_http_hfxro5.png',
    //    url: 'https://docs.google.com/spreadsheets/u/0/',
    //    pages: {
    //        pc: {
    //            type: 'Component',
    //            page: {
    //                component: Pricing,
    //                props: [],
    //            },
    //        },
    //        mobile: {
    //            type: 'Component',
    //            page: {
    //                component: Pricing,
    //                props: [],
    //            },
    //        }
    //    },
    //},
];

export default mobileDesktop;
