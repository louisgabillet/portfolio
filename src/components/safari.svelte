<script lang="ts">
export let link: string = '';
export let page: string | null = 'slide';

</script>

<div class="container">
    <nav>
        <button>􀏚</button>
        <button class={link ? '' : 'desactivated'} >􀆉</button>
        <button class={link ? '' : 'desactivated'} >􀆊</button>
        <label for="search" class="{link ? 'searched' : 'home'}">
            <i>􀊫</i>
            <input type="text" placeholder="Search or site name" bind:value={link} autocomplete="off" id="search">
        </label>
        <button class={link ? '' : 'desactivated'} >􀈂</button>
        <button>􀅼</button>
        <button>􀐅</button>
    </nav>
    {#if page === 'pricing'}
        <iframe title="pricing" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRMJoHLWzDWViYvj54FhQRLiWFehtLOHPuIAf6mOF6csEBYrK0r6Q6A9MthFLihobE8ZY_H23mNycg7/pubhtml?widget=true&amp;headers=false&amp;chrome=false&amp;minimal;frameborder=0"></iframe>
    {:else if page === 'slide'}    
        <iframe title="slide" src="https://docs.google.com/presentation/d/e/2PACX-1vTvEo_UvScMMK2UnIORqg0ntxJlX4yfd1eE7QnEvAuH0afn3dgOwp297GThp_4zBha2ErnhDI_VHGr5/embed?start=false&loop=true&delayms=3000" frameborder="0"></iframe>
    {/if}
</div>

<style>
.container {
    height: 100%;
    background-color: var(--dark-fullscreen);
    backdrop-filter: blur(var(--blur));
}
.desactivated {
    opacity: .35;
    pointer-events: none;
}
iframe {
    width: 100%;
    height: 100%;
}
nav {
    width: 100%;
    height: var(--nav-height);
    background-color: var(--dark-title-bar);
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0 8px 0 3.5rem
}
button {
    background: transparent;
    border: none;
    outline: none;
    border-radius: .2rem;
    padding: 2px;
}
button, i {
    color: #A1A1A0;
    font-size: var(--font-ratio);
}
label {
    width: 50%;
    position: relative;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: .2rem;
    padding: 0 5px;
}
input {
    color: var(--color-text);
    min-width: 50%;
    padding: 2px 0 2px 4px;
    /* border: 1px solid #50504E; */
    font-size: 10px;
    background: transparent;
    border: none;
    outline: none;
    cursor: default;
    transition: all .22s ease;
}
.searched {
    border: 1px solid #525150;
    text-align: center;
}
.home {
    background-color: #2C2C2B;
    border: none;
}
label:focus-within  {
    outline: 2px solid #457198;
}
label:focus-within input  {
    min-width: 100%;
    cursor: text;
}
button:hover {
    background-color: #F6F6F626;
}
</style>
