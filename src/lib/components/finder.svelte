<script lang="ts">
import { onMount } from 'svelte';
import { isResponsive } from '$lib/store';
import { fileSystem, type FileSystem } from '$lib/filesystem';
import appWindow from '$lib/apps/window-management';
import Shortcut from './shortcut.svelte';
import Svg from './svg.svelte';
import Img from './img.svelte';

//export let open: (app: any) => void;
export let finderPath: string[] = ['Macintosh HD', 'Utilisateur', 'louisgabillet'];

const navBtns = [
    {
        name: 'Airdrop',
        svg_name: 'airdrop',
        title: 'Favoris',
        color: 'var(--accent-color)',
        desactivated: true
    },
    {
        name: 'Récents',
        svg_name: 'clock',
        color: 'var(--accent-color)',
        desactivated: true
    },
    {
        name: 'Bureau',
        svg_name: 'menubar_dock_rectangle',
        color: 'var(--accent-color)',
        location: ['Macintosh HD', 'Utilisateur', 'louisgabillet'],
    },
    {
        name: 'Téléchargements',
        svg_name: 'arrow_down_circle',
        color: 'var(--accent-color)',
        location: ['Macintosh HD', 'Utilisateur', 'louisgabillet']
    },
    {
        name: 'Applications',
        svg_name: 'app_store',
        color: 'var(--accent-color)',
        location: ['Macintosh HD']
    },
    {
        name: 'louisgabillet',
        svg_name: 'house',
        location: ['Macintosh HD', 'Utilisateur'],
        color: 'var(--accent-color)'
    },
    { name: 'Projets', svg_name: 'folder', location: ['iCloud Drive'], color: 'var(--accent-color)' },
    {
        name: 'iCloud Drive',
        svg_name: 'cloud',
        title: 'iCloud',
        color: '#48d9fa'
    },
    {
        name: 'Partagé',
        svg_name: 'folder_badge_person_crop',
        color: '#48d9fa',
        desactivated: true
    },
    //{
    //    name: 'Rouge',
    //    svg_name: 'circle_fill',
    //    title: 'Tags',
    //    color: 'var(--color-btn-close)',
    //    desactivated: true
    //},
    //{
    //    name: 'Orange',
    //    svg_name: 'circle_fill',
    //    color: 'var(--color-btn-reduce)',
    //    desactivated: true
    //},
    //{
    //    name: 'Jaune',
    //    svg_name: 'circle_fill',
    //    color: '#ffe414',
    //    desactivated: true
    //},
    //{
    //    name: 'Vert',
    //    svg_name: 'circle_fill',
    //    color: 'var(--color-btn-fullscreen)',
    //    desactivated: true
    //},
    //{
    //    name: 'Bleu',
    //    svg_name: 'circle_fill',
    //    color: 'var(--accent-color)',
    //    desactivated: true
    //},
    //{
    //    name: 'Violet',
    //    svg_name: 'circle_fill',
    //    color: '#da72ff',
    //    desactivated: true
    //},
    //{
    //    name: 'Gris',
    //    svg_name: 'circle_fill',
    //    color: '#969597',
    //    desactivated: true
    //},
    //{
    //    name: 'All tags',
    //    svg_name: 'circlebadge_2',
    //    color: '#7c7c7c',
    //    desactivated: true
    //}
];

//let parentDirName: string = finderPath[0];
let openDirName: string = finderPath[finderPath?.length - 1];
let lastPath: FileSystem[] = [];

$: path = [] as FileSystem[];
$: children = path[path?.length - 1]?.children;

$: isPreviousActive = path?.length > 1;
$: isNextActive = lastPath?.length > 0 && lastPath[lastPath?.length - 1]?.name !== openDirName;

$: if ($isResponsive && path[0]?.name !== 'iCloud Drive') {
    path = [];
    changePath(fileSystem, ['iCloud Drive']);
}

onMount(() => {
    goInPath(finderPath);
});

const goInPath = (location: string[]) => {
    location?.forEach((folder) => {
        const arr = path[path?.length - 1];
        const parent = arr ? arr?.children : fileSystem;
        if (parent) {
            const goIn: FileSystem | undefined = parent?.find((dir) => dir?.name === folder);
            if (goIn) path = [...path, goIn];
        }
    });
};
let nameCurrOpen: string = '';

