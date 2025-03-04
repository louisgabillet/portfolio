<script lang="ts">
import { isResponsive, playingAudio } from "$lib/index";
//import { type Song } from "$lib/data";
import { onDestroy, onMount } from "svelte";
import Svg from "./svg.svelte";
import { fileSystem, type FileSystem, type Song } from "$lib/filesystem";
import { createPlayer } from "$lib/audio/player";
import { playlists } from "$lib/audio/playlists";
import { songs } from "$lib/audio/songs";

type PlaylistName = 'Morceaux Favoris' | 'Test' | 'Test 2' | 'Rock';
//interface Playlist {
//    //uuid: string,
//    id: string,
//    track_id: string[],
//    metadata: {
//        name: string,
//        desc: string,
//    },
//    visual: {
//        cover: {
//            name: string | null,
//            color: string | null,
//            background_color: string | null,
//        },
//        nav_btn: {
//            name: string | null,
//            color: string | null,
//        }
//    }
//}
//
//const playlistsData: Playlist[] = [
//    {
//        id: '0',
//        track_id: ['1'],
//        metadata: {
//            name: 'Morceaux Favoris',
//            desc: 'Mes morceaux favoris.',
//        },
//        visual: {
//            cover: {
//                name: 'star_fill',
//                color: '#e84f6a',
//                background_color: '#fff',
//            },
//            nav_btn: {
//                name: 'star_square',
//                color: null,
//            },
//        }
//    },
//    {
//        id: '1',
//        track_id: [],
//        metadata: {
//            name: 'Test',
//            desc: 'un test.',
//        },
//        visual: {
//            cover: {
//                name: null,
//                color: null, 
//                background_color: null, 
//            },
//            nav_btn: {
//                name: null,
//                color: null, 
//            },
//        }
//    },
//    {
//        id: '2',
//        track_id: ['2'],
//        metadata: {
//            name: 'Test 2',
//            desc: 'un test n°2.',
//        },
//        visual: {
//            cover: {
//                name: null,
//                color: null, 
//                background_color: null, 
//            },
//            nav_btn: {
//                name: null,
//                color: null, 
//            },
//        },
//    },
//    {
//        id: '3',
//        track_id: ['2', '1'],
//        metadata: {
//            name: 'Rock',
//            desc: 'Rock enjoyer.',
//        },
//        visual: {
//            cover: {
//                name: null,
//                color: null, 
//                background_color: null, 
//            },
//            nav_btn: {
//                name: null,
//                color: null, 
//            },
//        },
//    },
//]

//const findByPath = (arr: FileSystem[], path: string[]) => {
//    let currentLevel: FileSystem[] = arr;
//
//    for (const key of path) {
//        const nextLevel = currentLevel.find(obj => obj.name === key);
//
//        if (nextLevel?.children) {
//            currentLevel = nextLevel.children as FileSystem[];
//        } else {
//            return []; 
//        }
//    }
//    return currentLevel;  
//}
//function getAllSongs(arr: FileSystem[]) {
//    let songs: Song[] = []; 
//
//    arr.forEach(item => {
//        const isFolder = item.type === 'Folder';
//        if (isFolder) {
//            songs = songs.concat(getAllSongs(item.children));
//        }
//        else {
//            songs.push(item as Song);
//        }
//    });
//
//    return songs;
//}
//const songsParent: FileSystem[] = findByPath(fileSystem, ['Macintosh HD', 'Utilisateur', 'louisgabillet', 'Musique', 'Media', 'Musique']); 
//const songs: Song[] = getAllSongs(songsParent);

//const sortPlaylists = () => {
//    playlistsData.forEach(playlist => {
//        //playlist.songs = songs?.filter(song => song.playlists.includes(playlist.uuid ?? ''));
//        playlist.songs = playlist.songs_id.map(id => songs.find(song => song.id === id) as Song);
//    })
//
//    return playlistsData;
//}
//const allPlaylists = sortPlaylists();

interface NavBtn {
    name: PlaylistName | string,
    svg_name: string,
    color: string,
    title?: string,
    active?: boolean,
    playlist_id?: string;
}
const navBtns: NavBtn[]  = [
    { 
        name: 'Écouter',
        svg_name: 'play_circle',
        color: '#e84f6a',
        title: 'Apple Music' 
    },
    {
        name: 'Explorer',
        svg_name: 'square_grid_2x2',
        color: '#e84f6a',
    },
    {
        name: 'Radio',
        svg_name: 'dot_radiowaves_left_and_right',
        color: '#e84f6a',
    },
    { 
        name: 'Ajouté récemment',
        svg_name: 'clock',
        color: '#e84f6a',
        title: 'Library' 
    },
    {
        name: 'Artistes',
        svg_name: 'music_microphone',
        color: '#e84f6a',
    },
    {
        name: 'Albums',
        svg_name: 'square_stack',
        color: '#e84f6a' 
    },
    {
        name: 'Morceaux',
        svg_name: 'music_note',
        color: '#e84f6a' 
    },
    {
        name: 'iTunes Store',
        svg_name: 'star',
        color: '#da72ff',
        title: 'Store'
    },
    {
        name: 'Toutes les playlists',
        svg_name: 'square_grid_3x3',
        color: '#7c7c7c',
        title: 'Playlists',
        active: true, 
    },
    ...playlists.map(playlist => (
        {
            name: playlist.metadata.name,
            svg_name: playlist.visual.nav_btn.name ?? 'music_note_list',
            color: playlist.visual.nav_btn.color ?? '#7c7c7c',
            background_color: playlist.visual.cover.background_color ?? '#6e6e6e',
            active: true,
            playlist_id: playlist.id,
        }
    ))
]

