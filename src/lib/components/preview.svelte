<script lang="ts">
import Svg from "./svg.svelte";
import { isResponsive } from "$lib/store";
import Img from "./img.svelte";
import { onMount } from "svelte";
import { loadProjectData } from "$lib/projects"
import appWindows from "$lib/apps/window-management/store";
import appWindow from "$lib/apps/window-management";
import type { Details, Gallery, Images, Links, Design, Descriptions } from "$lib/projects/types";

export let img_id: string;
export let dirName: string;

let details: Details;
let design: Design;
let descriptions: Descriptions;
let links: Links;
let images: Images;

let fileName: string;
let openedImg: Gallery | undefined;

$: lastAppWindow = $appWindows[$appWindows.length - 1];

const isPlural = (word: string, arr: string[]) =>  {
    const length = arr.length;
    return length > 1 ? word + 's' : word;
}

onMount(async () => {
    if (dirName) {
        try {
            const res = await loadProjectData(dirName);

            if (!res) {
                return;
            }

            details = res.details;
            descriptions = res.descriptions;
            design = res.design;
            links = res.links;
            images = res.images;

            fileName = details.name;
            openedImg = images.gallery.find(img => img.img_id === img_id);

        } catch (err) {
            console.error(`Error fetching data of '${dirName}':`, err);
        }
    }
})
</script>

