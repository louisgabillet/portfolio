import data from './data';
import type { Gallery } from '../types';

const dirName: string = 'example_wikipedia';
const { details, links, images } = data;

const gallery: (k: 'pc' | 'mobile') => Gallery[] = (k) => images.gallery.filter(img => img[k]).map(i => ({ ...i, props: { imgId: i.imgId, dirName } }));

const app = {
    name: details.name,
    type: 'Folder',
    src: 'icons/folder_ptfrl4.png',
    children: [
        {
            name: 'Liens externes',
            type: 'Folder',
            src: 'icons/folder_ptfrl4.png',
            children: [
                {
                    name: 'Accéder au site',
                    type: 'Link',
                    url: links.live_demo,
                    src: images.logo,
                    shortcut: true,
                },
                {
                    name: 'Voir le code',
                    type: 'Link',
                    url: links.source_code,
                    src: 'icons/document_http_hfxro5.png',
                    shortcut: true,
                },
            ]
        },
        {
            name: 'Images',
            type: 'Folder',
            src: 'icons/folder_ptfrl4.png',
            children: [
                {
                    name: 'Ordinateur',
                    type: 'Folder',
                    src: 'icons/folder_ptfrl4.png',
                    children: gallery('pc'),
                },
                {
                    name: 'Mobile',
                    type: 'Folder',
                    src: 'icons/folder_ptfrl4.png',
                    children: gallery('mobile'),
                },
            ]
        },
        {
            name: 'Simulation',
            type: 'Safari',
            src: 'icons/document_http_hfxro5.png',
            props: {
                dirName,
            },
        },
        {
            name: 'Étude de cas',
            type: 'Preview',
            src: 'icons/document_pdf_qnerhq.png',
            props: {
                dirName,
            },
        },
    ],
}

export default app;
