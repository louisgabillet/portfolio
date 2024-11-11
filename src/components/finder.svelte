<script lang="ts">
	import { onMount } from "svelte";

export let open: (app: any) => void;
export let openWindow: HTMLElement;
export let finderPath: string[];

//import { data } from '$lib/index';

//let directories = [
//    { name: }
//]
const navBtns = [
    { name: 'Airdrop', icon: '􀌙', title: 'Favorites', color: 'blue' },
    { name: 'Recents', icon: '􀐫', color: 'blue' },
    { name: 'Desktop', icon: '􀣰', color: 'blue' },
    { name: 'Downloads', icon: '􀁸', color: 'blue' },
    { name: 'Applications', icon: '􀑏', color: 'blue' },
    { name: 'louisgabillet', icon: '􀎞', color: 'blue', active: true },
    { name: 'iCloud Drive', icon: '􀌋', title: 'iCloud', color: 'turquoise' },
    { name: 'Shared', icon: '􀈝', color: 'turquoise' },
    { name: 'Network', icon: '􀤆', title: 'Locations' },
    { name: 'Red', icon: '􀀁', title: 'Tags', minus: true },
    { name: 'Orange', icon: '􀀁', minus: true },
    { name: 'Yellow', icon: '􀀁', minus: true },
    { name: 'Green', icon: '􀀁', minus: true },
    { name: 'Blue', icon: '􀀁', minus: true },
    { name: 'Purple', icon: '􀀁', minus: true },
    { name: 'Grey', icon: '􀀁', minus: true },
    { name: 'All tags', icon: '􀀁', minus: true }
];
interface FileSystem {
    name: string;
    type: 'Folder' | 'Safari';
    url?: string;
    children?: FileSystem[];
}
const directories: FileSystem[] = [
    {
        name: 'louisgabillet',
        type: 'Folder',
        children: [
            {
                name: 'Projects',
                type: 'Folder',
                children: [
                    {
                        name: 'Test 1',
                        type: 'Folder',
                        children: [{ name: 'Test 1', url: 'https://test-1.com', type: 'Safari' }]
                    },
                    {
                        name: 'Test 2',
                        type: 'Folder',
                        children: [{ name: 'Test 2', url: 'https://test-2.com', type: 'Safari' }]
                    }
                ]
            }
        ]
    }
];

let parentDirName: string = finderPath[0]; 
let openDirName: string = finderPath[finderPath?.length - 1];
let lastPath: any = [];

$: path = [] as FileSystem[];
$: children = path[path?.length - 1]?.children;

$: isPreviousActive = path?.length > 1;
$: isNextActive = lastPath?.length > 0 && lastPath[lastPath?.length - 1]?.name !== openDirName;

onMount(() => {
    finderPath?.forEach((folder) => {
        const arr = path[path?.length - 1];
        const goIn =  (arr ? arr?.children?.find(dir => dir?.name === folder) : directories?.find((dir) => dir?.name === folder)) as FileSystem;
        if (goIn) {
            path = [...path, goIn];
            //if (openDirName !== goIn?.name) openDirName = goIn?.name;
        }
    })
})

//async function getUserRepos(username: string): Promise<[]> {
//    try {
//        const response = await fetch(`https://api.github.com/users/${username}/repos`);
//        const repos = await response.json();
//        return repos;
//    } catch (error) {
//        console.error('Error fetching repos:', error);
//        return [];
//    }
//}
//getUserRepos('octocat').then((res)=> {
//    const projects = children?.find(dir => dir?.name === 'Projects')
//    const repos = res?.map((repo: any)  => { return { name: repo?.name, url: repo?.svn_url, children: [ {name: repo?.name, dir: false} ] }})
//    if (projects && res) projects.children = repos;
//})
const changeParentDir = (name: string) => {
    openDirName = name;
    parentDirName = name;
    const newParent = directories?.find((dir) => dir?.name === name);
    path = newParent ? [newParent] : [];
    lastPath = [];
}
const openDir = (e: Event) => {
    const target = e?.target as HTMLElement;
    const directory = target?.closest('.directory') as HTMLElement;
    const dirName = directory?.dataset.nameDir; 
    
    if (dirName) openDirName = dirName;

    const opened = children?.find((dir) => dir?.name === dirName);
    if (opened?.type === 'Folder') {
        path = [...path, opened];
        lastPath = [];
    }

    openWindow?.focus();
};
const goBackInTree = () => {
    if (path?.length <= 1) return;
    //const newPath = path?.slice(0, -1);
    //path = newPath;
    const last = path?.pop();
    lastPath = [...lastPath, last];
    path = [...path];
    openDirName = path[path?.length - 1]?.name;
    //console.log(path, newPath)
};
const goBackToLast = () => {
    if (lastPath?.length === 0) return;

    const last = lastPath?.pop();
    path = [...path, last];
    openDirName = path[path?.length - 1]?.name;
};
const openOnClick = (e: Event, data: FileSystem) => {
    const type = data.type;
    const url = data?.url || data.name;
    if (type === 'Folder') {
        openDir(e);
    } else if (type === 'Safari') {
        const app = { name: 'Safari', safari_link: url }
        open(app);
    }
};
</script>

