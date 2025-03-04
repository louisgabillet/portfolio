<script lang="ts">
import { contacts, type Contact } from '$lib/data';
import { isResponsive } from "$lib/index";
import Svg from './svg.svelte';

const navBtns = [
    { name: 'All Contacts', active: true },
    { name: 'All iCloud', title: 'iCloud' },
    { name: 'All on My Mac', title: 'On My Mac' },
]

//let search: string = '';
let contactName = $isResponsive ? '' : 'Louis Gabillet';
$: contactInfo = contacts.find(contact => contact.letter === contactName) ?? { letter: '', mobile: '', mail: '', contact_method: [], note: '' };
$: ({letter, mobile, mail, note, self} = contactInfo);

const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "#"];

interface Sorted {
    letter: string,
    contacts: Contact[];
}
const filterByFirstLetter = () => {
    let global: Record<string, Contact[]> = {};
    const sortAlphabeticalOrder = <T extends { letter: string }>(n: T[]): T[] => n.sort((a, b) => a.letter.toLowerCase().localeCompare(b.letter.toLowerCase()));

    contacts?.forEach(contact => {
        const name = contact.letter.split(' ')[1] ?? contact.letter;

        const key = name[0].toUpperCase();
        const prev = global[key] ?? [];
        const sorted = sortAlphabeticalOrder([...prev, contact]);

        global[key] = sorted;
    })

    const arr: Sorted[] = Object.keys(global).map(key => ({ letter: key, contacts: global[key] }));
    return sortAlphabeticalOrder(arr);
}
</script>

