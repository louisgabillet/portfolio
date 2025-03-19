<script lang="ts">
import { isResponsive } from "$lib/store";
import Svg from "./svg.svelte";
import { playlists, type Playlist } from "$lib/audio/playlists";
import { songs, type Song } from "$lib/audio/songs";
import { player } from "$lib/audio/player";
import { players } from '$lib/audio/player/store';
import { get } from "svelte/store";
import { onMount } from "svelte";
	import SoundBars from "./soundBars.svelte";

interface NavBtn {
    name: string,
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
        color: '#a1a1a1',
        title: 'Playlists',
        active: true, 
    },
    ...playlists.map(playlist => (
        {
            name: playlist.metadata.name,
            svg_name: playlist.visual.nav_btn.name ?? 'music_note_list',
            color: playlist.visual.nav_btn.color ?? '#a1a1a1',
            background_color: playlist.visual.cover.background_color ?? '#6e6e6e',
            active: true,
            playlist_id: playlist.id,
        }
    ))
]

const timeToSeconds = (time: string): number => {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
}

const getAproximateTime = (songs: Song[]) => {
    const isPlural = (el: number) => el > 1 ? 's' : '';
    const totalSeconds = songs.reduce((acc, obj) => acc + timeToSeconds(obj.metadata.duration), 0);

    const days = totalSeconds/ 86400;
    const hours = totalSeconds / 3600; 
    const minutes = totalSeconds / 60; 

    if (minutes < 60) {
        return `${Math.round(minutes)} minute${isPlural(minutes)}`;
    } 
    if (hours < 24) {
        return `${(hours).toFixed(2)} hour${isPlural(hours)}`;
    }

    return `${(days).toFixed(2)} day${isPlural(days)}`;
}
let tabName: string = 'Toutes les playlists';

const onTabClick = (name: string, playlistId: string | undefined) => {
    tabName = name
    changeSessionStorage('music-tab-name', name);

    if (!playlistId) {
        closePlaylist();
        return;
    }

    const playlist = playlistMap.get(playlistId);
    if (playlist) {
        openPlaylist(playlist);
    }
}

const songMap = new Map<string, Song>();
songs.forEach(song => songMap.set(song.id, song));

const playlistMap = new Map<string, Playlist>();
playlists.forEach(pl => playlistMap.set(pl.id, pl));

$: defaultCover = {
    name: $isResponsive ? 'music_note_list' : 'music_double_note',
    color: '#a1a1a1',
    background_color: '#6E6E6E',
}

$: areControlsActive = playingSong && $audioDuration.raw > 0;
$: openedPlaylistIsPlaying = playingPlaylist && openedPlaylist ? playingPlaylist.id === openedPlaylist.id : false;

let isPlaylistOpen: boolean = false;

let openedPlaylist: Playlist; 
let openedPlaylistMetadata: Playlist['metadata'];
let openedPlaylistCover: Playlist['visual']['cover']; 

$: audioBuffer = _player.buffer;
let buffer: Song[] = songs; 

let playingPlaylist: Playlist;
let playingSong: Song;
let playingSongIndex: number = 0;
let playingSongName: string;
let playingSongArtist: string;

const playerName = 'Music';
const audio = player({
    name: playerName,
    buffer: songs,
});

$: _player = $players[playerName];
$: ({ paused, loop, random, volume, duration: audioDuration, time: audioTime } = audio);

onMount(() => {
    const storedPlayistId = sessionStorage.getItem(`music-playlist-open`);
    const storedTabName = sessionStorage.getItem(`music-tab-name`);
    const track = audio.track

    if (storedTabName) {
        tabName = storedTabName;
    }

    if (storedPlayistId) {
        const playlist = playlistMap.get(storedPlayistId);

        if (!playlist) {
            return;
        }

        openPlaylist(playlist);
    }

    if (track) {
        const audioIndex = track.dataset.audioIndex;

        if (!audioIndex) {
            return;
        }

        buffer = $audioBuffer;
        getPlayingSong(+audioIndex);
    }
    
})

