<script lang="ts">
import { isResponsive } from '$lib/store';
import { onDestroy, onMount } from 'svelte';
import Safari from './safari.svelte';
import Notes from './notes.svelte';
import Mail from './mail.svelte';
import Finder from './finder.svelte';
import Music from './music.svelte';
import Contacts from './contacts.svelte';
import TextEdit from './textEdit.svelte';
import Preview from './preview.svelte';
import appWindow from '$lib/apps/window-management';
import appWindows from '$lib/apps/window-management/store';
	import { apps } from '$lib/apps';
//import Settings from './settings.svelte';

export let name: string;
export let appWindowId: string;
export let appInfos: any;

const { type, url, pages, preview_data, path, dirName, img_id } = appInfos;

interface AppsData {
    type: string,
    sizes: {
        minWidth: number,
        minHeight: number,
    },
    resize: {
        x: boolean,
        y: boolean,
    },
}
const defaultAppData: AppsData = {
    type: 'Default',
    sizes: {
        minWidth: 25,
        minHeight: 25,
    },
    resize: {
        x: true,
        y: true,
    }
}

$: appData = apps.pc.global.find(app => app.type === name) ?? defaultAppData;
$: sizes = appData.sizes;
$: ({ x: isResizeX, y: isResizeY } = appData.resize);
// HTML Elements
// let openWindow: HTMLElement;
let openWindow: HTMLElement;
let parent: HTMLElement | null;

let appWindowPositions = {
    x: 0,
    y: 0,
    previousX: 0,
    previousY: 0,
}
let appWindowSizes = {
    width: 0,
    height: 0,
    previousWidth: 0,
    previousHeight: 0,
}

const resizeBtns = [
    { axe: 'x', pos: 'left' },
    { axe: 'x', pos: 'right' },
    { axe: 'y', pos: 'top' },
    { axe: 'y', pos: 'bottom' },
]
// LocalStorage Elements
//$: storage = {pos:{x: pos?.percentX || 50, y: pos?.percentY || 50}, size: {width: size?.width || 50, height: size?.height || 50}};
$: storage = { 
    pos: {
        x: percentX,
        y: percentY,
    },
    size: {
        width: width,
        height: height, 
    }
};
$: getStorageString = localStorage.getItem(name);
//$: getStorage = getStorageString ? JSON.parse(getStorageString) : {pos:{x: 25, y: 25}, size: {width: 50, height: 50}};
$: defaultSize = {
    width: sizes.minWidth,
    height: sizes.minHeight //+ (isResizeY ? 10 : 0),
}
const calculateSize = (value: number, isResize: boolean) => isResize ? (100 - value) / 2 + value : value;

$: getStorage = getStorageString ?
    JSON.parse(getStorageString) :
    {
        pos: {
            //x: 25, //parent ? (parent.offsetWidth / 2) - (defaultSize.width / 2) : 0,
            //y: 25, //parent ? (parent.offsetHeight / 2) - (defaultSize.height / 2) : 0,
            x: (100 - calculateSize(sizes.minWidth, isResizeX)) / 2, 
            y: (100 - calculateSize(sizes.minHeight, isResizeY)) / 2, 
        },
        size: {
            width: calculateSize(sizes.minWidth, isResizeX), 
            height: calculateSize(sizes.minHeight, isResizeY), 
        }
    };
$: ({x: storageX, y: storageY} = getStorage.pos);
$: ({width: storageWidth, height: storageHeight} = getStorage.size);

// Props Elements
//$: zIndex = order?.indexOf(uniqueName) >= 0 ? order?.indexOf(uniqueName) : 0;
$: indexOfWindow = $appWindows.findIndex(w => w.id === appWindowId);
$: zIndex = indexOfWindow >= 0 ? indexOfWindow : 0;

// Conditions
let isMouseMove: boolean = false;
let isFullScreen: boolean = false;
$: isWindowMoving = isResizeSidesLength > 0 ? false : true;