//let currPlaylistName: string = '';
//$: currPlaylist = allPlaylists.find(playlist => playlist.name === currPlaylistName) as NavBtn & Playlist;
let currPlaylistId: string = '';
$: currPlaylist = playlists.find(playlist => playlist.id === currPlaylistId);

$: currPlaylistSongs = getSongInPlaylist(currPlaylist); 
$: currPlaylistMetadata = currPlaylist?.metadata;
$: currPlaylistCover = currPlaylist?.visual.cover;

const getSongInPlaylist = (playlist: Playlist | undefined) => {
    if (playlist) {
        return playlist.track_id.map(track_id => getSongById(track_id));
    }

    return [];
}
const getSongById = (id: string) => {
    return songs.find(song => song.id === id);
}
const timeToSeconds = (time: string): number => {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
}
const getProgressAndRemainingTime = (percent: number = 0) => {
    const roundMin = (nbr: number) => Math.floor(nbr / 60);
    const roundSec = (nbr: number) => Math.floor(nbr % 60);
    const format = (min: number, sec: number) => `${min}:${sec < 10 ? '0' : ''}${sec}`

    const newDuration = duration * percent / 100;
    const min = roundMin(newDuration);
    const sec = roundSec(newDuration);

    const remainingTime = duration - newDuration;
    const remainingMin = roundMin(remainingTime);
    const remainingSec = roundSec(remainingTime);

    const progress = format(min, sec);
    const remaining = format(remainingMin, remainingSec);

    return {
        progress,
        remaining,
    }
}

const getAproximateTime = (arr: Playlist|undefined) => {
    if (!arr) return;
    const isPlural = (el: number) => el > 1 ? 's' : '';
    const totalSeconds = arr.songs.reduce((acc, obj) => acc + timeToSeconds(obj.time), 0);

    const days = totalSeconds/ 86400;
    const hours = totalSeconds / 3600; 
    const minutes = totalSeconds / 60; 
    if (minutes < 60) {
        return `${Math.round(minutes)} minute${isPlural(minutes)}`;
    } else if (hours < 24) {
        return `${(hours).toFixed(2)} hour${isPlural(hours)}`;
    } else {
        return `${(days).toFixed(2)} day${isPlural(days)}`;
    }
}

let music: HTMLAudioElement = new Audio();
//let volume = .1;
let volumeBarValue: number = 10;
let timeBarValue: number = 0;
let duration: number = 0;
let isTimerChanging: boolean = false;

let tabName: string = 'Toutes les playlists';

let isPlaying: boolean = false;
let activeMusic: string = '';

$: activeMusicData = songs.find(song => song?.url === activeMusic);
$: activeMusicIndex = songs.findIndex(song => song.url === activeMusic);
$: activeMusicName = activeMusicData?.secret_name ?? activeMusicData?.name ?? '';
$: activeMusicArtist = activeMusicData?.secret_artist ?? activeMusicData?.artist ?? '';

const playMusic = async (name: string) => {
    if (activeMusic === name) { 
        music.currentTime = 0;
        return;
    }

    try {
        const res = await fetch(`https://res.cloudinary.com/dejb4brmy/video/upload/q_auto/portfolio/${name}`);
        if (res.ok) {
            music.src = res.url;
        } else {
            if (res.status === 404) throw new Error('404, Not found');
            throw Error("Could not play the song");
        }
    } catch (err) {
        resetMusic();
        console.error(err);
        return;
    }

    console.log('play')
    activeMusic = name;
    playingAudio.set({
        html: music,
        name: name,
    });

    const hasSecretMusicPlayed = sessionStorage.getItem('secret_music_played');
    if (activeMusic === "never_gonna_give_you_up_dugl1z.mp3" && hasSecretMusicPlayed !== 'true') {
        sessionStorage.setItem('secret_music_played', 'true');
    }
}
const resetMusic = () => {
    isPlaying = false;
    activeMusic = '';
    if (music.src) {
        music.src = '';
        timeBarValue = 0;
        music.load()
        playingAudio.set({
            html: null,
            name: '',
        });
    }
}

const player = createPlayer();

