<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import { isResponsive } from '$lib/store';
import { toast } from '$lib/toast';
import { toastDefaultIcons } from '$lib/toast/utils';
import { apps } from '$lib/apps';
import appWindow from '$lib/apps/window-management';
import appWindows from '$lib/apps/window-management/store';
import type { Toast } from '$lib/toast/types';
import Img from './img.svelte';
import Svg from './svg.svelte';

export let _toast: Toast;
export let index: number;
export let length: number;

const TRANSITION_DURATION: number = 320;
const version = $isResponsive ? 'mobile' : 'pc';
const allApps = apps[version].global;
const units = [
    { label: 'h', seconds: 3600 },
    { label: 'min', seconds: 60 },
    { label: 's', seconds: 1 },
];
const rtIntervalActions: Record<string, number> = {
    'h': 3600000, 
    'min': 60000,   
    //'s': 30000,  
};

let self: HTMLElement;
let parent: HTMLElement;
let leave: boolean = false;

let relativeTime: string = 'maintenant';
let rtInterval: ReturnType<typeof setInterval>;
let rtIntervalDelay: number = rtIntervalActions['min'];
let rtTimeout: ReturnType<typeof setTimeout>;

let startingPos: number = 0;
let distance: number = 0;
let isPointerDown: boolean = false;

$: ({ type, title, message, appName } = _toast);
$: app = allApps.find(app => app.type === appName); 
$: icon = _toast.icon ?? toastDefaultIcons[type];

$: position = length - index > 4 ? 4 : length - index;
$: imgWidth = $isResponsive ? '45' : '30';

const isSameDay = (d1: Date, d2: Date): boolean => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
const formatTime = (t: number): string => t.toString().padStart(2, '0');
const callTomorrow = (d: Date) => rtTimeout = setTimeout(() => getRelativeTime(_toast.created_at), new Date(d).setHours(24, 0, 0, 0) - d.getTime())

const isYesterday = (d1: Date, yesterday: Date) => {
    const date1 = new Date(d1);
    date1.setDate(date1.getDate() - 1);

    return isSameDay(date1, yesterday);
}

const startRtInterval = () => {
    rtInterval = setInterval(() => {
        relativeTime = getRelativeTime(_toast.created_at)
    }, rtIntervalDelay)
}
const changeRtIntervalDelay = (delay: number) => {
    clearInterval(rtInterval);

    rtIntervalDelay = delay;
    startRtInterval();
}
const getRelativeTime = (date: string | number | Date) => {
    const now = new Date();
    const time = new Date(date);

    if (isNaN(time.valueOf())) {
        return 'Invalid date'; 
    }

    if (!isSameDay(now, time)) {
        const day = time.toLocaleDateString('fr-FR', { weekday: 'short' }); 
        const hours = formatTime(time.getHours());
        const minutes = formatTime(time.getMinutes());

        const yesterday = isYesterday(time, now);

        clearTimeout(rtTimeout);

        if (yesterday) {
            callTomorrow(now)
            return `hier ${hours}:${minutes}`;
        }

        return `${day} ${hours}:${minutes}`;
    }

    const secondsAgo = Math.floor((now.valueOf() - time.valueOf()) / 1000);
    const { interval, unit } = calculateTimeDifference(secondsAgo);

    if (interval === 0) {
        return 'maintenant'; 
    };

    if (unit === 'h' && interval > 2) {
        const hours = formatTime(time.getHours());
        const minutes = formatTime(time.getMinutes());

        clearInterval(rtInterval);
        callTomorrow(now)

        return `${hours}:${minutes}`;
    };

    const newInterval = rtIntervalActions[unit];

    if (newInterval && rtIntervalDelay !== newInterval) {
        changeRtIntervalDelay(newInterval);
    }

    return `il y a ${interval} ${unit}`;
};
const calculateTimeDifference = (time: number) => {
    const result = units.find(({ seconds }) => Math.floor(time / seconds) >= 1);

    if (result) {
        return { interval: Math.floor(time / result.seconds), unit: result.label };
    }

    return { interval: 0, unit: '' }; 
};

