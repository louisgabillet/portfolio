<script lang="ts">
import { type SvelteComponent } from "svelte";
import Finder from "./finder.svelte";
import Mail from "./mail.svelte";
import Safari from "./safari.svelte";
import Music from "./music.svelte";
import Contacts from "./contacts.svelte";
import Preview from "./preview.svelte";
import Notes from "./notes.svelte";
import appWindow from "$lib/apps/window-management";
import { isResponsive } from "$lib/store";
import type { App } from "$lib/apps/types";

export let mouseDownStartPos: { x: number, y: number };
export let appWindowPositions: { x: number, y: number };
export let desktop: HTMLElement | null;
export let appWindowData: App;
export let appWindowId: string;
export let isMouseDown: boolean;
export let calculateOffset: (e: MouseEvent, rect: DOMRect | null) => { offsetX: number, offsetY: number };
export let round: (val: number) => number;

const MARGIN_FOR_MOVE: number = 32;
const { type, props } = appWindowData;

const components: Record<string, any> = {
    Finder,
    Mail,
    Safari,
    Music,
    Contacts,
    Preview,
    Notes,
}
const currComponent = components[type];

let self: HTMLButtonElement;
let desktopRect: DOMRect | null = null;
let appWindowPrevPositions = { x: 0, y: 0 }

const startMoveOnMouseDown = (e: MouseEvent) => {
    const rect: DOMRect = self.getBoundingClientRect()
    const isMoving: boolean = e.clientY <= rect.y + MARGIN_FOR_MOVE; 
    
    setTimeout(() => {
        const windowIsFocused: boolean = document.activeElement === self;
        const screen: HTMLElement | null = document.querySelector('.device__screen[data-fullscreen]');
        const alreadyFullscreen: boolean = screen ? screen.dataset.fullscreen !== undefined : false;

        if (alreadyFullscreen || $isResponsive || !isMoving || !windowIsFocused) {
            return;
        };

        isMouseDown = true;

        mouseDownStartPos = {
            x: e.clientX,
            y: e.clientY,
        };
        appWindowPrevPositions = {
            x: appWindowPositions.x,
            y: appWindowPositions.y,
        };

        if (desktop) desktopRect = desktop.getBoundingClientRect();

        window.addEventListener('mousemove', moveOnMouseMove);
        window.addEventListener('mouseup', stopMoveOnMouseUp);
    })
}
const moveOnMouseMove = (e: MouseEvent) => {
    const { offsetX, offsetY } = calculateOffset(e, desktopRect);

    appWindowPositions = {
        x: round(appWindowPrevPositions.x + offsetX),
        y: Math.max(0, round(appWindowPrevPositions.y + offsetY)),
    }
}
const stopMoveOnMouseUp = () => {
    isMouseDown = false;

    window.removeEventListener('mousemove', moveOnMouseMove);
    window.removeEventListener('mouseup', stopMoveOnMouseUp);

    localStorage.setItem(`${type.toLowerCase()}-window-position`, JSON.stringify(appWindowPositions));
}

const onKeyDown = (e: KeyboardEvent) => {
    const { ctrlKey, shiftKey, code } = e;
    const isFullscreen: Element | null = self.closest('[data-fullscreen]');

    if ($isResponsive || !ctrlKey || !shiftKey) return;

    switch (code) {
        case 'KeyA':
            if (isFullscreen) {
                appWindow.fullscreen(appWindowId);
            };
            appWindow.close(appWindowId);
            break;
        case 'KeyR':
            appWindow.reduce(appWindowId, type);
            break;
        case 'KeyF':
            appWindow.fullscreen(appWindowId);
            break;
        default:
            break;
    }
}
</script>

<button 
    bind:this={ self }
    class="app__container"
    data-app-window-id={ appWindowId }
    on:focusin={() => appWindow.focus(appWindowId)}
    on:mousedown={ startMoveOnMouseDown }
    on:keydown={ onKeyDown }
>
    {#if currComponent}
        <svelte:component this={currComponent} {...props} /> 
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
