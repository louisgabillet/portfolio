import { toast } from "$lib/toast";
import { get } from "svelte/store";
import { formatTime, stop, pass } from "./store";
import type { Player, PlayerAudio } from "./types";
import { storagePrefix } from "$lib";

export class PlayerEvents {
    private player: Player;
    private audio: PlayerAudio;
    private track: HTMLAudioElement;

    constructor(p: Player, t: HTMLAudioElement) {
        this.player = p;
        this.audio = p.audio;
        this.track= t;
    }

    error = () => {
        stop(this.player);
        toast.error({
            appName: 'Music',
            title: 'Erreur de lecture',
            message: `L'audio n'a pas pu être lu. Veuillez réessayer.`,
        })
    }

    loadedmetadata = () => {
        const duration = Math.floor(this.track.duration);
        this.audio.duration.set({
            raw: duration,
            formatted: formatTime(duration),
        })

        const url = this.track.src.split('portfolio/')[1];
        this.handleSecretMusic(url);
    }

    ended = () => {
        if (this.player.opts.autoplay) {
            pass(this.player, 1);
        }
    }

    timeupdate = () => {
        const currTime = Math.floor(this.track.currentTime);
        const duration = get(this.audio.duration).raw;

        this.audio.time.set({
            raw: this.track.currentTime,
            current: formatTime(currTime),
            remaining: '-' + formatTime(duration - currTime),
        })
    }

    play = () => this.audio.paused.set(false); 

    pause = () => this.audio.paused.set(true); 

    volumechange = () => {
        const vol = Math.round(this.track.volume * 100);

        localStorage.setItem(`${storagePrefix}${this.player.name.toLowerCase()}-player-volume`, vol.toString());
        this.audio.volume.set(vol);
    }

    private handleSecretMusic = (url: string) => {
        const hasSecretMusicPlayed = sessionStorage.getItem(`${storagePrefix}music-secret-song-played`);
        const secretUrl = 'music/never_gonna_give_you_up_dugl1z.mp3'; 

        if (url !== secretUrl || hasSecretMusicPlayed === 'true') {
            return;
        }

        sessionStorage.setItem(`${storagePrefix}music-secret-song-played`, 'true');
        toast.success({
            appName: 'Music',
            title: 'NEVER GONNA GIVE YOU UP',
            message: 'Un Rick Roll en 2025..., hmmmm..., pas sûr de celle là.',
        }, { icon: '🕺🕺🕺' })
    }
}

export class RandomPicker {
    private availableNumbers: Set<number> = new Set(); 

    constructor(min: number, max: number) {
        this.changeRange(min, max);
    }

    getRandom(alreadyPlaying: number | null = null): number {
        if (this.availableNumbers.size === 0) {
            return -1;
        }
        if (alreadyPlaying !== null && this.availableNumbers.has(alreadyPlaying)) {
            this.availableNumbers.delete(alreadyPlaying);
        }

        const randomArray = Array.from(this.availableNumbers);

        const randomIndex = Math.floor(Math.random() * randomArray.length);
        const randomNumber = randomArray[randomIndex];

        this.availableNumbers.delete(randomNumber);

        return randomNumber;
    }

    changeRange(min: number, max: number) {
        if (min > max) {
            console.error(new Error('min should be less than or equal to max'));
            return;
        }

        this.availableNumbers.clear();

        for (let i = min; i <= max; i++) {
            this.availableNumbers.add(i);
        }
    }
}

