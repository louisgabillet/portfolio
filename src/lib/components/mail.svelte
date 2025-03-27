<script lang='ts' context='module'>
declare const grecaptcha: any;
</script>

<script lang="ts">
import { PUBLIC_RECAPTCHA_KEY, PUBLIC_EMAIL } from "$env/static/public";
import { isResponsive  } from "$lib/store";
import { applyAction, deserialize } from '$app/forms';
import type { ActionResult } from "@sveltejs/kit";
import Svg from "./svg.svelte";
import { invalidateAll } from "$app/navigation";
import { toast } from "$lib/toast";
import type { ToastContent, ToastOptions } from "$lib/toast/types";

type Form = {
    success: boolean,
    send_notification: boolean,
    content: ToastContent,
    opts: ToastOptions,
    errors: {
        subject?: string[],
        email?: string[],
        text?: string[],
        content?: string[],
    }
}

const recaptchaPublicKey = PUBLIC_RECAPTCHA_KEY;

let form: Form | null = null;

//let cc: string = '';
let subject: string = '';
let email: string = '';
let text: string = '';

$: linkToMailMe = `mailto:${PUBLIC_EMAIL}?subject=${subject}&body=${text}`
$: errors = form ? form.errors : null;

$: isFormComplete = [subject, email, text].every(value => value);

const getCaptchaToken = async () => {
    return new Promise<string | null>(resolve => {
        grecaptcha.ready(async () => {
            if (!recaptchaPublicKey) {
                resolve(null);
                return;
            }
            const token = await grecaptcha.execute(recaptchaPublicKey, { action: "submit" })
            resolve(token)
        })
    });
}

const handleSubmit =  async (e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
    e.preventDefault();

    const currTarget = e.currentTarget;
    const data = new FormData(currTarget);

    const token = await getCaptchaToken();
    if (token) data.append("token", token);

    const response = await fetch(currTarget.action, {
        method: 'POST',
        body: data
    });

    const result: ActionResult = deserialize(await response.text());
    const type = result.type;

    if (type === "success" || type === "failure") {

        const data = result.data as Form;
        if (!data) return;

        form = data;

        if (data.success) {
            const appWindow: HTMLElement | null = currTarget.closest('.app__container');

            currTarget.reset();
            resetForm();

            if (appWindow) appWindow.focus({ preventScroll: true })
        }

        await invalidateAll()
    }

    if (form && form.send_notification) toast(form.content, form.opts);

    applyAction(result)
}

const resetForm = () => {
    subject = '';
    email = '';
    text = '';
}
</script>

<svelte:head>
    <script src="https://www.recaptcha.net/recaptcha/api.js?trustedtypes=true&render={recaptchaPublicKey}"></script>
</svelte:head>

