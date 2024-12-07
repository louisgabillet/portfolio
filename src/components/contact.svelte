<script lang="ts">
const navBtns = [
    { name: 'All Contacts', active: true },
    { name: 'All iCloud', title: 'iCloud' },
    { name: 'All on My Mac', title: 'On My Mac' },
]
const contactList = [
    { name: 'Louis Gabillet', mobile: '+33 7 85 21 03 66', mail: 'gabillet.louis@gmail.com', note: '', self: true },
]

let search: string = '';
$: searchedContact = contactList.filter(contact => contact?.name?.toLowerCase()?.includes(search?.toLowerCase()));

let contactName: string = 'Louis Gabillet';
$: contactInfo = contactList.find(contact => contact.name === contactName) ?? contactList[0];
$: ({name, mobile, mail, note, self} = contactInfo);
</script>

<div class="app-grid">
    <nav>
        {#each navBtns as btn}
            {#if btn?.title}
               <h5>{btn.title}</h5> 
            {/if}
           <button class="{btn?.active ? 'active' : ''}">{btn.name}</button> 
        {/each}
    </nav>
    <div class="contact-list">
        <input type="text" bind:value={search}>
        {#each searchedContact as contact}
           <button class="{contact?.name === contactName ? 'active' : ''} {self ? 'flex-btw' : ''}" on:click={() => contactName = contact.name}>{contact.name}<i>􀉭</i></button> 
        {/each}
    </div>
    <div class="app-content">
        {#if contactInfo}
                <div class="flex">
                    <div class="pp">
                        <span>{name?.split('')[0]?.toUpperCase()}</span>
                    </div>
                    <h2>{name}</h2>
                </div>
                <div class="flex">
                    <div class="contact-btn {mobile ? 'activated' : ''}">
                        <a href="sms:{mobile}">􀌥</a>
                        <p>message</p>
                    </div>
                    <div class="contact-btn {mobile ? 'activated' : ''}">
                        <a href="tel:{mobile}">􀌿</a>
                        <p>call</p>
                    </div>
                    <div class="contact-btn">
                        <a href="/">􀍊</a>
                        <p>FaceTime</p>
                    </div>
                    <div class="contact-btn {mail ? 'activated' : ''}">
                        <a href="mailto:{mail}">􀍖</a>
                        <p>mail</p>
                    </div>
                </div>
                <div class="info">
                    <div class="flex line">
                        <p class="subtitle">mobile</p>
                        {#if mobile}
                            <p>{mobile}</p>
                        {/if}
                    </div>
                    <div class="flex line">
                        <p class="subtitle">FaceTime</p>
                        <i>􀍊</i>
                        <a href="/" class="{mobile ? 'activated' : ''}">􀌿</a>
                    </div>
                    <div class="flex line">
                        <p class="subtitle">note</p>
                        {#if note}
                            <p>{note}</p>
                        {/if}
                    </div>
                </div>
        {/if}
    </div>
</div>

<style>
.app-grid {
    grid-template-columns: 7rem 7rem 1fr;
    grid-template-rows: 1fr;
}
h2 {
    font-size: calc(var(--font-size) + 4px);
}
h5 {
    font-size: var(--fz-xxs);
    margin-block: .5rem .25rem;
}
h5, i {
    color: #7C7C7C;
}
a {
    text-decoration: none;
    cursor: default;
    pointer-events: none;
}
input {
    width: 100%;
    font-size: var(--fz-xs);
    border: none;
    outline: none;
    padding: 2px;
    background: grey;
    border-radius: 2px;
    margin-bottom: 15px;
}
button {
    background: transparent;
    border: none;
    outline: none;
    padding: 2px 4px;
    border-radius: 2px;
    text-align: start;
}
.active {
    background: #7C7C7C;
}
.pp {
    background: #7C7C7C;
    border-radius: 50%;
    display: grid;
    place-content: center;
    margin-right: 5px;
    padding: 5px;
}
.pp span {
    font-size: calc(var(--font-size) * 2.5);
    aspect-ratio: 1/1;
    text-align: center;
}
nav button {
    opacity: .5;
}
nav .active {
    background: var(--dark-selection-focused);
    opacity: 1;
}
.active i {
    color: white;
}
.activated p, .activated {
    color: #0A82FF;
}
.flex-btw {
    display: flex;
    justify-content: space-between;
}
.flex {
    display: flex;
    align-items: center;
    gap: 4px;
}
.info {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.contact-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    margin-inline: 4px;
    color: #3D3C39;
}
.contact-btn a {
    background: #3D3C39;
    color: #7C7C7C;
    padding: calc(var(--font-size) / 2);
    border-radius: 50%;
    aspect-ratio:  1/1;
    display: grid;
    place-content: center;
}
.activated a {
    color: white;
    background: var(--dark-selection-focused);
    pointer-events: auto;
}
.contact-list button {
    padding: 4px 4px;
}
.line {
    border-bottom: 0.03px solid #7C7C7C59;
    padding: 2px 0;
}
.line:last-of-type {
    align-items: flex-start;
    border: none;
    height: 100%;
}
.subtitle {
    text-align: end;
    width: 40%;
    color: #7C7C7C
}
 button, .info {
    width: 100%;
}
nav, .contact-list {
    padding: var(--nav-height) 5px 5px 5px;
}
.contact-list {
    border-right: 1px solid black;
    background: #1B1B1B;
}
.app-content {
    padding: calc(var(--nav-height) / 2) 10px 10px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--font-size) * 1.5);
    overflow: auto;
}
.app-content p, .app-content, .app-content a {
    font-size: var(--font-size);
}
.contact-list button:focus {
    background: var(--dark-selection-focused);
}
.contact-list button:focus i {
    color: white
}
</style>
