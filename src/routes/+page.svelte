<script lang="ts">
import { PUBLIC_NAME } from '$env/static/public';
import { onDestroy, onMount } from 'svelte';
import { isResponsive } from '$lib/store';
import { apps } from '$lib/apps'
import type { App } from '$lib/apps/types';
import appWindow from '$lib/apps/window-management';
import appWindows from '$lib/apps/window-management/store';
import Shortcut from '$lib/components/shortcut.svelte';
import Svg from '$lib/components/svg.svelte';
import Loader from '$lib/components/loader.svelte';
import Toaster from '$lib/components/toaster.svelte';
import Window from '$lib/components/window.svelte';
import { browser } from '$app/environment';

const dateOptions: Record<string, Intl.DateTimeFormatOptions> = {
    lock_screen: {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    },
    top_bar: {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
    }
}
const maxWidthIphone: number = 1280;
const pcAppsMap = new Map<string, App & { top_bar: string[] }>();

const formatDate = (options: Intl.DateTimeFormatOptions) => new Date().toLocaleDateString('fr', options).replace(',', '');
const formatTime = (time: number) => time.toString().padStart(2, '0');
const updatedTime = () => {
    const now = new Date();
    const hours = formatTime(now.getHours());
    const minutes = formatTime(now.getMinutes());

    time = `${hours}:${minutes}`;

    if (time === '00:00') {
        const options = dateOptions[isPowerOn ? 'top_bar' : 'lock_screen'];
        date = formatDate(options);
    }
}

let timeInterval: ReturnType<typeof setInterval>;
let date: string = formatDate(dateOptions.lock_screen);
let time: string; 

let desktopContent: App[] = [];
let dockContent: App[] = [];

let isPowerOn: boolean = false;
let isPageLoaded: boolean = false;
let isDeviceLoaded: boolean = false;
let isWallpaperLoaded: boolean = false;

let language: string = 'Français';
let screen: HTMLElement | undefined = undefined;

$: lastAppWindow = $appWindows[$appWindows.length - 1];
$: topBarName = lastAppWindow ? lastAppWindow.data.type : 'Finder';
$: topBarData = pcAppsMap.get(topBarName) ?? { name: '', top_bar: []};

$: isEverythingLoaded = isPageLoaded && isDeviceLoaded && isWallpaperLoaded;

apps.pc.global.forEach(app => pcAppsMap.set(app.type, app));
updatedTime();

onMount(() => {
    const device: HTMLImageElement | null = document.querySelector('.device__img');
    const wallpaper: HTMLImageElement | null = document.querySelector('.background__img');

    screen = document.querySelector('.device__lock-screen') as HTMLElement;
    timeInterval = setInterval(updatedTime, 1000);

    if (screen) screen.addEventListener('click', onPowerOn);

    if (device && device.complete) isDeviceLoaded = true;
    if (wallpaper && wallpaper.complete) isWallpaperLoaded = true;

    onWindowResize();
    if (browser) window.addEventListener('resize', onWindowResize)

    isPageLoaded = true;
})
onDestroy(() => {
    clearInterval(timeInterval);
    if (browser) window.removeEventListener('resize', onWindowResize)
})

const onPowerOn = () => {
    isPowerOn = true;
    date = formatDate(dateOptions.top_bar);

    if (screen) screen.removeEventListener('click', onPowerOn);
}
const homeButtonAction = () => {
    if ($appWindows.length <= 0) return;

    appWindows.set([]);
}
const onWindowResize = () => {
    const isWindowSmaller = window.innerWidth <= maxWidthIphone;

    const desktopContentUpdated = isWindowSmaller ? apps.mobile.desktop : apps.pc.desktop;
    const dockContentUpdated = isWindowSmaller ? apps.mobile.dock : apps.pc.dock;

    if (desktopContentUpdated !== desktopContent) desktopContent = desktopContentUpdated;
    if (dockContentUpdated !== dockContent) dockContent = dockContentUpdated;
}
</script>

