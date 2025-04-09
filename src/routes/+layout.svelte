<script lang="ts">
import '../style.css';
import { PUBLIC_NAME } from '$env/static/public';
import { page } from '$app/state';
import { onDestroy, onMount } from 'svelte';
import { isResponsive } from '$lib/store';
	import { browser } from '$app/environment';

const title = PUBLIC_NAME;
const description = 'Développeur Web front-end indépendant passionné par la création et les nouvelles technologies.';
const url = page.url.href;
const image = `${page.url.origin}/openGraph_image.jpg`;
const alt = `Wallpaper of Macbook in ${page.url.host}`;

const schema = {
    "@context": "https://schema.org",
    "@type": "Website",
    "name": `${ title }`,
    "url": `${ url }`,
    "logo": `${ image }`,
}
const jsonldScript = `<script type="application/ld+json">${JSON.stringify(schema) + "<"}/script>`;

const maxWidthIphone: number = 1280;

onMount(() => {
    onWindowResize();
    if (browser) window.addEventListener('resize', onWindowResize)
})
onDestroy(() => {
    if (browser) window.removeEventListener('resize', onWindowResize)
})

const onWindowResize = () => {
    const isWindowSmaller = window.innerWidth <= maxWidthIphone;

    if ($isResponsive !== isWindowSmaller) isResponsive.set(isWindowSmaller);
}
</script>

<svelte:head>
    <title>{ title }</title>
    <meta name="description" content={ description }>
    <meta name="author" content={ PUBLIC_NAME } />
    <meta name="color-scheme" content="dark">

    <!-- Open Graph / Facebook -->
    <meta property="og:title" content={ title }>
    <meta property="og:description" content={ description }>
    <meta property="og:type" content="website">
    <meta property="og:image" content={ image }>
    <meta property="og:image:alt" content={ alt }>
    <meta property="og:url" content={ url }>
    <meta property="og:site_name" content={ title }>
    <meta property="og:locale" content="fr_FR">

    <!-- Twitter -->
    <meta name="twitter:title" content={ title }>
    <meta name="twitter:description" content={ description }>
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content={ image }>
    <meta name="twitter:image:alt" content={ alt }>
    <meta name="twitter:url" content={ url }>

    <!-- LD+JSON -->
    {@html jsonldScript}
</svelte:head>

<slot />
