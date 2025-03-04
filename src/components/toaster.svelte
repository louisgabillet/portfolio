<script lang="ts">
import { isResponsive } from "$lib";
import { toasts } from "$lib/toast/store";
import Toast from "./toast.svelte";

$: _toasts = Object.entries($toasts);
$: toastsFlat = Object.values($toasts).flat();

$: toastsLength = toastsFlat.length;
$: isNotEmpty = _toasts.some(value => Array.isArray(value) && value.length > 0);
</script>


<div 
    class="notif-center screen__notif-center"
    class:notif-center--hidden={ !isNotEmpty }
>
    {#if $isResponsive}
        <div 
            class="notif-wrapper"
            style="--notif-wrapper--height: 0; --notif-wrapper--margin-b: 0"
        >
            {#each toastsFlat as toast, index}
                <Toast 
                    _toast={ toast }
                    { index } 
                    length={ toastsLength } 
                /> 
            {/each}
        </div>
    {:else}
        {#each _toasts as category (category[0])}
            <div 
                class="notif-wrapper"
                style="--notif-wrapper--height: 0; --notif-wrapper--margin-b: 0"
            >
                {#each category[1] as toast, index (toast.id)}
                    <Toast 
                        _toast={ toast }
                        { index }
                        length={ category[1].length }
                    /> 
                {/each}
            </div>
        {/each}
    {/if}
</div>

<style>
.notif-center {
    z-index: 1000;
    padding: 5px 15px;
    display: flex;
    flex-direction: column-reverse;
}
.screen__notif-center {
    position: absolute;
    top: 2rem;
    right: 0;
    width: 280px;
}
.notif-center--hidden {
    display: none;
}
.notif-wrapper {
    position: relative;
    height: var(--notif-wrapper--height);
    margin-bottom: var(--notif-wrapper--margin-b);
    display: grid;
    transition: height 320ms ease, margin 320ms ease;
}

@media (max-width: 1280px) {
    .screen__notif-center {
        position: absolute;
        top: 0;
        padding-top: 3.5rem;
        width: 100%;
    }
}
</style>