<main class="main">
    {#if !isEverythingLoaded}
        <Loader /> 
    {/if}
    <section class="main__sect main__sect-1 transition-320-ease" class:hidden={ !isEverythingLoaded }>
        <div class='device'>
            <picture>
                <source media="(max-width: 1280px)" srcset="https://res.cloudinary.com/dejb4brmy/image/upload/f_auto/q_auto/w_auto/portfolio/images/devices/iphone/iPhone_16_Black_Portrait_qquj9o.png">
                <source media="(min-width: 1281px)" srcset="https://res.cloudinary.com/dejb4brmy/image/upload/f_auto/q_auto/w_auto/portfolio/images/devices/macbook/MacBook_Air_Dark_lqrnpi.png">
                <img class="device__img" src="https://res.cloudinary.com/dejb4brmy/image/upload/f_auto/q_auto/w_auto/portfolio/images/devices/macbook/MacBook_Air_Dark_lqrnpi.png" alt={ $isResponsive ? "Iphone 16 noir portrait" : "Macbook Air noir" } on:load={() => isDeviceLoaded = true}> 
            </picture>
            <div class="device__placement">
                <div class="lock-screen device__lock-screen transition-320-ease" class:hidden={isPowerOn}>
                    <div class="lock-screen__date-and-time lock-screen__content"> 
                        <h1 class="lock-screen__h1 lock-screen__text lock-screen__text--faded">{date}</h1>
                        <h2 class="lock-screen__h2 lock-screen__text lock-screen__text--faded">{time}</h2>
                    </div>
                    {#if $isResponsive}
                        <span class="icon lock-screen__icon">
                            <Svg name='flashlight_off_fill' color="#fff" />
                        </span>
                        <span class="icon lock-screen__icon">
                            <Svg name='camera_fill' color="#fff" />
                        </span>
                    {/if}
                    <div class="lock-screen__account lock-screen__content"> 
                        {#if !$isResponsive}
                            <div class="lock-screen__pp"></div>
                            <div>
                                <h3 class="lock-screen__h3 lock-screen__text">{PUBLIC_NAME}</h3>
                                <h4 class="lock-screen__h3 lock-screen__text">Développeur Web</h4>
                            </div>
                        {/if}
                        <p class="lock-screen__p lock-screen__text lock-screen__text--faded">Appuyer sur l'écran<br>pour l'ouvrir</p>
                    </div>
                </div> 
                <div class="screen device__screen">
                    <Toaster />
                    <div class="top-bar {$isResponsive ? 'top-bar--grid' : 'top-bar--flex'} screen__top-bar">
                        {#if $isResponsive}
                            <p class="top-bar__p top-bar__time">{time}</p>
                            <div class="top-bar__icons-wrapper">
                                <span class="top-bar__icon">
                                    <Svg name='cellularbars' color="#fff" />
                                </span>
                                <span class="top-bar__icon">
                                    <Svg name='wifi' color="#fff" />
                                </span>
                                <span class="top-bar__icon">
                                    <Svg name='battery_25percent' color="#fff" />
                                </span>
                            </div>
                        {:else}
                            {#if !isPowerOn}
                                <div class="top-bar__language">
                                    <p class="top-bar__p">{language}</p>
                                    <span class="top-bar__icon">
                                        <Svg name='dock_rectangle' color="#fff" />
                                    </span>
                                </div>
                                <span class="top-bar__icon">
                                    <Svg name='battery_100percent_bolt' color="#fff" />
                                </span>
                                <span class="top-bar__icon">
                                    <Svg name='wifi' color="#fff" />
                                </span>
                            {:else}
                                <span class="top-bar__logo">
                                    <Svg name='apple' color="#fff" />
                                </span>
                                <h5 class="top-bar__h5">{topBarData.name}</h5>
                                {#if topBarData.top_bar}
                                    {#each topBarData.top_bar as str}
                                        <p class="top-bar__p">{str}</p>
                                    {/each}

                                {/if}
                                <div class="top-bar__icons-wrapper">
                                    <span class="top-bar__icon">
                                        <Svg name='battery_100percent_bolt' color="#fff" />
                                    </span>
                                    <span class="top-bar__icon">
                                        <Svg name='wifi' color="#fff" />
                                    </span>
                                    <span class="top-bar__icon">
                                        <Svg name='magnifyingglass' color="#fff" />
                                    </span>
                                    <span class="top-bar__icon">
                                        <Svg name='switch_2' color="#fff" />
                                    </span>
                                    <p class="top-bar__p top-bar__date">{date}
                                        <span class="top-bar__time">{time}</span>
                                    </p>
                                </div>
                            {/if}
                        {/if}
                    </div>
                    <picture class="background screen__background transition-320-ease">
                        <source media="(max-width: 1280px)" srcset="https://res.cloudinary.com/dejb4brmy/image/upload/f_auto/q_auto/w_auto/portfolio/images/wallpapers/mobile/Dark_Orbs_cwpt8t.jpg">
                        <source media="(min-width: 1281px)" srcset="https://res.cloudinary.com/dejb4brmy/image/upload/f_auto/q_auto/w_auto/portfolio/images/wallpapers/pc/Ink_Cloud_pumoik.jpg">
                        <img class="background__img" src='https://res.cloudinary.com/dejb4brmy/image/upload/f_auto/q_auto/w_auto/portfolio/images/wallpapers/pc/Ink_Cloud_pumoik.jpg' alt="Fond d'écran de l'appareil" on:load={() => isWallpaperLoaded = true}>
                    </picture>
                    <div class="desktop screen__desktop transition-320-ease">
                        <div class='icons-placement desktop__icons-placement transition-320-ease' class:hidden={!isPowerOn}>
                            {#each desktopContent as app} 
                                <Shortcut {app} action={() => appWindow(app)} bold /> 
                            {/each}
                        </div>
                        {#each $appWindows as { id, data }, i (id)}
                            <Window appWindowId={ id } appWindowData={ data } zIndex={ i } />   
                        {/each}
                        <div class="dock desktop__dock {$isResponsive ? 'icons-placement' : 'desktop__dock--flex'} transition-320-ease" class:hidden={!isPowerOn} style="{$isResponsive && $appWindows.length > 0 ? 'z-index: -1' : ''}"> 
                            {#each dockContent as app, i}
                                {#if i === dockContent?.length - 2 && !$isResponsive}
                                    <div class="dock__separator"></div>
                                {/if}
                                <Shortcut {app} action={ () => appWindow(app)} dock /> 
                            {/each}
                        </div>
                        {#if $isResponsive}
                            <button class="home-btn desktop__home-btn transition-320-ease" title="Revenir à la page d'accueil" class:hidden={ !isPowerOn || $appWindows.length === 0 } on:click={ homeButtonAction }>
                                <div class="home-btn__bar"></div>
                            </button>
                        {/if}
                    </div>
                </div>
    </section>
</main>

<style>
.hidden {
    visibility: hidden;
    opacity: 0;
}
.transition-320-ease {
    transition-property: transform, opacity;
    transition-duration: 320ms;
    transition-timing-function: ease;
}
.main {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
.main__sect {
    position: relative;
    /*display: grid;
    place-content: center;*/
}
.main__sect-1 {
    /*max-height: 100vh;*/
    margin: auto;
    user-select: none;
    -webkit-user-select: none;
    /*overflow: hidden;*/
}
.device {
    position: relative;
    display: inherit;
}
.device__img {
    /*height: 100vh;
    min-height: 900px;*/
    height: 850px;
    object-fit: cover;
    pointer-events: none;
    position: relative;
    z-index: 2;
}
.device__placement {
    z-index: 1;
    position: absolute;
    inset: 0;
    width: 100%; 
    height: 100%;
    padding: 6.7% 10.1% 6.6%;
    display: grid;
}
.lock-screen {
    position: relative;
    width: 100%;
    height: 100%;
}
.device__lock-screen {
    grid-area: 1/1;
    z-index: 2;
    cursor: pointer;
}
.lock-screen__content {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}
.lock-screen__text {
    color: white;
}
.lock-screen__text--faded {
    opacity: .7;
}
.lock-screen__date-and-time {
    top: 10%;
}
.lock-screen__account {
    text-align: center;
    bottom: 5%;
}
.lock-screen__h1 {
    font-size: 1.25rem;
    font-weight: 500;
    text-transform: capitalize;
}
.lock-screen__h2 {
    font-size: 5.625rem;
    font-weight: 600;
    line-height: 1;
}
.lock-screen__h3 {
    font-size: var(--fz-m);
    font-weight: 500;
}
.lock-screen__p {
    font-size: var(--fz-s);
}
.lock-screen__icon {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    padding: 10px;
    background: var(--dark-fullscreen);
    backdrop-filter: blur(var(--blur));
    position: absolute;
    bottom: 6%;
    right: 10%;
}
.lock-screen__icon:first-of-type {
    left: 10%;
}
.lock-screen__pp {
    width: 3rem;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background: var(--dark-fullscreen);
    backdrop-filter: blur(var(--blur));
}
.screen {
    position: relative;
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: hidden;
    background: #000;
}
.device__screen {
    grid-area: 1/1;
}
.device__screen:global([data-fullscreen]) .screen__background,
.device__screen:global([data-fullscreen]) .desktop__icons-placement {
    transform: translateX(-100%);
}
.device__screen:global([data-fullscreen]) .desktop__dock {
    transform: translateY(105%);
}
.background {
    width: 100%;
    height: 100%;
}
.screen__background {
    position: absolute;
    inset: 0;
    /*animation: zoom-out 25s linear;*/
}
.background__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.desktop {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    /*overflow: hidden;*/
}
.screen__desktop {
    --max-width: 83%;
    height: 100%;
    z-index: 1;
    justify-content: space-between;
}
.desktop__icons-placement {
    --nbr-columns: 10;
    --column-width: 1fr;
    width: var(--max-width);
    padding-block: 10px 45px;
}
.dock {
    position: relative;
    border-radius: 1rem;
    background-color: #4A4A4A63; 
    backdrop-filter: blur(50px);
    padding: 2px 2px 0;
    border: 1px solid #4A4A4A63;
    outline: 1px solid #1a1a1a;
}
.desktop__dock {
    max-width: var(--max-width);
    margin-bottom: 8px;
    z-index: 4;
}
.desktop__dock--flex {
    display: flex;
}
.dock__separator {
    position: relative;
    padding-inline: 10px;
}
.dock__separator::before {
    content: ''; 
    background-color: #414141;
    height: 80%;
    width: 1px;
    position: absolute;
    inset: 0;
    margin: auto;
}
.home-btn {
    width: 32%;
    padding: 10px;
}
.desktop__home-btn {
    position: absolute;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
}
.home-btn__bar {
    width: 100%;
    height: 5px;
    background-color: #fff;
    border-radius: 10px;
}
.top-bar {
    width: 100%;
    background-color: #0000002E;
    backdrop-filter: blur(50px);
}
.screen__top-bar {
    padding-inline: 15px;
    height: var(--top-bar-height);
    z-index: 2;
    transition: transform .32s ease;
}
.top-bar--grid {
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    gap: 7rem;
}
.top-bar--flex {
    gap: 15px;
}
.top-bar--flex,
.top-bar__icons-wrapper,
.top-bar__language {
    display: flex;
    align-items: center;
}
.top-bar__icons-wrapper {
    margin-left: auto;
    gap: 10px;
}
.top-bar__icon {
    height: 10px;
    aspect-ratio: 2/1;
}
.top-bar__language {
    margin-left: auto; 
    gap: 6px;
}
.top-bar__logo {
    height: 12px;
    aspect-ratio: 2/1;
}
.top-bar__h5 {
    font-weight: 600;
}
.top-bar__h5,
.top-bar__p {
    color: #fff;
    font-size: var(--fz-s);
}
.top-bar__time {
    display: inline-block;
    width: 30px;
    text-align: end;
}
.top-bar__date {
    min-width: 95px;
    white-space: nowrap;
}
.top-bar__date:first-letter {
    text-transform: capitalize;
}

/*@keyframes zoom-out {
from {
    scale: 1.1;
}
to {
    scale: 1;
}
}*/

@media (max-width: 1280px) {
    .device__placement {
        padding: 6.5%; 
    }
    .device__img {
        height: 800px;
    }
    .lock-screen__account {
        bottom: 4%;
    }
    .lock-screen__p {
        font-size: var(--fz-m);
    }
    .screen {
        grid-template-rows: 1fr;
        border-radius: 1rem;
    }
    .screen__desktop {
        --max-width: 100%;
    }
    .screen__background {
        animation: none;
    }
    .desktop__icons-placement {
        --nbr-columns: 4;
        padding: 4rem 15px 0;
    }
    .desktop__dock {
        --nbr-columns: 4;
        --column-width: 1fr;
        width: calc(100% - 23px);
        padding: 12px 10px;
        border-radius: 45px;
        bottom: 13px;
        margin: 0;
    }
    .screen__top-bar {
        position: absolute;
        top: 2.5%;
        background: transparent;
        backdrop-filter: none;
        z-index: 1000
    }
    .top-bar__p {
        font-size: var(--fz-xl);
    }
    .top-bar__time {
        width: auto;
        text-align: center;
    }
    .top-bar__icons-wrapper {
        gap: 4px;
        margin: 0 auto;
    }
    .top-bar__icon {
        height: 12px;
    }
}
</style>
