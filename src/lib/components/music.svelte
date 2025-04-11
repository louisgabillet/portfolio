<script lang="ts">
import { isResponsive } from "$lib/store";
import Svg from "./svg.svelte";
import { playlists, type Playlist } from "$lib/audio/playlists";
import { songs, type Song } from "$lib/audio/songs";
import { player } from "$lib/audio/player";
import { players } from '$lib/audio/player/store';
import { onMount } from "svelte";
import { storagePrefix } from "$lib";
import SoundBars from "./soundBars.svelte";
import type { PlayerData } from "$lib/audio/player/types";

interface NavBtn {
    name: string,
    svg_name: string,
    color: string,
    title?: string,
    active?: boolean,
    playlist_id?: string;
}

const playlistNavBtns: NavBtn[] = playlists.map(playlist => (
    {
        name: playlist.metadata.name,
        svg_name: playlist.visual.nav_btn.name ?? 'music_note_list',
        color: playlist.visual.nav_btn.color ?? '#a1a1a1',
        background_color: playlist.visual.cover.background_color ?? '#6e6e6e',
        active: true,
        playlist_id: playlist.id,
    }
))
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
    ...playlistNavBtns,
]

const songMap = new Map<string, Song>();
const playlistMap = new Map<string, Playlist>();

const defaultCoverSong = {
    name: 'music_double_note',
    color: '#a1a1a1',
    background_color: '#6E6E6E',
}

const playerName = 'Music';
const audio = player({
    name: playerName,
    buffer: songs,
});

let tabName: string = 'Toutes les playlists';
let isPlaylistOpen: boolean = false;
let buffer: Song[] = songs; 

let openedPlaylist: Playlist; 
let openedPlaylistMetadata: Playlist['metadata'];
let openedPlaylistCover: Playlist['visual']['cover']; 

let playingPlaylist: Playlist;
let playingSong: Song;
let playingSongIndex: number = 0;
let playingSongName: string;
let playingSongArtist: string;

$: defaultCoverPlaylist = {
    name: $isResponsive ? 'music_note_list' : 'music_double_note',
    color: $isResponsive ? '#7c7c7c' : '#a1a1a1',
    background_color: $isResponsive ? '#21211F' : '#6E6E6E',
}

$: audioBuffer = _player.buffer;
$: _player = $players[playerName];
$: ({ paused, loop, random, volume, duration: audioDuration, time: audioTime } = audio);

$: areControlsActive = playingSong && $audioDuration.raw > 0;
$: openedPlaylistIsPlaying = playingPlaylist && openedPlaylist ? playingPlaylist.id === openedPlaylist.id : false;

songs.forEach(song => songMap.set(song.id, song));
playlists.forEach(pl => playlistMap.set(pl.id, pl));

onMount(() => {
    const storedPlayistId = sessionStorage.getItem(`${storagePrefix}music-playlist-open`);
    const storedTabName = sessionStorage.getItem(`${storagePrefix}music-tab-name`);
    const track = audio.track

    if (storedTabName && !$isResponsive) {
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

        if (audioIndex) {
            buffer = $audioBuffer as Song[];
            playingPlaylist = openedPlaylist;
            getPlayingSong(+audioIndex);
            return;
        };

        const observer = new MutationObserver((changes) => {
            changes.forEach(change => {
                const attrName = change.attributeName;
                const index = track.dataset.audioIndex;

                console.log('ob', attrName, index);
                if (attrName !== 'src' || !index) return;

                getPlayingSong(+index);
            });
        });

        observer.observe(track, { attributes : true });
    }

})


const compareArrays = (a: PlayerData['buffer'], b: Song[]) => a.length === b.length && a.every((element, index) => element === b[index]);

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

