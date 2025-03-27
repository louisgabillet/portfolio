<script lang="ts">
import { svgs } from '$lib/svg';

export let name: string;
export let color = '#7c7c7c';
// export let desc = undefined;

$: displayIcon = svgs[name];
$: ({ box, path } = displayIcon);
</script>

{#if displayIcon}
    <svg 
        class="svg"
        xmlns="http://www.w3.org/2000/svg"
        fill={ color }
        viewBox={ box }
    >
        {@html path}
    </svg>
{/if}

<style>
.svg {
    width: 100%;
    height: 100%;
}
</style>
