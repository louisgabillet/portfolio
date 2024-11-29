<script lang="ts">
import '../fonts.css';
import '../style.css';
import { desktopApps, dockApps, launchpadApps } from '$lib/data';
import { windowOrder, openAppWindow } from '$lib/index';
import Topbar from '../components/topbar.svelte';
import iMac from '$lib/assets/images/mac/Apple Imac Pro.png';
//import iMac from '$lib/assets/images/mac/iMac 27 Silver.png';
import iphone from '$lib/assets/images/iphone/iPhone_16_White_Portrait.png';
import { onMount } from 'svelte';
import { scale } from 'svelte/transition';


const maxWidth: number = 995;
const isOpen = (name: string, arr: string[]) => arr?.some(el => el?.startsWith(name)); 
const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };


let time: string;
let date: string;
let launchpadSearchBar: string;
let opacity: string = '0';
let windowWidth: number;
let isLaunchpad: boolean =  false;
let isPowerOn: boolean = false;
let isRedirectOn: boolean = false;
let isCommandsOpen: boolean = false;
let isFullscreen: boolean = false;
let storageFullscreen: boolean = true;
let timeInterval: ReturnType<typeof setInterval>;


$: device = windowWidth <= maxWidth ? iphone : iMac;
$: launchpadAppsSearched = launchpadSearchBar ? launchpadApps.filter(app => app?.name?.toLowerCase()?.includes(launchpadSearchBar)) : launchpadApps;


const powerOnDevice = () => {
    const device = document.getElementById('device') as HTMLElement;
    const bodyHeight = document.querySelector('body')?.offsetHeight
    const blackScreen = device?.querySelector('.black-screen') as HTMLDivElement;
    const blChildren = Array.from(blackScreen?.children as HTMLCollection);
    
    if (!device || !blackScreen || !blChildren || !bodyHeight) return;

    const scaleHeight = (bodyHeight / (device?.offsetHeight / 1.7)).toFixed(2);
    const scaleWidth = (windowWidth/ (device?.offsetWidth / 1.15)).toFixed(2);
    const scale = scaleWidth > scaleHeight ? scaleWidth : scaleHeight;
    device?.removeEventListener('click', powerOnDevice );

    if (storageFullscreen) {
        // TODO -> Adapt the transition for all screens.
        device.style.transition = `all ${+scale * .5}s ease-in-out`;
        // TODO -> Adapt the scale so that it barely goes out. Need to adatp to all formats (mobile, pc, ...).
        device.style.transform = `scale(${scale})`;
        device.style.marginTop= '22vh'
    } else {
        device.style.removeProperty('transform');
    }
    setTimeout(() => {
        isFullscreen = storageFullscreen;
        if (storageFullscreen) {
            device.style.removeProperty('transition');
            device.style.removeProperty('margin-top');
        }
        blackScreen.addEventListener('click', unlockDevice)
        device.style.removeProperty('transform');
        isPowerOn = true;
        blChildren.forEach((child) => {
            (child as HTMLDivElement).style.removeProperty('visibility');
        })
    }, (+scale * 1000)) 
};
const unlockDevice = () => {
    const blackScreen = document?.querySelector('#screen .black-screen') as HTMLDivElement;
    const blChildren = Array.from(blackScreen?.children as HTMLCollection);
    if (blackScreen && blChildren) {
        blackScreen.style.cssText = `opacity: ${opacity}; pointer-events: none`;
        blackScreen.removeEventListener('click', unlockDevice);
        setTimeout(() => { 
            blChildren.forEach((child) => {
                (child as HTMLElement).style.display = 'none';
            });
            clearInterval(timeInterval);
        }, 320)
    }
}
const openCloseCommands = () => {
    isFullscreen = !isFullscreen;
    localStorage.setItem('fullscreen', isFullscreen.toString());
}
const updatedTime = () => {
    const now = new Date();
    const hours = now?.getHours()?.toString()?.padStart(2, '0');
    const minutes = now?.getMinutes()?.toString()?.padStart(2, '0');

    time = `${hours}:${minutes}`;
}

onMount(async () => {
    const getFullscreenStorage = localStorage.getItem('fullscreen'); 
    if (getFullscreenStorage) storageFullscreen = getFullscreenStorage === 'true';

    updatedTime();
    date = new Date().toLocaleDateString('en-GB', options).replace(',', '');
    timeInterval = setInterval(updatedTime, 1000);

    const device = document.getElementById('device');
    device?.addEventListener('click', powerOnDevice )

    isRedirectOn = localStorage.getItem('redirect_outside') === 'true'; 
    opacity = localStorage.getItem('opacity') ?? '0';

    const allElements = [
        {name: 'desktop', is_icon: true, html: document.getElementById('desktop') },
        {name: 'dock', is_icon: true, html: document.getElementById('dock') },
        {name: 'screen', html: document.getElementById('screen') },
        {name: 'background', is_img: true, html: document.querySelector('#screen .background img') as HTMLImageElement },
        {name: 'background', is_img: true, html: document.querySelector('#screen .black-screen img') as HTMLImageElement },
    ];

    allElements?.forEach(data => {
        const value = localStorage.getItem(data.name);
        if (!value || !data?.html) return;
        if (data?.is_img) {
            data.html.src = JSON.parse(value)?.src;
            return
        }
        const path = data?.is_icon ? 'icon_size' : 'font_size';
        const prop = data?.is_icon ? '--icon-size' : '--font-size';
        if (value) data.html.style.setProperty(prop, `${JSON.parse(value)?.[path]}px`);
    }) 
})
</script>

