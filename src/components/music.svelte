<script lang="ts">
import { onDestroy, onMount } from "svelte";

const songs = [
    { name: 'Rick Astley - Never Gonna Give You Up', src_name: 'Rick Roll', time: '3:32', artist: 'Rick Astley', album: '', genre: '', plays: '' },
]
const navBtns = [
    { name: 'Home', icon: '􀎞', title: 'Apple Music' },
    { name: 'Radio', icon: '􀌙' },
    { name: 'Recently Added', icon: '􀐫', title: 'Library' },
    { name: 'Artists', icon: '􀑫' },
    { name: 'Albums', icon: '􀐋' },
    { name: 'Songs', icon: '􀑪', active: true },
    { name: 'iTunes Store', icon: '􀋂', title: 'Store' },
    { name: 'All Playlists', icon: '􀦲', title: 'Playlists' },
]

let music: HTMLAudioElement;
let timeBar: HTMLInputElement;
let volumeBar: HTMLInputElement;
let volume = .1;
let currTime: number = 0;
let duration: number = 0;
let isTimerChanging: boolean = false;

let tabName: string = 'Songs';

let isPlaying: boolean = false;
let activeMusic: string = '';

$: activeMusicData = songs.find(song => song?.src_name === activeMusic);

const playMusic = (name: string) => {
    if (activeMusic === name) return;
    if (isPlaying && music) {
        music.pause();
        isPlaying = false;
    }

    activeMusic = name;
    music = new Audio(`/src/lib/assets/music/${name}.mp3`);

    music?.addEventListener('canplaythrough', () => {
        if (!music) return;

        music.volume = volume;

        duration = music.duration;

        music?.addEventListener('timeupdate', () => {
            if (isTimerChanging) return;

            currTime = music.currentTime;
            progressBar(timeBar, '#7C7C7C', '#7C7C7C59');
            const percent = currTime / duration * 100;
            if (timeBar) timeBar.value = percent?.toFixed(1);
        })

    })
}

onMount(() => {
    const storVolume = localStorage.getItem('volume'); 
    if (storVolume) volume = +storVolume;

    timeBar?.addEventListener('input', updateTimer)
    timeBar?.addEventListener('change', changeOnReleaseTimer)
    volumeBar?.addEventListener('input', updateVolume)
    volumeBar?.addEventListener('change', saveVolume)
})
onDestroy(() => {
    timeBar?.removeEventListener('input', updateTimer);
    timeBar?.removeEventListener('change', changeOnReleaseTimer);
    volumeBar?.removeEventListener('input', updateVolume);
    volumeBar?.removeEventListener('change', saveVolume)
})
const saveVolume = () => {
   localStorage.setItem('volume', volume.toString()) 
}
const updateVolume = (e: Event) => {
    const target = e?.target as HTMLInputElement;
    const value = +target?.value;

    volume = value / 100;
    progressBar(volumeBar, '#7C7C7C', 'var(--dark-grey)');
    if (music) music.volume = value / 100;
}
const updateTimer = (e: Event) => {
    const target = e?.target as HTMLInputElement;

    console.log('input');
    isTimerChanging = true;

    const value = target?.value;
    const time = +value / 100 * duration;
    progressBar(timeBar, '#7C7C7C', '#7C7C7C59');

    if (music) music.currentTime = time;
    if (music?.paused) {
        music.play();
        isPlaying = true;
    }
}
const changeOnReleaseTimer = () => {
    isTimerChanging = false;
} 
const playPauseBtn = () => {
    if (!music) {
        isPlaying = !isPlaying;
        const name = songs[0].src_name;
        playMusic(name);
        if (music) (music as HTMLAudioElement).play();
        return;
    }

    isPlaying = !isPlaying;
    if (music.paused) { music?.play() } else { music?.pause() };
}
const volumeMinMax = (vol: number) => {
    if (music) music.volume = vol;
    volume = vol;

    if (volumeBar) volumeBar.value = `${vol * 100}`;
    saveVolume();
}
const progressBar = (range: HTMLInputElement, color1: string, color2: string) => {
    if (!range) return;

    const min = 0;
    const max = 100;
    const value = +range.value;

    console.log(range, min, max, value)
    range.style.background = `linear-gradient(to right, ${color1} 0%, ${color1} ${(value - min)/(max - min)*100}%, ${color2} ${(value - min)/(max - min)*100}%, ${color2} 100%)`;
}
</script>