onMount(() => {
    music.addEventListener('timeupdate', onTimeUpdate);
    music.addEventListener('canplaythrough', () => {
        if (isTimerChanging) return;
        duration = music.duration;
        console.log('play 2')
        music.play();
        isPlaying = true;
    })

    const conditionToNextSong: boolean = activeMusicIndex < songs.length - 1;
    music.onended = () => goPrevOrNextSong(conditionToNextSong, 1);

    const storedVolume = localStorage.getItem('volume');
    if (storedVolume) {
        volumeBarValue = +storedVolume
        music.volume = +storedVolume / 100;
    }

    const storedLoop = localStorage.getItem('loop');
    if (storedLoop) music.loop = storedLoop === 'true';

    const { html, name } = $playingAudio;
    if (html) {
        music = html;
        isPlaying = !music.paused;
        activeMusic = name;
        duration = music.duration
        onTimeUpdate();
    }
})
onDestroy(() => {
    //music.removeEventListener('timeupdate', onTimeUpdate);
})
const onTimeUpdate = () => {
    if (isTimerChanging || !isPlaying) return;
    const percent = music.currentTime / duration * 100;
    timeBarValue = percent;
}
const saveVolume = () => {
    localStorage.setItem('volume', volumeBarValue.toString()) 
}
const changeVolume = () => {
    const volume = volumeBarValue / 100;
    music.volume = volume;
}
const changeCurrTime = () => {
    isTimerChanging = true;
    const newTime = timeBarValue / 100 * duration;
    music.currentTime = newTime;
}
const playPauseBtn = () => {
    if (!$player.audio.src) {
        const data = currPlaylistSongs.length > 0 ? currPlaylistSongs : songs;
        if (data[0]) {
            $player.tracks = data;
            $player.track_id = data[0].id;
        }
    }
    player.togglePlay();
    console.log($player);
    //if (!activeMusic) {
    //    isPlaying = true;
    //    const name = currPlaylistSongs[0] ? currPlaylistSongs[0].url : songs[0].url;
    //    playMusic(name);
    //    return;
    //}
    //if (music.paused) {
    //    music.play();
    //    isPlaying = true;
    //    return;
    //}
    //music.pause();
    //isPlaying = false;
}
const changeLoopState = () => {
    music.loop = !music.loop;
    localStorage.setItem('loop', music.loop.toString());
}
const volumeMinMax = (e: Event, vol: number) => {
    volumeBarValue = vol;
    music.volume = vol / 100;
    saveVolume();
}
const progressBar = (range: HTMLInputElement, color1: string, color2: string) => {
    if (!range) return;

    const min = 0;
    const max = 100;
    const value = +range.value;

    range.style.background = `linear-gradient(to right, ${color1} 0%, ${color1} ${(value - min)/(max - min)*100}%, ${color2} ${(value - min)/(max - min)*100}%, ${color2} 100%)`;
}
const onTabClick = (name: string, id: string | undefined) => {
        currPlaylistId = id ?? '';
        tabName = name
}
const goPrevOrNextSong = (condition: boolean, direction: 1 | -1) => {
    if (!music || activeMusicIndex < 0) return;
    
    if (condition) {
        const nextSong = songs[activeMusicIndex + direction];
        if (nextSong) playMusic(nextSong.url);
    } else {
        resetMusic();
    }
}
</script>

