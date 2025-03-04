<div class="spinner">
    {#each { length: 12 } as _}
        <div class="spinner__bar"></div>
    {/each}
</div>

<style>
.spinner {
    width: 50%;
    height: 50%;
    min-width: 15px;
    min-height: 15px;
    max-width: 50px;
    max-height: 50px;
    display: inline-block;
    position: absolute;
    inset: 0;
    margin: auto;
}
.spinner__bar {
    width: 6%;
    height: 16%;
    background: #7c7c7c;
    position: absolute;
    left: 49%;
    top: 43%;
    opacity: 0;
    border-radius: 50px;
    box-shadow: 0 0 3px rgba(0,0,0,0.2);
    animation: fade 1s linear infinite;
    -webkit-border-radius: 50px;
    -webkit-box-shadow: 0 0 3px rgba(0,0,0,0.2);
    -webkit-animation: fade 1s linear infinite;
}
.spinner__bar:nth-child(1) {
    transform: rotate(0deg) translate(0, -130%);
    animation-delay: 0s;
    -webkit-transform: rotate(0deg) translate(0, -130%);
    -webkit-animation-delay: 0s;
}    
.spinner__bar:nth-child(2) {
    transform:rotate(30deg) translate(0, -130%); 
    animation-delay: -0.9167s;
    -webkit-transform:rotate(30deg) translate(0, -130%); 
    -webkit-animation-delay: -0.9167s;
}
.spinner__bar:nth-child(3) {
    transform:rotate(60deg) translate(0, -130%); 
    animation-delay: -0.833s;
    -webkit-transform:rotate(60deg) translate(0, -130%); 
    -webkit-animation-delay: -0.833s;
}
.spinner__bar:nth-child(4) {
    transform:rotate(90deg) translate(0, -130%); 
    animation-delay: -0.7497s;
    -webkit-transform:rotate(90deg) translate(0, -130%); 
    -webkit-animation-delay: -0.7497s;
}
.spinner__bar:nth-child(5) {
    transform:rotate(120deg) translate(0, -130%); 
    animation-delay: -0.667s;
    -webkit-transform:rotate(120deg) translate(0, -130%); 
    -webkit-animation-delay: -0.667s;
}
.spinner__bar:nth-child(6) {
    transform:rotate(150deg) translate(0, -130%); 
    animation-delay: -0.5837s;
    -webkit-transform:rotate(150deg) translate(0, -130%); 
    -webkit-animation-delay: -0.5837s;
}
.spinner__bar:nth-child(7) {
    transform:rotate(180deg) translate(0, -130%); 
    animation-delay: -0.5s;
    -webkit-transform:rotate(180deg) translate(0, -130%); 
    -webkit-animation-delay: -0.5s;
}
.spinner__bar:nth-child(8) {
    transform:rotate(210deg) translate(0, -130%); 
    animation-delay: -0.4167s;
    -webkit-transform:rotate(210deg) translate(0, -130%); 
    -webkit-animation-delay: -0.4167s;
}
.spinner__bar:nth-child(9) {
    transform:rotate(240deg) translate(0, -130%); 
    animation-delay: -0.333s;
    -webkit-transform:rotate(240deg) translate(0, -130%); 
    -webkit-animation-delay: -0.333s;
}
.spinner__bar:nth-child(10) {
    transform:rotate(270deg) translate(0, -130%); 
    animation-delay: -0.2497s;
    -webkit-transform:rotate(270deg) translate(0, -130%); 
    -webkit-animation-delay: -0.2497s;
}
.spinner__bar:nth-child(11) {
    transform:rotate(300deg) translate(0, -130%); 
    animation-delay: -0.167s;
    -webkit-transform:rotate(300deg) translate(0, -130%); 
    -webkit-animation-delay: -0.167s;
}
.spinner__bar:nth-child(12) {
    transform:rotate(330deg) translate(0, -130%); 
    animation-delay: -0.0833s;
    -webkit-transform:rotate(330deg) translate(0, -130%); 
    -webkit-animation-delay: -0.0833s;
}

@keyframes fade {
from {
    opacity: 1;
}
to {
    opacity: 0;
}
}
@-webkit-keyframes fade {
from {
    opacity: 1;
}
to {
    opacity: 0;
}
}
</style>
