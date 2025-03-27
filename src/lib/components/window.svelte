<script lang="ts">
import { isResponsive } from '$lib/store';
import { onDestroy, onMount } from 'svelte';
import appWindow from '$lib/apps/window-management';
import appWindows from '$lib/apps/window-management/store';
import { apps } from '$lib/apps';
import type { App, AppSizeData } from '$lib/apps/types';
import WindowAction from './windowAction.svelte';

export let name: string;
export let appWindowId: string;
export let appInfos: App;
export let zIndex: number;

const MARGIN_FOR_RESIZE: number = 10;
const appInDock: boolean = apps.pc.dock.some(app => app.type === name)  

const defaultAppSizeData: AppSizeData = {
    minSize: {
        width: 25,
        height: 25,
    },
    resize: {
        x: true,
        y: true,
    }
}
const resizeBtns = [
    { axe: 'x', pos: 'left' },
    { axe: 'x', pos: 'right' },
    { axe: 'y', pos: 'top' },
    { axe: 'y', pos: 'bottom' },
]

let openWindow: HTMLDivElement;
let dekstop: HTMLElement | null;
let dekstopRect: DOMRect;


let isMouseDown: boolean = false;
let isFullyLoaded: boolean = false;

let mouseDownStartPos = { x: 0, y: 0 }

let appWindowPositions = { x: 0, y: 0 }
let appWindowPrevPositions = appWindowPositions;

let minSizes: AppSizeData['minSize'] = defaultAppSizeData.minSize;
let appWindowSizes = defaultAppSizeData.minSize;
let appWindowPrevSizes = appWindowSizes;

let resizeSides = { top: false, left: false, right: false, bottom: false }

$: lastAppWindowOpened = $appWindows[$appWindows.length - 1];

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
const round = (val: number): number => +val.toFixed(5);
const calculateSize = (min: number, isResize: boolean, multiplier: number) => isResize ? +(Math.min(75, min * multiplier)).toFixed(5) : min;
const calculatePos = (size: number, isResize: boolean) => isResize ? +(50 - Math.min(75, size) / 2).toFixed(5) : size;

onMount(() => {
    if ($isResponsive) return;

    dekstop = document.querySelector('.screen__desktop');
    if (dekstop) dekstopRect = dekstop.getBoundingClientRect();

    setTimeout(() => isFullyLoaded = true, 320)

    const appData = apps.pc.global.find(app => app.type === name) ?? defaultAppSizeData;

    const resize = appData.resize;
    if (minSizes !== appData.minSize) minSizes = appData.minSize;

    const id = $appWindows.filter(app => app.data.type === name).length;
    const appStorageSize = localStorage.getItem(`${name.toLowerCase()}-window-size`);
    const appStoragePos = localStorage.getItem(`${name.toLowerCase()}-window-position`);

    const size = appStorageSize ? 
        JSON.parse(appStorageSize) :
        {
            width: calculateSize(minSizes.width, resize.x, 1.75), 
            height: calculateSize(minSizes.height, resize.y, 2.75), 
        };
    const pos = appStoragePos ?
        JSON.parse(appStoragePos) :
        {
            x: calculatePos(size.width, resize.x),
            y: calculatePos(size.height, resize.y),
        };

    appWindowSizes  = {
        width: size.width,
        height: size.height,
    }
    appWindowPositions = {
        x: pos.x + id,
        y: pos.y + id,
    }
})
onDestroy(() => {
    const storageName: string = name.toLowerCase()

    localStorage.setItem(`${storageName}-window-position`, JSON.stringify(appWindowPositions));
    localStorage.setItem(`${storageName}-window-size`, JSON.stringify(appWindowSizes));
})

