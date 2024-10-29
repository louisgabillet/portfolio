<script lang="ts">
import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import Safari from './safari.svelte';
	import Notes from './notes.svelte';
	import Mail from './mail.svelte';
	import Finder from './finder.svelte';
	import Settings from './settings.svelte';

export let name;
export let order: string[];
export let safariLink: string = '';
export let open: (name: string, link: string) => void = () => {};
export let destroy: (name: string) => void;
export let changeFocus: (name: string) => void;

const dispatch = createEventDispatcher();

// HTML Elements
// let openWindow: HTMLElement;
let openWindow: HTMLElement;
let parent: HTMLElement | null;

// LocalStorage Elements
$: storage = {pos:{x: pos?.percentX || 50, y: pos?.percentY || 50}, size: {width: size?.width || 50, height: size?.height || 50}};
$: getStorageSting = localStorage.getItem(name);
$: getStorage = getStorageSting ? JSON.parse(getStorageSting) : {pos:{x: 25, y: 25}, size: {width: 50, height: 50}};
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
$: pos = {percentX: storageX, percentY: storageY, previousX: storageX, previousY: storageY};
$: size = {width: storageWidth, height: storageHeight, previousW: storageWidth, previousH: storageHeight, maxWidth: 100, maxHeight: 100};
let mousePos: {mouseXStart: number, mouseYStart: number};
$: ({percentX, percentY} = pos);
$: ({width, height, maxWidth, maxHeight} = size);
let reduceX: number, 
    reduceY: number;
let resizeSides = {left: false, top: false, right: false, bottom: false};
$: isResizeSides = Object.values(resizeSides)?.filter((side) => side);
$: isResizeSidesLength = isResizeSides?.length;

let scale: number = 0;
let reduce: boolean = false;
let uniqueName: string;
let id: number;
let isReduceTransi: boolean = false;


// Trigger based on condition
$: if (isMouseMove) { openWindow?.classList.remove('transition') } else { openWindow?.classList.add('transition') };
$: if (openWindow && isResizeSidesLength === 0) { openWindow.addEventListener('mouseleave', windowLeave) } else if (openWindow) { openWindow.removeEventListener('mouseleave', windowLeave) };
$: if (document.activeElement === openWindow && openWindow && !isFullScreen) { openWindow.addEventListener('mousemove', changeResizeCursor) } else if (openWindow) { openWindow.removeEventListener('mousemove', changeResizeCursor) }; 

onMount(() => {
    id = document?.querySelectorAll(`.app-window[data-app-name=${name}]`)?.length;
    uniqueName = `${name}-${id}`;
    //const window = document.querySelector(`.app-window[data-app-name=${name}-${uniqueID}`) as HTMLDivElement;
    openWindow?.focus({preventScroll: true});
    //window.addEventListener('mousemove', changeResizeCursor)

    //percentX = percentX + id;
    //percentY = percentY + id;

    parent = document.getElementById('desktop');

})
onDestroy(() => {
    openWindow.removeEventListener('mousemove', changeResizeCursor)
    localStorage.setItem(name, JSON.stringify(storage));
})

const onMouseDown = (e: MouseEvent) => {
    if (isFullScreen || !openWindow) return;
    dispatch('focus', { name: name })
    if (!isWindowMoving) e.stopPropagation();
    const rect = openWindow?.getBoundingClientRect();
    resizeSides = checkIfMouseResize(e, rect);
    mousePos = { mouseXStart: e.clientX, mouseYStart: e.clientY};

    const isMoving = Object.values(resizeSides)?.filter((side) => side)?.length <= 0; // Forced to do that cause isWindowMoving doesnt update fast enough
    const marginForMove = 32 + 6 // 2rem + padding(4px) + border(2px) ;
    if (isMoving && mousePos.mouseYStart > rect?.top + marginForMove) return;

    window.addEventListener('mousemove', mouseMoveHandler)
    window.addEventListener('mouseup', mouseUpHandler)
}
const onKeyDown = (e:KeyboardEvent) => {
    const keyClose = e.ctrlKey && e.code === 'KeyA';
    const keyReduce = e.ctrlKey && e.code === 'Semicolon';
    const keyFullscreen = e.ctrlKey && e.code === 'KeyF';

    if (keyClose) {
        if (isFullScreen) fullscreen();
        destroy(uniqueName)
    } else if (keyReduce && !isFullScreen) {
        reduceWindow();
    } else if (keyFullscreen && !reduce) {
        fullscreen();
    }
}

