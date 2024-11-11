<script lang="ts">
import { onMount } from "svelte";

const bg = [
    {name: 'Ink Cloud',src_name: 'Ink_Cloud.jpg', src: '/src/lib/assets/images/background/Ink_Cloud.jpg' },
    {name: 'Sonoma Light',src_name: 'Mode_Light.png', src: '/src/lib/assets/images/background/Mode_Light.png' },
    {name: 'Sonoma Dark',src_name: 'Mode_Dark.png', src: '/src/lib/assets/images/background/Mode_Dark.png' },
]
let needReloadToApply: boolean = false;

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

const changeBg = (src: string) => {
    const bg = document.querySelector('#screen .background img') as HTMLImageElement;
    if (!bg) return;

    bg.src = src;
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
</script>

<div class="container">
    <nav>
        <button>Desktop & Dock</button>
    </nav>
    <div class="content">
        {#if needReloadToApply}
            <p class="warning">Some changes will need the site to be reloaded for them to apply.</p>
        {/if}
        <label for="redirect">redirect instead of using the site
            <input type="checkbox" name="redirect" on:change={isRedirect}>
        </label>
        <label for="reduce-motion">reduce motion
            <input type="checkbox" name="reduce-motion" >
        </label>
        <label for="theme">theme
            <input type="radio" name="theme" value="dark" >
            <input type="radio" name="theme" value="light">
        </label>
        <label for="">Opacity
            <input type="range" name="opacity" step='10' min="20" on:input={changeOpacity} on:change={(e) => changeOpacity(e, true)}>
        </label>
        <label for="">desktop icons
            <input type="range" data-location='desktop' step="10" data-is-icon=true value="0" on:input={changeSize} on:change={saveValues}>
        </label>
        <label for="">dock
            <input type="range" data-location='dock' data-is-icon=true data-small=true value="43" on:input={changeSize} on:change={saveValues}>
        </label>
        <label for="">font size
            <input type="range" data-location='screen' value="50" on:input={changeSize} on:change={saveValues}>
        </label>
        {#each bg as bg}
           <button on:click={() => changeBg(bg?.src)}>
                <img src={bg.src} alt="">
            </button> 
        {/each}
    </div>
</div>

<style>
.container {
    height: 100%;
    background-color: black;
    display: flex;
}
.warning {
    color: red;
    text-align: center;
}
label {
    display: block;
}
nav {
    width: 8rem;
    height: 100%;
}
.content {
    background-color: grey;
    width: 100%;
    padding-top: 2rem;
    overflow: scroll;
}
button {
    width: 50%;
    aspect-ratio:  16/9;
}
button img {
    width: 100%;
    height: 100%;
}
</style>
