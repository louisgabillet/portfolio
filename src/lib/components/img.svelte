<script lang="ts">
import { onMount } from "svelte";
import Loader from "./loader.svelte";

export let src: string;
export let alt: string; 
export let path: string = '';
export let format: string = 'auto';
export let quality: string = 'auto';
export let width: string = '';

let img: HTMLImageElement;
let isImgLoaded = false;

const handleLoad = () => {
    isImgLoaded = true;
    if (img) img.removeEventListener('load', handleLoad)
}

onMount(() => {
    if (!img) return;

    const observer = new MutationObserver((changes) => {
        changes.forEach(change => {
            const attrName = change.attributeName;

            if (!attrName) return;

            if (attrName === 'src') {
                isImgLoaded = false;
                img.addEventListener('load', handleLoad)
            }
        });
    });

    observer.observe(img, { attributes : true });

    const isComplete: boolean = img.complete;

    if (!isComplete) {
        img.addEventListener('load', handleLoad)
        return;
    }

    isImgLoaded = true;
})
</script>

<div 
    class="media"
    style="{width ? `--media-width: ${width}px; aspect-ratio: 1/1;` : '--media-width: 100%'}"
>
    {#if !isImgLoaded}
        <Loader /> 
    {/if}
    <img 
        bind:this={ img }
        class="media__img"
        class:media__img--loading={ !isImgLoaded }
        src="https://res.cloudinary.com/dejb4brmy/image/upload/f_{format}/q_{quality}/w_{width ? +width + 40 : 'auto'}/portfolio/images/{path}{src}"
        loading="lazy"
        decoding="async"
        draggable="false"
        alt={alt}
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
    opacity: 1;
}
.media__img--loading {
    visibility: hidden;
}
</style>