<form class="app__grid" method="POST" action="?/email" on:submit={ handleSubmit } >
    {#if $isResponsive}
        <div class="controls app__controls controls-header app__controls-header">
            <button class="controls__item controls__item--distance-right controls__item--mw-mc controls-header__item controls-header__btn controls__btn--active controls__text--accent-color controls__text--overflow" type="button" on:click={ resetForm }>Annuler</button>
            <h2 class="controls__h2 controls__text--overflow">{!subject ? 'Nouv. message' : subject}</h2>
            <div class="controls__items-wrapper">
                <button class="controls__item controls-header__item controls-header__btn controls__btn--{isFormComplete ? 'active' : 'desactivated'} " type="submit">
                    <Svg name='arrow_up_circle_fill' color={isFormComplete ? 'var(--accent-color)' : '#7c7c7c'} />
                </button>
            </div>
        </div>
    {:else}
        <div class="controls app__controls app__controls--full">
            <button class="controls__item controls__btn controls__btn--hover" class:controls__btn--desactivated={ !isFormComplete } title="Envoyer le message" type="submit">
                <Svg name='paperplane' color={isFormComplete ? '#fff' : "#7c7c7c"} />
            </button>
            <span class="controls__item controls__item--distance-right">
                <Svg name='list_dash_header_rectangle' />
            </span>
            <span class="controls__item"> 
                <Svg name='arrowshape_turn_up_backward' />
            </span>
            <a href={ linkToMailMe } class="controls__item controls__btn controls__btn--hover" title="Joindre un document à ce message">
                <Svg name='paperclip' color="#0a82ff" />
            </a>
            <span class="controls__item"> 
                <Svg name='rectangle_and_paperclip' />
            </span>
            <span class="controls__item"> 
                <Svg name='textformat' />
            </span>
            <span class="controls__item"> 
                <Svg name='face_smiling_inverse' />
            </span>
            <span class="controls__item"> 
                <Svg name='photo_on_rectangle' />
            </span>
        </div>
    {/if}
    <div class="content app__content">
        <div class="content__line">
            <p class="content__label">À :</p>
            <a href={ linkToMailMe } class="content__label content__text--color-blue">{PUBLIC_EMAIL}</a>
        </div>
        {#if $isResponsive}
            <div class="content__line" class:content__line--state-error={ errors?.email }>
                <p class="content__label">De* :</p>
                <input class="content__input" type="text" bind:value={email} name='email'>
                {#if errors?.email}
                    <p class="content__error-message">{errors.email[0]}</p> 
                {/if}
            </div>
        {/if}
        <div class="content__line" class:content__line--state-error={ errors?.subject }>
            <p class="content__label">Objet* :</p>
            <input class="content__input" type="text" bind:value={subject} name='subject'>
            {#if errors?.subject}
                <p class="content__error-message">{errors.subject[0]}</p> 
            {/if}
        </div>
        {#if !$isResponsive}
            <div class="content__line" class:content__line--state-error={ errors?.email }>
                <p class="content__label">De* :</p>
                <input class="content__input" type="text" bind:value={email} name='email'>
                {#if errors?.email}
                    <p class="content__error-message">{errors.email[0]}</p> 
                {/if}
            </div>
        {/if}
        <label for="content" class="content__textarea-wrapper">
            {#if errors?.content}
                <p class="content__error-message">{errors.content[0]}</p> 
            {/if}
            <textarea class="content__textarea" name="content" id="content" bind:value={text} placeholder="*"></textarea>
        </label>
        <span class="content__captcha-text">
            This site is protected by reCAPTCHA and the Google 
            <a target="_blank" href="https://policies.google.com/privacy" class="content__text--color-blue">Privacy Policy</a>
            and
            <a target="_blank" href="https://policies.google.com/terms" class="content__text--color-blue">Terms of Service</a> apply.
        </span>
    </div>
</form>

<style>
.app__grid {
    --accent-color: #0a82ff;
    grid-template-columns: 1fr;
}
.app__content {
    --error-color: #ff000080;
    --gap: 5px;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    padding-bottom: 0;
    padding-right: 0;
}
.content__line {
    width: 100%;
    position: relative;
    border-bottom: 1px solid #525150;
    display: grid;
    grid-template-columns: min-content 1fr;
    gap: var(--gap);
    padding: 8px 1rem 8px 0;
}
.content__line--state-error {
    border-bottom: 1px solid var(--error-color);
}
.content__error-message {
    font-size: var(--fz-s);
    color: var(--error-color);
    grid-column: 1/-1;
}
.content__input,
.content__textarea {
    width: 100%;
    font-size: var(--fz-m);
    outline: none;
    border: none;
    background: transparent;
    color: #fff;
    cursor: text;
}
.content__textarea-wrapper {
    width: calc(100% + 1rem);
    height: 100%;
    margin-left: -1rem;
    padding: 5px 0 0 15px;
    display: flex;
    flex-direction: column;
}
.content__textarea {
    padding-top: var(--gap);
    height: 100%;
    resize: none;
    font-family: inherit;
}
.content__label {
    color: #A1A1A0;
    font-size: var(--fz-m);
    white-space: nowrap;
}
.content__text--color-blue {
    color: #0a82ff;
}
.content__captcha-text {
    font-size: var(--fz-xs);
    color: #525150;
    text-align: center;
    padding-block: .25rem;
    background-color: #1B1B1B;
}

@media (max-width: 1280px) {
    .content__line {
        padding-block: 15px;
    }
    .content__input,
    .content__textarea,
    .content__label {
        font-size: var(--fz-xl);
    }
    .content__captcha-text {
        font-size: var(--fz-s);
        padding: 10px 20px 15px 0;
        background-color: transparent;
    }
    .content__error-message {
        font-size: var(--fz-l);
    }
}
</style>
