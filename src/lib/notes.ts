import { PUBLIC_BIRTH_DATE } from "$env/static/public";

type Link = {
    name: string,
    definition: string,
    site: string,
}
export interface Note {
    id: string,
    name: string,
    updateDate: string,
    pinned?: boolean,
    content: string[],
    links: Link[],
}

const noteNames = {
    definitions: 'Définitions',
    links: 'Liens',
    examples: 'Exemples',
}
const indentation: string = '   ';

const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) age--;
    
    return age;
}

const notes: Note[] = [
    {
        id: '7',
        name: `${noteNames.definitions}`,
        updateDate: '2024-01-01',
        pinned: true,
        content: [
            `Voici les définitions sur certains termes techniques.
Pour plus d'infos, allez voir la note « ${noteNames.links} ».
Pour des petits exemples, allez voir la note « ${noteNames.examples} ».`,

            `HTML (HyperText Markup Language): 
${indentation}- Langage de balisage utilisé pour la création de pages web, permettant notamment de définir des liens hypertextes. Si une page web était un corps humain, « HTML » serait le squelette, supportant le reste.`,

            `CSS (Cascading Style Sheets): 
${indentation}- Langage informatique permettant de mettre en forme des pages web. Si une page web était un corps humain, « CSS » serait l'extérieur (peau, visage, ...), contrôlant l'apparence.`,

            `JavaScript:
${indentation}- Langage de programmation qui permet de créer du contenu mis à jour de façon dynamique, de contrôler le contenu multimédia, d'animer des images, et tout ce à quoi on peut penser. Si une page web était un corps humain, « JavaScript » serait les muscles et nerfs, permettant le mouvement.`,

            `TypeScript:
${indentation}- Langage de programmation libre développé par Microsoft qui a pour but d'améliorer et de sécuriser la production de code « JavaScript ». On rajoute à « JavaScript » des jambières, coudières et un casque, pour ne pas se blesser (en l'occurrence, ne pas avoir de bugs/erreurs).`,

            `Framework:
${indentation}- Ensemble de composants logiciels réutilisables qui permettent de développer de nouvelles applications plus efficacement. Comparable à une boite à outils, mettant à disposition de quoi faire le travail plus rapidement et facilement.`,
        ],
        links: [],
    },
    {
        id: '8',
        name: `${noteNames.links}:`,
        updateDate: '2024-01-01',
        pinned: true,
        content: [
            `Voici des liens pour plus d'infos sur certains termes techniques.
Pour de simples définitions, allez voir la note « ${noteNames.definitions} ».
Pour des petits exemples, allez voir la note « ${noteNames.examples} ».`,
        ],
        links: [
            { name: 'Python', definition: 'https://fr.wikipedia.org/wiki/Python_(langage)', site: 'https://www.python.org/' },
            { name: 'HTML', definition: 'https://developer.mozilla.org/fr/docs/Web/HTML', site: '' },
            { name: 'CSS', definition: 'https://developer.mozilla.org/fr/docs/Web/CSS', site: '' },
            { name: 'JavaScript', definition: 'https://developer.mozilla.org/fr/docs/Web/JavaScript', site: '' },
            { name: 'TypeScript', definition: 'https://en.wikipedia.org/wiki/TypeScript', site: 'https://www.typescriptlang.org/' },
            { name: 'Framework', definition: 'https://aws.amazon.com/fr/what-is/framework/', site: '' },
            { name: 'React', definition: 'https://fr.wikipedia.org/wiki/React', site: 'https://fr.react.dev/' },
            { name: 'Svelte', definition: 'https://fr.wikipedia.org/wiki/Svelte', site: 'https://svelte.dev/' },
        ],
    },
    {
        id: '9',
        name: `${noteNames.examples}:`,
        updateDate: '2024-01-01',
        pinned: true,
        content: [
            `Voici les petits exemples sur certains termes techniques.
Pour plus d'infos, allez voir la note « ${noteNames.links} ».
Pour de simples définitions, allez voir la note « ${noteNames.definitions} ».`,

            `HTML: 
${indentation}- <p>Bonjour</p> 
${indentation}- écrit « Bonjour » sur la page web.
`,

            `CSS:
${indentation}- p { color: red } 
${indentation}- change la couleur du texte « Bonjour » en rouge.`,

            `JavaScript:
${indentation}- const age = 18 
${indentation}- assigne la valeur 18 à « age ».`,

            `TypeScript:
${indentation}- const age: number = 18 
${indentation}- assure que la valeur assignée à « age » est un nombre (avec le « : number »).`,
        ],
        links: [],
    },
    {
        id: '0',
        name: 'Qui Suis-Je ?',
        updateDate: '2024-01-01',
        pinned: true,
        content: [
            `Développeur web front-end indépendant agé de ${calculateAge(PUBLIC_BIRTH_DATE)} ans. J'ai toujours eu un attrait pour la création. Faisant beaucoup de montages photo/vidéo étant plus jeune, j'ai toujours aimé voir mes idées prendre vie.`,

            `La programmation a été une découverte passionnante puisqu'elle m'a permis de démultiplier mes possibilités créatives, tout en s'associant à un autre centre d'intérêt, les nouvelles technologies.`,

            `Je vous propose de lire les notes que j'ai écrites, chronologiquement ou non, pour ce que ça intéresse d'en savoir un peu plus sur mon aventure dans cet univers fascinant et infini qu'est la programmation.`,
        ],
        links: [],
    },
    {
        id: '1',
        name: 'Découverte:',
        updateDate: '2022-02-02',
        content: [
            `Au départ, ma connaissance du monde de la programmation était très limitée, voir inexistante. J'avais les plus basiques des notions, et cela me suffisait largement. Je n'avais pas vraiment d'attraits pour cet univers, bien que profond et vaste, il ne m'avait jamais donné l'envie d'y plonger.`, 

            `Puis, au détour de vidéos sur le sujet, j'ai commencé à y voir un potentiel intérêt, un passe-temps, ou simplement quelque chose de nouveau à découvrir. Peu importe la raison, le fait était que, voyant les possibilités infinies que cela te proposait, je me suis dit: « Ça peut être marrant ! », et j'ai plongé.`,

            `Là, commença ma recherche pour savoir quelle était la première marche (où/quoi/comment commencer), pour éviter de démarrer trop compliquée, ruinant potentiellement mon expérience, et mon envie juste gagné d'apprendre.`, 

            `Après quelque temps, j'ai pris la connaissance de « Python », un langage réputé « simple », et donc par conséquent bien pour le petit débutant que j'étais.`
        ],
        links: [],
    },
    {
        id: '2',
        name: 'Python:',
        updateDate: '2022-12-25',
        content: [
            `Le consensus général est d'accord pour dire que: « Python est simple, d'apprentissage et d'utilisation ». Cela me paraissait être une bonne idée pour me lancer dans ce vaste univers. J'ai donc découvert Python, et par la même occasion, la programmation, en cherchant à droite à gauche, lisant de la documentation, regardant des tutoriels, des guides, et toute sources d'information qui pourrait m'aider à en comprendre un peu plus sur tout ça.`,

            `Après quelque temps, je me suis retrouvé avec un sentiment de: « Il me manque quelque chose ! ». J'ai donc cherché ce que cela pouvait bien être. Qu'elle pouvait être cette petite étincelle qui pourrait embraser ma passion pour la programmation. Malheureusement, la flamme étant manquante, j'avais du mal à trouver le plaisir escompté dans ce que je faisais. Je n'étais plus vraiment régulier, ce qui a eu pour effet de peu à peu, m'éloigner de la programmation.`,

            `Mais un jour, Eurêka, j'avais réussi à trouver le maillon manquant. De mon point de vue (celui d'un niveau intermédiaire), il n'y avait pas assez de « visuels ». Pour une légère remise en contexte, je faisais pas mal de montage photo/vidéo étant plus jeune. Pas forcément à un niveau incroyable, mais simplement pour le plaisir. Donc ce côté « visuel », « graphique », avait une place importante dans: « Est-ce que je m'amuse ? ».`,

            `C'est à ce moment-là que j'ai commencé à chercher d'autres options. Des options qui rassembleraient ce que j'aime, m'amuseraient, et me permettraient de me plonger à nouveau dans ce vaste monde qu'est la programmation.`
        ],
        links: [],
    },
    {
        id: '3',
        name: 'HTML/CSS:',
        updateDate: '2023-12-25',
        content: [
            `Cherchant un remplaçant pour « Python », j'avais eu vent d'un langage qui cocherait toutes mes cases:`,

            `${indentation}- simple d'utilisation (étant toujours peu expérimenté)
${indentation}- projet final attirant (pour moi)
${indentation}- partie visuelle prenant une place importante`,

            `Le « Développement Web » (création de sites web) semblait, sur le papier, combler toutes mes attentes. Le nouvel objectif était fixé: « Voir si cela comble mes attentes, et si je prends du plaisir à le faire ? ».`,

            `Je me lançais donc pour commencer les bases, « HTML » pour le corps du site, « CSS » pour son style. Je m'étais mis en tête d'apprendre au moins les notions principales à connaître pour me faire une idée globale (comme avec Python).`,

            `Il ne m'a pas fallu longtemps pour comprendre que j'allais aimer. La facilité d'apprentissage (point n°1), la simplicité avec laquelle on peut réaliser des choses concrètes (point n°2), et le visuelle qui est une partie essentielle dans la création , et ça, dès le début (point n°3), m'ont grandement fait apprécier tout le long de mon utilisation.`,
        ],
        links: [],
    },
    {
        id: '4',
        name: 'JavaScript:',
        updateDate: '2023-12-26',
        content: [
            `La suite logique de mon apprentissage était « JavaScript ». Il fait partie des essentiels à connaître. Si « HTML », représente le squelette, et « CSS », l'extérieur (peau, visage, ...), « JavaScript » serait les muscles et nerfs, permettant les mouvements. Il permet de rendre un site web inanimé, en un site vivant et interactif.`,

            `Je me lançais donc à nouveau dans l'apprentissage d'un nouveau langage, réputé une nouvelle fois pour être « simple », mais surtout grandement populaire, ce qui allait bien m'aider pour en comprendre tous les rouages.`,

            `Dès le départ, le plaisir était là. Il avait réussi à multiplier les possibilités à ma disposition de façon exponentielle, tout en gardant une simplicité et instantanéité. Chaque idée que je venais à avoir, quelle qu'elle soit, devenait possible avec quelques rapides recherches. Cela me permettait de tester tout plein de choses sans avoir à passer une longue période de recherche pour simplement essayer de comprendre.`,

            `Cela avait définitivement confirmé que pour le moment, j'allais continuer de creuser plus profond encore dans le « Développement Web ».`,
        ],
        links: [],
    },
    {
        id: '5',
        name: 'Svelte:',
        updateDate: '2024-12-25',
        content: [
            `Continuant mon aventure pas à pas, j'arrivais à l'étape du « framework ». Pour faire très simple, c'est un peu comme une boite à outils pour développeur web. Il met à disposition des outils, permettant de faciliter grandement certaines étapes du développement et de faire gagner beaucoup de temps.`,

            `La première chose à faire était donc de chercher un bon « framework ». Mes yeux s'étaient arrêtés sur deux choix:`,

            `   - React: le plus connu, mais qui commence à dater (29 mai 2013), et par conséquent, performer en deçà de potentiels nouveaux.`,
            `   - Svelte: plus récent (29 novembre 2016), donc plus efficace, mais aussi moins connu, ce qui rend l'apprentissage potentiellement plus difficile (par manque d'informations et de communautés).`,

            `Suite à une longue réflexion, mon choix s'était finalement porté sur « Svelte ». Je m'étais dit que miser sur le plus récent/efficace, était la meilleure décision, malgré les inconvénients.`,

            `Depuis ce jour, je l'utilise et je n'ai aucun regret. Il a toujours été clair dans son utilisation, et rapide dans son exécution. Certains penseront que je devrais en essayer d'autres, pour la comparaison, mais pour le moment, je n'en ressens pas le besoin, tant l'actuel satisfait mes besoins actuels.`,
        ],
        links: [],
    },
    {
        id: '6',
        name: 'Typescript:',
        updateDate: '2024-12-26',
        content: [
            `L'étape suivante pour moi était « TypeScript ». Bien que non-obligatoire, elle me paraissait tout aussi importante que les autres. Surtout que tout n'était pas à réapprendre, puisque « TypeScript » est simplement la version Microsoft de « JavaScript », mais avec une sécurité supplémentaire, les « types » stricts.`,

            `Les « types » rendent le code que l'on écrit, nous développeur, plus sûr et moins enclin à de potentiels bugs/erreurs, en assurant que l'on fasse les choses en ayant conscience des implications.`,

            `Après avoir passé quelque temps à l'utiliser, j'en suis venu à la conclusion que, malgré les complications gagnées, on se rend vite compte qu'il nous aide à faire moins d'erreurs, et nous demande un niveau de réflexion et compréhension supérieur comparé à un « JavaScript », bien plus relâché à ce niveau-là. Ce côté strict nous « force la main » à faire plus attention à ce que l'on fait, et écrit.`,

            `Un autre point avantageux est qu'il contribue beaucoup à la clarté, et lisibilité du code. Pour montrer une comparaison basique:`,

            `${indentation}- JavaScript: « let age = 18; »
${indentation}- TypeScript: « let age: number = 18; »`,

            `Ce qui est intéressant ici, c'est que « TypeScript » nous annonce avec certitude que la variable « age » est, et restera, un nombre (avec le « : number »), ce qui n'est pas le cas pour « JavaScript ». Un détail, mais une fois que l'on sait cela, on peut bien plus facilement planifier le reste du code, sans créer de potentiels bugs/erreurs en chemin.`,

            `Ce sont des petits détails comme cela qui rende « TypeScript » attrayant, mais surtout rentable, malgré le temps de réflexion supplémentaire demandé.`,
        ],
        links: [],
    },
];

export default notes;