<div class="app-grid">
    {#if $isResponsive}
        <div class="controls grid">
            <span class="icon">
                <Svg name='list_bullet' color='#0A82FF' />
            </span>
            <h2>{fileName}</h2>
            <button class="ok-btn" on:click={() => appWindow.close(lastAppWindow.id) }>OK</button>
        </div> 
    {/if}
    <div class="app-controls">
        {#if $isResponsive}
            <span class="icon">
                <Svg name='square_and_arrow_up' color='#0A82FF' />
            </span>
            <span class="icon">
                <Svg name='pencil_tip_crop_circle' color='#0A82FF' />
            </span>
            <span class="icon">
                <Svg name='magnifyingglass' color='#0A82FF' />
            </span>
        {:else} 
            <span class="icon">
                <Svg name='sidebar_left' color='#7c7c7c' />
            </span>
            <p>{fileName}</p>
            <span class="icon">
                <Svg name='info_circle' color='#7c7c7c'/>
            </span>
            <span class="icon">
                <Svg name='plus_magnifyingglass' color='#7c7c7c' />
            </span>
            <span class="icon">
                <Svg name='minus_magnifyingglass' color='#7c7c7c' />
            </span>
            <span class="icon icon-big"> 
                <Svg name='square_and_arrow_up' color='#7c7c7c' />
            </span>
            <span class="icon space-a">
                <Svg name='highlighter' color='#7c7c7c' />
            </span>
            <span class="icon icon-big">
                <Svg name='rotate_left' color='#7c7c7c' />
            </span>
            <span class="icon">
                <Svg name='pencil_tip_crop_circle' color='#7c7c7c' />
            </span>
            <span class="icon space-r">
                <Svg name='rectangle_and_pencil_and_ellipsis' color='#7c7c7c' />
            </span>
            <span class="icon">
                <Svg name='magnifyingglass' color='#7c7c7c' />
            </span>
        {/if}
    </div>
    <div class="app-content" class:center-content={ img_id && openedImg }>
        {#if img_id && openedImg}
            <Img 
                src={openedImg.src} 
                alt={openedImg.name} 
            />
        {:else if details}
            <div class="page">
                <h1>{details.name}</h1>
                <!--<h2>{subtitle}</h2>-->
            </div>
            <div class="page">
                <h2>Informations</h2>
                {#if details.client}
                    <div class="flex">
                        <h3>Client:</h3>
                        <a href="{links.live_demo}" target="_blank">{details.client}</a> 
                    </div>
                {/if}
                {#if details.date}
                    <div class="flex">
                        <h3>Date:</h3>
                        <p>{details.date}</p> 
                    </div>
                {/if}
                <!--{#if site_type}
                    <div class="flex">
                        <h3>Type de site:</h3>
                        <p>{site_type}</p> 
                    </div>
                {/if}-->
                {#if details.requests}
                    <h3>{isPlural('Demande', details.requests)}:</h3>
                    <ul>
                        {#each details.requests as request}
                            <li>{request}</li> 
                        {/each}
                    </ul>
                {/if}
                {#if details.technologies}
                    <h3>{isPlural('Outil', details.technologies)} {isPlural('utilisé', details.technologies)}:</h3>
                    <ul>
                        {#each details.technologies as techno}
                            <li>{techno}</li> 
                        {/each}
                    </ul>
                {/if}
                {#if details.targetAudience}
                    <h3>Audience visée:</h3>
                    <ul>
                        {#each details.targetAudience as target}
                            <li>{target}</li> 
                        {/each}
                    </ul>
                {/if}
            </div>
            <div class="page">
                <h2>Visuels</h2>
                {#if images.logo}
                    <div class="flex" style="align-items: center;">
                        <h3>Logo:</h3>
                        <Img 
                            width='50'
                            src={images.logo} 
                            alt='logo de la marque' 
                        />
                    </div>
                {/if}
                {#if design.fonts}
                    <h3>{isPlural('Police', design.fonts)} d'écriture:</h3>
                    <ul>
                        {#each design.fonts as font}
                            <li>{font}</li> 
                        {/each}
                    </ul>
                {/if}
                {#if design.colorCode}
                    <h3>Code Couleur:</h3>
                    <div class="list-placement">
                        {#each design.colorCode as color}
                            <button class="color" style="--color: {color};" on:click={() => navigator.clipboard.writeText(color)}>
                                <p>{color}</p>
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>
            <div class="page">
                <h2>Intro:</h2>
                {#if descriptions.intro}
                    <p>{descriptions.intro}</p> 
                {/if}
            </div>
            <div class="page">
                <h2>Processus:</h2>
                {#if descriptions.process}
                    <p>{descriptions.process}</p> 
                {/if}
            </div>
            <div class="page">
                <h2>Difficultés:</h2>
                {#if descriptions.challenges}
                    <p>{descriptions.challenges}</p> 
                {/if}
            </div>
            <div class="page">
                <h2>Résultat:</h2>
                {#if descriptions.outcome}
                    <p>{descriptions.outcome}</p> 
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
.app-grid {
    grid-template-columns: 1fr;
}
.app-controls {
    grid-column: 1 / -1;
}
.app-controls p {
    font-size: var(--fz-xs);
    margin-right: auto;
}
.app-controls .icon {
    opacity: .4;
}
.icon-big {
    --height: 12px;
}
.space-a {
    margin-inline: 10px;
}
.space-r {
    margin-right: 10px;
}
.center-content {
    display: flex;
    align-items: center;
    justify-content: center;
}
h1 {
    font-size: 1.25rem;
}
h2 {
    font-size: var(--fz-xl);
    text-align: center;
}
.list-placement {
    border: 1px solid #7c7c7c33;
}
.list-placement, ul {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
ul {
    list-style-type: none;
    padding-left: 15px;
}
a {
    color: #0A82FF;
}
h3, li, p, a {
    font-size: var(--fz-m);
}
li::before {
    content: '-';
    margin-right: 5px;
}
.flex {
    display: flex;
    align-items: flex-end;
}
.page > .flex, .page > h3 {
    margin-block: 15px 5px;
}
.flex h3 {
    margin-right: 5px;
}
.logo {
    height: 50px;
}
.text-grid {
    display: grid;
    grid-template-columns: max-content 1fr;
}
.text-grid h3, .text-grid li {
    margin: 0;
}
.color-container {
    outline: 1px solid #7c7c7c33;
    overflow: hidden;
    display: flex;
}
.color {
    width: 100%;
    background-color: var(--color);
    display: grid;
    place-content: center;
    padding: 5px;
}
.color > p {
    color: #fff;
    mix-blend-mode: difference;
    opacity: 0;
    transition: opacity .32s ease;
}
img {
    max-width: 100%;
    max-height: 100%;
}
.page {
    width: 350px;
    aspect-ratio: 210 / 297;
    background: white;
    margin: 0 auto 10px auto;
    color: black;
    padding: 35px;
    overflow: hidden;
    user-select: text;
}
.page:first-of-type {
    display: grid;
    place-content: center;
    text-align: center;
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
.controls button {
    padding: 5px;
}
.controls > .icon {
    opacity: .4;
}
.ok-btn {
    font-size: 17px;
    margin-left: auto;
}
.controls .icon {
    --height: 20px;
    aspect-ratio: 1/1;
}
.controls .flex .icon {
    aspect-ratio: 1/1;
}
.controls h2 {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.controls h2 {
    margin-inline: auto;
    color: white;
    max-width: 25ch;
    font-weight: 500;
}
.grid {
    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    align-items: center;
}
@media (min-width: 1281px) {
    .app-controls {
        padding-left: 3.5rem;
    }
    .color:hover > p {
        opacity: 1;
    }
}
@media (max-width: 1280px) {
    .app-grid {
        padding-top: 0;
        grid-template-columns: 1fr;
        grid-template-rows: max-content 1fr max-content;
    }
    .app-content {
        padding-block: 6.5rem 4rem;
        grid-area: 1 / 1 / -1 / -1;
    }
    .app-controls {
        padding: 10px 20px 2rem;
        grid-area: 3 / 1 / -1 / -1;
    }
    .app-controls .icon {
        --height: 20px;
        aspect-ratio: 1/1;
    }
    .page {
        width: 100%;
    }
    .color > p {
        opacity: 1;
    }
    h2 {
        font-size: 18px;
    }
    h3, li, p, a {
        font-size: var(--fz-l);
    }
}
</style>
