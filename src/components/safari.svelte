<script lang="ts">
export let link: string;
</script>

<div class="container">
    <nav>
        <label for="search">
            <input type="text" value='{link}.com' autocomplete="off" id="search">
        </label>
    </nav>
</div>

<style>
.container {
    height: 100%;
    background-color: var(--dark-fullscreen);
    backdrop-filter: blur(var(--blur));
}
nav {
    width: 100%;
    height: var(--nav-height);
    background-color: var(--dark-title-bar);
    display: flex;
    align-items: center;
    justify-content: center;
}
label {
    width: 50%;
    position: relative;
}
input {
    color: var(--color-text);
    text-align: center;
    width: 100%;
    padding: .1rem .5rem;
    /* border: 1px solid #50504E; */
    background: transparent;
    border: 1px solid #525150;
    border-radius: .2rem;
    font-size: 10px;
}
input:focus {
    outline: 2px solid #457198;
}
</style>
