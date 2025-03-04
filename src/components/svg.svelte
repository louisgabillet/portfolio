<script lang="ts">
import { svgs, type Svg } from '$lib/svg';

export let name: string;
//export let img_name: string;
//export let style: string | null = null;
export let color = '#7c7c7c';
// export let desc = undefined;

$: displayIcon = svgs[name];
$: ({ box, path, title, desc } = displayIcon);
</script>

{#if displayIcon}
    <!--<svg class="svg" xmlns="http://www.w3.org/2000/svg" fill={color} viewBox={box}>-->
    <svg class="svg" xmlns="http://www.w3.org/2000/svg" fill={color} viewBox={box}>
        <!--{#if title}
            <title>{title}</title>
        {/if}
        {#if desc}
            <desc>{desc}</desc>
        {/if}-->
        {@html path}
    </svg>
{/if}

<style>
.svg {
    width: 100%;
    height: 100%;
}
</style>
