<script lang="ts">
import '../fonts.css';
import '../style.css';
import iMac from '$lib/assets/images/mac/Apple Imac Pro.png';
//import iMac from '$lib/assets/images/mac/MacBook Pro 14" - 5th Gen - Silver.png';
import iphone from '$lib/assets/images/iphone/iPhone_16_White_Portrait.png';
import { onMount } from 'svelte';
import { fade, scale } from 'svelte/transition';
import Window from '../components/window.svelte';
import Topbar from '../components/topbar.svelte';
import { goto } from '$app/navigation';

interface Apps {
    name: string, 
    app_name?: string, 
    src: string, 
    usable?: boolean,
    action?: () => void,
    redirect_link?: string,
    safari_link?: string,
    path?: string[],
};
interface TopBar {
    name: string,
    app_name?: string,
    text: string[]
}
let comp: any = [];

let isFullscreen: boolean = false;

let windowWidth: number;
const maxWidth: number = 995;
$: device = windowWidth <= maxWidth ? iphone : iMac;
let isHelloScreen: boolean = true;

const desktopApps: Apps[] = [
    { name: 'Projects', app_name:'Finder', src: '/src/lib/assets/images/icon/Folder.png', path: ['louisgabillet', 'Projects'] },
    { name: 'About Me', app_name: 'Notes', src: '/src/lib/assets/images/icon/Notes.png' },
    { name: 'Mail', app_name: 'Mail', src: '/src/lib/assets/images/icon/Mail.png' },
];
const dockApps: Apps[]  = [
    { name: 'Finder', src: '/src/lib/assets/images/icon/Finder.png', usable: true},
    { name: 'Launchpad', src: '/src/lib/assets/images/icon/Launchpad.png', usable: true, action: () => { openLaunchpad() }},
    { name: 'Notes', src: '/src/lib/assets/images/icon/Notes.png', usable: true },
    { name: 'Mail', src: '/src/lib/assets/images/icon/Mail.png', usable: true },
    //{ name: 'Messages', src: '/src/lib/assets/images/icon/Messages.png' },
    //{ name: 'Photos', src: '/src/lib/assets/images/icon/Photos.png' },
    { name: 'Contact', src: '/src/lib/assets/images/icon/Contact.png', usable: true },
    { name: 'Safari', src: '/src/lib/assets/images/icon/Safari.png', usable: true },
    { name: 'Music', src: '/src/lib/assets/images/icon/Music.png', usable: true },
    { name: 'System Settings', app_name: 'System_Settings', src: '/src/lib/assets/images/icon/System_Settings.png', usable: true },
    { name: 'Projects', app_name: 'Finder', src: '/src/lib/assets/images/icon/Folder.png', usable: true, path: ['louisgabillet', 'Projects'] },
    { name: 'Bin', app_name: 'Trash_Empty', src: '/src/lib/assets/images/icon/Trash_Empty.png' },
];
const launchpadApps: Apps[]  = [
    { name: 'Finder', src: '/src/lib/assets/images/icon/Finder.png', usable: true},
    { name: 'Notes', src: '/src/lib/assets/images/icon/Notes.png', usable: true },
    { name: 'Mail', src: '/src/lib/assets/images/icon/Mail.png', usable: true, redirect_link: 'mailto:gabillet.louis@gmail.com' },
    { name: 'Contact', src: '/src/lib/assets/images/icon/Contact.png', usable: true },
    { name: 'Safari', src: '/src/lib/assets/images/icon/Safari.png', usable: true, redirect_link: 'https://www.google.com/' },
    { name: 'System Settings', app_name: 'System_Settings', src: '/src/lib/assets/images/icon/System_Settings.png', usable: true },
];
let launchpadSearchBar: string;
$: launchpadAppsSearched = launchpadSearchBar ? launchpadApps.filter(app => app?.name?.toLowerCase()?.includes(launchpadSearchBar)) : launchpadApps;
const topBarText: TopBar[] = [
    { name: 'Finder', text: ['File', 'Edit', 'View', 'Go', 'Window', 'Help'] },
    { name: 'Notes', text: ['File', 'Edit', 'Format', 'View', 'Window', 'Help'] },
    { name: 'Mail', text: ['File', 'Edit', 'View', 'Mailbox', 'Message', 'Format', 'Window', 'Help'] },
    { name: 'Safari', text: ['File', 'Edit', 'View', 'History', 'Bookmarks', 'Window', 'Help'] },
    { name: 'System Settings', app_name: 'System_Settings', text: ['Files', 'Edit', 'View', 'Window', 'Help'] },
    { name: 'Music', text: ['File', 'Edit', 'Song', 'View', 'Controls', 'Account', 'Help'] },
    { name: 'Contact', text: ['File', 'Edit', 'View', 'Card', 'Window', 'Help'] },
]
let activeAppName: string = 'Finder';
let windowOrder: string[] = [];
$: activeTopBar = topBarText.find((el) => (el?.app_name || el?.name) == activeAppName) as TopBar;

