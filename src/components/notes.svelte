<script lang="ts">
import { isResponsive } from "$lib/index";
import { notes, type Note } from "$lib/data";
	import Svg from "./svg.svelte";

export let name: string = 'Qui Suis-Je ?';

const options: Record<string, string> = { weekly: 'long', year: 'numeric', month: 'long', day: 'numeric' };
let activeName = $isResponsive ? '' : name;
$: activeNote = notes.find((note) => note.name === activeName) ?? null;

const dateText = (el: string) => new Date(el).toLocaleDateString('fr', options);
const parseDate = (date: string): string => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}
const sortByDate = () => {
    const global: Record<string, Note[]> = {};
    const today = new Date();
    const currYear = today.getFullYear();
    const currMonth = today.getMonth();
    const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

    notes.forEach(note => {
        const date = new Date(note.update_date);
        const year = date.getFullYear();
        const monthString= date.toLocaleDateString('fr', { month: 'long' });

        const key = note?.pinned ? 'épinglées' : year < currYear ? year : monthString;
        const prev = global[key] ?? [];
        const sorted = [...prev, note].sort((a, b) => b.update_date.localeCompare(a.update_date));

        global[key] = sorted;
    })

    const res = Object.keys(global).map(key => ({ title: key, notes: global[key] }));
    const pinned = res.filter(n => n.title === 'épinglées');
    const years = res.filter(n => /^[0-9]{4}$/.test(n.title)) 
    const months = res.filter(n => monthNames.includes(n.title));

    years.sort((a, b) => parseInt(b.title) - parseInt(a.title));
    months.sort((a, b) => {
        const indexA = monthNames.indexOf(a.title);
        const indexB = monthNames.indexOf(b.title);
        const diffA = Math.abs(indexA - currMonth);
        const diffB = Math.abs(indexB - currMonth);
        return diffA - diffB;
    });

    return [pinned, months, years].flat();
};
</script>