const openAppWindow = () => {
    if (!app) {
        return;
    }

    closeToast();

    const nbrAppWindowsOpen = $appWindows.filter(w => w.data.type === _toast.appName).length;
    if ($isResponsive && nbrAppWindowsOpen > 0) {
        return;
    }

    appWindow(app);
}
const closeToast = () => {
    leave = true;
    length--;

    setTimeout(() => {
        const nextLast = parent.children[length - 1] as HTMLElement;

        toast.remove(_toast, TRANSITION_DURATION); 
        changeParentHeight(nextLast);
    }, 220);
};
const changeParentHeight = (child: HTMLElement) => {
    const parentHeight: number = parent?.offsetHeight ?? 0;
    const height: number = child?.offsetHeight ?? 0;

    if (height !== parentHeight) {
        parent.style.setProperty('--notif-wrapper--height', `${height}px`);
    }

    if (length < 4) {
        const margin = 8 * length;
        parent.style.setProperty('--notif-wrapper--margin-b', `${margin}px`);
    }
};

const pointerdown = (e: PointerEvent) => {
    if (!self || position !== 1) {
        return;
    }

    startingPos = $isResponsive ? e.clientY : e.clientX;
    isPointerDown = true;

    self.addEventListener('pointermove', pointermove);
    window.addEventListener('pointerup', pointerup);
}

const pointermove = (e: PointerEvent) => {
    const axis: number = $isResponsive ? e.clientY : e.clientX;
    const direction: -1 | 1 = $isResponsive ? -1 : 1;

    distance = Math.max(-30, +(axis - startingPos).toFixed(5) * direction);
    self.style[$isResponsive ? 'bottom' : 'left'] = `${distance}px`;
}

const pointerup = () => {
    const range: number = $isResponsive ? 30 : 80;
    const inClosingRange: boolean = distance >= range;
    const isClicked: boolean = Math.round(distance) === 0;

    self.removeEventListener('pointermove', pointermove);
    window.removeEventListener('pointerup', pointerup);

    if (inClosingRange) {
        closeToast();
        return;
    }

    if (isClicked) {
        openAppWindow();
        return;
    }

    isPointerDown = false;
    distance = 0;
    self.style.removeProperty($isResponsive ? 'bottom' : 'left');
}

onMount(() => {
    parent = self.closest('.notif-wrapper') as HTMLElement;
    changeParentHeight(self);

    startRtInterval();
});
onDestroy(() => {
    clearInterval(rtInterval);
    clearTimeout(rtTimeout);
})
</script>

<div
    bind:this={ self }
    class="notif notif--position-{ position } { leave ? 'notif--slide-out' : 'notif--slide-in' }"
    class:notif--hover={ !$isResponsive && position === 1 }
    style:--transition-property='transform, opacity, scale{ !$isResponsive || !isPointerDown ? ', bottom' : '' }{ !isPointerDown ? ', left' : '' }'
