<script lang="ts">
import { globalWindowOrder, isResponsive } from "$lib/index";
import type { FileSystem } from "$lib/filesystem";
import Svg from "./svg.svelte";
import Img from "./img.svelte";
import type { App } from "$lib/apps/types";
import { Image } from "@unpic/svelte";

export let app: App & { outside_link: string };
export let action: () => void;
export let dock: boolean = false;
export let bold: boolean = false;

const alwaysOpen: string[] = ['Finder', 'Music'];

$: isOutsideLink = app?.outside_link;
$: isDesactivated= app?.desactivated;
$: tag = isOutsideLink ? 'a' : 'div';
$: link_attr = {
    href: app?.url,
    target: '_blank',
}

const actionHandler = () => {
    if (isOutsideLink || isDesactivated) return;
    action();
}

$: isOpen = (app: FileSystem) => {
    const { type, shortcut } = app;

    if (shortcut) return false;

    const indexAlwaysOpen = alwaysOpen.indexOf(type);
    if (indexAlwaysOpen !== -1) return true;

    return $globalWindowOrder?.some(el => el.includes(type)); 
}
</script>


<svelte:element 
    this={tag} 
    {...(isOutsideLink && app?.url ? {...link_attr} : {})}  
    class="shortcut"  
    class:shortcut--desactivated={ isDesactivated }
    class:dock__shortcut={ dock }
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
            <!--<img src='https://res.cloudinary.com/dejb4brmy/image/upload/f_auto/q_auto/w_auto/portfolio/images/{app.src}' alt="" style="visibility: {isImgLoaded ? 'visible' : 'hidden'};" on:load={() => isImgLoaded = true }>-->
            <!--<Image
                src={`https://res.cloudinary.com/dejb4brmy/image/upload/portfolio/images/${app.src}`}
                width={160}
                height={160}
                alt={app.app_name}
            />-->
        </button>
        <button class="shortcut__btn" on:click={ actionHandler }> 
            {#if dock && !$isResponsive}
                <span class="shortcut__dot" style="{isOpen(app) ? '' : 'display: none'}"></span>
            {:else if !dock}
                <span class="shortcut__text-overflow">
                    <span title="{app.name}" class="shortcut__name" class:shortcut__name--color-blue={ tag === 'a' }> 
                        {app.name}
                    </span>
                </span>
            {/if}
        </button>
        {#if app?.type === 'Folder'}
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
            <!--<img src='https://res.cloudinary.com/dejb4brmy/image/upload/f_auto/q_auto/w_auto/portfolio/images/{app.src}' alt="" style="visibility: {isImgLoaded ? 'visible' : 'hidden'};" on:load={() => isImgLoaded = true }>-->
            <!--<Image
                src={`https://res.cloudinary.com/dejb4brmy/image/upload/w_auto/portfolio/images/${app.src}`}
                width={100}
                height={100}
                alt={app.app_name}
                unstyled
                />-->
            {#if app?.shortcut}
                <span class="icon shortcut__icon">
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