<div class="app__grid">
    <nav class="sidebar app__sidebar {$isResponsive ? 'app__sidebar--full' : 'app__sidebar--bg-grey'}" style="{$isResponsive ? `z-index: ${activeName ? '-' : ''}1` : ''}">
        {#each sortByDate() as res}
            <h5 class="sidebar__title sidebar__category sidebar__text--overflow">{res.title}</h5>
            {#each res.notes as note, i}
                {@const length = res.notes.length}
                {@const moreThan1 = length > 1}
                {@const isBorr = $isResponsive && length === 1}
                {@const isBorrTop = $isResponsive && moreThan1 && i === 0}
                {@const isBorrBottom = $isResponsive && moreThan1 && i === length - 1}
                <button 
                    class="sidebar__item sidebar__item--grid sidebar__item--borr{isBorrBottom ? '-bottom' : isBorrTop ? '-top' : !isBorr ? '-none' : ''}"
                    class:sidebar__item--border-bottom={ moreThan1 && i < length - 1 }
                    class:sidebar__item--focused={ !$isResponsive && note?.name === activeName } 
                    class:sidebar__item--blurred-bg={ $isResponsive }
                    on:click={() => activeName = note.name}
                >
                    <span class="sidebar__title sidebar__text--overflow">{note.name}</span>
                    <span class="sidebar__text" class:sidebar__text--color-grey={ $isResponsive }>{parseDate(note.update_date)}</span>
                    <span class="sidebar__text sidebar__text--color-grey sidebar__text--overflow">{note.content.slice(0, 50)}</span>
                </button>
            {/each}
        {/each}
    </nav>
    {#if $isResponsive}
        <div class="controls app__controls controls-header app__controls-header" class:app__controls--bg-black={ activeName }>
            <button class="controls__item controls-header__item controls-header__btn controls-header__btn--grid controls__btn--{activeName ? 'active' : 'desactivated'} " on:click={() => activeName = ""}>
                <Svg name="chevron_left" color="var(--accent-color)" />
                <span class="controls__text--accent-color controls__text--overflow">{activeName ? "Notes" : "Dossiers"}</span>
            </button>
            <h2 class="controls__h2 controls__text--overflow">{!activeName? "Notes" : ""}</h2>
            <div class="controls__items-wrapper">
                {#if activeName}
                    <span class="controls__item controls-header__item">
                        <Svg name='square_and_arrow_up' color="var(--accent-color)" />
                    </span>
                {/if}
                <span class="controls__item controls-header__item">
                    <Svg name="ellipsis_circle" color="var(--accent-color)" />
                </span>
            </div>
        </div>
        <div class="controls app__controls controls-footer app__controls-footer" class:app__controls--bg-black={ activeName }>
            {#if activeName}
                <span class="controls__item controls-footer__item controls-footer__item--semi-transparent">
                    <Svg name="checklist" color="var(--accent-color)" />
                </span>
                <span class="controls__item controls-footer__item controls-footer__item--semi-transparent">
                    <Svg name="paperclip" color="var(--accent-color)" />
                </span>
                <span class="controls__item controls-footer__item controls-footer__item--semi-transparent">
                    <Svg name="pencil_tip_crop_circle" color="var(--accent-color)" />
                </span>
                <span class="controls__item controls-footer__item controls-footer__item--semi-transparent">
                    <Svg name="square_and_pencil" color="var(--accent-color)" />
                </span>
            {:else}
                <p class="controls-footer__p">{notes.length} note{notes.length > 1 ? 's' : ''}</p>
                <span class="controls__item controls-footer__item controls-footer__item--semi-transparent">
                    <Svg name="square_and_pencil" color="var(--accent-color)" />
                </span>
            {/if}
        </div>
    {:else}
        <div class="controls app__controls app__controls--full">
            <span class="controls__item">
                <Svg name='sidebar_left' />
            </span>
            <span class="controls__item">
                <Svg name='list_bullet' />
            </span>
            <span class="controls__item">
                <Svg name='square_grid_2x2' />
            </span>
            <span class="controls__item controls__item--space-left"> 
                <Svg name='trash' />
            </span>
            <div class="controls__separator"></div>
            <span class="controls__item">
                <Svg name='square_and_pencil' />
            </span>
            <span class="controls__item controls__item--distance-left">
                <Svg name='textformat' />
            </span>
            <span class="controls__item">
                <Svg name='checklist' />
            </span>
            <span class="controls__item">
                <Svg name='tablecells' />
            </span>
            <span class="controls__item controls__item--distance-right">
                <Svg name='photo_on_rectangle' />
            </span>
            <span class="controls__item">
                <Svg name='link_badge_plus' />
            </span>
            <span class="controls__item">
                <Svg name='lock' />
            </span>
            <span class="controls__item">
                <Svg name='square_and_arrow_up' />
            </span>
            <span class="controls__item">
                <Svg name='magnifyingglass' />
            </span>
        </div>
    {/if}
    <div class="content app__content" class:app__content--full={ $isResponsive }>
        {#if activeNote}
            <p class="content__p">{dateText(activeNote?.update_date)}</p>
            <h2 class="content__h2">{activeNote.name}</h2>
            <p class="content__p">{activeNote.content}</p>
        {/if}
    </div>
</div>

<style>
.app__grid {
    --accent-color: #998333;
}
.app__controls-footer {
    --nbr-columns: 4;
}
.app__sidebar--bg-grey {
    background-color: #1b1b1b;
}
.app__controls--bg-black {
    background-color: #080808;
    outline: none;
}
.sidebar__item {
    --padding-left: 12px;
    padding: 8px var(--padding-left);
}
.sidebar__item--grid {
    grid-template-rows: repeat(2, auto);
    grid-template-columns: min-content 1fr;
    row-gap: 0;
}
.sidebar__item--blurred-bg {
    background-color: var(--dark-fullscreen);
}
.sidebar__item > .sidebar__title {
    grid-column: 1/-1;
    text-align: start;
}
.sidebar__category {
    text-transform: capitalize;
    opacity: 1;
}
.sidebar__category:first-of-type {
    --margin-top: 1rem;
}
.sidebar__text--color-grey,
.sidebar__category {
    color: #A1A1A0;
}
.controls__separator {
    height: 100%;
    width: 1px;
    background: #7C7C7C80;
}
.sidebar__item--borr-top {
    --borr: 8px 8px 0 0;
}
.sidebar__item--borr-bottom {
    --borr: 0 0 8px 8px;
}
.sidebar__item--borr {
    --borr: 8px;
}
.sidebar__item--borr-none {
    --borr: 0px;
}
.sidebar__item--focused {
    --focused-color: var(--accent-color); 
}
.sidebar__item--border-bottom::after {
    --right: 5px;
}
.sidebar__item--focused.sidebar__item--border-bottom::after {
    visibility: hidden;
}
.content__h2 {
    margin-block: 1rem;
}
.content__p:first-of-type {
    color: #7c7c7c;
    text-align: center;
}
.controls-footer__item {
    --padding-block: calc((var(--controls-footer__item--height) - var(--controls__item--icon-height)) / 2);
    padding-block: var(--padding-block);
}
.controls-footer__item--semi-transparent {
    opacity: .4;
}
.controls-footer__p {
    grid-column: 2/4;
    text-align: center;
}
@media (max-width: 1280px) {
    .sidebar__item:focus,
    .sidebar__item:focus-within {
        background-color: #535353;
    }
    .sidebar__item--border-bottom::after {
        --right: 0px;
        bottom: 0;
        z-index: 1;
    }
    .sidebar__category {
        color: #fff;
    }
}
</style>
