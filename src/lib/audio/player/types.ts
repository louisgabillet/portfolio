import { type Writable } from "svelte/store";

export interface PlayerOptions {
    autoplay: true,
}
export type PlayerData = {
    name: string,
    buffer: Record<string, unknown>[],
}
export interface PlayerAudio {
    track: HTMLAudioElement | null,
    duration: Writable<{
        raw: number,
        formatted: string,
    }>,
    paused: Writable<boolean>,
    loop: Writable<boolean>,
    random: Writable<boolean>,
    volume: Writable<number>,
    time: Writable<{
        raw: number,
        current: string,
        remaining: string,
    }>,
}

export type PlayerHandler = (
    data: PlayerData,
	opts?: PlayerOptions,
) => PlayerAudio;

export interface Player {
    created_at: number,
    id: string,
    name: PlayerData['name'],
    audio: PlayerAudio,
    buffer: Writable<PlayerData['buffer']>,
    opts: PlayerOptions,
}

export type Players = Record<string, Player>;
