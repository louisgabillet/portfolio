<script lang="ts">
import { isResponsive } from "$lib/store";
import Svg from "./svg.svelte";
import Img from "./img.svelte";
import type { App } from "$lib/apps/types";
import appWindows from "$lib/apps/window-management/store";
import type { FileChildren } from "$lib/filesystem";

export let app: App & { children?: FileChildren[] };
export let action: () => void;
export let dock: boolean = false;
export let bold: boolean = false;

const alwaysOpen: string[] = ['Finder', 'Music'];

$: tag = isOutsideLink ? 'a' : 'div';
$: link_attr = isOutsideLink && app?.url ? { href: app?.url, target: '_blank' } : {};
$: appNameAttr = dock ? { 'data-app-name': app.type } : {};

$: isOutsideLink = app.type === 'Link';
$: isDesactivated= app?.desactivated;
$: isOpen = !app?.shortcut && (alwaysOpen.indexOf(app.type) !== -1 || $appWindows.some(w => w.data.type === app.type)); 

const actionHandler = () => {
    if (isOutsideLink || isDesactivated) return;
    action();
}
</script>


<svelte:element 
    this={tag} 
    {...link_attr}  
    class="shortcut"  
    class:shortcut--desactivated={ isDesactivated }
    class:dock__shortcut={ dock }
    {...appNameAttr}  
>
    {#if $isResponsive || dock}
        <button 
            class="shortcut__btn"
            on:click={ actionHandler }
        > 
            <Img
                width={$isResponsive ? "80" : "50"}
                src={app.src}
                alt="Icône '{app.type}'"
            />
        </button>
        <button class="shortcut__btn" on:click={ actionHandler }> 
            {#if dock && !$isResponsive}
                <span class="shortcut__dot" style="{isOpen ? '' : 'display: none'}"></span>
            {:else if !dock}
                <span class="shortcut__text-overflow">
                    <span title="{app.name}" class="shortcut__name" class:shortcut__name--color-blue={ tag === 'a' }> 
                        {app.name}
                    </span>
                </span>
            {/if}
        </button>
        {#if app.type === 'Folder'}
            <p class="shortcut__p">{app.children?.length ?? 0} élément{app.children? 's' : ''}</p>
        {/if}
    {:else}
        <button class="shortcut__btn shortcut__btn--focus"
            on:dblclick={ actionHandler }
        > 
            <Img
                width="50"
                src={app.src}
                alt="Icône '{app.type}'"
            />
            {#if app?.shortcut}
                <span class="shortcut__icon">
                    <Svg name='arrowshape_turn_up_right_fill' color='#000' />
                </span>
            {/if}
        </button>
        <button class="shortcut__btn" on:dblclick={ actionHandler }> 
            <span class="shortcut__text-overflow">
                {#if bold}
                    <b title="{app.name}" class="shortcut__name shortcut__name--focus shortcut__name--bold" class:shortcut__name--color-blue={ tag === 'a' }> 
                        {app.name}
                    </b>
                {:else} 
                    <span title="{app.name}" class="shortcut__name shortcut__name--focus" class:shortcut__name--color-blue={ tag === 'a' }> 
                        {app.name}
                    </span>
                {/if}
            </span>
        </button>
    {/if}
</svelte:element>


<style>
.shortcut__icon :global(> svg) {
    stroke: white;
    stroke-width: 1px;
}
.shortcut {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    overflow-wrap: break-word;
    overflow: hidden;
    padding: 1px;
}
.shortcut--desactivated {
    pointer-events: none; 
    opacity: .4;
}
.dock__shortcut {
    gap: 0;
    position: relative;
    overflow: visible;
}
.shortcut__btn {
    position: relative;
    border-radius: 2px;
    text-shadow: 0 1px 1px var(--color-shadow);
}
.shortcut__btn:last-of-type {
    width: auto;
    max-width: 100%;
}
.shortcut__name {
    display: inline;
    font-size: var(--fz-s);
    color: #fff;
}
.shortcut__name--color-blue {
    color: #0A82FF;
}
.shortcut__name--bold {
    font-weight: 600;
}
.shortcut__p {
    font-size: var(--fz-m);
    color: #7c7c7c;
}
.shortcut__text-overflow {
    overflow: hidden;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.shortcut__icon {
    width: 10px;
    height: 7px;
    position: absolute;
    bottom: 5%;
    left: 0;
    transform: rotate(-35deg)
}
.shortcut__dot {
    display: block;
    width: 3px;
    aspect-ratio: 1/1;
    background-color: #7C7C7C;
    border-radius: 50%;
}

.shortcut:focus-within .shortcut__btn--focus {
    box-shadow: 0 0 0px 1px #4D4D4D;
    background-color: #0000002E;
}
.shortcut:focus-within .shortcut__name--focus {
    background: var(--dark-selection-focused);
    color: white;
}

@media (max-width: 1280px) {
    .shortcut__name {
        font-size: var(--fz-l);
    }
}
</style>
