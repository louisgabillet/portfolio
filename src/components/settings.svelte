<script lang="ts">
import { onMount } from "svelte";

interface Wallpapers {
    name: string,
    src_name: string,
    src: string,
}

const wallpapers = [
    {
        name: 'pictures',
        data: [
            {name: 'Ink Cloud',src_name: 'Ink_Cloud.jpg', src: '/src/lib/assets/images/background/Ink_Cloud.jpg' },
            {name: 'Sonoma Light',src_name: 'Mode_Light.png', src: '/src/lib/assets/images/background/Mode_Light.png' },
            {name: 'Sonoma Dark',src_name: 'Mode_Dark.png', src: '/src/lib/assets/images/background/Mode_Dark.png' },
        ]
    },
]
let needReloadToApply: boolean = false;
let currWallpaper = {name: 'Ink Cloud', src: '/src/lib/assets/images/background/Ink_Cloud.jpg'}

const getData = (e: Event) => {
    const target = e?.target as HTMLInputElement;
    const value = +target?.value;
    const dataset = target?.dataset;

    const iconRatio = +getComputedStyle(document.documentElement)?.getPropertyValue('--icon-ratio')?.split('p')[0];
    const fontRatio = +getComputedStyle(document.documentElement)?.getPropertyValue('--font-ratio')?.split('p')[0];

    const { location, isIcon, small } = dataset;

    const icon = iconRatio / (small ? 4 : 1) + (value * (iconRatio * (small ? 1.75 : 1) / 100)); 
    const font = fontRatio + (value * (fontRatio / 100));

    //console.log(value);
    return { value, location, isIcon, icon, font };
}

const changeSize = (e: Event) => {
    const { location, isIcon, icon, font } = getData(e);
    if (!location) return;

    const el = document.getElementById(location) as HTMLElement;
    if (el) {
        if (isIcon) { el.style.setProperty('--icon-size', `${icon}px`) }
        else { el.style.setProperty('--font-size', `${font}px`) }
    }
}
const saveValues = (e: Event) => {
    const { location, isIcon, icon, font, value } = getData(e);
    if (!location) return;

    const storage = isIcon ? { icon_size: icon, input_value: value } : { font_size: font, input_value: value };
    //console.log(storage, location)

    localStorage.setItem(location, JSON.stringify(storage));
}

const changeBg = (data: Wallpapers) => {
    const bg = document.querySelector('#screen .background img') as HTMLImageElement;
    if (!bg || !data) return;

    const {src, name} = data;

    bg.src = src;
    currWallpaper.src = src;
    currWallpaper.name = name;

    const file = { src: src };
    localStorage.setItem('background', JSON.stringify(file))
}
const isRedirect = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const isChecked = target?.checked?.toString();

    needReloadToApply = true;

    localStorage.setItem('redirect_outside', isChecked);
}
const changeOpacity = (e: Event, save = false) => {
    const blackScreen = document.querySelector('.black-screen') as HTMLDivElement;
    const target = e?.target as HTMLInputElement;
    const value = +target?.value;

    if (!blackScreen) return;

    const reverse = +(1 - (value / 100)).toFixed(1);
    blackScreen.style.opacity = reverse.toString();
    if (save) localStorage.setItem('opacity', reverse?.toString());
}

