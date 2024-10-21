<script lang="ts">
    import '../fonts.css';
    import '../style.css';
    import iMac from '$lib/assets/images/mac/Apple Imac Pro.png';
    //import iMac from '$lib/assets/images/mac/MacBook Pro 14" - 5th Gen - Silver.png';
    import iphone from '$lib/assets/images/iphone/iPhone 16 White Portrait.png';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Window from '../components/window.svelte';

    interface App {
        id: number,
        name: string, 
        src: string, 
        open: boolean, 
        reduce: boolean,
        top_bar: string[] 
    };
    const iconsSrc: Record<string, any> = import.meta.glob('$lib/assets/images/icon/*', 
        {
            query: '?raw',
            import: 'default',
        })


    let windowWidth: number;
    const maxWidth: number = 995;
    $: device = windowWidth > maxWidth ? iMac : iphone;
    let isHelloScreen: boolean = true;
    let apps = [
        { id: 1, name: 'Finder', rename: 'My Work', src: '/src/lib/assets/images/icon/Finder.png', custom_src: '/src/lib/assets/images/icon/Folder.png',  open: false, reduce: false, top_bar: ['Files', 'Edit', 'View', 'Go', 'Window', 'Help']},
        { id: 2, name: 'Notes', rename: 'About Me', src: '/src/lib/assets/images/icon/Notes.png', open: false, reduce: false, top_bar: ['Files', 'Edit', 'Format', 'View', 'Window', 'Help']},
        { id: 3, name: 'Mail', rename: 'Contact Me',  src: '/src/lib/assets/images/icon/Mail.png', open: false, reduce: false, top_bar: ['Files', 'Edit', 'View', 'Mailbox', 'Message', 'Format', 'Window', 'Help']},
        { id: 4, name: 'Messages', src: '/src/lib/assets/images/icon/Messages.png' }, 
        { id: 5, name: 'Photos', src: '/src/lib/assets/images/icon/Photos.png' },
        { id: 6, name: 'Safari', src: '/src/lib/assets/images/icon/Safari.png' },
        { id: 7, name: 'System Preferences', src: '/src/lib/assets/images/icon/System Preferences.png' },
    ]
    let activeAppName: string = 'Finder';
    let windowOrder: string[] = [];
    $: activeAppData = apps.find((app) => app?.name == activeAppName) as App;

    $: if (windowOrder?.length === 0) activeAppName = 'Finder';

    const powerOnDevice = (device: HTMLElement) => {
        const helloScreen = device?.querySelector('.hello-screen');
        if (!device || !helloScreen) return;

        device.style.removeProperty('transform');
        isHelloScreen = false;

        device?.removeEventListener('click', () => { powerOnDevice(device) });
    };
    const topBarTextChange = (e: any) => {
        const target = e?.target?.closest('.app');
        if (!target) return;
        const name: string = target.dataset.name;
        if (activeAppName !== name) activeAppName = name;
    }
    const changeFocus = (e: CustomEvent) => {
        const detailName = e?.detail?.name;
        if (windowOrder?.length > 0 && detailName && activeAppName != detailName) activeAppName = detailName;
        const appName: string = activeAppName; 
        onBlur(appName, 1)
        if (!windowOrder?.includes(appName)) windowOrder = [...windowOrder, appName];
        //console.log('focus', appName, windowOrder);
    }
    const onBlur = (appName: string, nbr: number = 0) => {
        const remove = windowOrder?.includes(appName) && windowOrder?.length > nbr;
        //console.log('remove', remove);
        if (remove) windowOrder = windowOrder?.filter((name) => name !== appName);
    }
    const openOrCloseWindow = (open: boolean, name: string, reduce: boolean = false ) => {
        const app = apps.find((app) => app?.name == name);
        if (app?.open === !open) {
            if (app) app.open = open;
            if (!open) onBlur(app.name);
        } else if (app?.open === open) {
            const appWindow = document.querySelector(`.app-window[data-app-name=${activeAppName}]`) as HTMLDivElement;
            if (app && app.reduce !== reduce) {
                app.reduce = reduce;
            } 
            if (document.activeElement !== appWindow) appWindow?.focus({preventScroll: true});
        };
        apps = apps;
    }
    const fullscreen = () => {
        const bg = document.querySelector('#top-bar .bg-container') as HTMLDivElement;
        const bgImg = document.querySelector('.background img') as HTMLDivElement;
        const iconPlacement = document.getElementById('icons-placement') as HTMLDivElement;
        const dock = document.getElementById('dock') as HTMLDivElement;

        if (bg.style.transform) {
            bg.style.removeProperty('transform');
            bgImg.style.removeProperty('transform');
            iconPlacement.style.removeProperty('transform');
            dock.style.removeProperty('transform');
        } else {
            bg.style.transform = 'translateX(-50%)';
            bgImg.style.transform = 'translateX(-100%)';
            iconPlacement.style.transform = 'translateX(-100%)';
            dock.style.transform = 'translate(-50%, 110%)';
        }
    }
    onMount(() => {
        const device = document.getElementById('device');
        device?.addEventListener('click', () => { powerOnDevice(device) })
    })
