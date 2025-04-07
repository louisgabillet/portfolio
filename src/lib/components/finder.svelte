<script lang="ts">
import { PUBLIC_USERNAME } from '$env/static/public';
import { onMount } from 'svelte';
import { isResponsive } from '$lib/store';
import { fileSystem, type FileSystem, type FileChildren } from '$lib/filesystem';
import appWindow from '$lib/apps/window-management';
import Shortcut from './shortcut.svelte';
import Svg from './svg.svelte';
import Img from './img.svelte';

type NavBtn = {
    name: string,
    svg_name: string,
    title?: string,
    color: string,
    location: string[],
    desactivated?: boolean,
}

export let finderPath: string[] = ['Macintosh HD', 'Utilisateur', PUBLIC_USERNAME];

const navBtns: NavBtn[] = [
    {
        name: 'Airdrop',
        svg_name: 'airdrop',
        title: 'Favoris',
        color: 'var(--accent-color)',
        location: ['Airdrop'],
        desactivated: true
    },
    {
        name: 'Récents',
        svg_name: 'clock',
        color: 'var(--accent-color)',
        location: ['Récents'],
        desactivated: true,
    },
    {
        name: 'Bureau',
        svg_name: 'menubar_dock_rectangle',
        color: 'var(--accent-color)',
        location: ['Macintosh HD', 'Utilisateur', PUBLIC_USERNAME, 'Bureau'],
    },
    {
        name: 'Téléchargements',
        svg_name: 'arrow_down_circle',
        color: 'var(--accent-color)',
        location: ['Macintosh HD', 'Utilisateur', PUBLIC_USERNAME, 'Téléchargements']
    },
    {
        name: 'Applications',
        svg_name: 'app_store',
        color: 'var(--accent-color)',
        location: ['Macintosh HD', 'Applications']
    },
    {
        name: PUBLIC_USERNAME,
        svg_name: 'house',
        location: ['Macintosh HD', 'Utilisateur', PUBLIC_USERNAME],
        color: 'var(--accent-color)'
    },
    { 
        name: 'Projets',
        svg_name: 'folder',
        location: ['iCloud Drive', 'Projets'],
        color: 'var(--accent-color)' 
    },
    {
        name: 'iCloud Drive',
        svg_name: 'cloud',
        title: 'iCloud',
        color: '#48d9fa',
        location: ['iCloud Drive'],
    },
    {
        name: 'Partagé',
        svg_name: 'folder_badge_person_crop',
        color: '#48d9fa',
        location: ['Partagé'],
        desactivated: true
    },
];

let lastPath: FileSystem[] = [];
let lastBranch: FileSystem[] = [];

let previousPath: FileSystem[] = [];
let previousBranch: FileSystem[] = [];

$: path = [] as FileSystem[];
$: children = isPath ? path[path.length - 1].children : [];

$: lastParentDirName = $isResponsive && path.length > 1 ? path[path.length - 2].name : '';
$: openDirName = isPath ? path[path.length - 1].name : '';

$: isPath = path.length > 0;
$: isPreviousActive = previousPath.length > 0 || previousBranch.length > 0;
$: isNextActive = (lastPath?.length > 0 && lastPath[lastPath?.length - 1]?.name !== openDirName) || lastBranch.length > 0;

$: if ($isResponsive && path[0]?.name !== 'iCloud Drive') {
    path = [];
    goToLocation(['iCloud Drive']);
}

onMount(() => goToLocation(finderPath));