const calculateOffset = (e: MouseEvent) => {
    if (!dekstopRect) return { offsetX: 0, offsetY: 0 };

    const x: number = clamp(e.clientX, dekstopRect.left, dekstopRect.right);
    const y: number = clamp(e.clientY, dekstopRect.top, dekstopRect.bottom);

    const distanceX = x - mouseDownStartPos.x;
    const distanceY = y - mouseDownStartPos.y;

    return {
        offsetX: distanceX / dekstopRect.width * 100,
        offsetY: distanceY / dekstopRect.height * 100,
    }
}
const changeSize = (offset: number, side: 'left' | 'top') => {
    const direction: -1 | 1 = resizeSides[side] ? -1 : 1;
    const isAxisX: boolean = side === 'left';

    const axis: 'x' | 'y' = isAxisX ? 'x' : 'y';
    const dimension: 'width' | 'height' = isAxisX ? 'width' : 'height';

    const min: number = minSizes[dimension];
    const size = Math.max(min, round(appWindowPrevSizes[dimension] + offset * direction));

    appWindowSizes[dimension] = size;

    if (resizeSides[side] && size > min) {
        appWindowPositions[axis] = round(appWindowPrevPositions[axis] + offset);
    }
}
const updateSides = (e: MouseEvent, pos: string) => {
    const x = e.clientX;
    const rect = openWindow.getBoundingClientRect();

    resizeSides = {
        left: pos === 'left' || x < rect.left + MARGIN_FOR_RESIZE,
        right: pos === 'right' || x > rect.right - MARGIN_FOR_RESIZE,
        top: pos === 'top',
        bottom: pos === 'bottom',
    }
}

const changeCursorOnResizeMouseOver = (e: MouseEvent, side: string) => {
    if (isMouseDown || !dekstop) {
        return;
    };

    updateSides(e, side);
    const { top, left, right, bottom } = resizeSides;

    let cursor: string | null = null;
    
    if ((top && left) || (bottom && right)) {
        cursor = 'nwse';
    } else if ((top && right) || (bottom && left)) {
        cursor = 'nesw';
    } else if (left || right) {
        cursor = 'ew';
    } else if (top || bottom) {
        cursor = 'ns';
    }

    if (cursor) {
        dekstop.style.cursor = cursor + '-resize';
    }
}
const resetCursorOnResizeMouseOver = () => {
    if (isMouseDown || !dekstop) {
        return;
    }

    dekstop.style.removeProperty('cursor');
    resizeSides = {
        top: false,
        left: false,
        right: false,
        bottom: false,
    }
}

const startResizeOnMouseDown = (e: MouseEvent) => {
    isMouseDown = true;

    mouseDownStartPos = {
        x: e.clientX,
        y: e.clientY,
    };
    appWindowPrevSizes = {
        width: appWindowSizes.width,
        height: appWindowSizes.height,
    };
    appWindowPrevPositions = {
        x: parseFloat(openWindow.style.getPropertyValue('--left')),
        y: parseFloat(openWindow.style.getPropertyValue('--top')),
    }

    window.addEventListener('mousemove', resizeOnMouseMove);
    window.addEventListener('mouseup', stopResizeOnMouseUp);
}
const resizeOnMouseMove = (e: MouseEvent) => {
    const { offsetX, offsetY } = calculateOffset(e);

    const isResiseX: boolean = resizeSides.left || resizeSides.right;
    const isResiseY: boolean = resizeSides.top || resizeSides.bottom;

    if (isResiseX) {
        changeSize(offsetX, 'left');
    };
    if (isResiseY) {
        changeSize(offsetY, 'top');
    };
}
const stopResizeOnMouseUp = () => {
    isMouseDown = false;

    window.removeEventListener('mousemove', resizeOnMouseMove);
    window.removeEventListener('mouseup', stopResizeOnMouseUp);

    localStorage.setItem(`${name.toLowerCase()}-window-size`, JSON.stringify(appWindowSizes));
}

const handleClose = () => {
    const isFullscreen: boolean = openWindow.dataset.fullscreen !== undefined 
    if (isFullscreen) appWindow.fullscreen(appWindowId);

    appWindow.close(appWindowId);
}
</script>

<div 
    bind:this={ openWindow } 
    data-window-id={ appWindowId }
    class="app {$isResponsive ? 'app--version-mobile' : 'app--version-pc'}"
    class:app--transition={ !$isResponsive && !isMouseDown && isFullyLoaded }
    style:z-index={ zIndex }
    style="{ !$isResponsive ? `--left: ${appWindowPositions.x}%; --top: ${appWindowPositions.y}%; --width: ${appWindowSizes.width}%; --height: ${appWindowSizes.height}%;` : '' }"
