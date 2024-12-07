<script lang="ts">
import { activeTopBar } from "$lib/index";
import { onDestroy, onMount } from "svelte";

//export let activeTopBar = {name: 'test', text: 'test text'};

$: ({ name, text } = $activeTopBar);
const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: '2-digit' };

let time: string;
let date: string;


const updatedTime = () => {
    const now = new Date();
    const hours = now?.getHours()?.toString()?.padStart(2, '0');
    const minutes = now?.getMinutes()?.toString()?.padStart(2, '0');

    time = `${hours}:${minutes}`;

    if (time === '00:00') date = new Date().toLocaleDateString('en-GB', options).replace(',', '');
}
let interval: any;
let music: HTMLAudioElement;
let timeBar: HTMLInputElement;
const startVolume = .1;
let currTime: number = 0;
let duration: number = 0;
let isTimerChanging: boolean = false;

onMount(() => {
    updatedTime();
    date = new Date().toLocaleDateString('en-GB', options).replace(',', '');

    interval = setInterval(updatedTime, 1000);

    music = new Audio('/src/lib/assets/music/Rick Roll.mp3');

    music?.addEventListener('canplaythrough', () => {
        if (!music) return;

        music.volume = startVolume;

        duration = music.duration;

        music?.addEventListener('timeupdate', () => {
            if (isTimerChanging) return;

            currTime = music.currentTime;
            const percent = currTime / duration * 100;
            if (timeBar) timeBar.value = percent?.toFixed(1);
        })
    })
})
onDestroy(() => {
    clearInterval(interval);
})
const updateVolume = (e: Event) => {
    const target = e?.target as HTMLInputElement;
    if (!music || !target) return;

    const value = +target?.value;
    console.log(value)
    music.volume = value / 100;
}
const updateTimer = () => {
    isTimerChanging = true;
}
const changeOnReleaseTimer = (e: Event) => {
    const target = e?.target as HTMLInputElement;
    if (!music || !target) return;

    isTimerChanging = false;

    const value = target?.value;
    const time = +value / 100 * duration;
    console.log(time, duration, +value)
    music.currentTime = time;

    if (music.paused) music.play();
} 
let openMenu: boolean = true;

const closeMenu = (e) => {
    if (openMenu) openMenu = false;
}
</script>


<div id="top-bar">
    <div class="tb-text flex">                    
        <p class="tb-logo"></p>
        <p>{name}</p>
        {#each text as str}
            <p>{str}</p>
        {/each}
        <div class="flex f-icon">
            <!--<div class="menu-container" role="button" tabindex="0" on:focusout={(e) => closeMenu(e) }>
                <button on:click={(e) => { e.preventDefault(); e.stopPropagation(); openMenu = !openMenu}}>􀊕</button>
                {#if openMenu}
                    <div class="menu">
                        <button on:click={() => music?.paused ? music?.play() : music?.pause() }>PLAY/PAUSE</button>
                        <input class="time-bar" bind:this={timeBar} value='0' type="range" on:input={updateTimer} on:change={changeOnReleaseTimer}>
                        <input class="volume-bar" value='{startVolume * 100}' type="range" on:input={updateVolume}>
                    </div> 
                {/if}
            </div>-->
            <!-- <i>􀊕</i> <!-- play -->
            <i>􀙇</i> <!-- wifi -->
            <i>􀊫</i> <!-- spotlight -->
            <i>􀜊</i> <!-- control center -->
            <p style="width: 90px;">{date} <span>{time}</span></p>
        </div>
    </div>
    <div class="tb-text flex fullscreen">                    
        <p class="tb-logo">􀣺</p>
        <p>{name}</p>
        {#each text as str}
            <p>{str}</p>
        {/each}
        <div class="flex f-icon">
            <i>􀊕</i> <!-- play -->
            <i>􀙇</i> <!-- wifi -->
            <i>􀊫</i> <!-- spotlight -->
            <i>􀜊</i> <!-- control center -->
            <p style="width: 85px">{date} <span>{time}</span></p>
        </div>
    </div>
</div>

<style>
#top-bar {
    width: 100%;
    backdrop-filter: blur(50px);
    background-color: #0000002E;
    z-index: 997;
    color: var(--color-text);
    font-size: var(--fz-s);
    /*overflow: hidden;*/
    padding-block: 4px;
    transition: transform .32s ease;
}
#top-bar p:nth-child(1) {
    font-size: var(--fz-l);
}
#top-bar p:nth-child(2) {
    font-weight: 600;
}
.f-icon {
    margin-left: auto;
    gap: 10px;
}
p span {
    margin-left: 2px;
}
.flex {
    display: flex;
    height: 100%;
    align-items: center;
}
.fullscreen {
    position: absolute;
    top: 0;
    left: 100%;
    opacity: 0;
    transition: opacity .12s ease;
}
.fullscreen:hover {
    opacity: 1;
}
.tb-text {
    width: 100%;
    gap: 15px;
    padding: 0 14px;
}
button {
    background: transparent;
    border: none;
    outline: none;
    height: 100%;
}
.menu-container {
    position: relative;
}
.menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--dark-menu);
    backdrop-filter: blur(var(--blur));
    border-radius: 4px;
}
</style>