<div class="container">
    <nav>
        {#each navBtns as btn}
            {#if btn?.title}
                <h5>{btn?.title}</h5>
            {/if}
            <button class="line flex {btn?.name === parentDirName ? 'focused' : ''} {btn?.minus ? 'minus-font' : ''} color-{btn?.color ?? btn?.name?.toLowerCase()}"
            on:click={() => changeParentDir(btn?.name)}>
                <i>{btn?.icon}</i>
                <p>{btn?.name}</p>
            </button>
        {/each}
    </nav>
    <div class="topbar">
        <div class="controls flex">
            <button class={isPreviousActive ? 'usable' : 'desactivated'} on:click={() => goBackInTree()}
            >􀯶</button
            >
            <button class={isNextActive ? 'usable' : 'desactivated'} on:click={() => goBackToLast()}
            >􀯻</button
            >
            <h2>{openDirName}</h2>
            <button class="desactivated" style="margin-right: 1rem">􀇷</button>
            <button class="desactivated">􀓙</button>
            <button class="desactivated">􀈂</button>
            <button class="desactivated">􀋡</button>
            <button class="desactivated" style="margin-right: 1rem">􀍡</button>
            <button class="desactivated">􀊫</button>
        </div>
        <div class="flex">
            <div class="tab">
                <p>{openDirName}</p>
            </div>
            <button class="new-tab">􀅼</button>
        </div>
    </div>
    <div class="content">
        <div class="placement">
            {#if children}
                {#each children as repo}
                    <div class="directory-container">
                        <button
                            class="directory"
                            data-name-dir={repo.name}
                            on:dblclick={(e) => openOnClick(e, repo)}
                        >
                            <img class="icon" src="/src/lib/assets/images/icon/{repo?.type}.png" alt="" />
                        </button>
                        <button
                            class="directory"
                            data-name-dir={repo.name}
                            on:dblclick={(e) => openOnClick(e, repo)}
                        >
                            <p><span>{repo.name}</span></p>
                        </button>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</div>

<style>
h5 {
    font-size: calc(var(--font-ratio) - 2px);
    margin-block: 0.5rem 0.25rem;
    opacity: 0.5;
}
h5:first-of-type {
    margin-block: 0 0.25rem;
}
h2 {
    font-weight: 500;
    margin-right: auto;
}
button {
    background: transparent;
    border: none;
    outline: none;
}
.usable {
    opacity: 1;
    pointer-events: auto;
}
.desactivated {
    pointer-events: none;
    opacity: 0.5;
}
.container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: var(--width-sidebar) 1fr;
    grid-template-rows: calc(var(--nav-height) * 1.5) 1fr;
    background-color: var(--dark-fullscreen);
    backdrop-filter: blur(var(--blur));
}
.content {
    background-color: #1b1b1b;
    overflow: scroll;
    padding: 10px 15px;
    border-left: 1px solid black;
}
.placement {
    --width: calc(var(--icon-size) * 1.75);
    display: grid;
    grid-template-columns: repeat(5, var(--width));
    row-gap: 10px;
    /*display: flex;
    flex-wrap: wrap;*/
}
.directory-container {
    width: var(--width);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    overflow-wrap: break-word;
}
.directory {
    text-align: center;
    background: transparent;
    border: none;
    outline: none;
    border-radius: 2px;
    max-width: var(--width);
}
.directory p {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: calc(var(--icon-size) / 5);
}
.line {
    width: 100%;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 2px;
    font-size: var(--font-ratio);
}
.focused {
    background: #37373559;
}
.minus-font i {
    font-size: calc(var(--font-ratio) - 2px);
}
.line i, .new-tab {
    color: #7c7c7c;
}
.color-blue i {
    color: #0a82ff;
}
.color-turquoise i {
    color: #48d9fa;
}
.color-red i {
    color: var(--color-btn-close);
}
.color-orange i {
    color: var(--color-btn-reduce);
}
.color-yellow i {
    color: #ffe414;
}
.color-green i {
    color: var(--color-btn-fullscreen);
}
.color-purple i {
    color: #da72ff;
}
.color-grey i {
    color: #969597;
}
.flex {
    display: flex;
    align-items: center;
}
.icon {
    width: var(--icon-size);
    aspect-ratio: 1/1;
}
.topbar {
    background: #373735;
    border-left: 1px solid black;
    border-bottom: 1px solid black;
    display: grid;
    grid-template-rows: var(--nav-height) calc(var(--nav-height) / 2);
}
.tab {
    width: 100%;
    height: 100%;
    display: grid;
    place-content: center;
}
.new-tab {
    height: 100%;
    aspect-ratio: 1/1;
    background: #1B1B1B;
}
.controls {
    gap: 8px;
    padding: 5px 10px;
}
nav {
    width: 100%;
    height: calc(100% - var(--nav-height));
    grid-row: 1 / -1;
    margin-top: auto;
    padding: 0 8px 10px 8px;
    overflow-y: scroll;
    position: relative;
}
nav i {
    width: 12px;
    text-align: center;
}
.directory-container:focus-within .directory img {
    box-shadow: 0 0 0px 1px #4d4d4d;
    background-color: #0000002e;
}
.directory-container:focus-within .directory p span {
    background: var(--dark-selection-focused);
}
</style>
