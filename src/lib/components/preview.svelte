<script lang="ts">
import Svg from "./svg.svelte";
import { isResponsive } from "$lib/store";
import Img from "./img.svelte";
import { onMount } from "svelte";
import { loadProjectData } from "$lib/projects"
import appWindows from "$lib/apps/window-management/store";
import appWindow from "$lib/apps/window-management";
import type { Details, Gallery, Images, Links, Design, Descriptions, Color } from "$lib/projects/types";
import { toast } from "$lib/toast";

export let imgId: string | null = null;
export let dirName: string;

const fileName: string = 'Étude de cas';

let details: Details;
let design: Design;
let descriptions: Descriptions;
let links: Links;
let images: Images;

let openedImg: Gallery | undefined;

$: lastAppWindow = $appWindows[$appWindows.length - 1];

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

            if (imgId) openedImg = images.gallery.find(img => img.imgId === imgId);

        } catch (err) {
            console.error(`Error fetching data of '${dirName}':`, err);
        }
    }
})

const isPlural = (word: string, arr: string[]) =>  {
    const length = arr.length;
    return length > 1 ? word + 's' : word;
}
const copyColor = (color: Color) => {
    navigator.clipboard.writeText(color.hex)

    const props = { imgId, dirName };
    toast({
        appName: 'Preview',
        title: `Copie de ${color.name}`,
        message: `La couleur '${color.name}' (${color.hex}) a été copié dans le presse-papier.`,
    }, { props })
}
</script>