// Values
// --- Static
const margin: number = 12;
// --- Dynamic
$: pos = {
    percentX: storageX, 
    percentY: storageY,
    previousX: storageX,
    previousY: storageY
};
$: size = {
    width: storageWidth,
    height: storageHeight,
    previousW: storageWidth,
    previousH: storageHeight,
};
let mousePos = {
    mouseXStart: 0,
    mouseYStart: 0
};
$: ({ mouseXStart, mouseYStart } = mousePos);
$: ({ percentX, percentY, previousX, previousY } = pos);
$: ({ width, height, previousW, previousH } = size);

let reduceX: number, 
    reduceY: number;
let activeSides: Record<string, boolean> = {left: false, top: false, right: false, bottom: false};
$: isResizeSides = Object.values(activeSides)?.filter((side) => side);
$: isResizeSidesLength = isResizeSides?.length;

let scale: number = 0;
let reduce: boolean = false;
//let uniqueName: string;
let id: number;
let isReduceTransi: boolean = false;
let isMouseDown: boolean = false;

let windowWidth: number = 0;

// Trigger based on condition
//$: if (isMouseMove) { openWindow?.classList.remove('transition') } else { openWindow?.classList.add('transition') };

// TODO -> Place code inside reactive ifs elsewhere so that we can remove it.
//$: if (openWindow && isResizeSidesLength === 0) { openWindow.addEventListener('mouseleave', resetCursor) } else if (openWindow) { openWindow.removeEventListener('mouseleave', resetCursor) };
//$: if (document.activeElement === openWindow && openWindow && !isFullScreen) { openWindow.addEventListener('mousemove', changeResizeCursor) } else if (openWindow) { openWindow.removeEventListener('mousemove', changeResizeCursor) }; 

onMount(() => {
    const appStorage = localStorage.getItem(`${name}-app-window`);
    const { pos, size } = appStorage ? 
        JSON.parse(appStorage)
        : {
            pos: {
                x: (100 - calculateSize(sizes.minWidth, isResizeX)) / 2, 
                y: (100 - calculateSize(sizes.minHeight, isResizeY)) / 2, 
            },
            size: {
                width: calculateSize(sizes.minWidth, isResizeX), 
                height: calculateSize(sizes.minHeight, isResizeY), 
            }
        };

    const { width, height } = size;
    const x = pos.x + id;
    const y = pos.y + id;

    appWindowPositions = {
        x,
        y,
        previousX: x,
        previousY: y,
    }
    appWindowSizes  = {
        width,
        height,
        previousWidth: width,
        previousHeight: height,
    }

    parent = document.querySelector('.screen__desktop');

    const sameTypeAppWindows = document.querySelectorAll(`[data-app-name=${name}]`);
    id = sameTypeAppWindows ? sameTypeAppWindows.length : 0;
    //uniqueName = `${name}-${id}`;
    //const window = document.querySelector(`.app-window[data-app-name=${name}-${uniqueID}`) as HTMLDivElement;
    //openWindow?.focus({ preventScroll: true });
    //window.addEventListener('mousemove', changeResizeCursor)
    pos.percentX = percentX + id;
    pos.percentY = percentY + id;
    pos.previousX = previousX + id;
    pos.previousY = previousY + id;
})
onDestroy(() => {
    if (!openWindow) return;
    openWindow.removeEventListener('mousemove', changeResizeCursor)
    localStorage.setItem(`${name}-app-window`, JSON.stringify(storage));
})