const changeSessionStorage = (name: string, newValue: string) => {
    const stored = sessionStorage.getItem(name);

    if (newValue === stored) {
        return;
    }

    sessionStorage.setItem(name, newValue);
}

const openPlaylist = (playlist: Playlist) => {
    isPlaylistOpen = true;

    changeSessionStorage('music-playlist-open', playlist.id);

    if (playlist !== openedPlaylist) {
        openedPlaylist = playlist;

        openedPlaylistMetadata = playlist.metadata;
        openedPlaylistCover = playlist.visual.cover;
    }

    buffer = openedPlaylist.track_id.map(id => songMap.get(id)).filter((song): song is Song => song !== undefined);
}
const closePlaylist = () => {
    isPlaylistOpen = false;
    buffer = songs;

    sessionStorage.removeItem(`music-playlist-open`);
}
const getPlayingSong = (songIndex: number) => {
    const playing = buffer[songIndex];
    playingSongIndex = songIndex;
    console.log(_player.audio.track);

    if (playing === playingSong) {
        return true;
    }

    const metadata = playing.metadata;
    const secret = metadata?.secret;

    playingSong = playing;
    playingSongName = secret?.name ?? metadata.name;
    playingSongArtist = secret?.artist ?? metadata.artist;

    return false;
}
const updateBuffer = () => {
    const areEqual = compareArrays(get(_player.buffer), buffer);

    if (areEqual) {
        return;
    }

    player.buffer(_player, buffer);
}

const compareArrays = (a: string[], b: string[]) => a.length === b.length && a.every((element, index) => element === b[index]);

const handleStart = (songIndex: number, start: boolean = false, noRandom: boolean = false) => {
    if (buffer.length === 0) {
        console.log('no buffered songs');
        return;
    }

    if (noRandom && !$random) {
        player.random(_player);
    }
    updateBuffer();
    playingPlaylist = openedPlaylist;

    const isSameIndex: boolean = playingSongIndex === songIndex;
    const isSameSong: boolean = getPlayingSong(songIndex);

    if (!isSameSong || !isSameIndex || start) {
        player.start(_player, songIndex);
        return;
    }

    player.play(_player);
};
const handleNextAndPrevious = (next: boolean) => {
    if (next) {
        player.next(_player);
    } else {
        player.previous(_player);
    }

    const track = _player.audio.track;
    if (!track) {
        return;
    }
    const index = track.dataset.audioIndex;

    if (index) {
        playingSongIndex = +index;
    }
}
const handleRandom = () => {
    if (!$random) {
        player.random(_player);
    }

    const lastIndex = buffer.length;
    const randomIndex = Math.floor(Math.random() * lastIndex);

    handleStart(randomIndex, true);
};
const handlePlay = () => {
    if (buffer.length === 0) {
        console.log('no buffered songs');
        return;
    }

    if (!audio.track?.src) {
        getPlayingSong(0);
        updateBuffer();
        playingPlaylist = openedPlaylist;
    }

    player.play(_player);
}

</script>

