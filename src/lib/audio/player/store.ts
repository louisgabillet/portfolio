import { get, writable, type Writable } from "svelte/store";
import type { Player, PlayerData, Players } from "./types";
import { PlayerEvents, RandomPicker } from "./class";
import { storagePrefix } from "$lib";

export const players: Writable<Players> = writable({});

type EventManager = Record<string, () => void>;
type PickerManager = Record<string, RandomPicker>;

const eventManager: EventManager = {};
const pickerManager: PickerManager = {};

const addEvents = (player: Player) => {
    const track = player.audio.track;

    if (!track) {
        console.log('Track not existing');
        return;
    }

    const handlers = new PlayerEvents(player, track);

    const events = [
        { name: 'error', handler: handlers.error },
        { name: 'loadedmetadata', handler: handlers.loadedmetadata },
        { name: 'ended', handler: handlers.ended },
        { name: 'timeupdate', handler: handlers.timeupdate },
        { name: 'play', handler: handlers.play },
        { name: 'pause', handler: handlers.pause },
        { name: 'volumechange', handler: handlers.volumechange},
    ]

    events.forEach((e) => track.addEventListener(e.name, e.handler))

    eventManager[player.name] = () => {
        events.forEach((e) => track.removeEventListener(e.name, e.handler))
        delete eventManager[player.name];
    }
}
const loadAudio = (player: Player) => {
    const track = player.audio.track;

    if (!track) {
        console.log('Track not existing');
        return;
    }

    const storedVolume = localStorage.getItem(`${storagePrefix}${player.name.toLowerCase()}-player-volume`);
    const storedLoop = localStorage.getItem(`${storagePrefix}${player.name.toLowerCase()}-player-loop`);
    const storedRandom = localStorage.getItem(`${storagePrefix}${player.name.toLowerCase()}-player-random`);

    addEvents(player);
    track.autoplay = player.opts.autoplay;
    track.volume = storedVolume ? +storedVolume / 100 : 0.2;

    if (storedLoop === 'true') {
        loop(player);
    }
    if (storedRandom === 'true') {
        random(player);
    }
}

export function add(player: Player): Player {
    const _players = get(players);
    const name = player.name;

    if (_players[name]) {
        console.log('Player already existing');
        return _players[name];
    }

    loadAudio(player);
    pickerManager[name] = new RandomPicker(0, get(player.buffer).length - 1);

    players.update(($players) => {
        return {
            ...$players,
            [name]: player,
        }
    })

    return player;
}
export function remove(player: Player) {
    const name = player.name;
    const removeEvents = eventManager[name];

    stop(player);
    if (removeEvents) removeEvents();

    players.update(($players) => {
        const { [name]: _, ...rest } = $players;
        return rest;
    })
}
export function buffer(player: Player, buffer: PlayerData['buffer']) {
    const picker = pickerManager[player.name];

    player.buffer.set(buffer);
    if (picker) picker.changeRange(0, buffer.length - 1);
}

export function start(player: Player, index: number) {
    const track = player.audio.track;

    if (!track) {
        console.log('Track not existing');
        return;
    }

    const buff = get(player.buffer);
    const data = buff[index];

    if (!data) {
        console.log('Buffered audio not found');
        return;
    }

    const url = `https://res.cloudinary.com/dejb4brmy/video/upload/q_auto/portfolio/${data.url}`;

    track.dataset.audioIndex = index.toString();

    if (track.src !== url) {
        track.src = url;
        return;
    }

    track.currentTime = 0;

    if (track.paused) track.play();
}
export function stop(player: Player) {
    const track = player.audio.track;

    if (!track) {
        console.log('Track not existing');
        return;
    }

    track.pause();
    track.src = '';
    track.removeAttribute('src');
    track.removeAttribute('data-audio-index');

    pickerManager[player.name].changeRange(0, get(player.buffer).length - 1)

    player.audio.paused.set(true);
    player.audio.duration.set({
        raw: 0,
        formatted: formatTime(0),
    });
}
export function play(player: Player, index: number = 0) {
    const track = player.audio.track;

    if (!track) {
        console.log('Track not existing');
        return;
    }

    if (!track.src) {
        start(player, index);
        return;
    }

    if (track.paused) {
        track.play();
        return;
    }

    track.pause();
}

export function loop(player: Player) {
    const track = player.audio.track;

    if (!track) {
        console.log('Track not existing');
        return;
    }

    track.loop = !track.loop;
    player.audio.loop.set(track.loop);

    localStorage.setItem(`${storagePrefix}${player.name.toLowerCase()}-player-loop`, track.loop.toString());
}
export function random(player: Player) {
    const isRandom = !get(player.audio.random);
    player.audio.random.set(isRandom);

    localStorage.setItem(`${storagePrefix}${player.name.toLowerCase()}-player-random`, isRandom.toString());
}

export function pass(player: Player, direction: -1 | 1) {
    const buff = get(player.buffer);
    if (!buff) {
        console.log('No buffered audio');
        return;
    }

    const track = player.audio.track;
    if (!track) {
        console.log('Track not existing');
        return;
    }

    const currentIndex = track.dataset.audioIndex || '-2';
    const index = get(player.audio.random) ? pickerManager[player.name].getRandom(+currentIndex) : +currentIndex + direction; 
    const willPlay = buff[index];

    if (!willPlay) {
        stop(player);
        console.log('Buffered audio not found');
        return;
    }

    start(player, index);
}

export function volume(player: Player, volume: number) {
    const track = player.audio.track;

    if (!track) {
        console.log('Track not existing');
        return;
    }

    track.volume = volume / 100;
}
export function time(player: Player, time: number) {
    const track = player.audio.track;

    if (!track) {
        console.log('Track not existing');
        return;
    }

    track.currentTime = time;
}

export const formatTime = (timeInSec: number) => {
    const formatUnit = (unit: number) => unit < 10 ? `0${unit}` : `${unit}`;
    
    const days = Math.floor(timeInSec / 86400);
    timeInSec %= 86400;

    const hours = Math.floor(timeInSec / 3600);
    timeInSec %= 3600;

    const minutes = Math.floor(timeInSec / 60);
    const seconds = Math.floor(timeInSec % 60);

    const paddedDays = days > 0 ? days + ':' : '';
    const paddedHours = hours > 0 || days > 0 ? formatUnit(hours) + ':' : '';
    const paddedMinutes = hours > 0 || days > 0 ? formatUnit(minutes) : minutes;
    const paddedSeconds = formatUnit(seconds);

    return `${paddedDays}${paddedHours}${paddedMinutes}:${paddedSeconds}`;
}