const onMouseDown = (e: MouseEvent) => {
    if (isFullScreen || $isResponsive || !openWindow) {
        return;
    };

    if (!isWindowMoving) {
        e.stopPropagation();
    }

    const rect = openWindow.getBoundingClientRect();
    mousePos = { mouseXStart: e.clientX, mouseYStart: e.clientY};

    setTimeout(() => {
        const marginForMove = 32 + 6 // 2rem + padding(4px) + border(2px);
        const isTargetResize = (e.target as HTMLElement)?.classList.contains('app__resize');
        const isAppWindowFocused = openWindow === document.activeElement; 
        const canMoveAppWindow = mouseYStart <= rect?.top + marginForMove;

        if ((!canMoveAppWindow || !isAppWindowFocused) && !isTargetResize) return;

        isMouseDown = true;
        window.addEventListener('mousemove', mouseMoveHandler)
        window.addEventListener('mouseup', mouseUpHandler)
    })
}
const onKeyDown = (e: KeyboardEvent) => {
    const { ctrlKey, code } = e;

    if ($isResponsive || !ctrlKey) {
        return;
    }

    switch (code) {
        case 'KeyA':
            if (isFullScreen) {
                fullscreen()
            };
            appWindow.close(appWindowId);
            break;
        case 'Semicolon':
            reduceWindow();
            break;
        case 'KeyF':
            fullscreen();
            break;
        default:
            break;
    }
}

const mouseMoveHandler = (e: MouseEvent) => {
    requestAnimationFrame(()=> {
        if (!parent || !openWindow || !isMouseDown) {
            return; 
        };

        const round = (nbr: number) => +nbr.toFixed(5);

        // TODO -> Need to make the limit more precise (exceeds a bit).
        const parentRect = parent.getBoundingClientRect();
        const x: number = checkIfMouseLeave(e, parentRect)?.x ?? 0,
              y: number = checkIfMouseLeave(e, parentRect)?.y ?? 0;
        const parentWidth = parent.offsetWidth,
              parentHeight = parent.offsetHeight;

        const offsetX = ((mouseXStart - x) * -1) / parentWidth * 100,
              offsetY = ((mouseYStart - y) * -1) / parentHeight * 100;
        const pX = previousX + offsetX,
              pY = previousY + offsetY;

        isMouseMove = (mouseXStart != x) || (mouseYStart != y); 
        if (!isWindowMoving) {
            const isLeftSide = activeSides?.left,
                  isTopSide = activeSides?.top;

            const reverseOffsetX = isLeftSide ? offsetX * -1 : offsetX,
                  reverseOffsetY = isTopSide ? offsetY * -1 : offsetY;

            const pW = previousW + reverseOffsetX, //Math.round(previousW + reverseOffsetX),
                  pH = previousH + reverseOffsetY; //Math.round(previousH + reverseOffsetY);

            const minWidth = pW >= sizes.minWidth,
                  minHeight = pH >= sizes.minHeight;

            if (minWidth && isResizeX) {
                if (isLeftSide) pos.percentX = round(pX);
                if (activeSides?.left || activeSides?.right) size.width = round(pW);
            }
            if (minHeight && isResizeY) {
                if (isTopSide) pos.percentY = round(pY);
                if (activeSides?.top || activeSides?.bottom) size.height = round(pH);
            }

        } else {
            pos.percentX = round(pX); //Math.round(pX);
            pos.percentY = pY <= 0 ? 0 : round(pY); //pY <= 0 ? 0 : Math.round(pY);
        }
    })
};
const mouseUpHandler = (e: MouseEvent) => {
    if (!openWindow) {
        return;
    };

    isMouseDown = false;
    isResizeSidesLength = 0;
    activeSides = {left: false, top: false, right: false, bottom: false};

    window.removeEventListener('mousemove', mouseMoveHandler);
    window.removeEventListener('mouseup', mouseUpHandler);

    if (parent && isMouseMove) {
        localStorage.setItem(`${name}-app-window`, JSON.stringify(storage));
        pos.previousX = percentX;
        pos.previousY = percentY;

        if (!isWindowMoving) {
            size.previousW = width;
            size.previousH = height;
        }

        isMouseMove = false;
        changeResizeCursor(e);
    }
}