const mouseMoveHandler = (e: MouseEvent) => {
    requestAnimationFrame(()=> {
        if (!parent || !openWindow) return; 
        const {mouseXStart: startX, mouseYStart: startY} = mousePos;
        const parentRect = parent?.getBoundingClientRect();
        const {previousX, previousY} = pos;
        const {previousW, previousH} = size;
        //const previousX = pos.previousX,
        //      previousY = pos.previousY;
        //const previousW = size?.previousW,
        //      previousH = size?.previousH;
        //const width = openWindow?.offsetWidth / parent?.offsetWidth * 100,
        //      height = openWindow?.offsetHeight / parent?.offsetHeight * 100;


        const x: number = checkIfMouseLeave(e, parentRect)?.x ?? 0,
              y: number = checkIfMouseLeave(e, parentRect)?.y ?? 0;
        let offsetX = (startX - x) / parent.offsetWidth * -100,
            offsetY = (startY - y) / parent.offsetHeight * -100;
        const pX = previousX + offsetX,
              pY = previousY + offsetY;

        isMouseMove = (startX != x) || (startY != y); 
        const isLeftSide = resizeSides?.left,
              isTopSide = resizeSides?.top;
        //const maxWidth = pX >= 0 ? 100 - percentX : 100 - (100 - width),
        //      maxHeight = pY >= 0 ? 100 - percentY : 100 - (100 - height);
        const pW = (isLeftSide ? offsetX * -1 : offsetX) + previousW,
              pH = (isTopSide ? offsetY * -1 : offsetY) + previousH;
        const minWidth = pW >= 20,
              minHeight = pH > 25;
        const moveWhenResizeX = pX, 
              moveWhenResizeY = pY; 
              //moveWhenResizeY = pY <= 0 ? 0 : pY;

        pos.percentX = isLeftSide && minWidth ? moveWhenResizeX : isWindowMoving ? pX : percentX;
        pos.percentY = isTopSide && minHeight ? moveWhenResizeY : isWindowMoving ? pY <= 0 ? 0 : pY : percentY;

        if (!isWindowMoving) {
            //const isWidthTooLarge = pW > maxWidth,
            //     isHeightTooLong = pH > maxHeight;

            if (resizeSides?.left || resizeSides?.right) size.width =  pW <= 20 ? 20 : pW;
            if (resizeSides?.top || resizeSides?.bottom) size.height = pH <= 25 ? 25 : pH;
        }
    })
};
const mouseUpHandler = (e: MouseEvent) => {
    if (!openWindow) return;

    window.removeEventListener('mousemove', mouseMoveHandler);
    window.removeEventListener('mouseup', mouseUpHandler);
    resizeSides = {left: false, top: false, right: false, bottom: false};
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
          //top = clientY <= bounds?.top,
          bottom = clientY >= bounds.bottom;
    
    const x = left ? bounds?.left : right ? bounds.right : clientX,
          y = bottom ? bounds?.bottom : clientY;

    return {x, y};
}
const checkIfMouseResize = (e: MouseEvent, rect: any) => {
    const x = e?.clientX,
          y = e?.clientY;
    const inRightMargin = x >= rect?.right - margin,
        inLeftMargin = x <= rect?.left + margin,
        inTopMargin = y <= rect?.top + margin,
        inBottomMargin = y >= rect?.bottom - margin;
    let data = {right: false, left: false, top: false, bottom: false};
    if (data.right !== inRightMargin) data.right = inRightMargin;
    if (data.left !== inLeftMargin) data.left = inLeftMargin;
    if (data.top !== inTopMargin) data.top = inTopMargin; 
    if (data.bottom !== inBottomMargin) data.bottom = inBottomMargin;
    return data;
}
const windowLeave = () => {
    parent?.style.removeProperty('cursor');
}
const changeResizeCursor = (e: MouseEvent) => {
    if (document.activeElement !== openWindow) return;
    const x = e.clientX,
    y = e.clientY;
    const rect = openWindow?.getBoundingClientRect();
    const {left, right, bottom, top} = isResizeSidesLength === 0 ? checkIfMouseResize(e, rect) : resizeSides;
    if (!left && !right && !bottom && !top && parent && isResizeSidesLength === 0) {
        parent.style.removeProperty('cursor');
        return;
    };
    const startX = mousePos?.mouseXStart,
    startY = mousePos?.mouseYStart;
    const isAboveX = isResizeSidesLength > 0 && startX > x,
    isAboveY = isResizeSidesLength > 0 && startY > y,
    isBelowX = isResizeSidesLength > 0 && startX < x,
    isBelowY = isResizeSidesLength > 0 && startY < y; 

    let sign: string|null = null;

    if (left && top || right && bottom) {
        sign =  isAboveX && isAboveY ? 'se' : isBelowX && isBelowY ? 'nw' :'nwse'
    } else if (right && top || left && bottom) {
        sign =  isBelowX && isAboveY ? 'sw' : isAboveX && isBelowY ? 'ne' : 'nesw'
    } else if (right || left) {
        sign = isAboveX ? 'e' : isBelowX ? 'w' : 'ew'
    } else if (top || bottom) {
        sign = isAboveY ? 's' : isBelowY ? 'n' : 'ns'
    }
    if (sign && parent) parent.style.cursor = `${sign}-resize`
}