</script>

<svelte:window bind:innerWidth={windowWidth}/>

<main>
    <div id='device' style="transform: scale(.5);">
        <img src={device} alt="">
        <div id="screen">
            <div>
                {#if isHelloScreen}
                   <div class="hello-screen" transition:fade={{  duration: 500 }}></div> 
                {/if}
                <div id="top-bar">
                    <div class="bg-container">                    
                        <div class="bg">
                            <p style="font-size: 10px;"></p>
                            <p style="font-weight: 600; font-size: var(--font-size-ratio);">{activeAppName}</p>
                            {#each activeAppData?.top_bar as text}
                                <p>{text}</p>
                            {/each}
                        </div>
                        <div class="fullscreen">
                            <p style="font-size: 10px;"></p>
                            <p style="font-weight: 600; font-size: var(--font-size-ratio);">{activeAppName}</p>
                            {#each activeAppData?.top_bar as text}
                                <p>{text}</p>
                            {/each}
                        </div>
                    </div>
                </div>
                <div class="background">
                    <img src='/src/lib/assets/images/background/Ink_Cloud.jpg' alt="">
                </div>
                <div id="icon-container">
                    <div id='icons-placement'>
                        {#each apps as app (app.id)}
                            {#if app?.open != undefined}
                                <div class="app-container">
                                    <button class="app"
                                        data-name={app.name}
                                        on:click={(e) => { topBarTextChange(e) }}
                                        on:dblclick={() => { openOrCloseWindow(true, app.name) }}
                                    > 
                                        <img class='icon' src={app?.custom_src || app.src} alt="">
                                    </button>
                                    <button class="app"
                                        data-name={app.name}
                                        on:click={(e) => { topBarTextChange(e) }}
                                        on:dblclick={() => { openOrCloseWindow(true, app.name) }}
                                    > 
                                        <p><span>{app?.rename || app.name}</span></p>
                                    </button>
                                </div>
                            {/if}
                        {/each}
                    </div>
                        {#each apps as app (app.id)}
                            {#if app?.open}
                                <Window data={app} order={windowOrder} on:close={() => {openOrCloseWindow(false, app.name)}} on:focus={changeFocus} on:reduce={() => {openOrCloseWindow(true, app.name, true)}} on:fullscreen={fullscreen}/>
                            {/if}
                        {/each} 
                </div>
                <div id="dock"> 
                    {#each apps as app (app.id)}
                            <button class="app in-dock" style={app?.open == undefined ? 'pointer-events: none' : ''} data-name={app.name} on:click={(e) => { topBarTextChange(e); openOrCloseWindow(true, app.name) }}>  
                                <img class='icon' src={app.src} alt="">
                                {#if app?.open || app.name == 'Finder'}
                                    <span class="dot"></span>
                                {/if}
                            </button>
                    {/each}
            </div>
        </div>
    </div>
</main>

<style>
    button {
        background: transparent;
        outline: none;
        border: none;
    }
    main {
        width: 100vw;
        min-height: 100vh;
        display: grid;
        place-content: center;
    }
    #device {
        position: relative;
        transition: transform .5s ease;
    }
    #device >  img {
        max-width: 100vw;
        max-height: 100vh;
        object-fit: cover;
        pointer-events: none;
        position: relative;
        z-index: 1000;
    }
    #screen {
        --icon-ratio: 32px;
        --font-size-ratio: 6px;
        --icon-width: calc(var(--icon-ratio) * 2);
        /* --icon-width: 32px; /* Realistic one. But font too small if also realist*/
        --nav-color: #F6F6F65C;
        --nav-blur: 8.5rem;
        position: absolute;
        top: 0;
        left:  0;
        width: 100%; 
        height: 100%;
        /*padding: 4.42% 4.57% 25.45% 4.57%;*/
        padding: 5.8% 5.6% 27.4% 5.6%;
        background-size: 100%;
    }
    .hello-screen {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 102%;
        height: 102%;
        background-color: black;
        z-index: 1000;
    }
    .background {
        width: 100%;
        height: calc(100% + 2rem);
        background-color: black;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        padding-bottom: 2rem;
    }
    .background img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform .32s ease;
    }
    #screen > div {
        position: relative;
        width: 100%;
        height: 100%;
        /*aspect-ratio: 16 / 9;*/
        /*background-image: url('$lib/assets/images/background/Ink-Cloud.jpg');
        background-size: 100%;*/
        display: grid;
        grid-template-rows: auto 1fr;
    }
    #top-bar {
        width: 100%;
        backdrop-filter: blur(var(--blur));
        z-index: 999;
        color: var(--color-text);
        font-size: var(--font-size-ratio);
        overflow: hidden;
    }
    #top-bar:hover {
        opacity: 1 !important;
    }
    .bg-container {
        width: 200%;
        height: 100%;
        display: flex;
        transition: transform 320ms ease;
    }
    #top-bar .bg-container .bg, #top-bar .bg-container .fullscreen {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: #0000002E;
        padding: 0 8px;
    }
    #top-bar .bg-container .fullscreen {
        background-color: black;
    }
    #top-bar .bg-container .fullscreen p {
        opacity: 0;
        transition: opacity .32s ease;
    }
    #top-bar .bg-container .fullscreen:hover p {
        opacity: 1;
    }
    #icon-container {

        transition: transform .32s ease;

        position: relative;
        display: flex;
        justify-content: center;
        z-index: 1;
        overflow: hidden;
    }
    #icons-placement {
        --column-width: calc(var(--icon-width) + calc(var(--icon-width) / 1.5));
        max-width: 90%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, var(--column-width));
        grid-template-rows: repeat(auto-fill, calc(var(--icon-width) + 40px));
        gap: 5px;
        padding: 8px 0 var(--icon-width);
        margin: 0 auto;
        transition: transform .32s ease;
    }
    #dock {
        --icon-width: var(--icon-ratio);
        --borr: .6rem;
        box-shadow: 0 0 6px 0 var(--color-shadow);
        border-radius: var(--borr);
        background-color: var(--nav-color); 
        backdrop-filter: blur(var(--nav-blur));
        display: flex;
        width: fit-content;
        overflow: hidden;
        margin: 0 auto 2px auto;
        padding: 2px 2px 4px 2px;
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 999;
        transition: transform .32s ease;
    }
    .app-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
    }
    .app {
        --borr: 2px;
        text-align: center;
        font: var(--font-bold);
        text-shadow: 0 1px 1px var(--color-shadow);
        border-radius: var(--borr);
        position: relative;
    }
    .dot {
        width: 2px;
        height: 2px;
        background-color: rgba(0, 0, 0, .5);
        border-radius: 50%;
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
    }
    .app > p {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        /* line-height: 1; */
        /*max-height: var(--app-name-max-height);*/
        font-size: calc(var(--font-size-ratio) * 2);
    }
    .app > p > span {
        padding: 0 2px;
        border-radius: var(--borr);
    }
    .app-container:focus-within button img {
        box-shadow: 0 0 0px 2px #4D4D4D;
        background-color: #0000002E;
    }
    .app-container:focus-within button p span {
        background-color: #007AFF;
    }
    .app:focus img {
        box-shadow: 0 0 0px 1px var(--color-border);
        border-radius: var(--borr);
    }
    .app:focus p span {
    }
    .icon {
        width: var(--icon-width);
    }
</style>
