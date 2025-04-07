import type { Data } from '../types';

const data: Data = {
    details: {
        name: 'Exemple (Wikipedia)',
        technologies: ['Outil n°1', 'Outil n°2', 'Outil n°3', 'Outil n°4'],
        date: '2020',
        client: 'Wikipédia',
        requests: ['Design UX/UI', 'Développement Web'],
        targetAudience: ['Curieux', 'Passionés'],
    },
    design: {
        colorCode: [
            { 
                name: 'Gris neutre',
                hex: '#7c7c7c',
            },
            {
                name: 'Noir profond',
                hex: '#000', 
            },
            {
                name: 'Bleu azur',
                hex: '#0a82ff', 
            },
            {
                name: 'Noir de jais',
                hex: '#1b1b1b', 
            },
            {
                name: 'Blanc',
                hex: '#fff', 
                fontColor: '#000' 
            },
        ],
        fonts: ['Arial']
    },
    descriptions: {
        intro: 'Intro pour décrire le client et sa demande',
        process: 'Description du processus de réalisation de la demande.',
        challenges: 'Difficultés rencontrées pendant la réalisation de la demande.',
        outcome: 'Explication du produit final.',

    },
    links: {
        live_demo: 'https://fr.wikipedia.org/wiki/Programmation_web',
        source_code: 'https://github.com/louisgabillet',
    },
    images: {
        logo: 'projects/example_wikipedia/logo_pyd3ai.png',
        fullPage: {
            pc: `projects/example_wikipedia/pc/full_page_nz6pa2.png`,
            mobile: `projects/example_wikipedia/mobile/full_page_mr6siq.png`,
        },
        gallery: [
            {
                imgId: '1',
                name: `Page d'accueil`,
                type: 'Preview',
                src: `projects/example_wikipedia/pc/home_tkxqmr.png`,
                pc: true,
            },
            {
                imgId: '2',
                name: `Page d'accueil`,
                type: 'Preview',
                src: `projects/example_wikipedia/mobile/home_il6jic.png`,
                mobile: true,
            }
        ],
    },
}

export default data;
