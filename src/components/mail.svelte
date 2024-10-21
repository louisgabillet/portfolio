<script lang="ts" context='module'>
import { enhance } from "$app/forms";

const key = '6LccwGcqAAAAADpoFBfMu1yt9NU74CkTfTLvUIdZ';
let email: string = 'gabillet.louis@gmail.com', cc: string, subject: string, from: string = '';

declare const grecaptcha: any;

const onSubmit = async () => {
        grecaptcha.ready(function() {
          grecaptcha.execute(key, {action: 'submit'}).then(function(token: string) {
            console.log(typeof grecaptcha);
            fetch('?/email', {
                method: 'POST',
                body: JSON.stringify({ token, email, cc, subject, from }),
            })
        });
        });
      }
</script>

<svelte:head>
    <script src="https://www.google.com/recaptcha/api.js?render={key}"></script>
</svelte:head>

<form method="POST" on:submit|preventDefault={onSubmit}>
    <nav>
        <button type="submit">Submit</button>
    </nav>
    <div class="container">
            <div class="line">
                <p>To :</p>
                <input type="text" bind:value={email} id='to' name='to' disabled>
            </div>
            <div class="line">
                <p>Cc :</p>
                <input type="text" bind:value={cc} id='cc' name='cc'>
            </div>
            <div class="line">
                <p>Subject :</p>
                <input type="text" bind:value={subject} id='subject' name='subject'>
            </div>
            <div class="line">
                <p>From :</p>
                <input type="text" bind:value={from} id='from' name='from'>
            </div>
        <textarea name="content" id="content"></textarea>
        <span class="captcha-text">This site is protected by reCAPTCHA and the Google <a target="_blank" href="https://policies.google.com/privacy">Privacy Policy</a> and
            <a target="_blank" href="https://policies.google.com/terms">Terms of Service</a> apply.
        </span>
    </div>
</form>

<style>
.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 1rem;
}
.captcha-text {
    font-size: 6px;
    color: #525150;
    margin: 0 auto;
    padding-block: .25rem;
    background-color: #222220;
}
.captcha-text a {
    text-decoration: none;
    color: #A1A1A0;
}
form {
    width: 100%;
    height: 100%;
    background-color: #222220;
    display: grid;
    grid-template-rows: var(--nav-height) 1fr;
}
nav {
    width: 100%;
    height: var(--nav-height);
    background-color: #383836;
    display: flex;
    align-items: center;
    justify-content: center;
}
.line {
    width: 100%;
    border-bottom: 1px solid #525150;
    display: flex;
    gap: .5rem;
    padding: .5rem 1rem .5rem 0;
}
input, textarea {
    width: 100%;
    font-size: 12px;
    outline: none;
    border: none;
    background: transparent;
    color: var(--color-text);
}
textarea {
    width: calc(100% + 1rem);
    height: 100%;
    resize: none;
    padding: .5rem 1rem 0;
    margin-left: -1rem;
    font-family: inherit;
}
p {
    color: #A1A1A0;
    font-size: 12px;
    white-space: nowrap;
}
</style>