<svelte:window bind:innerWidth={windowWidth}/>

<main>
    <div class="commands {isCommandsOpen ? '' : 'close'}">
        <button on:click={() => isCommandsOpen = !isCommandsOpen}>{isCommandsOpen ? '􀆊' : '􀆉'}</button>
        <button class="{isPowerOn ? '' : 'desactivated'}" on:click={openCloseCommands}>{isFullscreen || !isPowerOn ? '􀅋' : '􀅊'}</button>
    </div>
    <div id='device' class="{isFullscreen ? 'fullscreen' : ''}" style="transform: scale(.5)">
        <img src={device} alt="" style="{isFullscreen ? 'display: none' : ''}">
        <div id="screen" style="{isFullscreen ? 'padding: 0' : ''}">
            <div class="screen-grid">
                <!--<div class="black-screen" transition:fade={{  duration: 500 }}></div> -->
                <div class="black-screen">
                        <div class="date-and-time flex" style="visibility: hidden;">
                            <h3>{date}</h3>
                            <h1>{time}</h1>
                        </div>
                        <div class="account flex" style="visibility: hidden;">
                            <div class="pp"></div>

                            <h5>Louis Gabillet</h5>
                            <p>Click to unlock</p>
                        </div>
                        <img src='/src/lib/assets/images/background/Ink_Cloud.jpg' alt="" style="visibility: hidden;">
                        <!--<p class="apple-logo"></p>-->
                </div> 
                {#if isLaunchpad}
                   <div class="launchpad" transition:scale={{ duration: 320, start: 1.1,  }}>
                        <input type="text" placeholder="Search" bind:value={launchpadSearchBar}>
                        <div class="lp-container" role="button" tabindex="0" on:focus={() => isLaunchpad = false }>
                            {#each launchpadAppsSearched as app} 
                                <div class="shortcut-container">
                                    <button class="shortcut"
                                        data-name-app={app?.app_name || app?.name}
                                        on:click={() => { openAppWindow(app); isLaunchpad = false }}
                                    > 
                                        <img src={app.src} alt="">
                                    </button>
                                    <button class="shortcut" data-name-app={app?.app_name || app?.name}> 
                                        <p><span>{app.name}</span></p>
                                    </button>
                                </div>
                            {/each}
                        </div>
                    </div> 
                {/if}
                <Topbar />
                <div class="background">
                    <img src='/src/lib/assets/images/background/Ink_Cloud.jpg' alt="">
                </div>
                <div id="desktop">
                    <div id='icons-placement'>
                        {#each desktopApps as app} 
                                <div class="shortcut-container">
                                    <button class="shortcut"
                                        data-name-app={app?.app_name || app?.name}
                                        on:dblclick={() => { openAppWindow(app) }}
                                    > 
                                        <img src={app.src} alt="">
                                    </button>
                                    <button class="shortcut"
                                        data-name-app={app?.app_name || app?.name}
                                        on:dblclick={() => { openAppWindow(app) }}
                                    > 
                                        <p><span>{app.name}</span></p>
                                    </button>
                                </div>
                        {/each}
                    </div>
                </div>
                <div id="dock">
                    {#each dockApps as app, i}
                        {#if i === dockApps?.length - 2}
                            <div class="separator">
                                <div class="line"></div>
                            </div>
                        {/if}
                        <button class="shortcut"
                            data-name-app={app?.app_name || app?.name}
                            on:click={() => { 
                                if (app?.name === 'Launchpad') { isLaunchpad = !isLaunchpad; return }; 
                                openAppWindow(app) }}
                        >  
                            <img  src={app.src} alt="">
                            {#if isOpen((app?.app_name || app?.name), windowOrder) || app.name == 'Finder'}
                                <span class="dot"></span>
                            {/if}
                        </button>
                    {/each}
                </div>
            </div>
        </div>
</main>

<style>
main {
    width: 100vw;
    min-height: 100vh;
    display: grid;
    place-content: center;
}
.commands {
    --outer: 20px;
    height: 30px;
    position: absolute;
    bottom: 1%;
    right: 0;
    padding-left: var(--outer);
    z-index: 1001;
    font-size: var(--fz-m);
    background: #1B1B1B;
    border-radius: 4px 0 0 4px;
    transition: transform .32s ease;
    overflow: hidden;
}
.commands.close {
    transform: translateX(calc(100% - var(--outer)));
}
.commands .desactivated {
    opacity: .4;
    pointer-events: none;
}
.commands button:first-of-type {
    background: #373735;
    position: absolute;
    padding: 0;
    top: 0;
    left: 0;
    width: var(--outer);
    height: 100%;
    text-align: center;
    border-radius: 0;
    outline: 1px solid #000;
}
.commands button {
    color: white;
    border-radius: 50%;
    height: 100%;
    aspect-ratio: 1/1;
}
.fullscreen {
    width: 100vw;
    height: 100vh;
}
#device {
    position: relative;
}
#device >  img {
    max-width: 100vw;
    max-height: 100vh;
    object-fit: cover;
    pointer-events: none;
    position: relative;
    z-index: 1000;
}
#screen {
    /* --icon-width: 32px; /* Realistic one. But font too small if also realist*/
    --nav-color: #F6F6F65C;
    --nav-blur: 8.5rem;
    --width: calc(var(--icon-size) * 2);
    position: absolute;
    top: 0;
    left:  0;
    width: 100%; 
    height: 100%;
    /*padding: 4.42% 4.57% 25.45% 4.57%;*/
    padding: 5.8% 5.6% 27.4% 5.6%;
    background-size: 100%;
}
.black-screen {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    background-color: black;
    z-index: 1000;
    transition: all .32s ease;
}
.black-screen img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.black-screen .flex {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}
.date-and-time, .account {
    position: absolute;
    left: 50%;
    color: white;
    transform: translateX(-50%);
    display: none;
}
.date-and-time h1, .date-and-time h3, .account p {
    opacity: .7;
}
.date-and-time {
    top: 10%;
}
.date-and-time h1 {
    font-size: 5.625rem;
    font-weight: 600;
    line-height: 1;
}
.date-and-time h3 {
    font-size: 1.25rem;
    font-weight: 500;
}
.account {
    bottom: 5%;
}
.account .pp {
    width: 3rem;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background: var(--dark-fullscreen);
    backdrop-filter: blur(var(--blur));
}
.account h5 {
    font-size: var(--fz-m);
    font-weight: 500;
}
.account p {
    font-size: var(--fz-s);
}
.launchpad {
    --width: calc(var(--icon-ratio) * 1.5);
    --icon-size: var(--width);
    width: 100%;
    height: 100%;
    background-color: #4A4A4A63;
    backdrop-filter: blur(50px);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
}
.launchpad input {
    position: absolute;
    top: 25px;
    left: 50%;
    transform: translate(-50%, -50%);
    outline: 1px solid #414141;;
    border: none;
    color: white;
    background: transparent;
    border-radius: 1px;
}
.lp-container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(5, 1fr);
    row-gap: 1rem;
    padding: 50px 8rem calc(var(--width) + 30px) 8rem;
    margin: 0 auto;
}
.background {
    width: 100%;
    height: calc(100% + 2rem);
    background-color: black;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    padding-bottom: 2rem;
}
.background img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform .32s ease;
}
.screen-grid {
    position: relative;
    width: 100%;
    height: 100%;
    /*aspect-ratio: 16 / 9;*/
    /*background-image: url('$lib/assets/images/background/Ink-Cloud.jpg');
background-size: 100%;*/
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: hidden;
}
#desktop {
    transition: transform .32s ease;
    position: relative;
    display: flex;
    justify-content: center;
    z-index: 1;
    overflow: hidden;
}
#icons-placement {
    --width: calc(var(--icon-size) * 2);
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    width: calc(100% - 11rem);
    /*display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--width), 1fr));*/
    gap: 4px;
    padding: 4px 0 calc(var(--icon-ratio) * 2);
    transition: transform .32s ease;
}
#dock {
    --icon-width: var(--icon-ratio);
    --borr: .6rem;
    box-shadow: 0 0 6px 0 var(--color-shadow);
    border-radius: var(--borr);
    background-color: #4A4A4A63; 
    backdrop-filter: blur(50px);
    display: flex;
    width: max-content;
    max-width: 90%;
    /*overflow: hidden;*/
    margin: 0 auto 4px auto;
    padding: 2px 2px 2px 2px;
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
    transition: transform .32s ease;
}
.launchpad .shortcut-container {
    width: 100%;
}
.launchpad .shortcut {
    max-width: 100%;
    font-weight: 400;
}
#dock .shortcut {
    /*width: var(--icon-size);*/
    flex: 1 1 var(--icon-size);
    max-width: var(--icon-size);
}
.float-name {
    position: absolute;
    top: -1.75rem;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    display: none;
    padding: 2.5px 10px;
    background-color: #4A4A4A63; 
    backdrop-filter: blur(50px);
    border-radius: 2px;
}
.app:hover .float-name {
    display: inline;
}
.dot {
    width: 3px;
    height: 3px;
    background-color: #7C7C7C;
    border-radius: 50%;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 25%);
}
.separator {
    position: relative;
    padding-inline: calc(var(--icon-size) / 5);
}
.separator .line {
    background-color: #414141;
    height: 85%;
    width: 1px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.triangle {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #4A4A4A63;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
}

@media (max-width: 995px) {
    #screen {
        padding: 6.5% 6.6% 7% 6.6%;
    }
    .fullscreen .screen-grid {
        border-radius: 0;
    }
    .screen-grid {
        border-radius: 20px;
    }
}
</style>
