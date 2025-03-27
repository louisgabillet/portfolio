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
        colorCode: ['#fff', '#000'],
        fonts: ['Arial']
    },
    descriptions: {
        intro: 'Dignitatemque iudicio iudicio laus rei auctoritatem cepit suspicionibus ordinis in cepit senatus mihi accepto huius ordinis cum in die doloribus.',

        process: 'Vilitatem ad restitisset occidi ordinis ni ei restitisset restitisset restitisset cum ad tunc iussit Honoratus tunc comes efferatus celebrari restitisset occidi ideo intempestivam intempestivam constantia Honoratus restitisset elogio quod Honoratus constantia responderunt ei ordinis comes ideo ad Honoratus vilitatem celebrari Antiochensis et efferatus perissent Antiochensis gravius efferatus Honoratus constantia constantia.',

        outcome: 'Vilitatem ad restitisset occidi ordinis ni ei restitisset restitisset restitisset cum ad tunc iussit Honoratus tunc comes efferatus celebrari restitisset occidi ideo intempestivam intempestivam constantia Honoratus restitisset elogio quod Honoratus constantia responderunt ei ordinis comes ideo ad Honoratus vilitatem celebrari Antiochensis et efferatus perissent Antiochensis gravius efferatus Honoratus constantia constantia.',

        challenges: 'Et Montius est addensque prodesse fidis primos prodesse id mandaverat sonu Constantii consulens conperto conveniet Constantii ad conveniet commune obiurgatorio.',
    },
    links: {
        live_demo: 'https://fr.wikipedia.org/wiki/Programmation_web',
        source_code: 'https://github.com',
    },
    images: {
        logo: 'projects/example_wikipedia/logo_pyd3ai.png',
        fullPage: {
            pc: `projects/example_wikipedia/pc/full_page_nz6pa2.png`,
            mobile: `projects/example_wikipedia/mobile/full_page_mr6siq.png`,
        },
        gallery: [
            {
                img_id: '1',
                name: `Page d'accueil`,
                type: 'Preview',
                src: `projects/example_wikipedia/pc/home_tkxqmr.png`,
                pc: true,
            },
            {
                img_id: '2',
                name: `Page d'accueil`,
                type: 'Preview',
                src: `projects/example_wikipedia/mobile/home_il6jic.png`,
                mobile: true,
            }
        ],
    },
}

export default data;