onMount(() => {
    const allElements = [
        {name: 'desktop', html: document.querySelector('input[data-location=desktop]') },
        {name: 'dock', html: document.querySelector('input[data-location=dock]') },
        {name: 'screen', html: document.querySelector('input[data-location=screen]') },
        {name: 'redirect_outside', html: document.querySelector('input[name=redirect]'), type: 'checkbox' },
        {name: 'opacity', html: document.querySelector('input[name=opacity]'), if_not: '100', simple_value: true },
    ];

    const src = localStorage?.getItem('background');
    if (src) currWallpaper.src = JSON.parse(src)?.src;
    wallpapers?.forEach(wallpaper => {
        if (src) currWallpaper.name = wallpaper?.data?.find(bg => bg?.src === JSON.parse(src)?.src)?.name ?? 'Ink Cloud';
    })

    allElements?.forEach(data => {
        const value = localStorage.getItem(data.name);
        if (!data?.html || !value) return;

        if (data?.type === 'checkbox') {
            (data.html as HTMLInputElement).checked = (value === 'true');
            return;
        }
        if (data?.simple_value) { (data.html as HTMLInputElement).value = `${100 * (1 - +value)}` }
        else { (data.html as HTMLInputElement).value = JSON.parse(value)?.input_value }
    }) 
})
const selectionBtn = [
    { name: 'Wi-Fi', color: 'blue', space: true, icon: '􀙇'},
    { name: 'Bluetooth', color: 'blue' },
    { name: 'Network', color: 'blue', icon: '􀤆' },
    { name: 'Notifications', color: 'red', space: true, icon: '􀝗' },
    { name: 'Sound', color: 'red', icon: '􀊨' },
    { name: 'Focus', color: 'purple', icon: '􀆺' },
    { name: 'Screen Time', color: 'purple', icon: '􀖇' },
    { name: 'General', color: 'grey', space: true, icon: '􀍟', active: true },
    { name: 'Appearance', color: 'black', icon: '􀀂', active: true },
    { name: 'Accessibility', color: 'blue', icon: '􀕾' },
    { name: 'Control Center', color: 'grey', icon: '􀜊' },
    { name: 'Siri And Spotlight', color: 'grey' },
    { name: 'Privacy & Security', color: 'blue', icon: '􀉼' },
    { name: 'Desktop & Dock', color: 'black', space: true, icon: '􀣰', active: true },
    { name: 'Displays', color: 'blue', icon: '􀆭', active: true },
    { name: 'Wallpaper', color: 'sky', active: true },
    { name: 'Screen Saver', color: 'sky' },
    { name: 'Lock Screen', color: 'black', space: true, icon: '􀎠' },
    { name: 'Touch ID & Password', color: 'white', icon: '􀟒'},
    { name: 'Users & Groups', color: 'blue', icon: '􀉬'},
    { name: 'Passwords', color: 'grey', space: true, icon: '􀟖'},
    { name: 'Internet Accounts', color: 'blue', icon: '􀅷'},
    { name: 'Game Center', color: 'white'},
    { name: 'Wallet & Apple Pay', color: 'black', icon: '􂏱'},
    { name: 'Keyboard', color: 'grey', space: true, icon: '􀇳'},
    { name: 'Printers & Scanners', color: 'grey', icon: '􀎛'},
]
let selectedSetting: string = 'General';
$: isSelected = (name: string) => selectedSetting === name;

const wrapLine = (name: string, line: Wallpapers[]) => {
    const slider = document.querySelector(`.line[data-line=${name}] .slider .overflow`) as HTMLDivElement;
    const btn = document.querySelector(`.line[data-line=${name}] .info button`) as HTMLDivElement;
    if (!slider || !btn) return;

    if (slider.style.flexWrap) {
        slider.style.removeProperty('flex-wrap');
        btn.textContent = `Show All (${line?.length})`;
    } else {
        slider.style.flexWrap = 'wrap';
        btn.textContent = 'Show less';
    }
}
</script>

