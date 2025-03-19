<script lang="ts">
import '../style.css';
import { PUBLIC_NAME } from '$env/static/public';

const title = PUBLIC_NAME;
const description = '';
const url = '';
const image = '';
const alt = '';

let schema = {
    "@context": "https://schema.org",
    "@type": "Website",
    "name": `${ title }`,
    "url": `${ url }`,
    "logo": `${ image }`,
}
const jsonldScript = `<script type="application/ld+json">${JSON.stringify(schema) + "<"}/script>`;
</script>

<svelte:head>
    <title>{ title }</title>
    <meta name="description" content={ description }>
    <meta name="author" content="" />
    <meta name="color-scheme" content="dark">
    <meta name="theme-color" content="">

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
