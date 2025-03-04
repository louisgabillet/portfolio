import { toast } from "$lib/toast";
import { writable, get, derived } from "svelte/store";

type Data = {
    audio: HTMLAudioElement,
    isPlaying: boolean,
    track_id: string,
    tracks: any[],
}

export function createPlayer() {
    const data = writable<Data>({
        audio: new Audio(),
        isPlaying: false,
        track_id: '',
        tracks: [],
    })

    const hasSecretMusicPlayed = sessionStorage.getItem('secret_music_played');
    const { audio } = get(data);
    audio.volume = 0.1;

    let metadata: Record<string, any> = {};
    const derivedId = derived(data, ($data) => $data.track_id);

    const getMetadata = () => {
        const { track_id, tracks } = get(data);
        let res;
        if (track_id && tracks.length > 0) {
            res = tracks.find(track => track.id === track_id);
        }
        return res ?? {};
    }
    derivedId.subscribe(() => metadata = getMetadata());

    const start = async (url: string) => {
        try {
            const res = await fetch(`https://res.cloudinary.com/dejb4brmy/video/upload/q_auto/portfolio/${url}`);
            if (res.ok) {
                audio.src = res.url;
            } else {
                if (res.status === 404) throw new Error('404, Not found');
                throw Error("Could not play the song");
            }
        } catch (err) {
            console.error(err);
            return;
        }

        if (url === "music/never_gonna_give_you_up_dugl1z.mp3" && hasSecretMusicPlayed !== 'true') {
            //addNotifToQueue('Musique', 'icons/music_s8ah6d.png', '🕺🕺🕺 NEVER GONNA GIVE YOU UP 🕺🕺🕺', 'Un Rick Roll en 2025..., hmmmm..., pas sûr de celle là.');
            toast.success({
                appName: 'Music',
                title: 'NEVER GONNA GIVE YOU UP', 
                message: 'Un Rick Roll en 2025..., hmmmm..., pas sûr de celle là.',
            }, { icon: '🕺' })
            sessionStorage.setItem('secret_music_played', 'true');
        }
    }

    const togglePlay = () => {
        if (!audio.src && metadata?.url) {
            const url = metadata.url;
            start(url);
        }
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
        data.update(curr => ({ ...curr, isPlaying: !audio.paused }));
    }

    return {
        ...data,
        togglePlay,
        start,
    }
}
