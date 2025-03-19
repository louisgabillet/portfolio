<script lang="ts">
import { onMount } from 'svelte';
import { isResponsive } from '$lib/store';
import { toast } from '$lib/toast';
import { toastDefaultIcons } from '$lib/toast/utils';
import { apps } from '$lib/apps';
import type { Toast } from '$lib/toast/types';
import Img from './img.svelte';
import Svg from './svg.svelte';

export let _toast: Toast;
export let index: number;
export let length: number;

$: ({ type, title, message, appName } = _toast);

const version = $isResponsive ? 'mobile' : 'pc';
const allApps = apps[version].global;
$: app = allApps.find(app => app.type === appName); 

$: icon = _toast.icon ?? toastDefaultIcons[type];

let self: HTMLElement;
let parent: HTMLElement;
let leave: boolean = false;

$: position = length - index > 4 ? 4 : length - index;
$: imgWidth = $isResponsive ? '25' : '18';

const close = () => {
    const nextLast = parent.children[length - 2] as HTMLElement;
    leave = true;
    length--;

    setTimeout(() => {
        toast.remove(_toast, 320); 
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

onMount(() => {
    parent = self.closest('.notif-wrapper') as HTMLElement;
    changeParentHeight(self);

    //setTimeout(() => {
    //    close();
    //}, 5000);
});
</script>

<div
    bind:this={self}
    class="notif notif--flex notif--position-{position} {leave ? 'notif--slide-out' : 'notif--slide-in'}"
    class:notif--hover={!$isResponsive && position === 1}
>
    <button
        class="notif__btn notif__btn--close"
        class:notif__btn--hidden={!$isResponsive || index !== length - 1}
        on:click={close}
    >
        <Svg name="xmark" color="#fff" />
    </button>
    <div class="notif-header">
        <Img src={app?.src ?? ''} alt="Icône '{app?.type}'" width={imgWidth} />
        <p
            class="notif__text notif__text--thin notif__text--color-grey notif__text--overflow notif__text--line-1"
        >
            {app?.type}
        </p>
    </div>
    <h5 class="notif__text notif__text--bold notif__text--overflow notif__text--line-1">{icon} {title} {icon}</h5>
    <p class="notif__text notif__text--overflow">{message}</p>
    {#if index > 0}
        <p class="notif__text notif__text--overflow">
            {index} notification{index > 1 ? 's' : ''} de plus
        </p>
    {/if}
</div>

<style>
.notif {
    --offset: calc(-8px * var(--pos));

    width: 100%;
    position: absolute;
    left: 0;
    bottom: var(--offset);
    background-color: var(--dark-fullscreen);
    backdrop-filter: blur(50px);
    padding: 8px;
    outline: 1px solid #7c7c7c33;
    border-radius: 0.4rem;
    transition: all 320ms ease;
    overflow-wrap: anywhere;
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
    --pos: 3;
    scale: 0.85;
    opacity: 0;
}
.notif--slide-in {
    animation: slide-in 320ms ease;
}
.notif--slide-out {
    animation: slide-out 320ms ease;
}
.notif--flex {
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.notif-header {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 5px;
}
.notif__text {
    font-size: var(--fz-s);
    color: #fff;
}
.notif__text--thin {
    font-weight: 300;
}
.notif__text--bold {
    font-weight: 500;
}
.notif__text--color-grey {
    opacity: 0.4;
}
.notif__text--overflow {
    --nbr-lines: 2;

    overflow: hidden;
    display: -webkit-box;
    line-clamp: var(--nbr-lines);
    -webkit-line-clamp: var(--nbr-lines);
    -webkit-box-orient: vertical;
}
.notif__text--line-1 {
    --nbr-lines: 1;
}
.notif__btn {
    background-color: inherit;
    backdrop-filter: inherit;
    outline: 1px solid #7c7c7c33;
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
    transform: translateX(100%);
}
to {
    transform: none;
}
}
@keyframes slide-out {
from {
    transform: none;
    opacity: 1;
}
to {
    transform: translateX(100%);
    opacity: 0;
}
}

@media (max-width: 1280px) {
    .notif {
        border-radius: 0.6rem;
    }
    .notif__text {
        font-size: var(--fz-l);
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
        transform: translateY(-100%);
    }
    to {
        transform: none;
    }
    }
    @keyframes slide-out {
    from {
        transform: none;
        opacity: 1;
    }
    to {
        transform: translateY(-100%);
        opacity: 0;
    }
    }
}
</style>