<div class="app__grid">
    <nav class="sidebar app__sidebar">
        {#each navBtns as {name, svg_name, color, title, active, playlist_id}}
            {#if title}
                <h5 class="sidebar__title sidebar__category sidebar__text--overflow">{title}</h5> 
            {/if}
            {#if active}
                <button class="sidebar__item sidebar__item--grid" class:sidebar__item--focused={ name === tabName } on:click={() => onTabClick(name, playlist_id) }>
                    <Svg name={svg_name} {color} />
                    <span class="sidebar__text sidebar__text--overflow">{name}</span>
                </button> 
            {:else}
                <div class="sidebar__item sidebar__item--grid sidebar__item--desactivated">
                    <Svg name={svg_name} {color} />
                    <span class="sidebar__text sidebar__text--overflow">{name}</span>
                </div>
            {/if}
        {/each}
    </nav>
    <!--{#if $isResponsive}
        <div class="controls grid">
            <button class="{currPlaylistName ? 'active' : ''}" on:click={() => currPlaylistName = ''}>
                <span class="icon">
                    <Svg name='chevron_left' color='#e84f6a' />
                </span>
                {!currPlaylistName ? 'Bibliothèque' : ''} 
            </button>
            <h2>{!currPlaylistName ? 'Playlists' : ''}</h2>
            <div class="flex">
                {#if !currPlaylistName}
                    <div class="round">
                        <span class="icon">
                            <Svg name='plus' color='#e84f6a' />
                        </span>
                    </div>
                    <div class="round">
                        <span class="icon">
                            <Svg name='line_3_horizontal_decrease' color='#e84f6a' />
                        </span>
                    </div>
                {/if}
                <div class="round">
                    <span class="icon">
                        <Svg name='ellipsis' color='#e84f6a' />
                    </span>
                </div>
            </div>
        </div>
    {/if}-->
    <div class="controls app__controls track">
        <span class="controls__item controls__item--distance-left">
            <Svg name='shuffle' color="#414141" />
        </span>
        <button class="controls__item controls__btn controls__btn--hover controls__btn--{activeMusic ? 'active' : 'desactivated'}" 
            on:click={() => goPrevOrNextSong(activeMusicIndex > 0, -1)}>
            <Svg name='backward_fill' color={activeMusic ? "#7c7c7c" : "#414141"} />
        </button>
        <button class="controls__item controls__btn controls__btn--play controls__btn--hover" on:click={ playPauseBtn }>
            <Svg name={$player.isPlaying ? 'pause_fill' : 'play_fill'} />
            <!--{#if isPlaying}
                <Svg name='pause_fill' />
            {:else}
                <Svg name='play_fill' />
            {/if}-->
        </button>
        <button class="controls__item controls__btn controls__btn--hover controls__btn--{activeMusic ? 'active' : 'desactivated'}" 
            on:click={() => goPrevOrNextSong(activeMusicIndex < songs.length - 1, 1)}>
            <Svg name='forward_fill' color={activeMusic ? "#7c7c7c" : "#414141"} />
        </button>
        <button class="controls__item controls__item--distance-right controls__btn controls__btn--hover" on:click={ changeLoopState }>
            <Svg name='repeat' color={music.loop ? "var(--accent-color)" : "#7c7c7c"} />
        </button>
        <div class="playing-song controls__playing-song">
            <div class="cover playing-song__cover">
                <Svg name='music_double_note' />
            </div>
            <div class="playing-song__infos" >
                {#if !activeMusicName}
                    <span class="playing-song__icon">
                        <Svg name='apple' />
                    </span>
                {:else}
                    <p title="{activeMusicName}">{activeMusicName}</p>
                    <p title="{activeMusicArtist}">{activeMusicArtist}</p>
                    {#if duration}
                        <div class="playing-song__time playing-song__time--progress">{getProgressAndRemainingTime(timeBarValue).progress}</div>
                        <div class="playing-song__time playing-song__time--remaining">-{getProgressAndRemainingTime(timeBarValue).remaining}</div>
                    {/if}
                    <input 
                        type="range"
                        class="controls__input--type-range playing-song__time-bar" 
                        style="--progress: {timeBarValue}%"
                        bind:value={timeBarValue}
                        on:input={ changeCurrTime }
                        on:change={() => isTimerChanging = false }
                    >
                {/if}
            </div>
        </div>
        <button class="controls__item controls__item--distance-left controls__btn controls__btn--hover" on:click={(e) => volumeMinMax(e, 0) }>
            <Svg name='speaker_fill' />
        </button>
        <input 
            type="range"
            class="controls__input--type-range volume-bar"
            style="--progress: {volumeBarValue}%"
            bind:value={volumeBarValue}
            on:input={ changeVolume }
            on:change={ saveVolume }
        >
        <button class="controls__item controls__item--distance-right controls__btn controls__btn--hover" on:click={(e) => volumeMinMax(e, 100) }>
            <Svg name='speaker_wave_3_fill' />
        </button>
        <span class="controls__item">
            <Svg name='quote_bubble' />
        </span>
        <span class="controls__item">
            <Svg name='list_bullet' />
        </span>
        {#if $isResponsive}
            <div class="playing-song">
                <div class="cover">
                    <span class="icon">
                        <Svg name='music_double_note' color='#7c7c7c' />
                    </span>
                </div>
                <p title="{activeMusicName}">{activeMusicName || "À l'arrêt"}</p>
                <button on:click={ playPauseBtn }>
                    {#if isPlaying}
                        <Svg name='pause_fill' />
                    {:else}
                        <Svg name='play_fill' />
                    {/if}
                </button>
                
                <span class="icon">
                    <Svg name='forward_fill' />
                </span>
            </div>
            <div class="tabs">
                <div class="tab-btn">
                    <span class="icon">
                        <Svg name='play_circle_fill' />
                    </span>
                    <p>Écouter</p>
                </div>
                <div class="tab-btn">
                    <span class="icon">
                        <Svg name='square_grid_2x2_fill' />
                    </span>
                    <p>Explorer</p>
                </div>
                <div class="tab-btn">
                    <span class="icon">
                        <Svg name='dot_radiowaves_left_and_right' />
                    </span>
                    <p>Radio</p>
                </div>
                <div class="tab-btn active">
                    <span class="icon">
                        <Svg name='play_square_stack' color='#e84f6a' />
                    </span>
                    <p>Bibliothèque</p>
                </div>
                <div class="tab-btn">
                    <span class="icon">
                        <Svg name='magnifyingglass' />
                    </span>
                    <p>Recherche</p>
                </div>
            </div>
        {/if}
    </div>
    <div class="content app__content">
        {#if !$isResponsive}
            <button class="go-back" class:masked={tabName !== 'Toutes les playlists' || !currPlaylist} on:click={() => currPlaylistId = ''}>
                <span class="icon">
                    <Svg name='chevron_left' color='#7c7c7c' />
                </span>
            </button>
        {/if}
        {#if currPlaylist}
            <div class="album-page">
                <div class="presentation">
                    <div class="cover" style="{currPlaylistCover?.background_color ? `--cover-color: ${currPlaylistCover.background_color}` : ''}">
                        <span class="icon">
                            {#if currPlaylistCover?.name}
                                <Svg name={currPlaylistCover?.name} color={currPlaylistCover?.color ?? '#7c7c7c'} />
                            {:else if $isResponsive} 
                                <Svg name='music_note_list' color={currPlaylistCover?.color ?? '#7c7c7c'} />
                            {:else}
                                <Svg name='music_double_note' color={currPlaylistCover?.color ?? '#7c7c7c'} />
                            {/if}
                        </span>
                    </div>
                    {#if $isResponsive}
                        <h3>{currPlaylistMetadata?.name}</h3>
                        <p>Mise à jour aujourd'hui</p>
                        <div class="flex">
                            {#if currPlaylistSongs[0]}
                                <button class="action" on:click={() => playMusic(currPlaylistSongs[0].url) }>
                                    <span class="icon">
                                        <Svg name='play_fill' color='#e84f6a' />
                                    </span>
                                    Lecture
                                </button>
                            {:else}
                                <div class="action">
                                    <span class="icon">
                                        <Svg name='play_fill' color='#e84f6a' />
                                    </span>
                                    Lecture
                                </div>
                            {/if}
                            <div class="action">
                                <span class="icon">
                                    <Svg name='shuffle' color='#e84f6a' />
                                </span>
                                <p>Aléatoire</p>
                            </div>
                        </div>
                        <p>{currPlaylistMetadata?.desc}</p>
                    {:else} 
                        <div class="flex">
                            <h3>{currPlaylistMetadata?.name}</h3>
                            <div class="flex">
                                <h4>{currPlaylistSongs.length} morceaux</h4>
                                <div class="dot"></div>
                                <!--<h4>{getAproximateTime(currPlaylist)}</h4>-->
                            </div>
                            <p>{currPlaylistMetadata?.desc}</p>
                            <div class="flex" style="gap: 8px;">
                                {#if currPlaylistSongs[0]}
                                    <button class="action" on:click={() => playMusic(currPlaylistSongs[0].url) }>
                                        <span class="icon">
                                            <Svg name='play_fill' />
                                        </span>
                                        Lecture
                                    </button>
                                {:else}
                                    <div class="action">
                                        <span class="icon">
                                            <Svg name='play_fill' />
                                        </span>
                                        Lecture
                                    </div>
                                {/if}
                                <div class="action">
                                    <span class="icon">
                                        <Svg name='shuffle' />
                                    </span>
                                    <p>Aléatoire</p>
                                </div>
                                <div class="round" style="margin-left: auto;">
                                    <span class="icon">
                                        <Svg name='ellipsis' color='#FA2D48' />
                                    </span>
                                </div>
                                <div class="round">
                                    <span class="icon">
                                        <Svg name='checkmark' color='#FA2D48' />
                                    </span>
                                </div>
                                <div class="round">
                                    <span class="icon">
                                        <Svg name='pencil' color='#FA2D48' />
                                    </span>
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
                {#if !$isResponsive}
                    <div class="song-line" style="align-items: flex-end;">
                        <span class="icon"></span>
                        <div class="cover" style="background: transparent;"></div>
                        <h4>Morceaux</h4> 
                        <h4>Artiste</h4> 
                        <h4>Album</h4> 
                        <h4 class="align-center">Durée</h4> 
                        <span class="icon"></span>
                    </div>
                {/if}
                {#each currPlaylistSongs as {name, artist, album, duration, url, favorite}, i}
                    <button class="song-line" class:dark-bg={i % 2 === 0 && !$isResponsive} on:dblclick={() => playMusic(url) }>
                        <span class="icon on-hover">
                            {#if favorite}
                                <Svg name='star_fill' color='#FA2D48' />
                            {/if}
                        </span>
                        <div class="cover">
                            <span class="icon">
                                {#if url === activeMusic}
                                    <Svg name='lines_measurement_horizontal' />
                                {:else}
                                    <Svg name='music_double_note' />
                                {/if}
                            </span>
                        </div>
                        {#if $isResponsive}
                           <div class="flex">
                                <p class="title">{name}</p> 
                                <p>{artist}</p> 
                            </div> 
                        {:else}
                            <p class="title">{name}</p> 
                            <p>{artist}</p> 
                            <p>{album}</p> 
                            <p class="align-center">{duration}</p> 
                        {/if}
                        <span class="icon">
                            <Svg name='ellipsis' color={$isResponsive ? '#fff' : '#FA2D48'} />
                        </span>
                    </button>
                {/each}
            </div>
        {/if}
        {#if tabName === 'Toutes les playlists'}
            <div class="placement" class:masked={currPlaylist}>
                {#each playlists as {metadata, visual, id}}
                    {@const cover = visual.cover}
                    {@const name = metadata.name}
                    <button class="album" on:click={() => currPlaylistId = id }>
                        <div class="cover" style="{cover?.background_color ? `--cover-color: ${cover.background_color}` : ''}">
                            <span class="icon">
                                {#if $isResponsive}
                                    <Svg name={cover?.name ?? 'music_note_list'} color={cover?.color ?? '#7c7c7c'} />
                                {:else} 
                                    <Svg name={cover?.name ?? 'music_double_note'} color={cover?.color ?? '#7c7c7c'} />
                                {/if}
                            </span>
                        </div>
                        {name}
                        {#if $isResponsive}
                           <span class="icon">
                                <Svg name='chevron_right' />
                            </span> 
                        {/if}
                    </button>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
.app__grid {
    --accent-color: #FA2D48;
    --light-grey: #2c2c2a;
    --dark-grey: #21211F;
    --light-grey-track: #424242;
    --cover-color: #6E6E6E;
}
.app__content {
    background-color: #1e1e1e;
    border-top: 1px solid #7c7c7c33;
}
.app__controls {
    background-color: #191919;
    padding-block: 2px;
}
.controls__item {
    padding-block: 9px;
}
.controls__btn--play {
    width: 25px;
    padding-block: 1px;
}
.playing-song {
    height: 100%;
    border-radius: 2px;
    overflow: hidden;
}
.controls__playing-song {
    display: flex;
    align-items: center;
    min-width: 125px;
    background-color: var(--light-grey-track);
}
.cover {
    --cover-height: 100%;
    height: var(--cover-height);
    aspect-ratio: 1/1;
    background-color: var(--cover-color); 
    position: relative;
    padding: 5px;
}
.playing-song__cover {
   --cover-height: 28px; 
}
.playing-song__infos {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
}
.playing-song__icon {
    height: 100%;
    padding: 5px;
}
.controls__input--type-range {
    background: linear-gradient(to right, var(--progress-color), var(--progress-color) var(--progress), var(--track-color) var(--progress), var(--track-color));
}
.playing-song__time-bar {
    --track-color: #7c7c7c59;
    --progress-color: #a1a1a1;
    width: 100%;
    height: 2px;
}
.playing-song__time {
    --side-distance: 4px;
    font-size: inherit;
    color: #fff;
    opacity: .4;
    position: absolute;
    bottom: 5px;
}
.playing-song__time--progress {
    left: var(--side-distance);
}
.playing-song__time--remaining {
    right: var(--side-distance);
}
.controls__input--type-range,
.controls__input--type-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
}
.time-bar::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    appearance: none;
    height: 10px;
}
.volume-bar::-webkit-slider-thumb {
    width: 8px;
    height: 8px;
    background: #1B1B1B;
    outline: 1px solid #7C7C7C;
    border-radius: 50%;
}
.playing-song:hover input::-webkit-slider-thumb {
    height: 6px;
    width: 2px;
    background: white;
    outline: 1px solid #1B1B1B;
    border-radius: 2px;
    margin-top: 2px;
}
/*.app-grid {
    --light-grey: #2c2c2a;
    --dark-grey: #21211F;
    --light-grey-track: #424242;
    --cover-color: #6E6E6E;
}
.app-content {
    --height: var(--fz-xl);
    background-color: var(--dark-grey); 
    display: grid;
    grid-template-rows: min-content 1fr;
    padding-block: 0;
}
.masked {
    z-index: -1;
    pointer-events: none;
    opacity: 0;
}
.go-back {
    width: fit-content;
    padding: 2px;
    margin-block: 5px;
}
.placement {
    height: min-content;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    grid-area: 2/1;
    gap: 30px 8px;
}
.album {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: var(--fz-s);
}
.album .cover {
    padding: 15px;
    border-radius: .2rem;
}
.album-page {
    width: 100%;
    height: 100%;
    grid-area: 2/1;
}
.presentation .cover {
    height: 125px;
    border-radius: .2rem;
    grid-area: 1 / 1 / -1 / 2;
    padding: 25px;
}
.presentation {
    display: grid;
    grid-template-columns: min-content 1fr;
    align-items: flex-end;
    gap: 15px;
    font-size: var(--fz-s);
    margin-bottom: 3rem;
    padding-left: 15px;
}
.presentation > .flex {
    display: grid;
    grid-template-rows: min-content min-content 55px min-content;
    gap: 2px;
}
.presentation h4 {
    text-transform: uppercase;
}
.presentation > .flex p {
    margin: auto 0;
    -webkit-line-clamp: 3;
}
.presentation .flex > h4, .presentation .flex > p, .presentation div.action, .presentation .round, .song-line h4, .song-line p {
    opacity: .4;
}
.presentation h3, .presentation h4, .presentation .action, .song-line h4 {
    font-weight: 500;
}
.presentation h3 {
    font-size: var(--fz-l);
}
.presentation h3, .presentation p {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.presentation .dot {
    width: 2px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background: #969696;
    margin-inline: 4px;
}
.presentation .action {
    min-width: 75px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    color: #fff;
    background: #FA2D48;
    border-radius: .2rem;
    padding: 4px 8px;
}
.presentation .icon {
    --height: 10px;
}
.round {
    background: var(--dark-fullscreen);
    border-radius: 50%;
    padding: 5px;
}
.presentation .round .icon {
    aspect-ratio: 1/1;
}
.song-line {
    width: 100%;
    height: 35px;
    display: grid;
    grid-template-columns: 10px min-content 1fr 25% 20% 30px min-content;
    align-items: center;
    gap: 5px;
    padding: 5px 15px 5px 0;
    font-size: var(--fz-s);
    text-align: start;
}
.song-line > .icon:first-of-type {
    --height: 8px;
}
.song-line .title {
    opacity: 1;
}
.song-line h4, .song-line p {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.song-line .cover {
    border-radius: .2rem;
    padding: 2px;
}
.song-line .icon {
    aspect-ratio: 1/1;
    opacity: .4;
}
.dark-bg {
    background: #1b1b1b;
}
.align-center {
    text-align: center;
}
.on-hover {
    visibility: hidden;
}
.song-line:hover .on-hover {
    visibility: visible;
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
.track .flex {*/
    /*color: #7C7C7C;*/
    /*font-size: var(--fz-xs);
}
.volume {
    gap: 2px;
}
.controls {
    gap: 4px;
}
.playing-song {
    width: 100%;
    height: 100%;
    min-width: 125px;
    background-color: var(--light-grey-track);
    border-radius: 2px;
    overflow: hidden;
}
.cover {
    height: 100%;
    aspect-ratio: 1/1;
    background-color: var(--cover-color); 
    position: relative;
    padding: 5px;
}
.cover .icon, .song-info .icon {
    --height: 100%;
    margin: auto;
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
h2 {
    padding-block: 5px;*/
    /*font-size: calc(var(--font-size) + 2px);*/
    /*font-size: var(--fz-l);
    font-weight: 500;
    text-align: center;
}
.app-controls .big {
    --height: 15px;
}
.app-controls .medium {
    --height: 13px;
}
.app-controls .small {
    --height: 9px;
}
.app-controls .flex .icon {
    opacity: .4;
    aspect-ratio: 1 / 1;
}
.track {
    border-bottom: 1px solid grey;
    background-color: #1b1b1b;
    padding: 2px 10px;
    gap: 20px;
    overflow-x: auto;
}
.grid {
    --full: calc(var(--height) * 10);
    --half: calc(var(--full) / 2);
    --quarter: calc(var(--full) / 4);
    --eighth: calc(var(--full) / 8);

    display: grid;
    align-items: center;
    grid-template-columns: 
        var(--eighth) 
        var(--full) 
        var(--eighth) 
        var(--quarter) 
        var(--half) 
        var(--half) 
        var(--quarter) 
        var(--eighth) 
        var(--quarter);
}
.song-info p {
    max-width: 90%;
}
.playing-song:hover input::-webkit-slider-thumb {
    height: 6px;
    width: 2px;
    background: white;
    outline: 1px solid #1B1B1B;
    border-radius: 2px;
    margin-top: 2px;
}
.tab-btn {
    font-size: var(--fz-s);
    opacity: .4;
    color: white;
    text-align: center;
}
.tab-btn > .icon {
    --height: 40px;
    aspect-ratio: 1/1.5;
    margin: 0 auto 5px;
}
.tab-btn.active {
    color: #e84f6a;
    opacity: 1;
}
@media (max-width: 1280px) {
    .app-grid, .app-content {
        background: #080808;
    }
    .app-grid {
        padding-top: 0;
        grid-template-columns: 1fr;
        grid-template-rows: max-content 1fr;
    }
    .app-content, .track {
        --height: calc(var(--font-size) * 5);
        grid-area: 1 / 1 / -1 / -1;
    }
    .app-content {
        padding: 6.5rem 0 0;
    }
    .app-controls {
        backdrop-filter: none;
    }
    .track {
        --fz-i: 20px;
        padding: 0;
        flex-direction: column;
        gap: 0;
        max-height: none;
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 1;
        background: none;
        border: none;
    }
    .track::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: var(--dark-sidebar);
        backdrop-filter: blur(30px);
        z-index: -1;
        mask: linear-gradient(to top, black, black 60%, transparent);
    }
    .flex.controls, .flex.volume, .flex.playing-song {
        display: none;
    }
    .playing-song {
        width: 95%;
        height: var(--height);
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 5px;
        border-radius: .75rem;
    }
    .playing-song > p {
        width: 100%;
        max-width: 100%;
        font-size: var(--fz-xl);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .playing-song > button, .playing-song > .icon {
        height: 100%;
        padding: 15px;
        aspect-ratio: 1/1;
    }
    .playing-song > .icon {
        opacity: .4;
        padding: 8px;
    }
    .playing-song .cover {
        padding: 10px;
    }
    .cover {
        --cover-color: var(--dark-fullscreen); 
        border-radius: .4rem;
    }
    .tabs {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
        gap: 0;
        padding: 10px 20px 2rem;
        color: #7c7c7c;
    }
    .controls {
        font-size: var(--fz-xl);
        color: #e84f6a;
        padding: 4rem 15px 10px;
        grid-area: 1 / 1 / 2 / -1;
        z-index: 2;
        background: var(--dark-fullscreen);
        backdrop-filter: blur(var(--blur)); 
    }
    .controls button, .controls .flex .icon {
        opacity: .4;
    }
    .controls button {
        text-align: center;
        padding: 0;
        width: fit-content;
        padding: 5px;
        display: flex;
        align-items: center;
        gap: 4px;
    }
    .controls > .flex {
        justify-content: flex-end;
        gap: 15px;
    }
    .controls .round {
        height: 100%;
    }
    .controls .icon {
        --height: 19px;
        aspect-ratio: 1/1;
    }
    .controls .active {
        opacity: 1;
    }
    .controls h2, .controls button {
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .controls h2 {
        margin-inline: auto;
        color: white;
        font-size: inherit;
        max-width: 25ch;
    }
    .grid {
        display: grid;
        grid-template-columns: 1fr max-content 1fr;
        align-items: center;
    }
    .placement {
        grid-template-columns: 1fr;
        gap: 0;
    }
    .album {
        --height: 75px;
        --padding-inline: 15px;
        --padding-block: 5px;
        --gap: 15px;
        --cover-height: calc(var(--height) - var(--padding-block) * 2);
        --width: calc(100% - var(--cover-height) - var(--gap) - var(--padding-inline));
        height: var(--height);
        flex-direction: row;
        align-items: center;
        gap: var(--gap);
        padding: var(--padding-block) var(--padding-inline);
        font-size: var(--fz-xl);
        position: relative;
    }
    .album > .icon {
        --height: 15px;
        opacity: .4;
        margin-left: auto;
    }
    .album::before, .presentation::before, .song-line::before { 
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: var(--width);
        height: 1px;
        background: #7c7c7c33;
    }
    .album:focus, .album:focus-within {
        background: var(--light-grey-track);
    }
    .album:focus::before, .album:focus-within::before {
        opacity: 0;
    }
    .presentation {
        --padding: 15px;
        --width: calc(100% - var(--padding));
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--padding);
        margin: 0;
        gap: 0;
    }
    .presentation > h3 {
        font-size: var(--fz-xl);
    }
    .presentation > p {
        opacity: .4;
        font-size: var(--fz-s);
    }
    .presentation > p:last-of-type {
        margin-right: auto;
        font-size: var(--fz-m);
    }
    .presentation .cover {
        height: 225px;
        margin-bottom: 15px;
        border-radius: .4rem;
    }
    .presentation > .flex {
        width: 100%;
        display: flex;
        gap: 15px;
    }
    .presentation .action {
        width: 100%;
        padding: 10px;
        margin-block: 15px;
        font-size: var(--fz-xl);
        gap: 5px;
        background: var(--dark-fullscreen);
        color: #e84f6a;
    }
    .presentation .action > .icon {
        --height: 15px;
    }
    .song-line {
        --height: 50px;
        --padding-inline: 15px;
        --padding-block: 5px;
        --gap: 5px;
        --cover-height: calc(var(--height) - var(--padding-block) * 2);
        --width: calc(100% - var(--cover-height) - var(--gap) * 2 - var(--padding-inline));
        height: var(--height);
        padding: var(--padding-block) var(--padding-inline) var(--padding-block) 5px;
        grid-template-columns: min-content min-content 1fr 15px;
        gap: var(--gap);
        position: relative;
        font-size: var(--fz-m);
    }
    .song-line p {
        opacity: .4;
    }
    .song-line .title {
        font-size: var(--fz-l);
        color: #fff;
    }
    .song-line > .flex {
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
    }
    .song-line .cover {
        padding: 8px;
    }
    .song-line > .icon {
        --height: 13px;
    }
    .song-line > .icon:first-of-type {
        --height: 10px;
    } 
    .song-line .on-hover {
        visibility: visible;
    }
    .active * {
        color: #e84f6a;
    }
}*/
</style>