const isOpen = (name: string, arr: string[]) => arr?.some(el => el?.startsWith(name)); 

let uniqueName: string;

$: if (windowOrder?.length === 0) activeAppName = 'Finder';

let isLaunchpad: boolean =  false;
const openLaunchpad = () => {
    isLaunchpad = !isLaunchpad;
}

let isOpeningScreen: boolean = false;
let isPowerOn: boolean = false;

const powerOnDevice = () => {

    const device = document.getElementById('device') as HTMLElement;
    const blackScreen = device?.querySelector('.black-screen') as HTMLDivElement;
    if (!device || !blackScreen) return;

    device.style.removeProperty('transform');
    //isHelloScreen = false;

    setTimeout(() => {
        blackScreen.style.cssText = `opacity: ${opacity}; pointer-events: none`;
        device?.removeEventListener('click', powerOnDevice );
        isPowerOn = true;
    }, 500)
    //setTimeout(() => {
    //    isOpeningScreen = true;
    //}, 500)
    //setTimeout(() => {
    //    isOpeningScreen = false;
    //}, 2000)
    //setTimeout(() => {
    //    blackScreen.style.cssText = `opacity: ${opacity}; pointer-events: none`;
    //    device?.removeEventListener('click', powerOnDevice );
    //}, 2500)
};
const topBarTextChange = (e: any) => {
    const target = e?.target?.closest('.app');
    if (!target) return;
    const name: string = target.dataset.nameApp;
    if (activeAppName !== name) activeAppName = name;
}
//const changeFocus = (e: CustomEvent) => {
//    const detailName = e?.detail?.name;
//    if (windowOrder?.length > 0 && detailName && activeAppName != detailName) activeAppName = detailName;
//    const appName: string = activeAppName; 
//    onBlur(appName, 1)
//    if (!windowOrder?.includes(appName)) windowOrder = [...windowOrder, appName];
//    //console.log('focus', appName, windowOrder);
//}
const changeFocus = (name: string) => {
    //if (windowOrder?.length <= 1) return;

    if (name && activeAppName != name) activeAppName = name?.split('-')[0];
    onBlur(name)
    windowOrder = [...windowOrder, name];

    comp.forEach(el => {
        el?.child?.$set({
            order: windowOrder,
        })
    })
}
const onBlur = (appName: string) => {
    const remove = windowOrder?.includes(appName);
    if (remove) windowOrder = windowOrder?.filter((name) => name !== appName);
}
//const openOrCloseWindow = (name: string, link: string = '') => {
const openOrCloseWindow = (app: Apps) => {
    const {name, app_name, safari_link, path } = app;
    const appOrCustom = app_name ?? name;
    console.log(appOrCustom, app_name, name)
    const nbrAppPageOpen = document?.querySelectorAll(`.app-window[data-app-name='${appOrCustom}']`)?.length;
    uniqueName = `${appOrCustom}-${nbrAppPageOpen + 1}`;

    if (isRedirectOn) {
        const link = launchpadApps?.find(app => ( app?.name || app?.app_name ) === name )?.redirect_link;
        if (link) window.open(link, '_blank');
    }

    if (isLaunchpad) isLaunchpad = false;

    //if (appWindow || !app) return;
    //if (!open) onBlur(name);

    const parent = document?.getElementById('desktop');
    if (!parent) return;
    windowOrder = [...windowOrder, uniqueName];
    const child = new Window({
        target: parent,
        props: {
            name: appOrCustom,
            safariLink: safari_link ?? '',
            //open: (name: string, link: string = '') => { openOrCloseWindow(name, link) },
            finderPath: path ?? ['louisgabillet'],
            open: (app: Apps) => { openOrCloseWindow(app) },
            destroy: (name: string) => { destroy(name) },
            changeFocus: (name: string) => { changeFocus(name) },
            order: windowOrder,
        }
    })
    comp = [...comp, {name: uniqueName,  child: child}];
}
const destroy = (name: string) => {
    const component = comp?.find((el: any) => el.name === name)?.child;
    component?.$destroy();
    comp = comp?.filter((el: any) => el?.name !== name);
    onBlur(name)
}
let isRedirectOn: boolean = false;
let opacity: string = '0';
onMount(async () => {
    const device = document.getElementById('device');
    device?.addEventListener('click', powerOnDevice )

    isRedirectOn = localStorage.getItem('redirect_outside') === 'true'; 
    opacity = localStorage.getItem('opacity') ?? '0';

    const allElements = [
        {name: 'desktop', is_icon: true, html: document.getElementById('desktop') },
        {name: 'dock', is_icon: true, html: document.getElementById('dock') },
        {name: 'screen', html: document.getElementById('screen') },
        {name: 'background', is_img: true, html: document.querySelector('#screen .background img') as HTMLImageElement },
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
    <div class="commands">
        <button on:click={() => { if (isPowerOn) isFullscreen = !isFullscreen }}>{isFullscreen ? '􀅋' : '􀅊'}</button>
    </div>
    <div id='device' class="{isFullscreen ? 'fullscreen' : ''}" style="transform: scale(.5)">
        <img src={device} alt="" style="{isFullscreen ? 'display: none' : ''}">
        <div id="screen" style="{isFullscreen ? 'padding: 0' : ''}">
            <div>
                <!--<div class="black-screen" transition:fade={{  duration: 500 }}></div> -->
                <div class="black-screen">
                    {#if isOpeningScreen}
                        <p class="apple-logo"></p>
                    {/if}
                </div> 
                {#if isLaunchpad}
                   <div class="launchpad" transition:scale={{ duration: 320, start: 1.1,  }}>
                        <input type="text" placeholder="Search" bind:value={launchpadSearchBar}>
                        <div class="lp-container" role="button" tabindex="0" on:focus={() => isLaunchpad = false }>
                            {#each launchpadAppsSearched as app} 
                                <div class="app-container">
                                    <button class="app"
                                        data-name-app={app?.app_name || app?.name}
                                        on:click={(e) => { topBarTextChange(e); openOrCloseWindow(app) }}
                                    > 
                                        <img class='icon' src={app.src} alt="">
                                    </button>
                                    <button class="app"
                                        data-name-app={app?.app_name || app?.name}
                                        on:click={(e) => { topBarTextChange(e) }}
                                        on:dblclick={() => { openOrCloseWindow(app) }}
                                    > 
                                        <p><span>{app.name}</span></p>
                                    </button>
                                </div>
                            {/each}
                        </div>
                    </div> 
                {/if}
                <Topbar {activeTopBar} />
                <div class="background">
                    <img src='/src/lib/assets/images/background/Ink_Cloud.jpg' alt="">
                </div>
                <div id="desktop">
                    <div id='icons-placement'>
                        {#each desktopApps as app} 
                                <div class="app-container">
                                    <button class="app"
                                        data-name-app={app?.app_name || app?.name}
                                        on:click={(e) => { topBarTextChange(e) }}
                                        on:dblclick={() => { openOrCloseWindow(app) }}
                                    > 
                                        <img class='icon' src={app.src} alt="">
                                    </button>
                                    <button class="app"
                                        data-name-app={app?.app_name || app?.name}
                                        on:click={(e) => { topBarTextChange(e) }}
                                        on:dblclick={() => { openOrCloseWindow(app) }}
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
                            <div class="separator"></div>
                        {/if}
                        <button class="app {!app?.usable ? 'unusable' : ''}"
                            data-name-app={app?.app_name || app?.name}
                            on:click={(e) => { 
                                if (app?.action) { app?.action(); return };
                                topBarTextChange(e); openOrCloseWindow(app) }}
                        >  
                            <img class='icon' src={app.src} alt="">
                            {#if isOpen((app?.app_name || app?.name), windowOrder) || app.name == 'Finder'}
                                <span class="dot"></span>
                            {/if}
                            <!--<div class="float-name">
                                <p>{app?.name}</p>
                                <div class="triangle"></div>
                            </div>-->
                        </button>
                    {/each}
                </div>
            </div>
        </div>
</main>

<style>
button {
    background: transparent;
    outline: none;
    border: none;
}
main {
    width: 100vw;
    min-height: 100vh;
    display: grid;
    place-content: center;
}
.commands {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: #4A4A4A63; 
    backdrop-filter: blur(50px);
    padding: 10px;
    z-index: 1000;
    font-size: 1rem;
}
.fullscreen {
    width: 100vw;
    height: 100vh;
}
#device {
    position: relative;
    transition: transform .5s ease;
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
.unusable {
pointer-events: none;
}
.black-screen {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 102%;
    height: 102%;
    background-color: black;
    z-index: 1000;
    transition: all .32s ease;
}
.apple-logo {
    font-size: 5rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
#screen > div {
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
    width: 84%;
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
.app-container {
    /*width: 100%;*/
    width: var(--width);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    word-wrap: break-word;
    overflow-wrap: break-word;
}
.launchpad .app-container {
    width: 100%;
}
.launchpad .app {
    max-width: 100%;
    font-weight: 400;
}
.app {
    --borr: 2px;
    min-width: var(--icon-size-desktop);
    text-align: center;
    font-weight: 600;
    text-shadow: 0 1px 1px var(--color-shadow);
    border-radius: var(--borr);
    position: relative;
    /*width: 100%;*/
    max-width: var(--width);
}
#dock .app {
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
    width: 1px;
    background-color: #414141;
    margin: 2.5px 1.5%;
    flex: 0 0 auto;
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
.app > p {
    --font-size: calc(var(--icon-size) / 5); 
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    /* line-height: 1; */
    /*max-height: var(--app-name-max-height);*/
    font-size: var(--font-size);
    /*display: inline;
    outline: 2px solid blue;*/
}
#desktop .app-container:focus-within button img {
    box-shadow: 0 0 0px 1px #4D4D4D;
    background-color: #0000002E;
}
#desktop .app-container:focus-within button p span {
    background: var(--dark-selection-focused);
}
#icon-placement .app:focus img {
    box-shadow: 0 0 0px 1px var(--color-border);
    border-radius: var(--borr);
}
.icon {
    width: var(--icon-size);
}
#dock .icon {
    /*width: var(--icon-size);*/
    width: 100%;
}

@media (max-width: 995px) {
    #screen {
        padding: 6.5% 6.6% 7% 6.6%;
    }
    #screen > div {
        border-radius: 20px;
    }
}
</style>
