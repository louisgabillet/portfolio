<script lang="ts">
import { onMount } from "svelte";
import { goto } from "$app/navigation";
import { page } from "$app/state";
import { isResponsive } from "$lib/store";
import Img from "$lib/components/img.svelte";
import Loader from "$lib/components/loader.svelte";

type ErrorMessage = {
    message: string,
    description: string,
}

const errorMessages: Record<number, ErrorMessage> = {
    400: {
        message: `Requête invalide ou mal formée`,
        description: `Le serveur n'a pas pu traiter la requête en raison d'un format incorrect ou de paramètres manquants. Vérifiez votre saisie et réessayez.`,
    },
    401: {
        message: `Veuillez vous connecter pour continuer`,
        description: `Vous devez vous authentifier avec des identifiants valides avant d'accéder à cette ressource. Veuillez vous connecter et réessayer.`,
    },
    403: {
        message: `Vous n'avez pas l'autorisation d'accéder à cette ressource`,
        description: `Vous n'avez pas les autorisations nécessaires pour accéder au contenu demandé.`,
    },
    404: {
        message: `La ressource que vous cherchez est manquante`,
        description: `La page que vous essayez d'accéder a peut-être été déplacée, supprimée ou l'URL a été mal saisie.`,
    },
    408: {
        message: `La requête a mis trop de temps à être traitée`,
        description: `Le serveur a mis trop de temps à répondre en raison de retards réseau ou d'une charge trop élevée. Veuillez réessayer plus tard.`,
    },
    422: {
        message: `La requête n'a pas pu être traitée`,
        description: `Votre requête est bien formée mais contient des erreurs qui empêchent son traitement, comme des données manquantes ou incorrectes.`,
    },
    429: {
        message: `Vous avez dépassé la limite de requêtes`,
        description: `Trop de requêtes ont été envoyées en peu de temps. Veuillez attendre un moment avant de réessayer.`,
    },
    500: {
        message: `Un problème est survenu côté serveur`,
        description: `Une erreur inattendue s'est produite sur le serveur pendant le traitement de votre demande. Veuillez réessayer plus tard.`,
    },
    502: {
        message: `Échec de la communication entre les serveurs`,
        description: `Le serveur agissant en tant que passerelle a reçu une réponse invalide d'un autre serveur. Veuillez réessayer plus tard.`,
    },
    503: {
        message: `Le service est temporairement indisponible`,
        description: `Le serveur est soit en maintenance, soit surchargé. Veuillez réessayer plus tard.`,
    },
};

const status = page.status;

let isPageLoaded: boolean = false;
let isDeviceLoaded: boolean = false;
let isWallpaperLoaded: boolean = false;

$: isEverythingLoaded = isPageLoaded && isDeviceLoaded && isWallpaperLoaded;

onMount(() => {
    const device: HTMLImageElement | null = document.querySelector('.device__img');
    const wallpaper: HTMLImageElement | null = document.querySelector('.background__img');

    //if (status === 404) goto('/')
    if (device && device.complete) isDeviceLoaded = true;
    if (wallpaper && wallpaper.complete) isWallpaperLoaded = true;

    isPageLoaded = true;
})
</script>

