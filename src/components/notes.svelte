<script lang="ts">
export let name: string = 'About Me';

const notes = [
    {name: 'About Me', update_date: '10/16/2024', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'},
    {name: 'Notes test', update_date: '12/16/2024', content: 'a note.'},
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
    <nav>
        <div class="group">
            <button>􀏚</button>
            <button>􀋲</button>
            <button>􀇷</button>
            <button style="margin-left: 1rem">􀈑</button>
            <div class="separator"></div>
            <button>􀈎</button>
        </div>
        <div class="group">
            <button>􀅑</button>
            <button>􀷾</button>
            <button>􀏣</button>
            <button>􀏫</button>
        </div>
        <div class="group">
            <button>􀥕</button>
            <button>􀎠</button>
            <button>􀈂</button>
            <button>􀊫</button>
        </div>
    </nav>
    <div class="selection">
        <div class="ref">
            <i class="grey">􀎧</i>
            <h4 class="grey">Pinned</h4>
        </div>
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
    font-size: var(--font-ratio);
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
    background: #1B1B1B;
    display: grid;
    grid-template-columns: var(--width-sidebar) 1fr;
    grid-template-rows: var(--nav-height) 1fr;
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
nav {
    width: 100%;
    height: var(--nav-height);
    grid-column: 1 / -1;
    background-color: #292926;
    padding: 8px 10px 8px 3.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
button {
    background: transparent;
    border: none;
    outline: none;
}
.separator {
    height: 100%;
    width: 1px;
    background: #7C7C7C80;
}
nav button {
    padding: 2px;
    color: #7C7C7C;
    font-size: var(--font-ratio);
}
.group {
    height: 100%;
    display: flex;
    gap: 6px;
}
.selection {
    width: 7rem;
    height: 100%;
    background-color: #21211F;
    border-right: 1px solid black;
    padding-bottom: 5px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-y: scroll;
}
.ref {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 2px 10px;
    gap: 3px;
    border-bottom: 1px solid #7C7C7C80;
    font-size: var(--font-ratio);
    margin-bottom: 5px;
    background: #21211FCC;
    backdrop-filter: blur(var(--blur));
}
.ref i {
    font-size: calc(var(--font-ratio) - 2px);
    width: calc(var(--font-ratio) - 1px);
}
.infos {
    background: transparent;
    border: none;
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: .25rem 15px;
    border-radius: .2rem;
    margin-inline: 5px;
}
.infos:focus {
    background-color: var(--yellow);
    box-shadow: 0 0 6px 0 var(--color-shadow);
}
</style>