const onTabClick = (name: string, playlistId: string | undefined) => {
    tabName = name
    changeSessionStorage(`${storagePrefix}music-tab-name`, name);

    if (!playlistId) {
        closePlaylist();
        return;
    }

    const playlist = playlistMap.get(playlistId);
    if (playlist) {
        openPlaylist(playlist);
    }
}
const changeSessionStorage = (name: string, newValue: string) => {
    const stored = sessionStorage.getItem(name);

    if (newValue === stored) {
        return;
    }

    sessionStorage.setItem(name, newValue);
}
const openPlaylist = (playlist: Playlist) => {
    isPlaylistOpen = true;

    changeSessionStorage(`${storagePrefix}music-playlist-open`, playlist.id);

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

    const defaultTabName = 'Toutes les playlists';
    if (tabName !== defaultTabName) {
        tabName = defaultTabName;
    }

    sessionStorage.removeItem(`${storagePrefix}music-playlist-open`);
}
const getPlayingSong = (songIndex: number) => {
    const playing = buffer[songIndex];
    playingSongIndex = songIndex;

    if (playing === playingSong) return true;

    const metadata = playing.metadata;
    const secret = metadata?.secret;

    playingSong = playing;
    playingSongName = secret?.name ?? metadata.name;
    playingSongArtist = secret?.artist ?? metadata.artist;

    return false;
}
const updateBuffer = () => {
    const areEqual = compareArrays($audioBuffer, buffer);

    if (areEqual) {
        return;
    }

    player.buffer(_player, buffer);
}
const handleStart = (songIndex: number, start: boolean = false, noRandom: boolean = false) => {
    if (buffer.length === 0) {
        console.log('no buffered songs');
        return;
    }

    if (noRandom && $random) player.random(_player);

    updateBuffer();
    playingPlaylist = openedPlaylist;

    const isSameIndex: boolean = playingSongIndex === songIndex;
    const isSameSong: boolean = buffer[songIndex] === playingSong;

    if (!isSameSong || !isSameIndex || start) {
        if (isSameSong) getPlayingSong(songIndex)
        player.start(_player, songIndex);

        return;
    }

    player.play(_player);
};
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
        updateBuffer();
        playingPlaylist = openedPlaylist;
    }

    player.play(_player);
}
</script>

