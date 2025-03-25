<script lang="ts">
import { onMount, type SvelteComponent } from "svelte";
import Finder from "./finder.svelte";
import Mail from "./mail.svelte";
import Safari from "./safari.svelte";
import Music from "./music.svelte";
import Contacts from "./contacts.svelte";
import Preview from "./preview.svelte";
import Notes from "./notes.svelte";
import appWindow from "$lib/apps/window-management";
import { isResponsive } from "$lib/store";
import { apps } from "$lib/apps";
import type { AppSizeData } from "$lib/apps/types";

type Conponent = {
    name: any,
    props: Record<string, unknown> | null,
}
type Propertie = {
    name: string,
    value: string,
}

export let appInfos: any;
export let appWindowId: string;
export let isFullScreen: boolean;
export let defaultAppSizeData: AppSizeData;
export let defaultAppSizeMultiplier: { x: number, y: number };

const { name, path, dirName, img_id } = appInfos;

const components: Record<string, Conponent> = {
    Finder: {
        name: Finder,
        props: { finderPath: path },
    },
    Mail: {
        name: Mail,
        props: null,
    },
    Safari: {
        name: Safari,
        props: { dirName },
    },
    Music: {
        name: Music,
        props: null,
    },
    Contacts: {
        name: Contacts,
        props: null,
    },
    Preview: {
        name: Preview,
        props: { dirName, img_id },
    },
    Notes: {
        name: Notes,
        props: null,
    },
}

const currComponent = components[name];

let mouseDownStartPos = {
    x: 0,
    y: 0,
}
let appWindowPrevPositions = {
    x: 0,
    y: 0,
}

let self: HTMLButtonElement;
let parent: HTMLDivElement | null;

const MARGIN_FOR_MOVE: number = 32;

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
const round = (val: number): number => +val.toFixed(5);

let isMoving: boolean = false;

const moveMouseDown = (e: MouseEvent) => {
    if (!parent) {
        return;
    }

    const appWindowRect = parent.getBoundingClientRect()
    isMoving = e.clientY <= appWindowRect.y + MARGIN_FOR_MOVE; 

    setTimeout(() => {
        const windowIsFocused: boolean = document.activeElement === self;

        if (!parent || isFullScreen || $isResponsive || !isMoving || !windowIsFocused) {
            return;
        };

        mouseDownStartPos = {
            x: e.clientX,
            y: e.clientY,
        };
        appWindowPrevPositions = {
            x: parseFloat(parent.style.getPropertyValue('--left')),
            y: parseFloat(parent.style.getPropertyValue('--top')),
        };

        window.addEventListener('mousemove', moveMouseMove);
        window.addEventListener('mouseup', moveMouseUp);
    })
}
const moveMouseMove = (e: MouseEvent) => {
    if (!desktop) {
        return;
    }

    const x: number = clamp(e.clientX, desktopRect.left, desktopRect.right);
    const y: number = clamp(e.clientY, desktopRect.top, desktopRect.bottom);

    const distanceX = x - mouseDownStartPos.x;
    const distanceY = y - mouseDownStartPos.y;

    const offsetX = distanceX / desktopRect.width * 100;
    const offsetY = distanceY / desktopRect.height * 100;

    if (!parent) {
        return;
    }

    const roundX = round(appWindowPrevPositions.x + offsetX);
    const roundY = Math.max(0, round(appWindowPrevPositions.y + offsetY));

    const properties: Propertie[] =  [
        { name: '--left', value: `${roundX}%` },
        { name: '--top', value: `${roundY}%` },
    ]
    changeProperty(parent, properties);
}
const moveMouseUp = () => {
    window.removeEventListener('mousemove', moveMouseMove);
    window.removeEventListener('mouseup', moveMouseUp);

    if (!parent) {
        return;
    }

    const storage = {
        x: parseFloat(parent.style.getPropertyValue('--left')),
        y: parseFloat(parent.style.getPropertyValue('--top')),
    }
    localStorage.setItem(`${name.toLowerCase()}-window-position`, JSON.stringify(storage));
}

const changeProperty = (element: HTMLElement, properties: Propertie[]) => {
    properties.forEach(p => {
        element.style.setProperty(p.name, p.value); 
    })
}
const calculateSize = (size: number, isResize: boolean, multiplier: number) => isResize ? +(50 - (size * multiplier) / 2).toFixed(5) : size;

let desktop: HTMLDivElement | null;
let desktopRect: DOMRect;

onMount(() => {
    const sameTypeAppWindows = document.querySelectorAll(`[data-app-name=${name}]`);
    const id = sameTypeAppWindows ? sameTypeAppWindows.length : 0;

    desktop = document.querySelector('.screen__desktop');
    parent = document.querySelector(`[data-app-window-id="${appWindowId}"]`)
    
    if (desktop) {
        desktopRect = desktop.getBoundingClientRect();
    }

    const appData = apps.pc.global.find(app => app.type === name) ?? defaultAppSizeData;
    const appStoragePos = localStorage.getItem(`${name.toLowerCase()}-window-position`);
    const appStorageSize = localStorage.getItem(`${name.toLowerCase()}-window-size`);

    const sizes = appStorageSize ? JSON.parse(appStorageSize) : appData.minSize;
    const resize = appData.resize;

    const pos = appStoragePos ?
        JSON.parse(appStoragePos) :
        {
            x: calculateSize(sizes.width, resize.x, defaultAppSizeMultiplier.x),
            y: calculateSize(sizes.height, resize.y, defaultAppSizeMultiplier.y),
        };

    const properties: Propertie[] = [
        { name: '--left', value: `${pos.x + id}%` },
        { name: '--top', value: `${pos.y + id}%` },
    ]
    if (parent) {
        changeProperty(parent, properties);
    }
})
</script>

<button 
    bind:this={ self }
    class="app__container"
    on:focusin={() => appWindow.focus(appWindowId)}
    on:mousedown={ moveMouseDown }
>
    {#if currComponent}
        <svelte:component this={currComponent.name} {...currComponent.props} /> 
    {/if}
</button>

<style>
.app__container {
    width: 100%;
    height: 100%;
    text-align: start;
    cursor: default;
}
</style>
