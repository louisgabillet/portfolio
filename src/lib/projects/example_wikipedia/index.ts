import { details } from './info/details';
import { descriptions } from './info/description';
import { links } from './assets/links';
import { images } from './media/images';
import type { Data } from '../types';
import { type FileSystem } from '$lib/filesystem';

const unique_name: string = 'example_wikipedia';

export const data: Data = {
    info: {
        details,
        descriptions,
    },
    assets: {
        links,
    },
    media: {
        images,
    },

}

export const test = {
    name: 'Exemple (Wikipédia) 22222',
    type: 'Folder',
    src: 'icons/folder_ptfrl4.png',
    children: [
        {
            name: 'Accéder au site',
            type: 'Webloc',
            url: links.live_demo,
            src: images.logo,
            shortcut: true,
            outside_link: true,
        },
        {
            name: links.live_demo,
            url: links.live_demo,
            type: 'Webloc',
            src: 'icons/document_http_hfxro5.png',
            pages: images.full_page,
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
                    //children: images.gallery.pc,
                    children: images.gallery.filter(img => img.pc),
                },
                {
                    name: 'Mobile',
                    type: 'Folder',
                    src: 'icons/folder_ptfrl4.png',
                    //children: images.gallery.mobile,
                    children: images.gallery.filter(img => img.mobile),
                },
            ]
        },
        {
            unique_name: unique_name,
            name: 'Étude de cas',
            type: 'Document',
            src: 'icons/document_pdf_qnerhq.png',
            //pages: {
            //    title: details.name,
            //    technologies: details.technologies,
            //    subtitle: 'Wikipedia',
            //    client: details.client,
            //    date: details.date,
            //    requests: details.requests,
            //    target_audience: details.target_audience,
            //    img: images,
            //    fonts: ['sans-serif'],
            //    color_code: ['#fff', '#88A3E8', '#0F1418', '#4E5152'],
            //    desc: `Le but du site était de mettre à disposition en libre service le plus d'information possible. Pour que peu importe la question est posée, qui se la pose, ou même pourquoi il se la pose, qu'il puisse simplement trouver sa réponse.`,
            //},
        },
    ],
}