> 
    {#if !$isResponsive}
        <div class="app__action action">
            <button 
                class='action__btn action__btn--close' title="Fermer" on:click={ handleClose }></button>
            <button class="action__btn action__btn--reduce" class:action__btn--desactivated={ !appInDock } title="Réduire" on:click={() => appWindow.reduce(appWindowId, name)}></button>
            <button class="action__btn action__btn--fullscreen" title="Plein Écran" on:click={() => appWindow.fullscreen(appWindowId)}></button>
        </div>
    {/if}
    <WindowAction 
        bind:mouseDownStartPos
        bind:appWindowPositions 
        bind:isMouseDown
        { appInfos }
        { appWindowId }
        { calculateOffset }
        { round }
    />
    {#if !$isResponsive && lastAppWindowOpened?.id === appWindowId}
        {#each resizeBtns as { axe, pos }}
            <button 
                class="app__resize app__resize--axe-{axe} app__resize--pos-{pos}"
                on:mousemove={(e) => changeCursorOnResizeMouseOver(e, pos) }
                on:mouseleave={ resetCursorOnResizeMouseOver }
                on:mousedown={ startResizeOnMouseDown }
            ></button> 
        {/each}
    {/if}
</div>

<style>
.app {
    --nav-height: 2rem;
    position: absolute;
}
.app:global([data-fullscreen]) {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #1b1b1b;
}
.app:global([data-reduce]) {
    transition-property: left, top, scale, visibility;
    left: var(--reduce-left);
    top: var(--reduce-top);
    scale: var(--reduce-scale);
    visibility: hidden;
}
.app:global([data-fullscreen]) .action__btn--reduce {
    --btn-color: #7c7c7c33;
    cursor: default;
}
.app--transition {
    transition-property: left, top, width, height, scale, background-color;
    transition-duration: 320ms;
    transition-timing-function: ease;
}
.app--version-pc {
    width: var(--width);
    height: var(--height);
    top: var(--top);
    left: var(--left);
    outline: 1px solid black;
    border-radius: .4rem;
}
.app--version-mobile {
    width: 100%;
    height: 100%;
    inset: 0;
}
.app__resize {
    --size: 10px;
    --placement-minus: -6px;
    position: absolute;
    z-index: 1000;
    cursor: inherit;
}
.app__resize--axe-y {
    width: calc(100% + var(--size));
    height: var(--size);
    left: 50%;
    transform: translateX(-50%);
}
.app__resize--axe-x {
    width: var(--size);
    height: 100%;
    top: 0;
}
.app__resize--pos-top {
    top: var(--placement-minus);
}
.app__resize--pos-bottom {
    bottom: var(--placement-minus);
}
.app__resize--pos-left {
    left: var(--placement-minus);
}
.app__resize--pos-right {
    right: var(--placement-minus);
}
.app__overlay {
    width: 100%;
    height: 100%;
    z-index: 1000;
    background: transparent;
    border: none;
    outline: none;
    position: absolute;
    top: 0;
    left: 0;
}
.app--reduce-transi {
    top: var(--reduce-top);
    left: var(--reduce-left); 
    transform: scale(var(--scale));
}
.app--reduced {
    position: relative;
    top: 0;
    left: 0;
    transform: scale(.1);
    width: 100%;
    height: 100%;
    transform-origin: center;
}
.action {
    display: flex;
    align-items: center;
}
.app__action {
    position: absolute;
    top: calc(var(--nav-height) / 2);
    transform: translateY(-50%);
    left: 8px;
    gap: 4px;
    z-index: 999;
}
.action__btn {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #7c7c7c33;
}
.app:focus-within {
    box-shadow: 0 0 1rem 0 var(--color-shadow);
}
.app:focus-within .action__btn {
    background-color: var(--btn-color);
}
.action__btn--fullscreen {
    --btn-color: var(--color-btn-fullscreen);
}
.action__btn--fullscreen:hover {
    background-color: var(--color-btn-fullscreen);
}
.action__btn--reduce {
    --btn-color: var(--color-btn-reduce);
}
.action__btn--reduce:hover {
    background-color: var(--color-btn-reduce);
}
.action__btn--close {
    --btn-color: var(--color-btn-close);
}
.action__btn--close:hover {
    background-color: var(--color-btn-close);
}
.action__btn--desactivated {
    --btn-color: #7c7c7c33;
    pointer-events: none;
}
</style>