<div class="app-grid">
    <nav class="full">
        <input type="text" placeholder="Search" />
        {#each navBtns as btn }
            {#if btn?.title}
               <h5>{btn?.title}</h5> 
            {/if}
           <button class="line flex {btn?.name === tabName ? 'focused' : ''}" on:click={() => tabName = btn?.name}>
                <i>{btn?.icon}</i>
                <p>{btn?.name}</p>
            </button> 
        {/each}
    </nav>
    <div class="app-controls track flex">
        <div class="flex controls">
            <button>􀊝</button>
            <button class="medium-i">􀊊</button>
            <button class="big-i" style="width: 12px;" on:click={ playPauseBtn }>{!isPlaying ? '􀊄' : '􀊆'}</button>
            <button class="medium-i">􀊌</button>
            <button on:click={() => music?.loop }>􀊞</button>
        </div>
        <div class="playing-song flex">
            <div class="cover"></div>
            <div class="song-info" >
                {#if !currTime}
                    <i>􀣺</i>
                {/if}
                <p class="{!currTime ? 'hidden' : ''}">{activeMusicData?.name ?? ''}</p>
                <p class="{!currTime ? 'hidden' : ''}">{activeMusicData?.artist?? ''}</p>
                <input class="time-bar {!currTime ? 'hidden' : ''}" bind:this={timeBar} value='0' type="range">
            </div>
        </div>
        <div class="flex volume">
            <button on:click={() => volumeMinMax(0) }>􀊡</button>
            <input class="volume-bar"
                style="background: linear-gradient(to right, #7C7C7C 0%, #7C7C7C {volume * 100}%, var(--dark-grey) {volume * 100}%, var(--dark-grey) 100%)
                "
                bind:this={volumeBar} value='{volume * 100}' type="range" >
            <button on:click={() => volumeMinMax(1) }>􀊩</button>
        </div>
        <div class="flex controls">
            <button>􀌮</button>
            <button>􀋲</button>
        </div>
    </div>
    <div class="app-content">
        {#if tabName === 'Songs'}
            <h2>Songs</h2>
            <div class="infos grid">
                <p></p>
                <p>Title</p>
                <p class="align-center">􀌋</p>
                <p class="align-right">Time</p>
                <p>Artist</p>
                <p>Album</p>
                <p>Genre</p>
                <p class="align-center">􀋂</p>
                <p class="align-right">Plays</p>
            </div>
            <div class="pattern">
                {#each songs as song}
                    <button class="song grid" on:focusin={() => playMusic(song?.src_name) }>
                        <p>{song?.src_name === activeMusic ? '􀊡' : ''}</p>
                        <p>{song?.name}</p>
                        <p class="align-center">􀁸</p>
                        <p class="align-right">{song?.time}</p>
                        <p>{song?.artist}</p>
                        <p>{song?.album}</p>
                        <p>{song?.genre}</p>
                        <p class="align-center">􀋂</p>
                        <p>{song?.plays}</p>
                    </button> 
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
.app-grid {
    --light-grey: #2c2c2a;
    --dark-grey: #21211F;
    --light-grey-track: #3d3d3d;
}
.app-content {
    --height: calc(var(--font-size) + 6px);
    background-color: var(--dark-grey); 
    padding: 0;
    display: flex;
    flex-direction: column;
}
h5 {
    font-size: var(--fz-xxs);
    margin-block: 0.5rem 0.25rem;
}
nav i {
    width: 12px;
}
input, button {
    background: transparent;
    border: none;
    outline: none;
}
input[type=text] {
    width: 100%;
    background: grey;
    border: none;
    outline: none;
    border-radius: 2px;
}
input[type=range], input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
}
.flex {
    display: flex;
    align-items: center;
}
.hidden {
    visibility: hidden;
}
.track .flex {
    color: #7C7C7C;
    font-size: var(--fz-xs);
}
.volume {
    gap: 2px;
}
.controls {
    gap: 4px;
}
.medium-i {
    font-size: calc(var(--font-size) + 3.5px);
}
.big-i {
    font-size: calc(var(--font-size) + 6px);
}
.playing-song {
    width: 100%;
    height: 100%;
    min-width: 150px;
    background-color: var(--light-grey-track);
    border-radius: 2px;
    overflow: hidden;
}
.cover {
    height: 100%;
    aspect-ratio: 1/1;
    background-color: grey;
}
.song-info {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
}
.song-info > i {
    font-size: 18px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.time-bar {
    width: 100%;
    height: 2px;
    background: #7C7C7C59;
}
.time-bar::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    appearance: none;
    height: 10px;
}
.volume-bar {
    width: 40px;
    height: 2px;
    background: var(--dark-grey);
    border-radius: 4px;
}
.volume-bar::-webkit-slider-thumb {
    width: 8px;
    height: 8px;
    background: #1B1B1B;
    outline: 1px solid #7C7C7C;
    border-radius: 50%;
}
.line {
    width: 100%;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 2px;
    opacity: 1;
}
h2 {
    padding-block: 5px;
    font-size: calc(var(--font-size) + 2px);
    font-weight: 500;
    text-align: center;
}
i,
nav p,
h5 {
    color: #7c7c7c;
}
.focused {
    background-color: #7c7c7c80;
}
.line p {
    color: white;
}
.line i {
    color: #e84f6a;
}
.track {
    border-bottom: 1px solid grey;
    background-color: #1b1b1b;
    padding: 2px 10px;
    gap: 20px;
    display: grid;
    grid-template-columns: min-content 1fr min-content min-content;
    overflow-x: auto;
}
.infos {
    min-width: fit-content;
    border-bottom: 1px solid grey;
}
.infos p {
    border-right: 1px solid grey;
}
.infos p:nth-child(2) {
    border-left: 1px solid grey;
}
.pattern {
    min-width: fit-content;
    height: 100%;
    background: repeating-linear-gradient(
        to bottom,
        var(--light-grey),
        var(--light-grey) var(--height),
        transparent var(--height),
        transparent calc(var(--height) * 2)
        );
    /*padding-right: 1rem;*/
}
.song {
    width: 100%;
    height: var(--height);
    font-size: var(--font-size);
}
.grid {
    --100: calc(var(--height) * 10);
    --50: calc(var(--100) / 2);
    --25: calc(var(--100) / 4);
    --10: calc(var(--100) / 8);
    display: grid;
    align-items: center;
    grid-template-columns: var(--10) var(--100) var(--10) var(--25) var(--50) var(--50) var(--25) var(--10) var(--25);
}
.grid p {
    padding-inline: 2px;
    text-align: start;
}
.grid .align-center {
    text-align: center;
}
.grid .align-right {
    text-align: end;
}
.song-info p {
    max-width: 90%;
}
.song p, .song-info p {
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-right: 1px solid transparent;
}
.song p:nth-child(2) {
    border-left: 1px solid transparent;
}
.song:focus, .song:focus-within {
    background-color: #BB2E33;
}
.playing-song:hover input::-webkit-slider-thumb {
    height: 6px;
    width: 2px;
    background: white;
    outline: 1px solid #1B1B1B;
    border-radius: 2px;
    margin-top: 2px;
}
</style>