<div class="app__grid">
    {#if $isResponsive}
        <div class="controls app__controls controls-header app__controls-header">
            <span class="controls__item controls-header__item">
                <Svg name='list_bullet' color='var(--accent-color)' />
            </span>
            <h2 class="controls__h2 controls__text--overflow">{fileName}</h2>
            <div class="controls__items-wrapper">
                <button class="controls__item controls-header__item controls-header__btn controls__btn--active" on:click={() => appWindow.close(lastAppWindow.id)}>OK</button>
            </div>
        </div> 
        <div class="controls app__controls controls-footer app__controls-footer">
            <span class="controls__item controls-footer__item controls-footer__item--semi-transparent">
                <Svg name='square_and_arrow_up' color='var(--accent-color)' />
            </span>
            <span class="controls__item controls-footer__item controls-footer__item--semi-transparent">
                <Svg name='pencil_tip_crop_circle' color='var(--accent-color)' />
            </span>
            <span class="controls__item controls-footer__item controls-footer__item--semi-transparent">
                <Svg name='rectangle_and_pencil_and_ellipsis' color='var(--accent-color)' />
            </span>
            <span class="controls__item controls-footer__item controls-footer__item--semi-transparent">
                <Svg name='magnifyingglass' color='var(--accent-color)' />
            </span>
        </div>
    {:else} 
        <div class="controls app__controls app__controls--full">
            <span class="controls__item controls__item--space-right">
                <Svg name='sidebar_left' />
            </span>
            <p class="controls__file-name">{fileName}</p>
            <span class="controls__item">
                <Svg name='info_circle' />
            </span>
            <span class="controls__item">
                <Svg name='plus_magnifyingglass' />
            </span>
            <span class="controls__item">
                <Svg name='minus_magnifyingglass' />
            </span>
            <span class="controls__item">
                <Svg name='square_and_arrow_up' />
            </span>
            <span class="controls__item controls__item--space-right controls__item--space-left">
                <Svg name='highlighter' />
            </span>
            <span class="controls__item">
                <Svg name='rotate_left' />
            </span>
            <span class="controls__item">
                <Svg name='pencil_tip_crop_circle' />
            </span>
            <span class="controls__item">
                <Svg name='rectangle_and_pencil_and_ellipsis' />
            </span>
            <span class="controls__item">
                <Svg name='magnifyingglass' />
            </span>
        </div>
    {/if}
    <div class="content app__content" class:app__content--full={ $isResponsive }>
        {#if openedImg}
            <Img 
                src={openedImg.src} 
                alt={openedImg.name} 
            />
        {:else if details}
            <div class="page content__page">
                <h1 class="page__title">Étude de cas</h1>
                <!--<h2>{subtitle}</h2>-->
                <h2 class="page__subtitle">{details.name}</h2>
            </div>
            {#if descriptions.intro}
                <div class="page content__page">
                    <h2 class="page__subtitle">Intro:</h2>
                    <p class="page__text">{descriptions.intro}</p> 
                </div>
            {/if}
            <div class="page content__page">
                <h2 class="page__subtitle">Informations</h2>
                {#if details.client}
                    <div class="page__line">
                        <h3 class="page__text page__text--bold">Client:</h3>
                        <a class="page__text page__link" href="{links.live_demo}" target="_blank">{details.client}</a> 
                    </div>
                {/if}
                {#if details.date}
                    <div class="page__line">
                        <h3 class="page__text page__text--bold">Date:</h3>
                        <p class="page__text">{details.date}</p> 
                    </div>
                {/if}
                {#if details.requests}
                    <h3 class="page__text page__text--bold page__text--margin-top">{isPlural('Demande', details.requests)}:</h3>
                    <ul class="page__list">
                        {#each details.requests as request}
                            <li class="page__list-item page__text">{request}</li> 
                        {/each}
                    </ul>
                {/if}
                {#if details.technologies}
                    <h3 class="page__text page__text--bold page__text--margin-top">{isPlural('Outil', details.technologies)} {isPlural('utilisé', details.technologies)}:</h3>
                    <ul class="page__list">
                        {#each details.technologies as techno}
                            <li class="page__list-item page__text">{techno}</li> 
                        {/each}
                    </ul>
                {/if}
                {#if details.targetAudience}
                    <h3 class="page__text page__text--bold page__text--margin-top">Audience visée:</h3>
                    <ul class="page__list">
                        {#each details.targetAudience as target}
                            <li class="page__list-item page__text">{target}</li> 
                        {/each}
                    </ul>
                {/if}
            </div>
            {#if descriptions.process}
                <div class="page content__page">
                    <h2 class="page__subtitle">Processus:</h2>
                    <p class="page__text">{descriptions.process}</p> 
                </div>
            {/if}
            <div class="page content__page">
                <h2 class="page__subtitle">Visuels</h2>
                {#if images.logo}
                    <div class="page__line" style="align-items: center;">
                        <h3 class="page__text page__text--bold">Logo:</h3>
                        <Img 
                            width='50'
                            src={images.logo} 
                            alt='logo de la marque' 
                        />
                    </div>
                {/if}
                {#if design.fonts}
                    <h3 class="page__text page__text--bold page__text--margin-top">{isPlural('Police', design.fonts)} d'écriture:</h3>
                    <ul class="page__list">
                        {#each design.fonts as font}
                            <li class="page__list-item page__text">{font}</li> 
                        {/each}
                    </ul>
                {/if}
                {#if design.colorCode}
                    <h3 class="page__text page__text--bold page__text--margin-top">Code Couleur:</h3>
                    <div class="page__list">
                        {#each design.colorCode as color}
                            <button
                                class="page__list-item page__text page__color"
                                style:--color={ color?.fontColor || color.hex }
                                on:click={() => copyColor(color)}
                            >
                                { color.name }: {color.hex}
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>
            {#if descriptions.challenges}
                <div class="page content__page">
                    <h2 class="page__subtitle">Difficultés:</h2>
                    <p class="page__text">{descriptions.challenges}</p> 
                </div>
            {/if}
            {#if descriptions.outcome}
                <div class="page content__page">
                    <h2 class="page__subtitle">Résultat:</h2>
                    <p class="page__text">{descriptions.outcome}</p> 
                </div>
            {/if}
        {/if}
    </div>
</div>

<style>
.app__grid {
    grid-template-columns: 1fr;
    --accent-color: #0a82ff;
}
.app__controls {
    grid-column: 1 / -1;
}
.app__controls-footer {
    --nbr-columns: 4;
}
.controls-header__item:first-of-type {
    width: min-content;
    padding-inline: 8px;
}
.controls-header__btn {
    color: var(--accent-color);
}
.controls-footer__item {
    --padding-block: calc((var(--controls-footer__item--height) - var(--controls__item--icon-height)) / 2);
    padding-block: var(--padding-block);
}
.controls-footer__item--semi-transparent {
    opacity: .4;
}
.controls__file-name {
    font-size: var(--fz-s);
    margin-right: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.page {
    --gap: 15px;
    width: 350px;
    min-height: 495px;
    /*aspect-ratio: 210 / 297;*/
    background: white;
    color: black;
    overflow: hidden;
    user-select: text;
}
.content__page {
    margin: 0 auto 8px auto;
    padding: 35px;
}
.page:first-of-type {
    display: grid;
    place-content: center;
    text-align: center;
}
.page:last-of-type {
    margin-bottom: 0;
}
.page__line {
    display: flex;
    align-items: flex-end;
    gap: 5px;
    margin-top: var(--gap);
}
.page__line:first-of-type {
    margin-top: 0;
}
.page__title {
    font-size: 1.25rem;
}
.page__subtitle {
    font-size: var(--fz-xl);
    text-align: center;
    margin-bottom: var(--gap);
}
.page__text {
    font-size: var(--fz-m);
}
.page__text--bold {
    font-weight: 600;
}
.page__text--margin-top {
    margin-top: var(--gap);
}
.page__link {
    color: var(--accent-color);
}
.page__list {
    list-style-type: none;
    padding-left: 15px;
    display: flex;
    flex-wrap: wrap;
}
.page__list-item {
    display: flex;
    overflow-wrap: anywhere;
    min-width: 100%;
}
.page__list-item::before {
    content: '-';
    margin-right: 5px;
}
.page__color {
    color: var(--color);
    gap: 5px;
}

@media (max-width: 1280px) {
    .app__content {
        padding-inline: 0;
    }
    .page {
        width: 100%;
        margin-bottom: 5px;
    }
    .page__subtitle {
        font-size: 18px;
    }
    .page__text {
        font-size: var(--fz-l);
    }
}
</style>
