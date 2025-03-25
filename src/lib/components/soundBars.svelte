<script lang="ts">
export let width: string = 'fit-content'; 
export let height: string = '14px'; 
</script>

<div 
    class="soundbars"
    style:--width={ width }
    style:--height={ height }
>
    <div class="soundbars__bar"></div>
    <div class="soundbars__bar"></div>
    <div class="soundbars__bar"></div>
    <div class="soundbars__bar"></div>
</div>

<style>
.soundbars {
    width: var(--width);
    height: var(--height);
    position: absolute;
    inset: 0;
    margin: auto;
    display: flex;
    align-items: flex-end;
    gap: 1px;
}
.soundbars__bar {
    background: #fff;
    height: var(--bar-height);
    width: 3px;      
    border-radius: 6px 6px 0 0;
    animation: sound 0ms -800ms linear infinite alternate;
}
.soundbars__bar:nth-child(1) { 
    --bar-height: 2px;
    animation-duration: 474ms;
}
.soundbars__bar:nth-child(2) { 
    --bar-height: 9px;
    animation-duration: 433ms;
}
.soundbars__bar:nth-child(3) { 
    --bar-height: 7px;
    animation-duration: 407ms;
}
.soundbars__bar:nth-child(4) { 
    --bar-height: 4px;
    animation-duration: 400ms;
}

@keyframes sound {
to {
    height: var(--height);        
}
}
</style>