<div class="app__grid" data-moving-target style:--playlist-cover-color={ defaultCoverPlaylist.background_color } style:--song-cover-color={ defaultCoverSong.background_color }>
    <nav class="sidebar app__sidebar" class:app__sidebar--removed={ $isResponsive }> 
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
    {#if $isResponsive}
        <div class="controls app__controls controls-header app__controls-header">
            <button class="controls__item controls-header__item controls-header__btn controls-header__btn--grid controls__btn--{isPlaylistOpen ? 'active' : 'desactivated'} " on:click={ closePlaylist }>
                <Svg name="chevron_left" color="var(--accent-color)" />
                <span class="controls__text--accent-color controls__text--overflow">{ !isPlaylistOpen ? "Bibliothèque" : '' }</span>
            </button>
            <h2 class="controls__h2 controls__text--overflow">{ !isPlaylistOpen ? 'Playlists' : openedPlaylistMetadata.name }</h2>
            <div class="controls__items-wrapper">
                {#if !isPlaylistOpen}
                    <span class="controls__item controls-header__item controls-header__item--round">
                        <Svg name="plus" color="var(--accent-color)" />
                    </span>
                    <span class="controls__item controls-header__item controls-header__item--round">
                        <Svg name="line_3_horizontal_decrease" color="var(--accent-color)" />
                    </span>
                {/if}
                <span class="controls__item controls-header__item controls-header__item--round">
                    <Svg name="ellipsis" color="var(--accent-color)" />
                </span>
            </div>
        </div>
        <div class="controls app__controls controls-footer app__controls-footer">
            <div class="footer-player controls-footer__player">
                <div class="cover footer-player__cover">
                    <Svg name={ defaultCoverSong.name } color={ defaultCoverSong.color } />
                    <div class="cover__action" class:cover__action--hidden={ $paused }>
                        <SoundBars />
                    </div>
                </div>
                <p class="footer-player__title">{ playingSongName || "À l'ârret" }</p>
                <button class="footer-player__btn" class:footer-player__btn--desactivated={ buffer.length === 0 } on:click={ handlePlay }>
                    <Svg name={$paused ? 'play_fill' : 'pause_fill'} color={buffer.length > 0 ? "#fff" : "#414141"}/>
                </button>
                <button 
                    class="footer-player__btn" class:footer-player__btn--desactivated={ !areControlsActive }
                    on:click={() => player.next(_player)}
                >
                    <Svg name='forward_fill' color={ areControlsActive ? "#fff" : '#414141' } />
                </button>
            </div>
            <div class="controls__item controls-footer__item controls-footer__item--grid">
                <Svg name='play_circle_fill' />
                <span class="controls__text--overflow">Écouter</span>
            </div>
            <div class="controls__item controls-footer__item controls-footer__item--grid">
                <Svg name='square_grid_2x2_fill' />
                <span class="controls__text--overflow">Explorer</span>
            </div>
            <div class="controls__item controls-footer__item controls-footer__item--grid">
                <Svg name="dot_radiowaves_left_and_right" />
                <span class="controls__text--overflow">Radio</span>
            </div>
            <div class="controls__item controls-footer__item controls-footer__item--grid">
                <Svg name="play_square_stack" color="var(--accent-color)" />
                <span class="controls__text--accent-color controls__text--overflow">Bibiothèque</span>
            </div>
            <div class="controls__item controls-footer__item controls-footer__item--grid">
                <Svg name="magnifyingglass" />
                <span class="controls__text--overflow">Recherche</span>
            </div>
        </div>
    {:else}
        <div class="controls app__controls" data-moving-target>
            <button class="controls__item controls__item--distance-left controls__btn controls__btn--hover" on:click={() => player.random(_player)}>
                <Svg name='shuffle' color={$random ? "var(--accent-color)" : "#7c7c7c"} />
            </button>
            <button 
                class="controls__item controls__btn controls__btn--hover controls__btn--{areControlsActive ? 'active' : 'desactivated'}" 
                on:click={() => player.previous(_player)}
            >
                <Svg name='backward_fill' color={areControlsActive ? "#7c7c7c" : "#414141"} />
            </button>
            <button class="controls__item controls__btn controls__btn--play controls__btn--hover" class:controls__btn--desactivated={ buffer.length === 0 } on:click={ handlePlay }>
                <Svg name={$paused ? 'play_fill' : 'pause_fill'} color={buffer.length > 0 ? "#7c7c7c" : "#414141"}/>
            </button>
            <button 
                class="controls__item controls__btn controls__btn--hover controls__btn--{areControlsActive ? 'active' : 'desactivated'}" 
                on:click={() => player.next(_player)}
            >
                <Svg name='forward_fill' color={areControlsActive ? "#7c7c7c" : "#414141"} />
            </button>
            <button class="controls__item controls__item--distance-right controls__btn controls__btn--hover" on:click={() => player.loop(_player)}>
                <Svg name='repeat' color={$loop ? "var(--accent-color)" : "#7c7c7c"} />
            </button>
            <div class="playing-song controls__playing-song">
                <div class="cover playing-song__cover">
                    <Svg name={ defaultCoverSong.name } color={ defaultCoverSong.color } />
                </div>
                <div class="playing-song__infos" data-moving-target>
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
        </div>
    {/if}
    <div class="content app__content" class:app__content--full={ $isResponsive }>
        {#if !$isResponsive}
            <div class="content__action">
                <button class="content__action-btn" class:masked={tabName !== 'Toutes les playlists' || !isPlaylistOpen} on:click={ closePlaylist }>
                    <Svg name='chevron_left' color='#7c7c7c' />
                </button>
            </div>
        {/if}
        {#if isPlaylistOpen && openedPlaylist}
            <div class="album-page content__album-page">
                <div class="presentation album-page__presentation">
                    <div class="cover presentation__cover" style="{openedPlaylistCover.background_color ? `--playlist-cover-color: ${openedPlaylistCover.background_color}` : ''}">
                        <Svg name={openedPlaylistCover.name ?? defaultCoverPlaylist.name} color={openedPlaylistCover.color ?? defaultCoverPlaylist.color} />
                    </div>
                    {#if $isResponsive}
                        <h3 class="presentation__title presentation__text presentation__text--overflow">{openedPlaylistMetadata.name}</h3>
                        <div class="presentation__action">
                            <button class="presentation__action-btn presentation__action-btn--form-rect" class:presentation__action-btn--desactivated={ buffer.length === 0 } on:click={() => handleStart(0, true, true)}>
                                <span class="presentation__icon">
                                    <Svg name='play_fill' color='var(--accent-color)' />
                                </span>Lecture
                            </button>
                            <button class="presentation__action-btn presentation__action-btn--form-rect" class:presentation__action-btn--desactivated={ buffer.length === 0 } on:click={ handleRandom }>
                                <span class="presentation__icon">
                                    <Svg name='shuffle' color='var(--accent-color)' />
                                </span>Aléatoire
                            </button>
                        </div>
                        <p class="presentation__description presentation__text presentation__text--overflow">{openedPlaylistMetadata.desc}</p>
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
                                    <Svg name='ellipsis' color='var(--accent-color)' />
                                </div>
                                <div class="presentation__action-btn presentation__action-btn--form-round presentation__action-btn--desactivated"> 
                                    <Svg name='checkmark' color='var(--accent-color)' />
                                </div>
                                <div class="presentation__action-btn presentation__action-btn--form-round presentation__action-btn--desactivated"> 
                                    <Svg name='pencil' color='var(--accent-color)' />
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
                    {#if $isResponsive}
                        <button class="categories album-page__categories" on:click={() => handleStart(i, true) }>
                            <span class="categories__icon" class:categories__icon--hidden={ !favorite }>
                                <Svg name={ favorite ? 'star_fill' : 'star' } color='var(--accent-color)' />
                            </span>
                            <div class="categories__wrapper">
                                <button class="cover categories__cover" on:click={() => handleStart(i, !openedPlaylistIsPlaying)}>
                                    <div class="cover__action" class:cover__action--hidden={ !openedPlaylistIsPlaying || !isPlaying || $paused }>
                                        <span class="cover__icon cover__icon--hide-hover" class:cover__icon--hidden={ !isPlaying || $paused }>
                                            <SoundBars />
                                        </span>
                                        <span class="cover__action-btn">
                                            <Svg name={ openedPlaylistIsPlaying && isPlaying && !$paused  ? 'pause_fill' : 'play_fill' } color="#fff" />
                                        </span>
                                    </div>
                                    <span class="cover__icon">
                                        <Svg name={ defaultCoverSong.name } color={ defaultCoverSong.color } />
                                    </span>
                                </button>
                                <p class="categories__text--color-white categories__text--overflow" title={ metadata.name }>{metadata.name}</p> 
                                <p class="categories__text--overflow" title={ metadata.artist }>{metadata.artist}</p> 
                            </div>
                            <span class="categories__icon categories--desactivated">
                                <Svg name='ellipsis' color='#fff' />
                            </span>
                        </button>
                    {:else}
                        <button class="categories album-page__categories categories--background" class:categories--background-transparent={ i % 2 !== 0 } on:dblclick={() => handleStart(i, true) }>
                            <span class="categories__icon" class:categories__icon--hidden={ !favorite }>
                                <Svg name={ favorite ? 'star_fill' : 'star' } color='var(--accent-color)' />
                            </span>
                            <div class="categories__wrapper">
                                <button class="cover categories__cover" on:click={() => handleStart(i, !openedPlaylistIsPlaying)}>
                                    <div class="cover__action" class:cover__action--hidden={ !openedPlaylistIsPlaying || !isPlaying || $paused }>
                                        <span class="cover__icon cover__icon--hide-hover" class:cover__icon--hidden={ !isPlaying || $paused }>
                                            <SoundBars />
                                        </span>
                                        <span class="cover__action-btn">
                                            <Svg name={ openedPlaylistIsPlaying && isPlaying && !$paused  ? 'pause_fill' : 'play_fill' } color="#fff" />
                                        </span>
                                    </div>
                                    <span class="cover__icon">
                                        <Svg name={ defaultCoverSong.name } color={ defaultCoverSong.color } />
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
                                <Svg name='ellipsis' color='#7c7c7c' />
                            </span>
                        </button>
                    {/if}
                {/each}
                <p class="album-page__playlist-duration">{buffer.length} morceaux, {getAproximateTime(buffer)}</p>
            </div> 
        {/if}
        {#if tabName === 'Toutes les playlists' || $isResponsive}
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
                            style="{cover.background_color ? `--playlist-cover-color: ${cover.background_color}` : ''}"
                        >
                            <Svg 
                                name={ cover.name ??  defaultCoverPlaylist.name }
                                color={ cover.color ?? defaultCoverPlaylist.color }
                            />
                        </div>
                        <span class="album__name">{name}</span>
                        {#if $isResponsive}
                            <span class="album__icon">
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
    --progress-color: #7c7c7c;
}
.app__content {
    --height: var(--fz-xl);
    --extra-padding: 15px;
    display: grid;
    grid-template-rows: min-content 1fr;
}
.content__action {
    height: 24px;
    padding-block: 2px;
    position: sticky;
    top: 0;
    z-index: 1;
}
.content__action-btn {
    width: 20px;
    height: 100%;
    padding: 4px;
}
.controls__btn--play {
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
    background-color: var(--playlist-cover-color); 
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
    aspect-ratio: 1/1;
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
    aspect-ratio: 1/1;
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
.playing-song__time-bar::-webkit-slider-thumb {
    height: 8px;
    width: 1px;
    background-color: transparent;
    border-radius: 2px;
    margin-top: 2px;
}
.app__controls:hover .playing-song__time-bar::-webkit-slider-thumb,
.playing-song__time-bar:active::-webkit-slider-thumb {
    background-color: var(--progress-color);
    outline: 1px solid var(--progress-color);
}
.app__controls:hover .playing-song__time,
.playing-song__time-bar:active ~.playing-song__time {
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
.presentation__cover {
    --cover-height: 175px;
    border-radius: .2rem;
    grid-area: 1 / 1 / -1 / 2;
    padding: 25px;
    border-radius: 8px;
}
.presentation__text {
    font-size: var(--fz-s);
    color: #a1a1a1;
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
    background: var(--accent-color);
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
    aspect-ratio: 2/1;
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
.categories__cover {
    --cover-height: 35px;
    position: relative;
    background-color: var(--song-cover-color);
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
.cover__action {
    position: absolute;
    inset: 0;
    background-color: #00000075;
    padding: 8px;
}
.cover__action--hidden {
    visibility: hidden;
}
.album-page__playlist-duration {
    --margin-left: calc(var(--categories__favorite-icon--width) + var(--categories--gap));
    font-size: var(--fz-s);
    font-weight: 500;
    color: #a1a1a1;
    margin: var(--space-btw) 0 0 var(--margin-left);
}
.controls-header__btn {
    width: fit-content;
}
.app__controls-footer {
    --nbr-columns: 5;
    grid-template-rows: auto auto;
    background-color: transparent;
    backdrop-filter: blur(0);
    outline: none;
    z-index: 3;
}
.app__controls-footer::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: #080808;
    z-index: -1;
    mask: linear-gradient(to top, black, black 75%, transparent);
}
.controls__items-wrapper {
    gap: 10px;
}
.controls-header__item--round {
    width: var(--controls__item--height);
    min-width: var(--controls__item--height);
    background: var(--dark-fullscreen);
    border-radius: 50%;
    padding: 8px;
}
.footer-player {
    width: 99%;
    height: 50px;
    padding: 8px;
    background-color: var(--playlist-cover-color);
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 12px;
}
.controls-footer__player {
    grid-column: 1/-1;
    margin-inline: auto;
    margin-bottom: 8px;
}
.footer-player__cover {
    border-radius: 5px;
    overflow: hidden;
    background-color: var(--song-cover-color);
    flex-shrink: 0;
}
.footer-player__title {
    font-size: var(--fz-l);
    color: #fff;
    margin-right: auto;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.footer-player__btn {
    height: 100%;
    aspect-ratio: 1.5/1;
    padding: 8px;
    flex-shrink: 0;
}
.footer-player__btn--desactivated {
    pointer-events: none;
}

@media (min-width: 1281px) {
    .app__controls {
        background-color: #191919;
    }
    .app__content {
        background-color: #1e1e1e;
        border-top: 1px solid #7c7c7c33;
        padding-top: 0;
    }
    .categories:hover.categories--background::after {
        background-color: #41414180;
    }
    .categories:hover .categories__icon--hidden {
        visibility: visible;
    }
    .categories:hover .categories__icon :global(> svg) {
        fill: var(--accent-color);
    }
    .categories:hover .cover__action-btn {
        display: block;
    }
    .cover__icon--hidden,
    .categories:hover .cover__icon--hide-hover {
        display: none;
    }
    .categories:hover .cover__action--hidden {
        visibility: visible;
    }
}
@media (max-width: 1280px) {
    .app__content {
        padding-inline: 0;
        padding-bottom: 9.375rem;
    }
    .placement {
        grid-template-columns: 1fr;
        gap: 0;
    }
    .album {
        --cover-width: 65px;
        position: relative;
        grid-template-columns: var(--cover-width) 1fr auto;
        grid-template-rows: auto;
        align-items: center;
        gap: var(--gap);
    }
    .placement__album {
        --gap: 10px;
        gap: var(--gap);
        padding: 10px 15px 10px 0;
    }
    .album::after {
        content: '';
        width: calc(100% - var(--cover-width) - var(--gap));
        height: 1px;
        position: absolute;
        bottom: 0;
        right: 0;
        background-color: #7c7c7c33;
        border-radius: 5px;
    }
    .album__cover {
        outline: 1px solid #7c7c7c33;
    }
    .album__name {
        font-size: var(--fz-l);
        text-align: start;
    }
    .album__icon {
        height: 12px;
        aspect-ratio: 2/1;
    }
    .presentation {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 0;
        padding: 0 15px 15px 20px;
        border-bottom: 1px solid #7c7c7c33;
    }
    .presentation__cover {
        --cover-height: 235px;
        padding: 70px;
    }
    .presentation__title {
        font-size: var(--fz-xl);
    }
    .presentation__description {
        width: 100%;
        font-size: var(--fz-l);
        margin: 0;
        text-align: start;
    }
    .presentation__action {
        width: 100%;
    }
    .presentation__action-btn {
        width: 100%;
        height: 40px;
        font-size: var(--fz-l);
    }
    .presentation__action-btn--form-rect {
        border-radius: 8px;
        background-color: var(--playlist-cover-color);
        color: var(--accent-color);
    }
    .presentation__icon {
        height: 14px;
    }
    .categories {
        --cover-width: 40px;
        grid-template-columns: var(--favorite-width) 1fr auto;
        font-size: var(--fz-m);
    } 
    .album-page__categories {
        --gap: 5px;
        padding-inline: var(--gap) 20px;
    }
    .categories::after {
        content: '';
        width: calc(100% - var(--favorite-width) - var(--gap) * 2 - var(--cover-width));
        height: 1px;
        background-color: #7c7c7c33;
        position: absolute;
        bottom: 0;
        right: 0;
    }
    .categories:last-of-type::after {
        width: calc(100% - var(--favorite-width) - var(--gap) * 2);
    }
    .categories__wrapper {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;
        gap: 0 var(--gap);
    }
    .categories__cover {
        --cover-height: var(--cover-width);
        grid-row: 1/-1;
    }
    .categories__text--color-white {
        font-size: var(--fz-l);
    }
    .album-page__playlist-duration {
        font-size: var(--fz-l);
        font-weight: 400;
        margin-top: 10px;
    }
}
</style>
