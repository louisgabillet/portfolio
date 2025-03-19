import { PUBLIC_EMAIL } from "$env/static/public";

export interface Contact {
    letter: string,
    mobile?: string,
    mail: string,
    contactMethod: ContactMethod[],
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
const contacts: Contact[] = [
    { 
        letter: 'Louis Gabillet', 
        //mobile: PUBLIC_TEL,
        mail: PUBLIC_EMAIL,
        note: 'Développeur Web indépendant.', 
        self: true, 
        contactMethod: [
            { 
                name: 'message',
                svg_name: 'message_fill',
                value: '',
                prefix: ''
            },
            { 
                name: 'e-mail',
                svg_name: 'envelope_fill',
                value: PUBLIC_EMAIL,
                prefix: 'mailto:'
            },
            { 
                name: 'github',
                svg_name: 'github',
                value: 'https://github.com',
                blank: true
            },
            {
                name: 'linkedin',
                svg_name: 'linkedin',
                value: 'https://fr.linkedin.com',
                blank: true
            },
        ],
    },
]

export default contacts;