const checkIfMouseLeave = (e: MouseEvent, bounds: DOMRect | undefined) => {
    if (!bounds) return;

    const clientX = e.clientX,
          clientY = e.clientY; 
    const left = clientX <= bounds?.left,
          right = clientX >= bounds?.right,
          top = clientY <= bounds.top,
          bottom = clientY >= bounds.bottom;
    
    const x = left ? bounds?.left : right ? bounds.right : clientX,
          y = top ? bounds.top : bottom ? bounds?.bottom : clientY;

    return {x, y};
}
const checkIfMouseResize = (e: MouseEvent, rect: any) => {
    const x = e?.clientX,
          y = e?.clientY;
    const sides = [
        { name: 'left', axe: x, above: false },
        { name: 'right', axe: x, above: true },
        { name: 'top', axe: y, above: false },
        { name: 'bottom', axe: y, above: true },
    ]
    let data: Record<string, boolean> = { left: false, right: false, top: false, bottom: false };
    sides.forEach(side => {
        data[side.name] = side.above ? 
            side.axe >= rect[side.name] - margin :
            side.axe <= rect[side.name] + margin  
    })
    return data;
}
let isCursorChanging: boolean = false
const resetCursor = () => {
    if (!isMouseDown) {
        const screen: HTMLElement|null = document.querySelector('.screen__desktop');
        activeSides = {left: false, top: false, right: false, bottom: false};
        isCursorChanging = false;
        window.removeEventListener('mousemove', changeResizeCursor);
        window.removeEventListener('mouseup', resetCursor);
        screen?.style.removeProperty('cursor');
    } else if (!isCursorChanging) {
        window.addEventListener('mousemove', changeResizeCursor);
        window.addEventListener('mouseup', resetCursor);
        isCursorChanging = true;
    }
}
const changeResizeCursor = (e: MouseEvent, pos: string = '') => {
    const isFocused = openWindow?.contains(document.activeElement);
    if (!isFocused || isFullScreen || reduce || $isResponsive) return;

    const screen: HTMLElement|null = document.querySelector('.screen__desktop');
    const x = e.clientX,
          y = e.clientY;
    const rect = openWindow?.getBoundingClientRect();

    if (!isMouseDown) {
        const isTop = pos === 'top';
        const isLeft = pos === 'left' || x < rect.left + 10;
        const isBottom = pos === 'bottom';
        const isRight = pos === 'right' || x > rect.right - 10;
        activeSides = { top: isTop, left: isLeft, bottom: isBottom, right: isRight }
        // TODO -> If nothing is clickable in the resize range, maybe remove the resize divs (using 'checkIfMouseResize').
        //
        // Solution: activeSides = checkIfMouseResize(e, rect) ?
        // Changes: - add padding on the app-window again.
        //          - add content div again for the border and outline.
    }
    const { top, left, bottom, right } = activeSides;

    const isAboveX = isMouseDown && mouseXStart > x,
          isBelowX = isMouseDown && mouseXStart < x,
          isAboveY = isMouseDown && mouseYStart > y,
          isBelowY = isMouseDown && mouseYStart < y; 

    const isWidthUnderMin = width <= sizes.minWidth,
          isHeightUnderMin = height <= sizes.minHeight;

    let sign: string = '';

    const isHorizontal = left || right;
    const isVertical = top || bottom;
    const isDiagoNESW = top && right || bottom && left;
    const isDiagoNWSE = top && left || bottom && right;

    if (isDiagoNESW && isResizeX && isResizeY) {
        if (isWidthUnderMin && isHeightUnderMin) {
            sign = top ? 'ne' : 'sw';
        } else {
            sign = (isAboveX && isBelowY) ? 'ne' : (isAboveY && isBelowX) ? 'sw' : 'nesw';
        }
    } else if (isDiagoNWSE && isResizeX && isResizeY) {
        if (isWidthUnderMin && isHeightUnderMin) {
            sign = top ? 'nw' : 'se';
        } else {
            sign = (isAboveX && isAboveY) ? 'se' : (isBelowX && isBelowY) ? 'nw' : 'nwse';
        }
    } else if (isHorizontal && isResizeX) {
        if (isWidthUnderMin) {
            sign = left ? 'w' : 'e';
        } else {
            sign = (isAboveX) ? 'e' : (isBelowX) ? 'w' : 'ew';
        }
    } else if (isVertical && isResizeY) {
        if (isHeightUnderMin) {
            sign = top ? 'n' : 's'
        } else {
            sign = (isAboveY) ? 's' : (isBelowY) ? 'n' : 'ns';
        }
    }
    if (sign && screen) screen.style.cursor = `${sign}-resize`
}