const goToLocation = (location: string[]) => {
    let currentParent: FileChildren[] = fileSystem;
    let updatedPath: FileSystem[] = [];

    location.forEach((folder) => {
        const newPath = currentParent.find((dir) => dir.name === folder) as FileSystem;

        if (!newPath) {
            currentParent = [];
            return;
        }

        updatedPath.push(newPath);
        currentParent = newPath.children; 
    });

    path = updatedPath;
}
const changeParentDir = (name: string, location: string[]) => {
    if (openDirName === name) return;

    //openDirName = name;
    previousBranch = path;

    path = [];
    lastPath = [];

    goToLocation(location);
};
const openDir = (data: FileSystem) => {
    path = [...path, data];

    previousPath = [...previousPath, data]
    lastPath = [];

    previousBranch = [];
    lastBranch = [];

    const focused = document.activeElement;
    if (!focused) return;

    const parent: HTMLElement | null = focused.closest('.app__container');
    if (parent) parent.focus();
};
const goBackInTree = () => {
    if (path.length <= 1 && previousBranch.length === 0 || !isPreviousActive) return;

    if (previousBranch.length > 0) {
        lastBranch = path;
        path = previousBranch;
        previousBranch = [];
        return;
    }

    const last = path.pop();
    if (last) lastPath.push(last);

    path = path;
    previousPath = [...previousPath.slice(0, previousPath.length - 1)];
};
const goBackToLast = () => {
    if (lastPath.length === 0 && lastBranch.length === 0 || !isNextActive) return;

    if (lastBranch.length > 0) {
        previousBranch = path;
        path = lastBranch;
        lastBranch = [];
        return;
    }

    const last = lastPath.pop();
    if (!last) return;

    path = [...path, last];
    previousPath = [...previousPath, last];
};
const openOnClick = (data: FileChildren) => {
    if (data.type === 'Folder') {
        openDir(data as FileSystem);
        return;
    }

    appWindow(data);
};
const jumpPath = (index: number) => {
    if (index >= path.length - 1) return;

    previousBranch = [...path];
    lastPath = [];

    path.length = index + 1;
};
</script>

