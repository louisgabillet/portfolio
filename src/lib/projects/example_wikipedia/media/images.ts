import type { Images } from "$lib/projects/types";

const unique_name: string = 'example_wikipedia';

export const images: Images = {
    logo: 'projects/example_wikipedia/logo_pyd3ai.png',
    full_page: {
        pc: `projects/example_wikipedia/pc/full_page_nz6pa2.png`,
        mobile: `projects/example_wikipedia/mobile/full_page_mr6siq.png`,
    },
    gallery: [
        {
            img_id: '1',
            unique_name: unique_name,
            name: `Page d'accueil`,
            type: 'Image',
            src: `projects/example_wikipedia/pc/home_tkxqmr.png`,
            pc: true,
        },
        {
            img_id: '2',
            unique_name: unique_name,
            name: `Page d'accueil`,
            type: 'Image',
            src: `projects/example_wikipedia/mobile/home_il6jic.png`,
            mobile: true,
        }
    ],
}