<div class="app__grid">
    <nav class="sidebar app__sidebar">
        {#each navBtns as {name, svg_name, color, title, active, playlist_id}}
            {#if title}
                <h5 class="sidebar__title sidebar__category sidebar__text--overflow">{title}</h5> 
            {/if}
            {#if active}
                <button class="sidebar__item sidebar__item--grid" title={ name } class:sidebar__item--focused={ name === tabName } on:click={() => onTabClick(name, playlist_id) }>
                    <Svg name={svg_name} {color} />
                    <span class="sidebar__text sidebar__text--overflow">{name}</span>
                </button> 
            {:else}
                <div class="sidebar__item sidebar__item--grid sidebar__item--desactivated" title={ name }>
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
        <!--<span class="controls__item controls__item--distance-left">
            <Svg name='shuffle' color="#414141" />
        </span>-->
        <button class="controls__item controls__item--distance-left controls__btn controls__btn--hover" on:click={() => player.random(_player)}>
            <Svg name='shuffle' color={$random ? "var(--accent-color)" : "#7c7c7c"} />
        </button>
        <button 
            class="controls__item controls__btn controls__btn--hover controls__btn--{areControlsActive ? 'active' : 'desactivated'}" 
            on:click={() => handleNextAndPrevious(false)}
        >
            <Svg name='backward_fill' color={areControlsActive ? "#7c7c7c" : "#414141"} />
        </button>
        <button class="controls__item controls__btn controls__btn--play controls__btn--hover" on:click={() => handlePlay()}>
            <Svg name={$paused ? 'play_fill' : 'pause_fill'} />
        </button>
        <button 
            class="controls__item controls__btn controls__btn--hover controls__btn--{areControlsActive ? 'active' : 'desactivated'}" 
            on:click={() => handleNextAndPrevious(true)}
        >
            <Svg name='forward_fill' color={areControlsActive ? "#7c7c7c" : "#414141"} />
        </button>
        <button class="controls__item controls__item--distance-right controls__btn controls__btn--hover" on:click={() => player.loop(_player)}>
            <Svg name='repeat' color={$loop ? "var(--accent-color)" : "#7c7c7c"} />
        </button>
        <div class="playing-song controls__playing-song">
            <div class="cover playing-song__cover">
                <Svg name={ defaultCover.name } color={ defaultCover.color } />
            </div>
            <div class="playing-song__infos" >
                {#if !playingSong || !audio.track?.src}
                    <span class="playing-song__icon">
                        <Svg name='apple' />
                    </span>
                {:else}
                    <p class="playing-song__text" title="{playingSongName}">{playingSongName}</p>
                    <p class="playing-song__text playing-song__text--color-grey" title="{playingSongArtist}">{playingSongArtist}</p>
                    <input 
                        type="range"
                        class="controls__input--type-range playing-song__time-bar" 
                        style:--progress="{ ($audioTime.raw / $audioDuration.raw * 100).toFixed(5) || 0 }%"
                        bind:value={ $audioTime.raw }
                        min="0"
                        max={ $audioDuration.raw }
                        aria-valuenow={ $audioTime.raw }
                        on:input={() => player.time(_player, $audioTime.raw)}
                    >
                    <div class="playing-song__time playing-song__time--progress">{$audioTime.current}</div>
                    <div class="playing-song__time playing-song__time--remaining">{$audioTime.remaining}</div>
                    <span class="playing-song__favorite">
                        <Svg name={ playingSong.favorite ? 'star_fill' : 'star' } color='#7c7c7c' />
                    </span>
                {/if}
            </div>
        </div>
        <button class="controls__item controls__item--distance-left controls__btn controls__btn--hover" on:click={() => player.volume(_player, 0)}>
            <Svg name='speaker_fill' />
        </button>
        <input 
            type="range"
            class="controls__input--type-range controls__volume-bar"
            style:--progress="{ $volume }%"
            bind:value={ $volume }
            min="0"
            max="100"
            aria-valuenow={ $volume }
            on:input={() => player.volume(_player, $volume)}
        >
        <button class="controls__item controls__item--distance-right controls__btn controls__btn--hover" on:click={() => player.volume(_player, 100)}>
            <Svg name='speaker_wave_3_fill' />
        </button>
        <span class="controls__item">
            <Svg name='quote_bubble' color="#414141" />
        </span>
        <span class="controls__item">
            <Svg name='list_bullet' color="#414141" />
        </span>
        <!--{#if $isResponsive}
            <div class="playing-song">
                <div class="cover">
                    <span class="icon">
                        <Svg name='music_double_note' color='#7c7c7c' />
                    </span>
                </div>
                <p title="{activeMusicName}">{activeMusicName || "À l'arrêt"}</p>
                <button on:click={() => handlePlay()}>
                    <Svg name={$paused ? 'play_fill' : 'pause_fill'} />
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
        {/if}-->
    </div>
    <div class="content app__content">
        {#if !$isResponsive}
            <div class="content__action">
                <button class="content__action-btn" class:masked={tabName !== 'Toutes les playlists' || !isPlaylistOpen} on:click={ closePlaylist }>
                    <Svg name='chevron_left' color='#7c7c7c' />
                </button>
            </div>
        {/if}
        <!--{#if currPlaylist}
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
                                <button class="action" on:click={() => handleStart(0)}>
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
                                <h4>{getAproximateTime(currPlaylist)}</h4>
                            </div>
                            <p>{currPlaylistMetadata?.desc}</p>
                            <div class="flex" style="gap: 8px;">
                                {#if currPlaylistSongs[0]}
                                    <button class="action" on:click={() => handleStart(0)}>
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
                    <button class="song-line" class:dark-bg={i % 2 === 0 && !$isResponsive} on:dblclick={() => handleStart(i) }>
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
        {/if}-->
        {#if isPlaylistOpen && openedPlaylist}
            <div class="album-page content__album-page">
                <div class="presentation album-page__presentation">
                    <div class="cover presentation__cover" style="{openedPlaylistCover.background_color ? `--cover-color: ${openedPlaylistCover.background_color}` : ''}">
                        <Svg name={openedPlaylistCover.name ?? defaultCover.name} color={openedPlaylistCover.color ?? defaultCover.color} />
                    </div>
                    {#if $isResponsive}
                        <h3>{currPlaylistMetadata?.name}</h3>
                        <p>Mise à jour aujourd'hui</p>
                        <div class="flex">
                            <button class="presentation__action-btn" on:click={() => handleStart(0, true)}>
                                <Svg name='play_fill' color='#e84f6a' />
                                <span>Lire</span>
                            </button>
                            <div class="presentation__action-btn">
                                <Svg name='shuffle' color='#e84f6a' />
                                <span>Aléatoire</span>
                            </div>
                        </div>
                        <p>{currPlaylistMetadata?.desc}</p>
                    {:else} 
                        <div class="presentation__infos">
                            <h3 class="presentation__title presentation__text presentation__text--overflow">{openedPlaylistMetadata.name}</h3>
                            <p class="presentation__description presentation__text presentation__text--overflow">{openedPlaylistMetadata.desc}</p>
                            <div class="presentation__action">
                                <button class="presentation__action-btn presentation__action-btn--form-rect" class:presentation__action-btn--desactivated={ buffer.length === 0 } on:click={() => handleStart(0, true, true)}>
                                    <span class="presentation__icon">
                                        <Svg name='play_fill' color='#fff' />
                                    </span>Lire
                                </button>
                                <button class="presentation__action-btn presentation__action-btn--form-rect" class:presentation__action-btn--desactivated={ buffer.length === 0 } on:click={ handleRandom }>
                                    <span class="presentation__icon">
                                        <Svg name='shuffle' color='#fff' />
                                    </span>Ordre Aléatoire
                                </button>
                                <div class="presentation__action-btn presentation__action-btn--form-round presentation__action-btn--desactivated" style="margin-left: auto">
                                    <Svg name='ellipsis' color='#FA2D48' />
                                </div>
                                <div class="presentation__action-btn presentation__action-btn--form-round presentation__action-btn--desactivated"> 
                                    <Svg name='checkmark' color='#FA2D48' />
                                </div>
                                <div class="presentation__action-btn presentation__action-btn--form-round presentation__action-btn--desactivated"> 
                                    <Svg name='pencil' color='#FA2D48' />
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
                {#if !$isResponsive}
                    <div class="categories album-page__categories">
                        <span class="categories__icon"></span>
                        <h4 class="categories__text--overflow categories__text--bold categories--border-right">Morceaux</h4> 
                        <h4 class="categories__text--overflow categories__text--bold categories--border-right">Artiste</h4> 
                        <h4 class="categories__text--overflow categories__text--bold">Album</h4> 
                        <span class="categories__icon categories--border-right"></span>
                        <h4 class="categories__text--overflow categories__text--end categories__text--bold">Durée</h4> 
                        <span class="categories__icon"></span>
                    </div>
                {/if}
                {#each buffer as {id, metadata, favorite}, i}
                    {@const isPlaying = id === playingSong?.id && playingSongIndex === i}
                    <button class="categories album-page__categories categories--background" class:categories--background-transparent={i % 2 !== 0 && !$isResponsive} on:dblclick={() => handleStart(i, true) }>
                        <span class="categories__icon" class:categories__icon--hidden={ !$isResponsive && !favorite }>
                            <Svg name={ favorite ? 'star_fill' : 'star' } color='#FA2D48' />
                        </span>
                        <div class="categories__wrapper">
                            <button class="cover categories__cover" on:click={() => handleStart(i, !openedPlaylistIsPlaying)}>
                                <div class="cover__action" class:cover__action--hidden={ !openedPlaylistIsPlaying || !isPlaying || $paused }>
                                    <span class="cover__icon cover__icon--hide-hover" class:cover__icon--hidden={ !isPlaying || $paused }>
                                        <!--<Svg name='lines_measurement_horizontal' color="#fff" />-->
                                        <SoundBars />
                                    </span>
                                    <span class="cover__action-btn">
                                        <Svg name={ openedPlaylistIsPlaying && isPlaying && !$paused  ? 'pause_fill' : 'play_fill' } color="#fff" />
                                    </span>
                                </div>
                                <span class="cover__icon">
                                    <Svg name={ defaultCover.name } color={ defaultCover.color } />
                                </span>
                            </button>
                            <p class="categories__text--color-white categories__text--overflow" title={ metadata.name }>{metadata.name}</p> 
                        </div>
                        <p class="categories__text--overflow" title={ metadata.artist }>{metadata.artist}</p> 
                        <p class="categories__text--overflow" title={ metadata.album }>{metadata.album}</p> 
                        <span class="categories__icon categories--desactivated">
                            <Svg name='arrow_down_circle_fill' color={$isResponsive ? '#fff' : '#7c7c7c'} />
                        </span>
                        <p class="categories__text--end categories__text--overflow" title={ metadata.duration }>{metadata.duration}</p> 
                        <span class="categories__icon categories--desactivated">
                            <Svg name='ellipsis' color={$isResponsive ? '#fff' : '#7c7c7c'} />
                        </span>
                    </button>
                {/each}
                <p class="album-page__playlist-duration">{buffer.length} morceaux, {getAproximateTime(buffer)}</p>
            </div> 
        {/if}
        {#if tabName === 'Toutes les playlists'}
            <div class="placement content__placement" class:masked={ isPlaylistOpen }>
                {#each playlists as playlist}
                    {@const cover = playlist.visual.cover}
                    {@const name = playlist.metadata.name}
                    <button 
                        class="album placement__album"
                        title={ name }
                        on:click={() => openPlaylist(playlist)}
                    >
                        <div 
                            class="cover album__cover"
                            style="{cover.background_color ? `--cover-color: ${cover.background_color}` : ''}"
                        >
                            <Svg 
                                name={cover.name ??  defaultCover.name}
                                color={cover.color ?? defaultCover.color}
                            />
                        </div>
                        <span class="album__name">{name}</span>
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
.masked {
    z-index: -1;
    pointer-events: none;
    opacity: 0;
}
.app__grid {
    --accent-color: #FA2D48;
    --light-grey: #2c2c2a;
    --dark-grey: #21211F;
    --light-grey-track: #424242;
    --cover-color: #6E6E6E;
    --progress-color: #7c7c7c;
}
.app__content {
    --height: var(--fz-xl);
    --extra-padding: 15px;
    background-color: #1e1e1e;
    border-top: 1px solid #7c7c7c33;
    display: grid;
    grid-template-rows: min-content 1fr;
    padding-top: 0;
}
.content__action {
    height: 24px;
    padding-block: 2px;
    position: sticky;
    top: 0;
    z-index: 1;
}
.content__action-btn {
    width: fit-content;
    height: 100%;
    padding: 4px;
}
.app__controls {
    background-color: #191919;
}
.controls__btn--play {
    width: 25px;
    padding-block: 2px;
}
.playing-song {
    height: 100%;
    border-radius: 2px;
    overflow: hidden;
}
.controls__playing-song {
    width: 40%;
    display: flex;
    align-items: center;
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
    justify-content: center;
    overflow: hidden;
}
.playing-song__icon {
    height: 100%;
    padding: 5px;
}
.playing-song__text {
    font-size: var(--fz-xs);
    color: #fff;
    max-width: 70%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.playing-song__favorite {
    height: 8px;
    position: absolute;
    top: 4px;
    right: 4px;
}
.playing-song__text--color-grey {
    color: #a1a1a1;
}
.controls__input--type-range {
    background: linear-gradient(to right, var(--progress-color), var(--progress-color) var(--progress), var(--track-color) var(--progress), var(--track-color));
}
.playing-song__time-bar {
    --track-color: #7c7c7c59;
    --progress-color: #c2c2c2;
    width: 100%;
    height: 2px;
    position: absolute;
    bottom: 0;
    left: 0;
}
.playing-song__time {
    --side-distance: 4px;
    font-size: inherit;
    color: #7c7c7c;
    opacity: 0;
    position: absolute;
    bottom: 5px;
    transition: opacity 120ms ease;
}
.playing-song__time-bar:active ~ .playing-song__time {
    color: #a1a1a1;
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
.controls__volume-bar {
    --track-color: #414141;
    --progress-color: #a1a1a1;
    width: 50px;
    height: 3px;
    border-radius: 6px;
}
.controls__volume-bar::-webkit-slider-thumb {
    width: 9px;
    height: 9px;
    background: #1B1B1B;
    outline: 1px solid #7C7C7C;
    border-radius: 50%;
}
.app__controls:hover .playing-song__time-bar::-webkit-slider-thumb {
    height: 8px;
    width: 1px;
    background-color: var(--progress-color);
    outline: 1px solid var(--progress-color);
    border-radius: 2px;
    margin-top: 2px;
}
.app__controls:hover .playing-song__time {
    opacity: 1;
}
.placement {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
}
.content__placement {
    height: min-content;
    grid-area: 2/1;
    gap: 30px 8px;
    padding-left: var(--extra-padding);
}
.album {
    width: 100%;
    display: grid;
    grid-template-rows: min-content auto;
}
.placement__album {
    gap: 2px;
}
.album__cover {
    padding: 15px;
    border-radius: .2rem;
    overflow: hidden;
}
.album__name {
    font-size: var(--fz-s);
    color: #fff;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow-wrap: anywhere;
}
.album-page {
    width: 100%;
    height: 100%;
}
.content__album-page {
    --space-btw: 2.5rem;
    --categories__favorite-icon--width: 10px; 
    --categories--gap: 10px;
    grid-area: 2/1;
}
.presentation {
    display: grid;
    grid-template-columns: min-content 1fr;
    align-items: flex-end;
}
.album-page__presentation {
    margin-bottom: var(--space-btw);
    padding-left: var(--extra-padding);
    gap: 15px;
}
.presentation__wrapper {
    --wrapper-gap: 2px;
    display: flex;
    align-items: center;
    gap: var(--wrapper-gap);
}
.presentation__dot {
    width: 2px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background: #969696;
    margin-inline: 4px;
}
.presentation__cover {
    --cover-height: 175px;
    border-radius: .2rem;
    grid-area: 1 / 1 / -1 / 2;
    padding: 25px;
    border-radius: 8px;
}
.presentation__infos {
}
.presentation__text {
    font-size: var(--fz-s);
    color: #a1a1a1;
}
/*.presentation h3, .presentation h4, .presentation .action, .song-line h4 {*/
.presentation__text--bold {
    font-weight: 500;
}
.presentation__text--overflow {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: var(--line-clamp);
    -webkit-box-orient: vertical;
}
.presentation__title {
    --line-clamp: 2;
    font-size: var(--fz-xl);
    color: #fff;
    font-weight: 600;
}
.presentation__description {
    --line-clamp: 3;
    margin-block: 1rem 2rem;
}
.presentation__action {
    display: flex;
    align-items: center;
    gap: 8px;
}
.presentation__action-btn {
    --btn-padding: 4px;
    height: 20px;
    color: #fff;
    font-size: var(--fz-s);
    font-weight: 500;
    padding: var(--btn-padding);
}
.presentation__action-btn--desactivated {
    opacity: .4;
    pointer-events: none;
}
.presentation__action-btn--form-rect {
    min-width: 75px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--btn-padding);
    background: #FA2D48;
    border-radius: .2rem;
    padding-inline: 8px;
}
.presentation__action-btn--form-round {
    aspect-ratio: 1/1;
    background: var(--dark-fullscreen);
    border-radius: 50%;
}
.presentation__icon {
    height: 10px;
}
.categories {
    --favorite-width: 10px; 
    --gap: 0px;
    width: 100%;
    /*height: 35px;*/
    position: relative;
    display: grid;
    grid-template-columns: var(--favorite-width) 1fr 20% 25% auto 40px auto;
    align-items: center;
    gap: var(--gap);
    text-align: start;
}
.album-page__categories {
    --icon-width: 12px;
    --gap: var(--categories--gap);
    --favorite-width: var(--categories__favorite-icon--width); 
    font-size: var(--fz-s);
    color: #a1a1a1;
    padding: 5px 15px 5px 0;
    z-index: 2;
}
.categories--border-right {
    border-right: 1px solid #7c7c7c33;
}
.categories--desactivated {
    opacity: .4;
    pointer-events: none;
}
.categories--background {
    --background-color: #41414133;
}
.categories--background-transparent {
    --background-color: transparent;
}
.categories--background::after {
    content: '';
    width: calc(100% - var(--favorite-width) - var(--gap) / 2);
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    background-color: var(--background-color);
    border-radius: 5px;
    z-index: -1;
}
.categories:hover.categories--background::after {
    background-color: #41414180;
}
.categories__wrapper {
    display: flex;
    align-items: center;
    gap: 5px;
    overflow: hidden;
}
.categories__text--end {
    text-align: end;
}
.categories__text--bold {
    font-weight: 500;
}
.categories__text--color-white {
    color: #fff;
}
.categories__text--overflow {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.categories__icon {
    width: var(--icon-width);
    height: 100%;
}
.categories__icon:first-of-type {
    --icon-width: var(--favorite-width);
}
.categories__icon--hidden {
    visibility: hidden;
}
.categories:hover .categories__icon--hidden {
    visibility: visible;
}
.categories:hover .categories__icon :global(> svg) {
    fill: #FA2D48;
}
.categories__cover {
    --cover-height: 35px;
    position: relative;
    border-radius: 5px;
    overflow: hidden;
    flex-shrink: 0;
}
.cover__icon,
.cover__action-btn {
    width: 100%;
    height: 100%;
    display: block;
}
.cover__action-btn {
    padding: 3px;
    display: none;
}
.categories:hover .cover__action-btn {
    display: block;
}
.cover__icon--hidden,
.categories:hover .cover__icon--hide-hover {
    display: none;
}
.cover__action {
    position: absolute;
    inset: 0;
    background-color: #00000075;
    padding: 8px;
}
.cover__action--hidden {
    visibility: hidden;
}
.categories:hover .cover__action--hidden {
    visibility: visible;
}
.album-page__playlist-duration {
    --margin-left: calc(var(--categories__favorite-icon--width) + var(--categories--gap));
    font-size: var(--fz-s);
    font-weight: 500;
    color: #a1a1a1;
    margin: var(--space-btw) 0 0 var(--margin-left);
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