<div class="app__grid" class:app__grid--version-pc={ !$isResponsive } data-moving-target>
    <nav class="sidebar app__sidebar" class:app__sidebar--removed={ $isResponsive }>
        {#each navBtns as { name, svg_name, title, location, color, desactivated }}
            {#if title}
                <h5 class="sidebar__title sidebar__category sidebar__text--overflow">{title}</h5>
            {/if}
            {#if desactivated}
                <div class="sidebar__item sidebar__item--grid sidebar__item--desactivated">
                    <Svg name={svg_name} {color} />
                    <p class="sidebar__p sidebar__text--overflow">{name}</p>
                </div>
            {:else}
                <button
                    class="sidebar__item sidebar__item--grid"
                    class:sidebar__item--focused={!$isResponsive && name === openDirName}
                    title={name}
                    on:click={() => changeParentDir(name, location)}
                >
                    <Svg name={svg_name} {color} />
                    <span class="sidebar__text sidebar__text--overflow">{name}</span>
                </button>
            {/if}
        {/each}
    </nav>
    {#if $isResponsive}
        <div class="controls app__controls controls-header app__controls-header">
            <button class="controls__item controls-header__item controls-header__btn controls-header__btn--grid controls__btn--{lastParentDirName ? 'active' : 'desactivated'} " on:click={ goBackInTree }>
                <Svg name="chevron_left" color="var(--accent-color)" />
                <span class="controls__text--accent-color controls__text--overflow">{lastParentDirName ?? "Explorer"}</span>
            </button>
            <h2 class="controls__h2 controls__text--overflow">{!openDirName ? 'Icloud Drive' : openDirName}</h2>
            <div class="controls__items-wrapper">
                <span class="controls__item controls-header__item">
                    <Svg name="ellipsis_circle" color="var(--accent-color)" />
                </span>
            </div>
        </div>
        <div class="controls app__controls controls-footer app__controls-footer">
            <div class="controls__item controls-footer__item controls-footer__item--grid">
                <Svg name="clock_fill" />
                <span class="controls__text--overflow">Récents</span>
            </div>
            <div class="controls__item controls-footer__item controls-footer__item--grid">
                <Svg name="folder_fill_badge_person_crop" />
                <span class="controls__text--overflow">Partagé</span>
            </div>
            <div class="controls__item controls-footer__item controls-footer__item--grid">
                <Svg name="folder_fill" color="#0A82FF" />
                <span class="controls__text--accent-color controls__text--overflow">Explorer</span>
            </div>
        </div>
    {:else}
        <div class="controls app__controls" data-moving-target>
            <button class="controls__item controls__btn controls__btn--hover" class:controls__btn--desactivated={ !isPreviousActive } title="Voir les dossiers précédemment consultés" on:click={ goBackInTree }>
                <Svg name="chevron_left" color={isPreviousActive ? '#fff' : "#7c7c7c"} />
            </button>
            <button class="controls__item controls__item--space-right controls__btn controls__btn--hover" class:controls__btn--desactivated={ !isNextActive } title="Voir les dossiers précédemment consultés" on:click={ goBackToLast }>
                <Svg name="chevron_right" color={isNextActive ? "#fff" : "#7c7c7c"}/>
            </button>
            <h2 class="controls__h2 controls__h2--distance-right" title={ openDirName }>{openDirName}</h2>
            <span class="controls__item controls__item--space-right">
                <Svg name="square_grid_2x2" />
            </span>
            <span class="controls__item">
                <Svg name="square_grid_3x1_below_line_grid_1x2" />
            </span>
            <span class="controls__item">
                <Svg name="square_and_arrow_up" />
            </span>
            <span class="controls__item">
                <Svg name="tag" />
            </span>
            <span class="controls__item controls__item--space-right">
                <Svg name="ellipsis_circle" />
            </span>
            <span class="controls__item">
                <Svg name="magnifyingglass" />
            </span>
        </div>
        <div class="line app__line tabs app__tabs">
            <p class="line__p" title={ openDirName }>{openDirName}</p>
            <span class="tabs__icon">
                <Svg name="plus" />
            </span>
        </div>
    {/if}
    <div class="content app__content" class:app__content--full={ $isResponsive }>
        <div class="icons-placement app__icons-placement">
            {#each children as repo}
                <Shortcut
                    app={repo}
                    action={() => openOnClick(repo)}
                />
            {/each}
        </div>
    </div>
    {#if !$isResponsive}
        <div class="route app__route">
            {#each path as path, i}
                <button class="route__btn" title={path.name} on:click={() => jumpPath(i)}>
                    <Img
                        width="10"
                        src={path.src}
                        alt="Petite icône '{path.name}'"
                    />
                    <span class="route__name route__text--overflow">{path.name}</span>
                </button>
            {/each}
        </div>
        <div class="line app__line nbr-el app__nbr-el">
            <p class="line__p nbr-el__p">{children?.length ?? 0} élément{(children?.length ?? 0) > 1 ? 's' : ''}, 248,25 Go disponibles</p>
        </div>
    {/if}
</div>

<style>
.app__grid--version-pc {
    grid-template-rows: var(--nav-height) min-content 1fr min-content min-content;
}
.app__grid {
    --accent-color: #0a82ff;
}
.app__content--full {
    padding-block: 8.125rem 7rem;
}
.app__controls-footer {
    --nbr-columns: 3;
}
.route {
    background-color: #1b1b1b;
    display: flex;
    align-items: center;
}
.app__route {
    border-top: 1px solid #7c7c7c33;
}
.route__btn {
    padding: 5px 0 5px 5px;
    display: grid;
    grid-template-columns: 10px 1fr min-content;
    gap: 5px;
}
.route__btn::after {
    content: '>';
    opacity: .4;
}
.route__btn:last-of-type:after {
    content: '';
}
.route__btn:hover::after,
.route__btn:hover > .route__name {
    opacity: 1;
}
.route__name {
    font-size: var(--fz-xs);
    opacity: 0.4;
}
.route__text--overflow {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.line {
    height: var(--tab-height);
    position: relative;
    background: #373735;
}
.app__line {
    --tab-height: 1rem;
}
.line__p {
    font-size: var(--fz-xs);
    text-align: center;
    padding-inline: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.nbr-el {
    display: grid;
}
.app__nbr-el {
    border-top: 1px solid #000;
    align-items: center;
}
.nbr-el__p {
    color: #7c7c7c;
}
.app__icons-placement {
    --nbr-columns: auto-fill;
    --column-width: minmax(var(--icon-grid-placement), 1fr);
}
.tabs {
    display: grid;
    grid-template-columns: 1fr max-content;
}
.app__tabs {
    border-bottom: 1px solid #000;
    align-items: center;
}
.tabs__icon {
    height: var(--tab-height);
    aspect-ratio: 1/1;
    padding: 3px;
    background-color: #1b1b1b;
    border-block: 1px solid #000;
    border-left: 1px solid #7c7c7c;
}
@media (max-width: 1280px) {
    .app__icons-placement {
        --nbr-columns: 3;
        --column-width: 1fr;
        row-gap: 3rem;
    }
}
</style>
