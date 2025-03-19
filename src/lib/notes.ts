export interface Note {
    name: string,
    updateDate: string,
    pinned?: boolean,
    content: string,
}
const notes: Note[] = [
    {
        name: 'Qui Suis-Je ?',
        updateDate: '2024-01-01',
        pinned: true,
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'
    },
    {
        name: 'Qui Suis-Je 3?',
        updateDate: '2024-12-25',
        pinned: true,
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'
    },
    {
        name: 'Qui Suis-Je 2 ?',
        updateDate: '2024-02-02',
        pinned: true,
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'
    },
    {
        name: 'Test n1 2025',
        updateDate: '2025-01-20',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'
    },
    {
        name: 'Python',
        updateDate: '2022-03-03',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'
    },
    {
        name: 'HTML/CSS/JS',
        updateDate: '2023-04-04',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'
    },
    {
        name: 'Test n2 2023',
        updateDate: '2023-05-05',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'
    },
    {
        name: 'Test n1 2024',
        updateDate: '2024-06-06',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'
    },
    {
        name: 'Test n2 2025',
        updateDate: '2025-07-07',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'
    },
    {
        name: 'Test n3 2025',
        updateDate: '2025-12-12',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'
    },
    {
        name: 'Test n3 2023',
        updateDate: '2023-12-12',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'
    },
    {
        name: 'AABCD',
        updateDate: '2024-01-28',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'
    },
];

export default notes;
