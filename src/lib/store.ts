import { writable, type Writable } from 'svelte/store';

export const isResponsive: Writable<boolean> = writable();