const fullscreen = () => {
    const classes: string[] = ['screen__background', 'desktop__icons-placement', 'desktop__dock'];

    classes.forEach(c => {
        const el = document.querySelector(`.${c}`);

        if (!el) {
            return;
        }

        if (isFullScreen) {
            el.classList.remove(`${c}--fullscreen`);
            return;
        }
        el.classList.add(`${c}--fullscreen`);

    })

    isFullScreen = !isFullScreen;
}
const addOrRemoveElDock = (isReduce: boolean, ratio: number, duration: number) => {
    const dock = document.querySelector('.desktop__dock');
    const animationOpen = [ {width: 0}, {width: 'var(--icon-size)'} ];
    const animationOpts = { duration: duration, fill: ('forwards' as any)};
    if (isReduce) {
        const el = openWindow?.closest('.reduced-page') as HTMLElement;
        if (!el) return;

        el.style.visibility = 'hidden';

        el.animate(animationOpen.reverse(), animationOpts)
        setTimeout(() => { el.remove() }, duration);

    } else {
        const newApp = document.createElement('div')
        const newAppChild = document.createElement('div')
        const newAppImg = document.createElement('img')
        if (!dock) return;

        newApp.animate(animationOpen, animationOpts)

        newApp.classList.add('reduced-page')
        newAppChild.classList.add(ratio >= 1 ? 'ratio-width' : 'ratio-height')
        newAppChild.style.setProperty('--ratio', ratio?.toString())
        newAppImg.src = `/src/lib/assets/images/icon/${name}.png`

        newApp.appendChild(newAppChild);
        dock?.insertBefore(newApp, dock?.lastElementChild);

        setTimeout(() => { newApp.appendChild(newAppImg) }, duration)
    }
}
// TODO -> Improve reduce for fluidity and optimisation / Correct existing bugs.
const reduceWindow = () => {
    const offX = openWindow?.offsetWidth, 
          offY = openWindow?.offsetHeight;
    const aspRatio = offX / offY;
    const duration = 320;
    addOrRemoveElDock(reduce, aspRatio, duration);
    if (reduce) {
        //const el = openWindow?.closest('.reduced-page');
        parent?.appendChild(openWindow);
        reduce = false;
        setTimeout(() => isReduceTransi = false )
        setTimeout(() => {
            openWindow?.focus();
            openWindow?.style?.removeProperty('transform-origin');
        }, duration)
    } else {
        scale = +(32 / (offX > offY ? offX : offY)).toFixed(2);
        const allReduced = document.querySelectorAll('.desktop__dock .reduced-page');
        //const lastEl = document.getElementById('dock')?.lastElementChild;
        const lastEl = allReduced?.[allReduced?.length - 1] ?? null;
        const rect = lastEl?.getBoundingClientRect();
        const parentRect = parent?.getBoundingClientRect();
        if (parentRect && rect) {
            reduceX = Math.round((rect?.left - openWindow?.offsetWidth / 2) - parentRect?.left);
            reduceY = Math.round((rect?.top - openWindow?.offsetHeight / 2.25) - parentRect?.top);
        }
        isReduceTransi = true;
        setTimeout(() => {
            reduce = true;
            lastEl?.firstChild?.appendChild(openWindow);
        }, duration)
    }

    

    //const reducePos = document.getElementById('dock')?.lastElementChild?.getBoundingClientRect();
    //const parentRect = parent?.getBoundingClientRect();
    //console.log(reducePos, document?.getElementById('dock'));
    //if (reducePos && parentRect) {
    //    reduceX = reducePos?.left - parentRect?.left;
    //    reduceY = reducePos?.top - parentRect?.top;
    //}
}
// TODO -> Rework on transition.
let isTransitionActive: boolean = false;
$: if (isFullScreen || isReduceTransi) {
    isTransitionActive = true;
} else if (isTransitionActive) {
    setTimeout(() => {
        isTransitionActive = false
    }, 320)
}
interface Component {
    name: any;
    props: Record<string, any> | null,
}
const components: Record<string, Component> = {
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
    TextEdit: {
        name: TextEdit,
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
</script>


<svelte:window bind:innerWidth={windowWidth}/>
<div bind:this={openWindow} 
    class="app {$isResponsive ? 'app--version-mobile' : 'app--version-pc'}"
    data-app-name={name}
    data-app-window-id={appWindowId}
    class:app--transition={ isTransitionActive }
    class:app--fullscreen={ isFullScreen }
    class:app--reduced={ reduce }
    class:app--reduce-transi={ isReduceTransi }
    style="z-index: {zIndex}; {$isResponsive ? '' : `--width: ${width}%; --height: ${height}%; --top: ${percentY}%; --left: ${percentX}%; ${isReduceTransi ? `--reduce-top: ${reduceY}px; --reduce-left: ${reduceX}px; --scale: ${scale}` : ''}`}"
    role="button" 
    tabindex="0" 
    on:focusin={() => appWindow.focus(appWindowId)}
    on:pointerdown={ (e) => onMouseDown(e)}
    on:keydown={ (e) => onKeyDown(e)}
> 
    {#if reduce}
        <button class="app__overlay" on:click={() => { reduceWindow() }}></button> 
    {/if}
    {#if !$isResponsive}
        <div class="app__action action">
            <button class='action__btn action__btn--close' on:click={() => appWindow.close(appWindowId)}></button>
            <!--<button id={!isFullScreen ? 'reduce-btn desactivated' : 'desactivated'} on:click={() => { reduceWindow() }}></button>-->
            <button class="action__btn action__btn--reduce action__btn--desactivated" on:click={() => { reduceWindow() }}></button>
            <button class="action__btn action__btn--fullscreen" on:click={() => { fullscreen() }}></button>
        </div>
    {/if}
    {#if currComponent}
       <svelte:component this={currComponent.name} {...currComponent.props} /> 
    {/if}
    {#if !$isResponsive}
        {#each resizeBtns as {axe, pos}}
            <button class="app__resize app__resize--axe-{axe} app__resize--pos-{pos}"
                on:mousemove={(e) => { if (!isCursorChanging) changeResizeCursor(e, pos) }}
                on:mouseleave={resetCursor}
                on:focus={() => {}}
            ></button> 
        {/each}
    {/if}
</div>

<style>
.app {
    --padding: 0px;
    --nav-height: 2rem;
    position: absolute;
}
.app--version-pc {
    padding: var(--padding);
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
.app--transition {
    transition: all 320ms ease; 
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
.app--fullscreen {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
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
.action__btn--close:hover {
    background-color: var(--color-btn-close);
}
.action__btn--reduce:hover {
    background-color: var(--color-btn-reduce);
}
.action__btn--fullscreen:hover {
    background-color: var(--color-btn-fullscreen);
}
.app:focus,
.app:focus-within {
    box-shadow: 0 0 1rem 0 var(--color-shadow);
}
.app:focus .action__btn,
.app:focus-within .action__btn,
.app:has(.overlay) .action__button {
    background-color: var(--btn-color);
}
.action__btn--fullscreen {
    --btn-color: var(--color-btn-fullscreen);
}
.action__btn--reduce {
    --btn-color: var(--color-btn-reduce);
}
.action__btn--close {
    --btn-color: var(--color-btn-close);
}
.action__btn--desactivated {
    --btn-color: #7c7c7c33;
    pointer-events: none;
}

@media (max-width: 1280px) {
}
</style>
