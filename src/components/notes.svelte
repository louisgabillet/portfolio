<script lang="ts">
export let name: string = 'About Me';

const notes = [
    {name: 'About Me', update_date: '10/16/2024', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'},
    {name: 'Notes test', update_date: '10/16/2024', content: 'a note.'},
];

    const options: Record<string, string> = {
        weekly: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    const dateText = (el: string) => new Date(el).toLocaleDateString('en', options);

    const changeNote = (e: any) => {
        const noteName = e?.target.closest('.infos')?.dataset?.name;
        if (noteName) activeName = noteName;
    }

$: activeName = name;
$: activeNote = notes.find((note) => note.name === activeName) ?? {name: '', update_date: '', content: ''};
</script>

<div class="container">
    <div class="selection">
        {#each notes as note }
            <button class="infos" id={note?.name === activeName ? 'focused' : ''} data-name={note.name} on:click={changeNote}>
                <h3 class="truncate">{note.name}</h3>
                <div class="flex">
                    <h4>{note.update_date}</h4>
                    <p class="truncate grey">{note.content}</p>
                </div>
            </button>
        {/each}
    </div>
    <div class="content">
        <header>
        </header>
        <div class="text-container">
            <div class="text">
                {#if activeNote}
                    <p class="grey text-center">{dateText(activeNote?.update_date)}</p>
                    <h2>{activeNote.name}</h2>
                    <p>{activeNote.content}</p>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
h3, h4, p {
    color: var(--color-text);
}
h3 {
    font-size: var(--font-size);
    font-weight: 500;
    width: 100%;
}
h4 {
    font-weight: normal;
}
.grey {
    color: #A1A1A0;
}
.text-center {
    text-align: center;
}
.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: start;
}
#focused {
    background-color: var(--yellow);
    box-shadow: 0 0 6px 0 var(--color-shadow);
}
#focused p {
    color: #D1C7A5;
}
.flex {
    width: 100%;
    display: flex;
    gap: 4px;
}
.container {
    --yellow: #998333;
    width: 100%;
    height: 100%;
    background: #1E1E1E;
    display: flex;
}
.content {
    width: 100%;
    display: flex;
    flex-direction: column;
}
.text-container {
    height: 100%;
    overflow-y: scroll;
    padding: .5rem;
}
.text h2 {
    font-size: calc(var(--font-size) + 4px);
}
.text p {
    /*font-size: .75rem;*/
    font-size: var(--font-size);
}
header {
    background-color: #22211F;
    width: 100%;
    height: var(--nav-height);
}
.selection {
    width: 6rem;
    height: 100%;
    background-color: #22211F;
    border-right: 1px solid black;
    padding: var(--nav-height) .25rem 0 .25rem;        
    display: flex;
    flex-direction: column;
}
.infos {
    background: transparent;
    border: none;
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: .25rem .5rem;
    border-radius: .2rem;
}
.infos:focus {
    background-color: var(--yellow);
    box-shadow: 0 0 6px 0 var(--color-shadow);
}
</style>
