<script lang="ts">
import { closeAppWindow, changeAppWindowsOrder } from '$lib/index';
import { createEventDispatcher, onDestroy, onMount } from 'svelte';
import Safari from './safari.svelte';
import Notes from './notes.svelte';
import Mail from './mail.svelte';
import Finder from './finder.svelte';
import Settings from './settings.svelte';
import Music from './music.svelte';
import Contact from './contact.svelte';

export let name;
export let order: string[];
export let safariLink: string = '';
export let finderPath: string[] = ['louisgabillet']
//export let open: (app: any) => void = () => {};
//export let destroy: (name: string) => void;
//export let changeFocus: (name: string) => void;

const dispatch = createEventDispatcher();

interface AppsData {
    name: string,
    data: {
        min_height: number,
        min_width: number,
        resize_x?: boolean,
        resize_y?: boolean,
    }
}
const appsData: AppsData[] = [
    { 
        name: 'Finder',
        data: {
            min_width: 200,
            min_height: 200,
        }
    },
    {
        name: 'Notes',
        data : {
            min_width: 260,
            min_height: 190,
        }
    },
    {
        name: 'Contact',
        data: {
            min_width: 260,
            min_height: 260,
        }
    },
    {
        name: 'Safari',
        data : {
            min_width: 300,
            min_height: 130,
        }
    },
    {
        name: 'Music',
        data : {
            min_width: 520,
            min_height: 380,
        }
    },
    {
        name: 'System_Settings',
        data: {
            min_width:390,
            min_height: 304,
            resize_x: false,
        }
    },
]
const defaultAppData: AppsData = {
    name: 'Default',
    data: {
        min_width: 250,
        min_height: 200,
    }
}

$: appData = appsData.find(app => app.name === name)?.data ?? defaultAppData.data;
$: isResizeX = appData?.resize_x ?? true;
$: isResizeY = appData?.resize_y ?? true;
// HTML Elements
// let openWindow: HTMLElement;
let openWindow: HTMLElement;
let parent: HTMLElement | null;

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
    width: appData.min_width + (isResizeX ? 200 : 0),
    height: appData.min_height + (isResizeY ? 200 : 0),
}
$: getStorage = getStorageString ?
    JSON.parse(getStorageString) :
    {
        pos: {
            x: parent ? (parent.offsetWidth / 2) - (defaultSize.width / 2) : 0,
            y: parent ? (parent.offsetHeight / 2) - (defaultSize.height / 2) : 0,
        },
        size: {
            width: defaultSize.width,
            height: defaultSize.height,
        }
    };
$: ({x: storageX, y: storageY} = getStorage.pos);
$: ({width: storageWidth, height: storageHeight} = getStorage.size);

// Props Elements
$: zIndex = order?.indexOf(uniqueName) >= 0 ? order?.indexOf(uniqueName) : 0;

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
let uniqueName: string;
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
    parent = document.getElementById('desktop');
    id = document?.querySelectorAll(`.app-window[data-app-name=${name}]`)?.length;
    uniqueName = `${name}-${id}`;
    //const window = document.querySelector(`.app-window[data-app-name=${name}-${uniqueID}`) as HTMLDivElement;
    openWindow?.focus({preventScroll: true});
    //window.addEventListener('mousemove', changeResizeCursor)

    //percentX = percentX + id;
    //percentY = percentY + id;
})
onDestroy(() => {
    openWindow.removeEventListener('mousemove', changeResizeCursor)
    localStorage.setItem(name, JSON.stringify(storage));
})

const onMouseDown = (e: MouseEvent) => {
    if (isFullScreen || !openWindow) return;
    //dispatch('focus', { name: name })

    if (!isWindowMoving) e.stopPropagation();
    const rect = openWindow?.getBoundingClientRect();
    //activeSides = checkIfMouseResize(e, rect);
    mousePos = { mouseXStart: e.clientX, mouseYStart: e.clientY};

    setTimeout(() => {
        const marginForMove = 32 + 6 // 2rem + padding(4px) + border(2px);
        const isTargetResize = (e.target as HTMLElement)?.classList.contains('resize');
        const isAppWindowFocused = openWindow === document.activeElement; 
        const canMoveAppWindow = mouseYStart <= rect?.top + marginForMove;

        if ((!canMoveAppWindow || !isAppWindowFocused) && !isTargetResize) return;

        isMouseDown = true;
        window.addEventListener('mousemove', mouseMoveHandler)
        window.addEventListener('mouseup', mouseUpHandler)
    })
}
const onKeyDown = (e:KeyboardEvent) => {
    const keyClose = e.ctrlKey && e.code === 'KeyA';
    const keyReduce = e.ctrlKey && e.code === 'Semicolon';
    const keyFullscreen = e.ctrlKey && e.code === 'KeyF';

    if (keyClose) {
        if (isFullScreen) fullscreen();
        closeAppWindow(uniqueName)
    } else if (keyReduce && !isFullScreen) {
        reduceWindow();
    } else if (keyFullscreen && !reduce) {
        fullscreen();
    }
}

