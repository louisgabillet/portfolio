<script lang="ts">
import '../fonts.css';
import '../style.css';
import iMac from '$lib/assets/images/mac/Apple Imac Pro.png';
//import iMac from '$lib/assets/images/mac/MacBook Pro 14" - 5th Gen - Silver.png';
import iphone from '$lib/assets/images/iphone/iPhone_16_White_Portrait.png';
import { onMount } from 'svelte';
import { fade } from 'svelte/transition';
import Window from '../components/window.svelte';
	import Topbar from '../components/topbar.svelte';

interface Apps {
    name: string, 
    app_name?: string, 
    src: string, 
    usable?: boolean;
};
interface TopBar {
    name: string,
    app_name?: string,
    text: string[]
}
let comp: any = [];



let windowWidth: number;
const maxWidth: number = 995;
$: device = windowWidth > maxWidth ? iMac : iphone;
let isHelloScreen: boolean = true;

const desktopApps: Apps[] = [
    { name: 'My Work', app_name:'Finder', src: '/src/lib/assets/images/icon/Finder.png' },
    { name: 'About Me', app_name: 'Notes', src: '/src/lib/assets/images/icon/Notes.png' },
    { name: 'Mail', app_name: 'Mail', src: '/src/lib/assets/images/icon/Mail.png' },
];
const dockApps: Apps[]  = [
    { name: 'Finder', src: '/src/lib/assets/images/icon/Finder.png', usable: true},
    { name: 'Notes', src: '/src/lib/assets/images/icon/Notes.png', usable: true },
    { name: 'Mail', src: '/src/lib/assets/images/icon/Mail.png', usable: true },
    { name: 'Messages', src: '/src/lib/assets/images/icon/Messages.png' },
    { name: 'Photos', src: '/src/lib/assets/images/icon/Photos.png' },
    { name: 'Safari', src: '/src/lib/assets/images/icon/Safari.png', usable: true },
    { name: 'System Settings', app_name: 'System_Settings', src: '/src/lib/assets/images/icon/System_Settings.png', usable: true },
];
const topBarText: TopBar[] = [
    { name: 'Finder', text: ['Files', 'Edit', 'View', 'Go', 'Window', 'Help'] },
    { name: 'Notes', text: ['Files', 'Edit', 'Format', 'View', 'Window', 'Help'] },
    { name: 'Mail', text: ['Files', 'Edit', 'View', 'Mailbox', 'Message', 'Format', 'Window', 'Help'] },
    { name: 'Safari', text: ['Files', 'Edit', 'View', 'History', 'Bookmarks', 'Window', 'Help'] },
    { name: 'System Settings', app_name: 'System_Settings', text: ['Files', 'Edit', 'View', 'Window', 'Help'] },
]
let activeAppName: string = 'Finder';
let windowOrder: string[] = [];
$: activeTopBar = topBarText.find((el) => (el?.app_name || el?.name) == activeAppName) as TopBar;

const isOpen = (name: string, arr: string[]) => arr?.some(el => el?.startsWith(name)); 

let uniqueName: string;

$: if (windowOrder?.length === 0) activeAppName = 'Finder';