const changePath = (arr: FileSystem[], location: string[]) => {
    let currentLevel = arr;

    for (const key of location) {
        const nextLevel = currentLevel.find((obj) => obj.name === key);
        if (nextLevel) path.push(nextLevel);

        if (nextLevel?.children) {
            currentLevel = nextLevel.children;
        }
    }
};
const changeParentDir = (name: string, location: string[] | null = null) => {
    openDirName = name;
    path = lastPath = [];

    if (location) {
        location.push(name);
    } else {
        location = [name];
    }
    changePath(fileSystem, location);
};
const openDir = () => {
    openDirName = nameCurrOpen;

    //const opened = children?.find((dir) => dir?.name === dirName);
    const opened = children?.find((dir) => dir?.name === nameCurrOpen);
    if (opened?.type === 'Folder') {
        path = [...path, opened];
        lastPath = [];
    }
    const focused = document.activeElement;
    if (focused) {
        const parent = focused.closest('.app') as HTMLElement;
        parent?.focus();
    }
};
const goBackInTree = () => {
    if (path?.length <= 1 || !isPreviousActive) return;
    //const newPath = path?.slice(0, -1);
    //path = newPath;
    const last = path?.pop();
    if (last) lastPath = [...lastPath, last];
    path = [...path];
    openDirName = path[path?.length - 1]?.name;
    //console.log(path, newPath)
};
const goBackToLast = () => {
    if (lastPath?.length === 0 || !isNextActive) return;

    const last = lastPath?.pop();
    if (last) path = [...path, last];
    openDirName = path[path?.length - 1]?.name;
};
const openOnClick = (data: FileSystem) => {
    //const { type, name, url, pages, src, unique_name } = data;
    const { type, name } = data;

    nameCurrOpen = name;
    console.log(data, path)

    if (data.type === 'Folder') {
        openDir();
        return;
    }
    //const app: any = { name, type, src };
    //const test: any = {
    //    unique_name,
    //    name,
    //    img_id: '2',
    //    type: type === 'Document' || type === 'Image' ? 'Preview' : type === 'Webloc' ? 'Safari' : type,
    //    src,
    //}
    if (type === 'Document' || type === 'Image') {
        data.type = 'Preview';
        //data.unique_name = parentDirName;
    } else if (type === 'Webloc') {
        data.type = 'Safari';
    }

    //if (type === 'Webloc' || type === 'Safari') {
    //    app.type = 'Safari';
    //    app.url = url;
    //    app.pages = pages;
    //} else if (type === 'Document' || type === 'Image') {
    //    const img = { name, src };
    //    app.type = 'Preview';
    //    //app.preview_data = { [type.toLowerCase()]: pages ?? img };
    //    app.unique_name = unique_name;
    //    if (img_id) app.img_id = img_id;
    //}
    appWindow(data);
};
$: lastParentDirName = path[path.length - 2]?.name;

const jumpPath = (name: string) => {
    const index = path.findIndex((path) => path.name === name) + 1;
    if (index < path.length) {
        path.length = index;
        openDirName = name;
    }
};
</script>

<div class="app__grid" class:app__grid--version-pc={ !$isResponsive }>
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
        <div class="controls app__controls">
            <button class="controls__item controls__btn controls__btn--hover" class:controls__btn--desactivated={ !isPreviousActive } title="Voir les dossiers vus précédemment" on:click={ goBackInTree }>
                <Svg name="chevron_left" color={isPreviousActive ? '#fff' : "#7c7c7c"} />
            </button>
            <button class="controls__item controls__item--space-right controls__btn controls__btn--hover" class:controls__btn--desactivated={ !isNextActive } title="Voir les dossiers vus précédemment" on:click={ goBackToLast }>
                <Svg name="chevron_right" color={isNextActive ? "#fff" : "#7c7c7c"}/>
            </button>
            <h2 class="controls__h2 controls__h2--distance-right">{openDirName}</h2>
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
            <p class="line__p" title={openDirName}>{openDirName}</p>
            <span class="tabs__icon">
                <Svg name="plus" />
            </span>
        </div>
    {/if}
    <div class="content app__content" class:app__content--full={ $isResponsive }>
        <div class="icons-placement app__icons-placement">
            {#if children}
                {#each children as repo}
                    <Shortcut
                        app={repo}
                        action={() => openOnClick(repo)}
                    />
                {/each}
            {/if}
        </div>
        <!--{#if $isResponsive}
<p class="line__p nbr-el__p">{children?.length ?? 0} élément{(children?.length ?? 0) > 1 ? 's' : ''}</p>
{/if}-->
    </div>
    {#if !$isResponsive}
        <div class="route app__route">
            {#each path as path}
                <button class="route__btn" title={path.name} on:click={() => jumpPath(path.name)}>
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