<div class="app__grid">
    <nav class="sidebar app__sidebar" class:app__sidebar--full={ $isResponsive } style="{$isResponsive ? `z-index: ${contactName? '-' : ''}1` : ''}">
        {#each filterByFirstLetter() as res}
            {#if $isResponsive}
                <h5 class="sidebar__title sidebar__category sidebar__text--overflow">{res.letter}</h5>
            {/if}
            {#each res.contacts as { letter, self }, i}
                {@const splitName = letter.split(' ') }
                {@const part1 = splitName[0] }
                {@const part2 = splitName[1] }
                <button
                    class="sidebar__item sidebar__item--grid"
                    class:sidebar__item--icon={ self }
                    class:sidebar__item--focused={!$isResponsive && letter === contactName}
                    class:sidebar__item--bold={ !part2 }
                    class:sidebar__item--border-top={ $isResponsive && i === 0 }
                    class:sidebar__item--border-bottom={ $isResponsive }
                    title={letter}
                    on:click={() => contactName = letter }
                >
                    <span class="sidebar__text sidebar__text--overflow">
                        {part1}
                        {#if part2}
                            <b class="sidebar__b">{splitName.slice(1).join(' ')}</b>
                        {/if}
                    </span>
                    {#if self && !$isResponsive}
                        <Svg name='person_crop_circle' color="#a1a1a1" /> 
                    {:else if self}
                        moi
                    {/if}
                </button>
            {/each}
        {/each}
    </nav>
    {#if $isResponsive}
        {#if !contactName}
            <div class="alphabet">
                {#each alphabet as letter}
                    <p class="alphabet__letter">{letter}</p> 
                {/each}
            </div>

        {/if}
        <div class="controls app__controls controls-header app__controls-header" class:controls-header--no-bg={ contactName }>
            <button class="controls__item controls-header__item controls-header__btn controls-header__btn--grid controls__btn--{contactName ? 'active' : 'desactivated'} {contactName ? 'controls-header__btn--bg controls-header__btn--round' : ''}" on:click={() => contactName = '' }>
                <Svg name="chevron_left" color={contactName ? "#fff" : "var(--accent-color)"} />
                {#if !contactName}
                    <span class="controls__text--accent-color controls__text--overflow">Listes</span>
                {/if}
            </button>
            <h2 class="controls__h2 controls__text--overflow">{!contactName ? 'Contacts' : ''}</h2>
            <div class="controls__items-wrapper">
                {#if !contactName}
                    <span class="controls__item controls-header__item">
                        <Svg name="ellipsis_circle" color="var(--accent-color)" />
                    </span>
                {:else} 
                    <span class="controls__item controls-header__item controls-header__btn controls-header__btn--bg controls-header__btn--semi-round">Modifier</span>
                {/if}
            </div>
        </div>
    {/if}
    <!--{#if $isResponsive}
        <div class="controls grid" style="{contactName ? 'background: none; backdrop-filter: none' : ''}">
            <button class="{!contactName ? 'flex' : ''}{contactName ? ' btn-bg round active' : ''}" on:click={() => contactName = ''}>
                <span class="icon">
                    <Svg name='chevron_left' color={!contactName ? '#0a82ff' : '#fff'} />
                </span>
                {#if !contactName}
                   <span>Listes</span> 
                {/if}
            </button>
            <h2>{!contactName ? 'Contacts' : ''}</h2>
            {#if !contactName}
                <span class="icon space-left">
                    <Svg name='plus' color='#0a82ff' />
                </span>
            {:else} 
                <button class="btn-bg semi-round space-left">Modifier</button>
            {/if}
        </div>
    {/if}-->
    <div class="content app__content contact" class:app__content--full={ $isResponsive }>
        {#if contactInfo.letter}
                <div class="contact__header">
                    <div class="pp contact__pp">
                        <span class="pp__letter">{letter?.split('')[0]?.toUpperCase()}</span>
                    </div>
                    <h2 class="contact__name contact__name--overflow">{letter}</h2>
                </div>
                <div class="contact__links-wrapper">
                    {#each contactInfo.contact_method as {name, svg_name, value, prefix, blank}}
                    <a class="link contact__link" href="{prefix ?? ''}{value}" class:contact__link--desactivated={ !value } target={blank ? "_blank" : ""}>
                        <span class="contact__icon link__icon">
                            <Svg name={svg_name} color={$isResponsive ? "var(--accent-color)" : "#fff"} />
                        </span>
                        {name}
                    </a> 
                    {/each}
                </div>
            <div class="contact__infos">
                <div class="contact__line">
                    <p class="contact__label">téléphone</p>
                    {#if mobile}
                        <a href="sms:{mobile}" class="contact__text contact__text--accent-color">{mobile}</a>
                    {/if}
                </div>
                <div class="contact__line">
                    <p class="contact__label">domicile</p>
                    {#if mail}
                        <a href="mailto:{mobile}" class="contact__text contact__text--accent-color">{mail}</a>
                    {/if}
                </div>
                <div class="contact__line" class:contact__line--single-line={ $isResponsive }>
                    <p class="contact__label">FaceTime</p>
                    <div class="contact__icons-wrapper">
                        <span class="contact__icon contact__link--desactivated">
                            <Svg name='video_fill' color='var(--accent-color)' />
                        </span>
                        <a href="{mobile ? `sms:${mobile}` : ''}" class="contact__icon {$isResponsive && mobile ? ' btn-bg round' : ''}" class:contact__link--desactivated={ !mobile }>
                            <Svg name='phone_fill' color="var(--accent-color)" />
                        </a>
                    </div>
                </div>
                <div class="contact__line" class:contact__line--min-h={ $isResponsive }>
                    <p class="contact__label">{$isResponsive ? 'Notes' : 'note'}</p>
                    {#if note}
                        <p class="contact__text">{note}</p>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
.app__grid {
    --accent-color: #0a82ff;
}
.app__content {
    grid-row: 1/-1;
    outline: 1px solid #000;
}
.controls-header--no-bg {
    background-color: transparent;
    backdrop-filter: none;
    outline: none;
}
.controls-header__btn--bg {
    background-color: #ffffff12;
    backdrop-filter: blur(var(--blur));
    min-width: min-content;
    margin-inline: 5px;
}
.controls-header__btn--semi-round {
    border-radius: var(--controls__item--height);
}
.controls-header__btn--round {
    display: inline;
    border-radius: 50%;
    aspect-ratio: 1/1;
}
.contact {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}
.sidebar__item--grid {
    --size-col2: 0;
    grid-template-columns: 1fr var(--size-col2);
    justify-content: flex-start;
    gap: 0px;
    text-align: start;
}
.sidebar__item--icon {
    --size-col2: 10px;
    gap: 2px;
}
.sidebar__item--bold,
.sidebar__b {
    font-weight:  600;
}
.contact__header {
    display: flex;
    align-items: center;
    gap: 5px;
}
.contact__name {
    font-size: var(--fz-xl);
    font-weight: 500;
}
.contact__name--overflow {
    overflow: hidden;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.pp {
    border-radius: 50%;
    display: grid;
    place-content: center;
}
.contact__pp {
    background: #7C7C7C;
    margin-right: 5px;
    padding: 5px;
}
.pp__letter {
    font-size: 1.875rem;
    aspect-ratio: 1/1;
    text-align: center;
}
.contact__links-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 60px);
    gap: 5px;
}
.link {
    font-size: var(--fz-m);
    color: var(--accent-color);
}
.contact__link {
    text-align: center;
}
.contact__link--desactivated {
    --accent-color: #7c7c7c;
    opacity: .4;
    color: #a1a1a1;
    pointer-events: none;
}
.link__icon {
    --icon-height: 30px;
    display: block;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background-color: var(--accent-color);
    padding: 6px;
    margin: 0 auto 5px auto;
}
.contact__infos {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.contact__line {
    border-bottom: 1px solid #7C7C7C59;
    padding: 2px 0;
    display: grid;
    grid-template-columns: 40% 1fr;
    gap: 5px;
}
.contact__line:last-of-type {
    border: none;
}
.contact__line--min-h {
    min-height: 8rem;
}
.contact__label {
    font-size: var(--fz-m);
    color: #a1a1a1;
    text-align: end;
}
.contact__icons-wrapper {
    --icon-height: 10px;
    display: flex;
    align-items: center;
    gap: 5px;
}
.contact__icon {
    height: var(--icon-height);
}
.contact__text {
    font-size: var(--fz-m);
    color: #fff;
    overflow-wrap: anywhere;
}
.contact__text--accent-color {
    color: var(--accent-color);
}
.sidebar__category:first-of-type {
    --margin-top: 1rem;
}
.alphabet {
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: .4;
}
.alphabet__letter {
    font-size: var(--fz-s);
    color: var(--accent-color);
    text-transform: uppercase;
}

@media (max-width: 1280px) {
    .app__sidebar {
        --padding-left: 20px;
        padding-inline: 0 10px;
        padding-bottom: 2rem;
    }
    .sidebar__category,
    .sidebar__item {
        padding-left: var(--padding-left);
    }
    .sidebar__item {
        --right: 5px;
        padding-right: var(--right);
    }
    .sidebar__item--grid {
        font-size: var(--fz-l);
    }
    .sidebar__item--icon {
        --size-col2: auto;
        gap: 5px;
    }
    .sidebar__category {
        font-size: var(--fz-l);
        color: #a1a1a1;
        opacity: 1;
    }
    .sidebar__item:focus,
    .sidebar__item:focus-within {
        background-color: #535353;
    }
    .app__content {
        --padding-inline: 5px;
        --gap: 15px;
        --bg-color: #424242;
        padding: 0;
        gap: 0;
    }
    .contact__header {
        width: 100%;
        flex-direction: column;
        gap: var(--gap);
        background-color: var(--bg-color);
        padding: 6rem var(--padding-inline) 0;
    }
    .contact__pp {
        padding: 15px;
    }
    .pp__letter {
        font-size: 3rem;
    }
    .contact__name {
        font-size: 1.75rem;
    }
    .contact__links-wrapper {
        width: 100%;
        background-color: var(--bg-color);
        grid-template-columns: repeat(4, 1fr);
        padding: var(--gap) var(--padding-inline);
    }
    .contact__link {
        background-color: #ffffff12;
        backdrop-filter: blur(var(--blur));
        border-radius: 8px;
        padding: 5px;
    }
    .link__icon {
        --icon-height: 30px;
        background-color: transparent;
        margin-bottom: 0;
        padding: 0 0 2px 0;
    }
    .contact__icons-wrapper {
        --icon-height: 15px;
        gap: 10px;
    }
    .contact__infos {
        padding-inline: var(--padding-inline);
    }
    .contact__line {
        padding: 15px 20px;
        margin-top: var(--gap);
        grid-template-columns: 1fr;
        grid-template-rows: repeat(2, min-content);
        border: none;
        background-color: var(--dark-fullscreen);
        backdrop-filter: blur(var(--blur));
        border-radius: 8px;
        gap: 0;
    }
    .contact__line--single-line {
        grid-template-columns: 1fr auto;
    }
    .contact__label {
        font-size: var(--fz-l);
        text-align: start;
        color: #fff;
    }
    .contact__text {
        font-size: var(--fz-l);
        margin-top: 5px;
    }
}
/*h2 {*/
    /*font-size: calc(var(--font-size) + 4px);*/
    /*font-size: 1.25rem;
    font-weight: 500;
}
.controls h2 {
    font-size: inherit;
}
h4 {
    color: #7C7C7C;
}
button {
    background: transparent;
    border: none;
    outline: none;
    padding: 2px 4px;
    border-radius: 2px;
    text-align: start;
}
.active {
    background: var(--dark-selection-focused);
}
.pp {
    background: #7C7C7C;
    border-radius: 50%;
    display: grid;
    place-content: center;
    margin-right: 5px;
    padding: 5px;
}*/
/*.pp span {*/
    /*font-size: calc(var(--font-size) * 2.5);*/
    /*font-size: 1.875rem;
    aspect-ratio: 1/1;
    text-align: center;
}
.flex {
    display: flex;
    align-items: center;
    gap: 4px;
}
.info {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.contact-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 60px);
    gap: 5px;
}
.contact-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}
.contact-btn.desactivated a {
    background: #7c7c7c; 
    color: #7c7c7c; 
    opacity: .4;
}
.contact-btn a {
    color: white;
    background: var(--dark-selection-focused);*/
    /*padding: calc(var(--font-size) / 2);*/
    /*padding: 6px;
    border-radius: 50%;
    aspect-ratio:  1/1;
}
.contact-btn .icon {
    --height: 15px;
    aspect-ratio: 1/1;
}
.contact-list button {
    padding: 4px 4px;
    text-transform: capitalize;
    font-weight: 600;
}
.contact-list button span {
    font-weight: 400;
}
.contact-list button .icon {
    margin-left: auto;
}
.line {
    border-bottom: 1px solid #7C7C7C59;
    padding: 2px 0;
    display: grid;
    grid-template-columns: 40% 1fr;
    gap: 5px;
}
.desactivated {
    opacity: .4;
    pointer-events: none;
    color: #7c7c7c;
}
.line a {
    color: #0A82FF;
}
.line:last-of-type {
    align-items: flex-start;
    border: none;
    height: 100%;
}
.subtitle {
    text-align: end;
    color: #7C7C7C
}
 button, .info {
    width: 100%;
}
.contact-list > h4 {
    text-transform: uppercase;
    padding-block: 12px 5px;
    font-weight: 500;
    font-size: inherit;
}
.app-content {
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;*/
    /*gap: calc(var(--font-size) * 1.5);*/
    /*gap: 1rem;
    overflow: auto;
    grid-row: 1/-1;
    outline: 1px solid #000;
}
.app-content p, .app-content {*/
    /*font-size: var(--font-size);*/
    /*font-size: var(--fz-m);
}*/
/*.contact-list button:focus {
    background: var(--dark-selection-focused);
}
.contact-list button:focus i {
    color: white
}*/
/*h5 {
    text-align: center;
    font-size: var(--fz-m);
    font-weight: 500;
    margin-block: 12px;
    opacity: 1;
}
.controls {
    font-size: var(--fz-xl);
    color: #0A82FF;
    padding: 4rem 15px 10px;
    grid-area: 1 / 1 / 2 / -1;
    z-index: 2;
    background: var(--dark-fullscreen);
    backdrop-filter: blur(var(--blur)); 
    gap: 8px;
}
.controls button, .controls > .icon:last-of-type {
    opacity: .4;
}
.controls button {
    width: fit-content;
    padding: 5px 5px 5px 0;
}
.controls .icon {
    --height: 17px;
}
.controls .flex .icon {
    aspect-ratio: 1/1;
}
.space-left {
    margin-left: auto;
}
.controls h2, .controls button, .controls button > span:last-of-type {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.controls h2 {
    margin-inline: auto;
    color: white;
    max-width: 25ch;
}
.grid {
    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    align-items: center;
}
.controls .btn-bg {
    color: white;
}
.btn-bg {
    background: #7c7c7c59;
}
.btn-bg.active {
    opacity: 1;
}
.btn-bg.round {
    height: 100%;
    border-radius: 50%;
    aspect-ratio: 1/1;
    padding: 5px;
}
.btn-bg.semi-round {
    border-radius: 20px;
}
.flex-column {
    flex-direction: column;
}
.wrapper {
    width: 100%;
    gap: 1rem;
}
@media (max-width: 1280px) {
    .app-grid, .app-content, .contact-list {
        background-color: #080808;
    }
    .app-grid {
        padding-top: 0;
        grid-template-columns: 1fr;
        grid-template-rows: max-content 1fr;
    }
    .contact-list, .app-content {
        grid-area: 1 / 1 / -1 / -1; 
    }
    .app-content {
        padding: 0;
        gap: 0;
    }
    .wrapper {
        padding: 6.5rem 15px 1rem;
        background: #7c7c7c80;
    }
    .contact-list {
        --padding-left: 15px;
        display: block;
        font-size: var(--fz-l);
        padding: 6.5rem 10px 0 0;
        border: none;
    }
    .contact-list button {
        padding: 10px 5px 10px var(--padding-left);
        border-radius: 0;
    }
    .contact-list button, .contact-list > h4 {
        position: relative;
    }
    .contact-list button:focus {
        background: #7c7c7c;
    }
    .contact-list button:focus i {
        color: white
    }
    .contact-list h4 {
        font-size: var(--fz-m);
        padding: 15px 0 5px var(--padding-left);
    }
    .contact-list button .icon {
        --height: 100%;
        text-transform: none;
    }
    .contact-list h4::before, .contact-list button::before {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: calc(100% - var(--padding-left));
        height: 1px;
        background: #7c7c7c33;
    }
    .wrapper > .flex, .contact-wrapper {
        width: 100%;
    }
    .wrapper > .flex:first-of-type {
        flex-direction: column;
        gap: 10px;
    }
    .contact-wrapper {
        grid-template-columns: repeat(4, 1fr);
    }
    .pp span {
        font-size: 4rem;
    }
    .contact-btn {
        width: 100%;
        background: var(--dark-fullscreen);
        backdrop-filter: blur(var(--blur));
        border-radius: .4rem;
        font-size: var(--fz-xl);
        color: white;
        padding: 5px;
    }
    .contact-btn .icon {
        --height: 25px;
    }
    .info {
        padding: 1rem 15px;
        gap: 10px;
    }
    .line {
        display: flex;
        align-items: flex-start;
        border: none;
        background: var(--dark-fullscreen);
        backdrop-filter: blur(var(--blur));
        padding: 10px 20px;
        border-radius: .4rem;
    }
    .line a {
        font-size: var(--fz-l);
    }
    .line .btn-bg.round {
        padding: 6px;
    }
    .line .icon {
        --height: 14px;
    }
    .line:last-of-type {
        height: auto;
        min-height: 20%;
    }
    .subtitle {
        color: white;
        width: auto;
        margin-right: auto;
    }
}*/
</style>