<div class="app-grid">
    <nav class="full">
        <input type="text">
        <div class="setting-selection">
            {#each selectionBtn as {name, color, space, icon, active}}
                <button class="selection-btn {space ? 'mg-top' : ''} {!active ? 'desactivated' : ''} {isSelected(name) ? 'focused' : ''}"
                    on:click={() => selectedSetting = name}><i class="color-{color}">{icon ?? ''}</i>{name}</button>
            {/each}
        </div>
    </nav>
    <div class="app-controls">
        <button>􀆉</button>
        <button>􀆊</button>
        <h2>{selectedSetting}</h2>
    </div>
    <div class="app-content">
        {#if needReloadToApply}
            <p class="warning">Some changes will need the site to be reloaded for them to apply.</p>
        {/if}
        {#if isSelected('General')}
            <label for="redirect">redirect instead of using the site
                <input type="checkbox" name="redirect" on:change={isRedirect}>
            </label>
            <label for="reduce-motion">reduce motion
                <input type="checkbox" name="reduce-motion" >
            </label>
            <label for="">font size
                <input type="range" data-location='screen' value="50" on:input={changeSize} on:change={saveValues}>
            </label>
        {:else if isSelected('Appearance')}
            <label for="theme">theme
                <input type="radio" name="theme" value="dark" >
                <input type="radio" name="theme" value="light">
            </label>
        {:else if isSelected('Desktop & Dock')}
            <label for="">desktop icons
                <input type="range" data-location='desktop' step="0" data-is-icon=true value="25" on:input={changeSize} on:change={saveValues}>
            </label>
            <label for="">dock
                <input type="range" data-location='dock' data-is-icon=true data-small=true value="57" on:input={changeSize} on:change={saveValues}>
            </label>
        {:else if isSelected('Displays')}
            <label for="">Opacity
                <input type="range" name="opacity" step='10' min="20" on:input={changeOpacity} on:change={(e) => changeOpacity(e, true)}>
            </label>
        {:else if isSelected('Wallpaper')}
            <div class="wallpaper-preview">
                <img src={currWallpaper?.src} alt="preview">
                <p>{currWallpaper?.name}</p>
            </div>
            {#each wallpapers as {name, data}}
                
            <div class="line" data-line={name}>
                <div class="info">
                    <h4>{name?.charAt(0)?.toUpperCase() + name?.slice(1)}</h4>
                    <button on:click={() => wrapLine(name, data)}>Show All ({data?.length})</button>
                </div>
                <div class="slider">
                    <div class="overflow">
                        {#each data as bg}
                            <button class="wallpaper" on:click={() => changeBg(bg)}>
                                <img src={bg.src} alt="" class="{bg?.name === currWallpaper?.name ? 'selected' : ''}">
                                <p>{bg?.name}</p>
                            </button> 
                        {/each}
                    </div>
                </div>
                </div>
            {/each}
        {/if} 
    </div>
</div>

<style>
.container {
    height: 100%;
    display: flex;
    grid-template-columns: 7rem 1fr;
}
.warning {
    color: red;
    text-align: center;
}
label {
    display: block;
}
nav {
    padding: var(--nav-height) 0 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
input[type=text] {
    width: 100%;
    background: #7C7C7C;
    border: none;
    outline: none;
}
button {
    background: transparent;
    border: none;
    outline: none;
}
.selected {
    outline: 1px solid #0A82FF;
}
.setting-selection {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 0 0px 10px 5px;
}
.mg-top {
    margin-top: 10px;
}
.desactivated {
    opacity: .6;
    pointer-events: none;
}
.focused {
    /*background: #FFFFFF1A;*/
    background: var(--dark-selection-focused);
}
.color-blue {
    background: #0a82ff;
}
.color-red {
    background: #BB2E33;
}
.color-purple {
    background: #5E5CDE;
}
.color-grey {
    background: #7C7C7C;
}
.color-black {
    background: #000;
}
.color-white {
    background: #FFF;
    color: #BB2E33;
}
.color-sky {
    background: #78C6F0;
}
.selection-btn {
    width: 100%;
    text-align: start;
    display: flex;
    align-items: center;
    gap: 2px;
    border-radius: 2px;
    padding: 2px 4px;
}
.selection-btn i {
    width: 11px;
    aspect-ratio: 1/1;
    border-radius: 3px;
    font-size: 7px;
    display: grid;
    place-content: center;
}
.app-controls {
    background-color: #1B1B1B;
    justify-content: flex-start;
}
.controls {
    width: 100%;
    height: var(--nav-height);
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 10px;
}
h2 {
    font-size: calc(var(--font-ratio) + 4px);
}
h2, h4 {
    font-weight: 500;
}
.controls button {
    font-size: calc(var(--font-ratio) + 2px);
    opacity: .5;
}
.wallpaper p {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}
.wallpaper {
    height: 100%;
    flex: 0 0 25%;
    max-width: 25%;
    padding: 1px 5px 1px 0;
    overflow-wrap: break-word;
    text-align: center;
}
.wallpaper img {
    width: 100%;
    aspect-ratio:  4/3;
    border-radius: 5px;
    object-fit: cover;
}
.wallpaper-preview {
    width: 100%;
    display: flex;
    gap: 5px;
}
.wallpaper-preview img {
    width: 35%;
    aspect-ratio:  16/9;
}
.line {
    width: 100%;
}
.info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 15px 5px 10px;
}
.slider {
    width: 100%;
    overflow-y: hidden;
    padding-inline: 10px;
}
.slider::-webkit-scrollbar {
    display: none;
}
.overflow {
    display: flex;
    row-gap: 5px;
}
</style>