<main class="main">
    {#if !isEverythingLoaded}
        <Loader /> 
    {/if}
    <section class="main__sect" class:main__sect--hidden={ !isEverythingLoaded }>
        <div class="device">
            <picture>
                <source media="(max-width: 1280px)" srcset="https://res.cloudinary.com/dejb4brmy/image/upload/f_auto/q_auto/w_auto/portfolio/images/devices/iphone/iPhone_16_Black_Portrait_qquj9o.png">
                <source media="(min-width: 1281px)" srcset="https://res.cloudinary.com/dejb4brmy/image/upload/f_auto/q_auto/w_auto/portfolio/images/devices/macbook/MacBook_Air_Dark_lqrnpi.png">
                <img class="device__img" src="https://res.cloudinary.com/dejb4brmy/image/upload/f_auto/q_auto/w_auto/portfolio/images/devices/macbook/MacBook_Air_Dark_lqrnpi.png" alt={ $isResponsive ? "Iphone 16 noir portrait" : "Macbook Air noir" } on:load={() => isDeviceLoaded = true}> 
            </picture>
            <div class="device__placement">
                <picture class="background screen__background transition-320-ease">
                    <source media="(max-width: 1280px)" srcset="https://res.cloudinary.com/dejb4brmy/image/upload/f_auto/q_auto/w_auto/portfolio/images/wallpapers/mobile/Dark_Orbs_cwpt8t.jpg">
                    <source media="(min-width: 1281px)" srcset="https://res.cloudinary.com/dejb4brmy/image/upload/f_auto/q_auto/w_auto/portfolio/images/wallpapers/pc/Ink_Cloud_pumoik.jpg">
                    <img class="background__img" src='https://res.cloudinary.com/dejb4brmy/image/upload/f_auto/q_auto/w_auto/portfolio/images/wallpapers/pc/Ink_Cloud_pumoik.jpg' alt="Fond d'écran de l'appareil" on:load={() => isWallpaperLoaded = true}> 
                </picture>
            </div>
            <div class="error error--placement">
                {#if !$isResponsive}
                    <Img 
                        src="icons/warning_tfoskk.png"
                        alt="warning sign"
                    />
                {/if}
                {#if errorMessages[status]}
                    <h5 class="error__message">{ errorMessages[status].message } ({ status }).</h5>
                    <p class="error__description">{ errorMessages[status].description }</p>
                {:else}
                    <h5 class="error__message">Une erreur est survenue ({ status }).</h5>
                    <p class="error__description">Une erreur est survenue durant l'utilisation. Veuillez réessayer. Si le problème persiste, veuillez contacter le support (moi).</p>
                {/if}
                <a href="/" class="error__link">OK</a>
            </div>
        </div>
    </section>
</main>

<style>
.main {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.main__sect {
    position: relative;
    max-height: 100vh;
    user-select: none;
    -webkit-user-select: none;
}
.main__sect--hidden {
    visibility: hidden;
    opacity: 0;
}
.device {
    position: relative;
    display: inherit;
    transition: opacity 320ms ease;
}
.device__placement {
    max-height: 100%;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 6.7% 10.1% 6.6%;
}
.device__img {
    height: 100vh;
    min-height: 900px;
    object-fit: cover;
    pointer-events: none;
    position: relative;
    z-index: 2;
    opacity: .4;
}
.background__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: .4;
}
.error {
    --padding: 20px;
    width: 75%;
    max-width: 400px;
    height: min-content;
    position: absolute;
    inset: 0;
    margin: auto;
    background-color: var(--dark-fullscreen);
    backdrop-filter: blur(var(--blur));
    border: 1px solid #4A4A4A63;
    outline: 1px solid #1a1a1a;
    padding: var(--padding);
    border-radius: 10px;
    text-align: center;
    color: #fff;
    transition: opacity 320ms ease;
}
.error--placement {
    display: grid;
    grid-template-rows: 100px repeat(3, min-content);
    gap: 20px;
}
.error__message {
    font-size: 1.125rem;
    font-weight: 700;
}
.error__description {
    font-size: 14px;
}
.error__link {
    width: 100%;
    font-size: 1rem;
    font-weight: 500;
    background-color: #0a82ff;
    color: #fff;
    border-radius: 5px;
    padding: 8px;
    transition: opacity 220ms ease;
}
.error__link:hover {
    opacity: .8;
}

@media (max-width: 1280px) {
    .device__placement {
        padding: 6.5%;
    }
    .error {
        padding-bottom: 0;
        border-radius: 1rem;
        border: none;
    }
    .error--placement {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .error__description {
        opacity: .6;
    }
    .error__link {
        width: calc(100% + var(--padding) * 2);
        border-top: 1px solid #7c7c7c33;
        background-color: transparent;
        color: #0a82ff;
        border-radius: 0;
        padding-block: 10px;
    }
}
</style>