>
    <button
        class="notif__btn notif__btn--close"
        class:notif__btn--hidden={ !$isResponsive || index !== length - 1 }
        title="Fermer la notification"
        on:click={ closeToast }
    >
        <Svg name="xmark" color="#fff" />
    </button>
    <button 
        class="notif__content" 
        on:pointerdown={ pointerdown }
    >
        <div class="notif__img" title="{ index + 1 } notifitations { app?.type ? `pour ${ app?.type }` : '' }">
            <Img src={ app?.src ?? '' } alt="Icône '{ app?.type }'" width={ imgWidth } />
            <!--{#if index > 0}
                <span class="notif__nbr-open">{ index + 1 }</span>
            {/if}-->
        </div>
        <div class="notif__header">
            {#if icon}
                <span class="notif__icon">{ icon }</span>
            {/if}
            <h5 class="notif__title notif__text notif__text--overflow" title="{ title }">{ title }</h5>
            <p class="notif__relative-time">{ relativeTime }</p>
        </div>
        <p class="notif__message notif__text notif__text--overflow" title="{ message }">{message}</p>
    </button>
</div>

<style>
.notif {
    --offset: calc(-8px * var(--pos));
    --bg-color: var(--dark-fullscreen);
    width: 100%;
    position: absolute;
    left: 0;
    bottom: var(--offset);
    transition-property: var(--transition-property);
    transition-duration: 320ms;
    transition-timing-function: ease;
}
.notif--position-1 {
    --pos: 0;
    z-index: 1;
}
.notif--position-2 {
    --pos: 1;
    scale: 0.95;
}
.notif--position-3 {
    --pos: 2;
    scale: 0.9;
}
.notif--position-4 {
    --pos: 2;
    /*scale: 0.85;*/
    scale: 0.9;
    opacity: 0;
}
.notif--slide-in {
    animation: slide-in 320ms ease;
}
.notif--slide-out {
    animation: slide-out 320ms ease;
}
.notif__content {
    position: relative;
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: repeat(2, min-content);
    column-gap: 8px;
    background-color: var(--bg-color);
    backdrop-filter: blur(var(--blur));
    border: 1px solid var(--bg-color);
    outline: 1px solid #1a1a1a;
    padding: 8px;
    border-radius: 14px;
}
.notif-header {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 5px;
}
.notif__header {
    display: flex;
    align-items: center;
    gap: 5px;
}
.notif__icon {
    font-size: var(--fz-xs);
    white-space: nowrap;
}
.notif__img {
    position: relative;
    width: min-content;
    grid-row: 1/-1;
}
.notif__text--overflow {
    --nbr-lines: 2;
    overflow: hidden;
    display: -webkit-box;
    line-clamp: var(--nbr-lines);
    -webkit-line-clamp: var(--nbr-lines);
    -webkit-box-orient: vertical;
    overflow-wrap: anywhere;
}
.notif__relative-time {
    font-size: var(--fz-xs);
    font-weight: 300;
    color: #a1a1a1;
    margin-left: auto;
    white-space: nowrap;
}
.notif__title {
    --nbr-lines: 1;
    font-weight: 600;
}
.notif__message {
    --nbr-lines: 3;
    text-align: start;
}
.notif__text {
    font-size: var(--fz-s);
    color: #fff;
}
.notif__nbr-open {
    --fz: var(--fz-s);
    --min-width: calc(var(--fz) + 2px);
    min-width: var(--min-width);
    border-radius: calc(var(--min-width) * 2);
    padding: 1px;
    font-size: var(--fz);
    color: #a1a1a1;
    background-color: var(--bg-color);
    backdrop-filter: blur(var(--blur));
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(15%, -15%);
    z-index: 1;
}
.notif__btn {
    background-color: var(--bg-color);
    backdrop-filter: blur(var(--blur));
    padding: 5px;
}
.notif__btn--hidden {
    visibility: hidden;
}
.notif__btn--close {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    width: 18px;
    height: 18px;
    border-radius: 50%;
    z-index: 1;
}
.notif--hover:hover .notif__btn--close {
    visibility: visible;
}

@keyframes slide-in {
from {
    transform: translateX(110%);
}
to {
    transform: none;
}
}
@keyframes slide-out {
from {
    transform: none;
}
to {
    transform: translateX(110%);
}
}

@media (max-width: 1280px) {
    .notif {
        border-radius: 0.6rem;
    }
    .notif__text {
        font-size: var(--fz-l);
    }
    .notif__relative-time {
        font-size: var(--fz-m);
    }
    .notif__nbr-open {
        --fz: var(--fz-m);
    }
    .notif__btn--close {
        top: 98%;
        left: 98%;
        width: 25px;
        height: 25px;
        padding: 8px;
    }

    @keyframes slide-in {
    from {
        transform: translateY(-205%);
    }
    to {
        transform: none;
    }
    }
    @keyframes slide-out {
    from {
        transform: none;
    }
    to {
        transform: translateY(-205%);
    }
    }
}
</style>
