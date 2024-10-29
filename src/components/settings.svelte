<script lang="ts">
import { onMount } from "svelte";

const getData = (e: Event) => {
    const target = e?.target as HTMLInputElement;
    const value = +target?.value;
    const dataset = target?.dataset;
    const icon = 32 + (value * 0.32); // 100 steps --> 32 to 64 = 32 --> 32 / 100 = 0,32
    const font = 8 + (value * 0.08); // 100 steps --> 8 to 16 = 8 --> 8 / 100 = 0,08
    
    const { location, isIcon } = dataset;

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
    console.log(storage, location)

    localStorage.setItem(location, JSON.stringify(storage));
}

onMount(() => {
    const allElements = [
        {name: 'desktop', html: document.querySelector('input[data-location=desktop]') },
        {name: 'dock', html: document.querySelector('input[data-location=dock]') },
        {name: 'screen', html: document.querySelector('input[data-location=screen]') },
    ];

    allElements?.forEach(data => {
        const value = localStorage.getItem(data.name);
        if (data.html) (data.html as HTMLInputElement).value = value ? JSON.parse(value)?.input_value : '0';
    }) 
})
</script>

<div class="container">
    <nav>
        <button>Desktop & Dock</button>
    </nav>
    <div class="content">
        <label for="">desktop icons
            <input type="range" data-location='desktop' data-is-icon=true on:input={changeSize} on:change={saveValues}>
        </label>
        <label for="">dock
            <input type="range" data-location='dock' data-is-icon=true on:input={changeSize} on:change={saveValues}>
        </label>
        <label for="">font size
            <input type="range" data-location='screen' on:input={changeSize} on:change={saveValues}>
        </label>
    </div>
</div>

<style>
.container {
    height: 100%;
    background-color: black;
    display: flex;
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
}
</style>
