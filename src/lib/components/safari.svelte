<script lang="ts">
import { onMount } from "svelte";
import { isResponsive } from "$lib/store";
import { loadProjectData } from "$lib/projects";
import appWindows from "$lib/apps/window-management/store";
import appWindow from "$lib/apps/window-management";
import Svg from "./svg.svelte";
import type { Images } from "$lib/projects/types";

export let dirName: string | null = null;

let images: Images;
let url: string;
let formattedUrl: string;

let isImgLoaded: boolean = false;

$: lastAppWindow = $appWindows[$appWindows.length - 1];

onMount(async () => {
    if (dirName) {
        try {
            const res = await loadProjectData(dirName);

            if (!res) {
                return;
            }

            images = res.images;

            url = res.links.live_demo;
            formattedUrl = url.split('://')[1]?.split('/')[0];

        } catch (err) {
            console.error(`Error fetching data of '${dirName}':`, err);
        }
    }
})
</script>

<div class="app__grid">
    {#if $isResponsive}
        {#if images}
            <div class="controls app__controls controls-header app__controls-header">
                <button class="controls__item controls__item--distance-right controls-header__item controls-header__btn controls__btn--active controls__text--accent-color" on:click={() => appWindow.close(lastAppWindow.id)}>OK</button>
                <a href={url} target="_blank" class="controls__link controls__text--overflow controls__text--accent-color">{formattedUrl}</a>
                <div class="controls__items-wrapper">
                    <span class="controls__item controls-header__item">
                        <Svg name="arrow_clockwise" color="var(--accent-color)" />
                    </span>
                </div>
            </div>
        {/if}
        <div class="controls app__controls controls-footer app__controls-footer" class:controls__search-bar--no-url={ !url } style={ images ? '--nbr-columns: 4' : ''}>
            {#if url && images}
                <span class="controls__item controls-footer__item">
                    <Svg name="chevron_left" />
                </span>
                <span class="controls__item controls-footer__item">
                    <Svg name="chevron_right" />
                </span>
                <span class="controls__item controls-footer__item" style="padding-block: 12px;">
                    <Svg name="square_and_arrow_up" />
                </span>
                <span class="controls__item controls-footer__item">
                    <Svg name="safari" />
                </span>
            {:else if url}
                <a href="{url}" target="_blank" class="search-bar__link">{formattedUrl}</a> 
            {:else}
                <label for="search" class="search-bar controls__search-bar controls__search-bar--bg" class:controls__search-bar--searched={ formattedUrl }> 
                    <input class="search-bar__input" type="text" bind:value={ formattedUrl } autocomplete="off" id="search">
                    <span class="search-bar__icon search-bar__icon--can-hide" style="margin-right: auto;">
                        <Svg name='magnifyingglass' />
                    </span>
                    <p class="search-bar__placeholder search-bar__text">
                        {#if !formattedUrl}
                            Rechercher ou saisir un site
                        {/if}
                    </p>
                    <span class="search-bar__icon">
                        <Svg name='microphone_fill' />
                    </span>
                    {#if formattedUrl}
                        <button class="search-bar__icon" on:click={() => formattedUrl = '' }>
                            <Svg name='x_circle_fill' />
                        </button>
                    {/if}
                </label>
                <span class="controls__item controls-footer__item">
                    <Svg name="chevron_left" />
                </span>
                <span class="controls__item controls-footer__item">
                    <Svg name="chevron_right" />
                </span>
                <span class="controls__item controls-footer__item" style="padding-block: 12px;">
                    <Svg name="square_and_arrow_up" />
                </span>
                <span class="controls__item controls-footer__item">
                    <Svg name="book" />
                </span>
                <span class="controls__item controls-footer__item">
                    <Svg name="square_on_square" />
                </span>
            {/if}
        </div>
    {:else}
        <div class="controls app__controls app__controls--full">
            <span class="controls__item">
                <Svg name='sidebar_left' />
            </span>
            <span class="controls__item">
                <Svg name='chevron_left' />
            </span>
            <span class="controls__item">
                <Svg name='chevron_right' />
            </span>
            {#if url}
                <div class="search-bar controls__search-bar controls__search-bar--searched">
                    <a href="{url}" target="_blank" class="search-bar__link">
                        <span class="search-bar__icon">
                            <Svg name='magnifyingglass' color="var(--accent-color)" />
                        </span>
                        {formattedUrl}
                    </a> 
                </div>
            {:else}
                <label for="search" class="search-bar controls__search-bar controls__search-bar--bg" class:controls__search-bar--searched={ formattedUrl }> 
                    <input class="search-bar__input" type="text" bind:value={ formattedUrl } autocomplete="off" id="search">
                    <div class="search-bar__placeholder">
                        <span class="search-bar__icon">
                            <Svg name='magnifyingglass' />
                        </span>
                        {#if !formattedUrl}
                            <p class="search-bar__text">Rechercher ou saisir un site</p>
                        {/if}
                    </div>
                </label>
            {/if}
            <span class="controls__item">
                <Svg name='square_and_arrow_up' />
            </span>
            <span class="controls__item">
                <Svg name='plus' />
            </span>
            <span class="controls__item">
                <Svg name='square_on_square' />
            </span>
        </div>
    {/if}
    <div class="content app__content" class:app__content--no-bg={ !images }>
        {#if images}
            <picture class:loading={ !isImgLoaded }>
                <source media="(max-width: 1280px)" srcset="https://res.cloudinary.com/dejb4brmy/image/upload/f_auto/q_auto/w_auto/portfolio/images/{images.fullPage.mobile}">
                <source media="(min-width: 1281px)" srcset="https://res.cloudinary.com/dejb4brmy/image/upload/f_auto/q_auto/w_auto/portfolio/images/{images.fullPage.pc}">
                <img class="content__page" src='https://res.cloudinary.com/dejb4brmy/image/upload/f_auto/q_auto/w_auto/portfolio/images/{images.fullPage.pc}' alt="Contenu de la page '{formattedUrl}" on:load={() => isImgLoaded = true }>
            </picture>
        {/if}
    </div>
</div>

<style>
.app__grid {
    --accent-color: #0a82ff;
    grid-template-columns: 1fr;
}
.controls-footer {
    row-gap: 0;
}
.controls__search-bar--no-url {
    grid-template-rows: 40px min-content;
}
.app__controls-footer {
    --nbr-columns: 5;
}
.controls-footer__item {
    padding-block: 14px;
}
.controls__link {
    font-size: var(--fz-xl);
}
.controls__text--accent-color {
    color: var(--accent-color)
}
.app__content {
    padding: 0;
}
.app__content:not(.app__content--no-bg)::-webkit-scrollbar {
    background: white;
}
.app__content--no-bg {
    background-color: transparent;
}
.search-bar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}
.controls__search-bar {
    --padding-inline: 20px;
    width: 50%;
    height: 60%;
    margin: 0 auto;
    border-radius: .2rem;
    padding-inline: var(--padding-inline);
    font-size: var(--fz-s);
    caret-color: var(--accent-color);
}
.controls__search-bar--searched {
    outline: 1px solid #525150;
    text-align: center;
}
.controls__search-bar--bg {
    background-color: #2C2C2B;
    outline: none;
}
.search-bar__link {
    height: 100%;
    display: flex;
    align-items: center;
    color: var(--accent-color);
}
.search-bar__placeholder {
    height: 100%;
    display: flex;
    align-items: center;
    position: absolute;
    white-space: nowrap;
    max-width: 100%;
    left: 50%;
    transform: translateX(-50%);
    transition: left .22s ease, transform .22s ease;
    pointer-events: none;
}
.controls__search-bar:focus-within .search-bar__placeholder,
.controls__search-bar--searched .search-bar__placeholder {
    left: 0;
    transform: translateX(0);
}
.search-bar__icon {
    width: var(--padding-inline);
    height: 100%;
    padding: 3px;
    flex-shrink: 0;
}
.search-bar__text {
    font-size: inherit;
    color: #7c7c7c;
    overflow: hidden;
    text-overflow: ellipsis;
}
.search-bar__input {
    color: #fff;
    min-width: 0;
    padding: inherit;
    font-size: inherit;
    background: transparent;
    cursor: default;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}
.controls__search-bar:focus-within .search-bar__input {
    cursor: text;
}
.content__page {
    width: 100%;
}

@media (max-width: 1280px) {
    .controls__search-bar {
        --padding-inline: 10px;
        width: 100%;
        height: 100%;
        grid-column: 1/-1;
        font-size: var(--fz-l);
        border-radius: 8px;
        gap: 10px;
    }
    .search-bar__icon {
        width: auto;
        padding: 10px 0;
        z-index: 2;
        transition: opacity 320ms ease, visibility 320ms ease;
    }
    .controls__search-bar:focus-within .search-bar__placeholder,
    .controls__search-bar--searched .search-bar__placeholder {
        left: var(--padding-inline);
        transform: translateX(0);
    }
    .controls__search-bar:focus-within .search-bar__icon--can-hide,
    .controls__search-bar--searched .search-bar__icon--can-hide {
        opacity: 0;
        visibility: hidden;
    }
    .search-bar__link {
        grid-column: 1/-1;
        font-size: var(--fz-m);
        justify-content: center;
        margin-top: 10px;
    }
}
@media (min-width: 1281px) {
    .controls__search-bar:focus,
    .controls__search-bar:focus-within {
        outline: 3px solid #457198;
    }
}
</style>