const fullscreen = () => {
    const tbContainer = document.querySelector('#top-bar .tb-container') as HTMLDivElement;
    const bgImg = document.querySelector('.background img') as HTMLDivElement;
    const iconPlacement = document.getElementById('icons-placement') as HTMLDivElement;
    const dock = document.getElementById('dock') as HTMLDivElement;

    const all = [tbContainer, bgImg, iconPlacement, dock];

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
        dock?.appendChild(newApp);

        setTimeout(() => { newApp.appendChild(newAppImg) }, duration)
    }
}
const reduceWindow = () => {
    const offX = openWindow?.offsetWidth, offY = openWindow?.offsetHeight;
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
        scale = 32 / (offX > offY ? offX : offY);
        const lastEl = document.getElementById('dock')?.lastElementChild;
        const rect = lastEl?.getBoundingClientRect();
        const parentRect = parent?.getBoundingClientRect();
        if (parentRect && rect) {
            reduceX = (rect?.left - openWindow?.offsetWidth / 2) - parentRect?.left;
            reduceY = (rect?.top - openWindow?.offsetHeight / 2.25) - parentRect?.top;
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

<div bind:this={openWindow} 
    role="button" 
    tabindex="0" 
    data-app-name={name}
        class="app-window transition {isFullScreen ? 'full-screen' : ''} {reduce ? 'reduced' : ''} {isReduceTransi ? 'reduce-transi' : ''}"
    style="--width: {width}%; --height: {height}%; --top: {percentY + id}%; --left: {percentX + id}%; z-index: {zIndex}; 
    {isReduceTransi ? `--reduce-top: ${reduceY}px; --reduce-left: ${reduceX}px; --scale: ${scale}` : ''}"
    on:focusin={() => { changeFocus(uniqueName) }}
    on:mousedown={ (e) => { onMouseDown(e) }}
    on:keydown={ (e) => { onKeyDown(e) }}
> 
    {#if reduce}
        <button class="overlay" on:click={() => { reduceWindow() }}></button> 
    {/if}
    <div class="content {isFullScreen ? 'full-screen' : ''}">
        <div class="action-btn">
           <!-- <button id='close-btn' on:click={() => { if (isFullScreen) dispatch('fullscreen'); dispatch('close') }}></button>-->
            <button id='close-btn' on:click={() => { destroy(uniqueName) }}></button>
            <button id={!isFullScreen ? 'reduce-btn' : 'desactivated'} on:click={() => { reduceWindow() }}></button>
            <button id="full-screen-btn" on:click={() => { fullscreen() }}></button>
        </div>
        {#if name === 'Notes'}
            <Notes />   
        {:else if name === 'Finder'}
            <Finder {open} {openWindow}/>
        {:else if name === 'Mail'}
            <Mail />
        {:else if name === 'Safari'}
            <Safari link={safariLink} />
        {:else if name === 'System_Settings'}
            <Settings />
        {/if}
    </div>
</div>

<style>
.app-window {
    --padding: 4px;
    position: absolute;
    outline: none;
    padding: var(--padding);
    width: var(--width);
    height: var(--height);
    max-width: var(--max-width);
    max-height: var(--max-height);
    top: var(--top);
    left: var(--left);
}
.content {
    --nav-height: 2rem;
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: .4rem;
    overflow: hidden;
    outline: .5px solid black;
    border: 1px solid #525150;
    overflow: hidden;
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
.app-window:focus .content {
    box-shadow: 0 0 5px 5px rgba(0,0,0,.2);
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