const powerOnDevice = (device: HTMLElement) => {
    const helloScreen = device?.querySelector('.hello-screen');
    if (!device || !helloScreen) return;

    device.style.removeProperty('transform');
    isHelloScreen = false;

    device?.removeEventListener('click', () => { powerOnDevice(device) });
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
const openOrCloseWindow = (name: string, link: string = '') => {
    const nbrAppPageOpen = document?.querySelectorAll(`.app-window[data-app-name='${name}']`)?.length;
    uniqueName = `${name}-${nbrAppPageOpen + 1}`;

    //if (appWindow || !app) return;
    //if (!open) onBlur(name);

    const parent = document?.getElementById('desktop');
    if (!parent) return;
    windowOrder = [...windowOrder, uniqueName];
    const child = new Window({
        target: parent,
        props: {
            name: name,
            safariLink: link,
            open: (name: string, link: string = '') => { openOrCloseWindow(name, link) },
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
onMount(async () => {
    const device = document.getElementById('device');
    device?.addEventListener('click', () => { powerOnDevice(device) })

    const allElements = [
        {name: 'desktop', is_icon: true, html: document.getElementById('desktop') },
        {name: 'dock', is_icon: true, html: document.getElementById('dock') },
        {name: 'screen', html: document.getElementById('screen') },
    ];

    allElements?.forEach(data => {
        const value = localStorage.getItem(data.name);
        const path = data?.is_icon ? 'icon_size' : 'font_size';
        const prop = data?.is_icon ? '--icon-size' : '--font-size';
        if (data.html && value) data.html.style.setProperty(prop, `${JSON.parse(value)?.[path]}px`);
        console.log(data.html, value, path)
    }) 
})
</script>

<svelte:window bind:innerWidth={windowWidth}/>

<main>
    <div id='device' style="transform: scale(.5);">
        <img src={device} alt="">
        <div id="screen">
            <div>
                {#if isHelloScreen}
                    <div class="hello-screen" transition:fade={{  duration: 500 }}></div> 
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
                                        on:dblclick={() => { openOrCloseWindow(app?.app_name || app?.name) }}
                                    > 
                                        <img class='icon' src={app.src} alt="">
                                    </button>
                                    <button class="app"
                                        data-name-app={app?.app_name || app?.name}
                                        on:click={(e) => { topBarTextChange(e) }}
                                        on:dblclick={() => { openOrCloseWindow(app?.app_name || app?.name) }}
                                    > 
                                        <p><span>{app.name}</span></p>
                                    </button>
                                </div>
                        {/each}
                    </div>
                </div>
                <div id="dock">
                    {#each dockApps as app}
                        <button class="app {!app?.usable ? 'unusable' : ''}"
                            data-name-app={app?.app_name || app?.name}
                            on:click={(e) => { topBarTextChange(e); openOrCloseWindow(app?.app_name || app?.name) }}
                        >  
                            <img class='icon' src={app.src} alt="">
                            {#if isOpen(app?.name, windowOrder) || app.name == 'Finder'}
                                <span class="dot"></span>
                            {/if}
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
    --icon-ratio: var(--icon-size-desktop);
    --font-size-ratio: 6px;
    /*--icon-width: calc(var(--icon-ratio) * 2);*/
    --icon-width: var(--icon-ratio);
    /* --icon-width: 32px; /* Realistic one. But font too small if also realist*/
    --nav-color: #F6F6F65C;
    --nav-blur: 8.5rem;
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
.hello-screen {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 102%;
    height: 102%;
    background-color: black;
    z-index: 1000;
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
    --column-width: calc(var(--icon-size) + calc(var(--icon-size) / 1.5));
    --width: calc(var(--icon-size) * 1.5);
    height: 100%;
    display: flex;
    width: 90%;
    /*display: grid;
    max-width: 90%;
    margin: 0 auto;
    grid-template-columns: repeat(auto-fill, var(--column-width));
    grid-template-rows: repeat(auto-fill, calc(var(--icon-width) + 40px));*/
    gap: 5px;
    padding: 8px 0 var(--max-width);
    transition: transform .32s ease;
}
#dock {
    --icon-width: var(--icon-ratio);
    --borr: .6rem;
    box-shadow: 0 0 6px 0 var(--color-shadow);
    border-radius: var(--borr);
    background-color: var(--nav-color); 
    backdrop-filter: blur(var(--nav-blur));
    display: flex;
    width: fit-content;
    overflow: hidden;
    margin: 0 auto 2px auto;
    padding: 2px 2px 4px 2px;
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
    gap: 2px;
}
.app {
    --borr: 2px;
    min-width: var(--icon-size-desktop);
    text-align: center;
    font-weight: 600;
    text-shadow: 0 1px 1px var(--color-shadow);
    border-radius: var(--borr);
    position: relative;
}
#dock .app {
    width: var(--icon-size);
}
.dot {
    width: 2px;
    height: 2px;
    background-color: rgba(0, 0, 0, .5);
    border-radius: 50%;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
}
.app > p {
    --font-size: calc(var(--icon-size) / 4);
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    /* line-height: 1; */
    /*max-height: var(--app-name-max-height);*/
    font-size: var(--font-size);
}
.app > p > span {
    padding: 0 2px;
    border-radius: var(--borr);
}
.app-container:focus-within button img {
    box-shadow: 0 0 0px 2px #4D4D4D;
    background-color: #0000002E;
}
.app-container:focus-within button p span {
    background-color: #007AFF;
}
#icon-placement .app:focus img {
    box-shadow: 0 0 0px 1px var(--color-border);
    border-radius: var(--borr);
}
#desktop .icon {
    width: var(--icon-size);
}
#dock .icon {
    width: var(--icon-size);
}
</style>
