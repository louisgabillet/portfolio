import { browser } from "$app/environment";
import { genId } from "./utils";
import { add, buffer, formatTime, loop, pass, play, random, remove, start, stop, time, volume } from "./store";
import type { Player, PlayerAudio, PlayerData, PlayerHandler, PlayerOptions } from "./types";
import { writable } from "svelte/store";

const createPlayer = (data: PlayerData, opts?: PlayerOptions) => ({
    created_at: Date.now(),
    id: genId(),
    name: data.name,
    audio: {
        track: browser ? new Audio() : null,
        paused: writable(true),
        loop: writable(false),
        random: writable(false),
        duration: writable({
            raw: 0,
            formatted: formatTime(0),
        }),
        volume: writable(0),
        time: writable({
            raw: 0,
            current: formatTime(0),
            remaining: formatTime(0),
        }),
    },
    buffer: writable(data.buffer),
    opts: {
        autoplay: opts?.autoplay || true,
    },
});
    
const createHandler: PlayerHandler = (data: PlayerData, opts?: PlayerOptions) => {
    const player: Player = createPlayer(data, opts);
    const added: Player = add(player);

    return added.audio; 
}

export const player = (data: PlayerData, opts?: PlayerOptions): PlayerAudio => createHandler(data, opts);
player.remove = (p: Player) => remove(p);
player.buffer = (p: Player, b: PlayerData['buffer']) => buffer(p, b);

player.start = (p: Player, index: number) => start(p, index);
player.stop = (p: Player) => stop(p);
player.play = (p: Player, index: number = 0) => play(p, index);

player.loop = (p: Player) => loop(p);
player.random = (p: Player) => random(p);

player.next = (p: Player) => pass(p, 1);
player.previous = (p: Player) => pass(p, -1);

player.volume = (p: Player, vol: number) => volume(p, vol);
player.time = (p: Player, t: number) => time(p, t);
