<script lang="ts">
    export let open: (name: string, link: string) => void;
    export let openWindow: HTMLElement;

//import { data } from '$lib/index';

//let directories = [
//    { name: }
//]
interface Repo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  [key: string]: any;  // To capture any additional fields
}
let isDirOpen: boolean = false;
let openDirName: string;

async function getUserRepos(username: string): Promise<Repo[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    const repos: Repo[] = await response.json();
    return repos;
  } catch (error) {
    console.error('Error fetching repos:', error);
    return [];
  }
}

const openDir = (e: any) => {
    const target = e?.target?.closest('.directory');
    isDirOpen = true;
    openDirName = target?.dataset.nameDir
    openWindow?.focus()
 }
</script>

<div class="container">
    <div class="sidebar"></div>
    <nav>
        <button on:click={() => {isDirOpen = false}}>back</button>
    </nav>
    <div class="content">
        <div class="placement">
            {#if isDirOpen}
                <button class="directory" on:dblclick={() => open('Safari', openDirName) }>
                    <img class='icon' src="/src/lib/assets/images/icon/Safari.png" alt="">
                    <p>{openDirName}</p>
                </button>
                <button class="directory" on:dblclick={() => open('Notes', openDirName) }>
                    <img class='icon' src="/src/lib/assets/images/icon/Document.png" alt="">
                    <p>Case Study.txt</p>
                </button>
            {:else}
                {#await getUserRepos('octocat')}
                    {#each Array(6) as _}
                        <button class="directory" >
                            <img class='icon' src="/src/lib/assets/images/icon/Folder.png" alt="">
                        </button>
                    {/each}
                {:then repos}
                    {#each repos as repo }
                        <button class="directory" data-name-dir={repo.name} on:dblclick={openDir}>
                            <img class='icon' src="/src/lib/assets/images/icon/Folder.png" alt="">
                            <p>{repo.name}</p>
                        </button>
                    {/each}
                {/await}
            {/if}
        </div>
    </div>
</div>


<style>
.container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-template-rows: var(--nav-height) 1fr;
}
.content {
    background-color: #21211E;
    overflow: scroll;
}
.placement {
    display: flex;
    flex-wrap: wrap;
    width: 300px;
}
.directory {
    width: 100px;
    aspect-ratio: 1/1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 12px;
    align-items: center;
    text-align: center;
    background: transparent;
    border: none;
    outline: none;
}
.icon {
    width: 64px;
    aspect-ratio: 1/1;
}
.sidebar {
    width: 100%;
    height: 100%;
    grid-row: 1 / -1;
    background-color: #4A4A4A64;
    backdrop-filter: blur(20px);
}
nav {
    width: 100%;
    height: var(--nav-height);
    background-color: #373735;
}
</style>
