<script lang="ts">
import Loader from "./loader.svelte";

export let src: string;
export let alt: string; 
export let path: string = '';
export let format: string = 'auto';
export let quality: string = 'auto';
export let width: string = '';

let isImgLoaded = false;

$: if (src) isImgLoaded = false;
</script>

<div class="media" style="{width ? `--media-width: ${width}px; aspect-ratio: 1/1;` : '--media-width: 100%'}">
    {#if !isImgLoaded}
        <Loader /> 
    {/if}
    <img 
        class="media__img"
        class:media__img--loading={ !isImgLoaded }
        src="https://res.cloudinary.com/dejb4brmy/image/upload/f_{format}/q_{quality}/w_{width ? +width + 40 : 'auto'}/portfolio/images/{path}{src}"
        loading="lazy"
        decoding="async"
        alt={alt}
        on:load={() => isImgLoaded = true }
    >
</div>

<style>
.media {
    width: var(--media-width);
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}
.media__img {
    max-width: 100%;
    max-height: 100%;
}
.media__img--loading {
    visibility: hidden;
}
</style>
