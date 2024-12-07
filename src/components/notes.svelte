<script lang="ts">
export let name: string = 'About Me';

const notes = [
    {name: 'About Me', update_date: '10/16/2024', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rem, quidem harum ratione at omnis officiis architecto iste aut adipisci obcaecati perferendis tempora. Nisi, natus laudantium. Temporibus, officia assumenda voluptates animi, delectus modi quaerat fuga iste pariatur illo suscipit! Itaque rerum necessitatibus facere. Eligendi, blanditiis tempore explicabo culpa cum animi'},
    {name: 'RoadMap', update_date: '12/16/2024', content: `<b>1. Python</b><br>First heard of Python as a relatively simple language, a good one to start. So to learn the big principles of how a programming language works, i thought it was good.<br><br><b>2. HTML/CSS/JS:</b><br>I liked Python, but I found that there was not enough 'Graphism' in it. That's when i learned of 'Web Developement'. Tried it, and realised that the 'Graphism' realy was important for me.<br><br><b>3. Svelte:</b><br>After exploring the world of the Web, i had to take the next step to learn new things. Follows a search on the 'Best' framework existing. Learned pretty quickly that there are not that different one another, and Svelte/SvelteKit was interesting enough to try him<br><br><b>4. TS:</b><br>At one point, i saw TypeScript code and became intriged on what types was. After some learning, realise it was not obligated, but could simplify my life greatly.
`},
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

<div class="app-grid">
    <div class="app-controls full">
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
    </div>
    <nav>
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
    </nav>
    <div class="app-content">
        {#if activeNote}
            <p class="grey text-center">{dateText(activeNote?.update_date)}</p>
            <h2>{activeNote.name}</h2>
            <p>{@html activeNote.content}</p>
        {/if}
    </div>
</div>

<style>
h3, h4, p {
    color: var(--color-text);
}
h3 {
    font-size: var(--fz-xs);
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
.app-grid {
    --yellow: #998333;
}
h2 {
    font-size: calc(var(--font-size) + 4px);
    margin-bottom: 10px;
}
.app-content p {
    /*font-size: .75rem;*/
    font-size: var(--font-size);
}
.app-controls {
    background-color: #292926;
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
.app-controls button {
    padding: 2px;
    color: #7C7C7C;
}
.group {
    height: 100%;
    display: flex;
    gap: 6px;
}
nav {
    background-color: #21211F;
    padding: 0 0 10px;
    display: flex;
    flex-direction: column;
    position: relative;
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
    font-size: var(--fz-xs);
    margin-bottom: 5px;
    background: #21211FCC;
    backdrop-filter: blur(var(--blur));
}
.ref i {
    font-size: var(--fz-xxs);
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
</style>