const onPointerDown = (e: PointerEvent) => {
    const rect = openWindow?.getBoundingClientRect()
    const height = rect?.top;
    const startY = e?.clientY - height;

    window.addEventListener('pointermove', pointerMoveHandler);
    window.addEventListener('pointerup', pointerUpHandler);
}
const pointerMoveHandler = (e: PointerEvent) => {
    if (!parent) return;
    const percentY = e.clientY / parent?.offsetHeight * 100;
    size.height = percentY / 100;
}
const pointerUpHandler = (e: PointerEvent) => {
    window.removeEventListener('pointermove', pointerMoveHandler);
    window.removeEventListener('pointerup', pointerUpHandler);
}
const mouseMoveHandler = (e: MouseEvent) => {
    requestAnimationFrame(()=> {
        if (!parent || !openWindow || !isMouseDown) return; 
        const parentRect = parent?.getBoundingClientRect();

        // TODO -> Need to make the limit more precise (exceeds a bit).
        const x: number = checkIfMouseLeave(e, parentRect)?.x ?? 0,
              y: number = checkIfMouseLeave(e, parentRect)?.y ?? 0;
        const offsetX = (mouseXStart - x) * -1;
        const offsetY = (mouseYStart - y) * -1;
        const pX = previousX + offsetX,
              pY = previousY + offsetY;

        isMouseMove = (mouseXStart != x) || (mouseYStart != y); 
        if (!isWindowMoving) {
            const isLeftSide = activeSides?.left,
                  isTopSide = activeSides?.top;

            const reverseOffsetX = isLeftSide ? offsetX * -1 : offsetX,
                  reverseOffsetY = isTopSide ? offsetY * -1 : offsetY;

            const pW = Math.round(previousW + reverseOffsetX),
                  pH = Math.round(previousH + reverseOffsetY);

            const minWidth = pW >= appData.min_width,
                  minHeight = pH >= appData.min_height;

            if (minWidth && isResizeX) {
                if (isLeftSide) pos.percentX = pX;
                if (activeSides?.left || activeSides?.right) size.width =  pW <= 20 ? 20 : pW;
            }
            if (minHeight && isResizeY) {
                if (isTopSide) pos.percentY = pY;
                if (activeSides?.top || activeSides?.bottom) size.height = pH <= 25 ? 25 : pH;
            }

        } else {
            pos.percentX = Math.round(pX);
            pos.percentY = Math.round(pY);
        }
    })
};
const mouseUpHandler = (e: MouseEvent) => {
    if (!openWindow) return;
    isMouseDown = false;

    window.removeEventListener('mousemove', mouseMoveHandler);
    window.removeEventListener('mouseup', mouseUpHandler);
    activeSides = {left: false, top: false, right: false, bottom: false};
    isResizeSidesLength = 0;

    if (parent && isMouseMove) {
        localStorage.setItem(name, JSON.stringify(storage));
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
        const screen: HTMLElement|null = document.getElementById('screen');
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
    if (!isFocused || isFullScreen || reduce) return;

    const screen: HTMLElement|null = document.getElementById('screen');
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

    const isWidthUnderMin = width <= appData.min_width,
          isHeightUnderMin = height <= appData.min_height;

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
    const topBar = document.getElementById('top-bar') as HTMLDivElement;
    const bgImg = document.querySelector('.background img') as HTMLDivElement;
    const iconPlacement = document.getElementById('icons-placement') as HTMLDivElement;
    const dock = document.getElementById('dock') as HTMLDivElement;

    const all = [topBar, bgImg, iconPlacement, dock];

    if (isFullScreen) {
        all?.forEach((el: HTMLElement) => {
            el?.classList.remove('bg-fullscreen');
        })
    } else {
        all?.forEach((el: HTMLElement) => {
            el?.classList.add('bg-fullscreen');
        })
    }
    isFullScreen = !isFullScreen;
}
const addOrRemoveElDock = (isReduce: boolean, ratio: number, duration: number) => {
    const dock = document?.getElementById('dock');
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
        const allReduced = document.querySelectorAll('#dock .reduced-page');
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
</script>


<svelte:window bind:innerWidth={windowWidth}/>
<div bind:this={openWindow} 
    role="button" 
    tabindex="0" 
    data-app-name={name}
    class="app-window {isMouseMove ? '' : 'transition'} {isFullScreen ? 'full-screen' : ''} {reduce ? 'reduced' : ''} {isReduceTransi ? 'reduce-transi' : ''}"
    style="
    --width: {width}px;
    --height: {height}px;
    --top: {percentY + id}px;
    --left: {percentX + id}px;
    z-index: {zIndex}; 
    {isReduceTransi ? `--reduce-top: ${reduceY}px; --reduce-left: ${reduceX}px; --scale: ${scale}` : ''}
    "
    on:focusin={() => { changeAppWindowsOrder(uniqueName) }}
    on:pointerdown={ (e) => { if (windowWidth > 995) {onMouseDown(e)} else {onPointerDown(e)} }}
    on:keydown={ (e) => { onKeyDown(e) }}
> 
    {#if reduce}
        <button class="overlay" on:click={() => { reduceWindow() }}></button> 
    {/if}
    <div class="action-btn">
        <button id='close-btn' on:click={() => { closeAppWindow(uniqueName) }}></button>
        <button id={!isFullScreen ? 'reduce-btn' : 'desactivated'} on:click={() => { reduceWindow() }}></button>
        <button id="full-screen-btn" on:click={() => { fullscreen() }}></button>
    </div>
    {#if name === 'Notes'}
        <Notes />   
    {:else if name === 'Finder'}
        <Finder {openWindow} {finderPath}/>
        {:else if name === 'Mail'}
        <Mail />
        {:else if name === 'Safari'}
        <Safari link={safariLink}/>
        {:else if name === 'System_Settings'}
        <Settings />
        {:else if name === 'Music'}
        <Music />
        {:else if name === 'Contact'}
        <Contact />
    {/if}
    {#each resizeBtns as {axe, pos}}
        <button class="resize axe-{axe} pos-{pos}"
            on:mousemove={(e) => { if (!isCursorChanging) changeResizeCursor(e, pos) }}
            on:mouseleave={resetCursor}
            on:focus={() => {}}
        ></button> 
    {/each}
</div>

<style>
.app-window {
    --padding: 0px;
    --nav-height: 2rem;
    position: absolute;
    padding: var(--padding);
    width: var(--width);
    height: var(--height);
    top: var(--top);
    left: var(--left);
    outline: 1px solid black;
    border-radius: .4rem;
}
.resize {
    --size: 10px;
    --placement-minus: -6px;
    position: absolute;
    z-index: 1000;
}
.resize.axe-y {
    width: calc(100% + var(--size));
    height: var(--size);
    left: 50%;
    transform: translateX(-50%);
}
.resize.axe-x {
    width: var(--size);
    height: 100%;
    top: 0;
}
.resize.pos-top {
    top: var(--placement-minus);
}
.resize.pos-bottom {
    bottom: var(--placement-minus);
}
.resize.pos-left {
    left: var(--placement-minus);
}
.resize.pos-right {
    right: var(--placement-minus);
}
.overlay {
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
.transition {
    --transi: 320ms ease;
    transition: 
        top var(--transi),
        left var(--transi),
        width var(--transi),
        height var(--transi),
        max-width var(--transi),
        max-height var(--transi),
        padding var(--transi),
        transform var(--transi);
}
.reduce-transi {
    top: var(--reduce-top);
    left: var(--reduce-left); 
    transform: scale(var(--scale));
}
.reduced {
    position: relative;
    top: 0;
    left: 0;
    transform: scale(.1);
    width: 100%;
    height: 100%;
    transform-origin: center;
}
.full-screen {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    padding: 0;
    border-radius: 0;
    outline: none;
    border: none;
}
.action-btn {
    --pos: calc(var(--nav-height) / 2);
    display: flex;
    align-items: center;
    position: absolute;
    top: var(--pos);
    transform: translateY(-50%);
    left: 8px;
    gap: 4px;
    z-index: 999;
    /*height: var(--nav-height);*/
}
#desactivated {
    pointer-events: none;
}
.action-btn button {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: none;
    outline: none;
    box-shadow: inset 0 0 .5px .5px rgba(0, 0, 0, .2);;
    background-color: #50504E;
}
.action-btn:hover #close-btn {
    background-color: var(--color-btn-close);
}
.action-btn:hover #reduce-btn {
    background-color: var(--color-btn-reduce);
}
.action-btn:hover #full-screen-btn {
    background-color: var(--color-btn-fullscreen);
}
.app-window:focus,
.app-window:focus-within {
    box-shadow: 0 0 1rem 0 var(--color-shadow);
}
.app-window:focus #full-screen-btn,
.app-window:focus-within #full-screen-btn, 
.app-window:has(.overlay) #full-screen-btn {
    background-color: var(--color-btn-fullscreen);
}
.app-window:focus .action-btn #reduce-btn,
.app-window:focus-within #reduce-btn, 
.app-window:has(.overlay) #reduce-btn {
    background-color: var(--color-btn-reduce);
}
.app-window:focus #close-btn,
.app-window:focus-within #close-btn,
.app-window:has(.overlay) #close-btn {
    background-color: var(--color-btn-close);
}

</style>
