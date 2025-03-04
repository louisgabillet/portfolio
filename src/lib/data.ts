// Apps for the all environment (pc, mobile, ...)
import { PUBLIC_EMAIL, PUBLIC_TEL } from "$env/static/public";

interface SafariPage {
    type: 'Image'|'Component',
    page: {
        src?: string,
        component: any,
        props: [],
    }
}
export interface Apps {
    name: string, 
    app_name: string, 
    src: string, 
    shortcut?: boolean,
    redirect_link?: string,
    safari_link?: string,
    safari_pages?: {
        pc: SafariPage;
        mobile: SafariPage;
    },
    preview_data?: any,
    path?: string[],
};

// Notes
export interface Note {
    name: string,
    update_date: string,
    pinned?: boolean,
    content: string,
}
export const notes: Note[] = [
    {name: 'Qui Suis-Je ?', update_date: '2024-01-01', pinned: true, content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'},
    {name: 'Qui Suis-Je 3?', update_date: '2024-12-25', pinned: true, content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'},
    {name: 'Qui Suis-Je 2 ?', update_date: '2024-02-02', pinned: true, content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'},
    {name: 'Test n1 2025', update_date: '2025-01-20', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'},
    {name: 'Python', update_date: '2022-03-03', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'},
    {name: 'HTML/CSS/JS', update_date: '2023-04-04', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'},
    {name: 'Test n2 2023', update_date: '2023-05-05', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'},
    {name: 'Test n1 2024', update_date: '2024-06-06', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'},
    {name: 'Test n2 2025', update_date: '2025-07-07', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'},
    {name: 'Test n3 2025', update_date: '2025-12-12', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'},
    {name: 'Test n3 2023', update_date: '2023-12-12', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'},
    {name: 'AABCD', update_date: '2024-01-28', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'},
];

// Contact
export interface Contact {
    letter: string,
    mobile?: string,
    mail: string,
    contact_method: ContactMethod[],
    note: string,
    self?: boolean,
}
interface ContactMethod {
    name: string,
    svg_name: string,
    value: string,
    prefix?: string,
    blank?: boolean,
    desactivated?: boolean,
}
export const contacts: Contact[] = [
    { letter: 'Louis Gabillet', 
        //mobile: PUBLIC_TEL,
        mail: PUBLIC_EMAIL,
        contact_method: [
            { name: 'message', svg_name: 'message_fill', value: '', prefix: ''},
            { name: 'e-mail', svg_name: 'envelope_fill', value: PUBLIC_EMAIL, prefix: 'mailto:'},
            { name: 'github', svg_name: 'github', value: 'https://github.com', blank: true},
            { name: 'linkedin', svg_name: 'linkedin', value: 'https://fr.linkedin.com', blank: true},
        ],
     note: 'Développeur Web indépendant.', self: true },
]

// Music
export interface Song {
    name: string,
    src_name: string,
    time: string,
    artist: string,
    album: string,
    genre: string,
    plays: string,
    secret_name?: string,
    secret_artist?: string,
}
export const songs: Song[] = [
    { name: "Le Plus Beau Son De L'histoire", secret_name: 'Never Gonna Give You Up', src_name: 'Rick Roll', time: '3:32', artist: 'Inconnu', secret_artist: 'Rick Astley', album: '', genre: '', plays: '' },
]
