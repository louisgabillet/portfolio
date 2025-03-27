import data from './data';
import type { Gallery } from '../types';

const { details, links, images } = data;

const url = new URL(import.meta.url);
const urlParts = url.pathname.split('/');
const dirName = urlParts[urlParts.length - 2];

const gallery: (k: 'pc' | 'mobile') => Gallery[] = (k) => images.gallery.filter(img => img[k]).map(i => ({ ...i, dirName }));

const app = {
    name: details.name,
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
            dirName,
            name: links.live_demo,
            type: 'Safari',
            src: 'icons/document_http_hfxro5.png',
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
            dirName,
            name: 'Étude de cas',
            type: 'Preview',
            src: 'icons/document_pdf_qnerhq.png',
        },
    ],
}

export default app;
