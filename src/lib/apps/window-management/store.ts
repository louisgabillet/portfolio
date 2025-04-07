import { get, writable, type Writable } from "svelte/store";
import type { AppWindow } from "./types";
import { browser } from "$app/environment";
import { toast } from "$lib/toast";
import type { ToastContent } from "$lib/toast/types";

type LimitManager = Record<string, number>;
type ToastManager = Record<string, boolean>;
type ReducedManager = Record<string, AppWindow['id'][]>;

const appWindows: Writable<AppWindow[]> = writable([]);
export default appWindows;

const limitManager: LimitManager = { global: 100 };
const toastManager: ToastManager = {};
const reducedManager: ReducedManager = {}

const showError = (limitName: string, toastContent: ToastContent, isToast: boolean = false) => {
    if (toastManager[limitName]) {
        return;
    }

    toastManager[limitName] = true;
    if (isToast) toast.blocked(toastContent);
}
export function open(app: AppWindow) {
    if (!browser) return;

    const _appWindows = get(appWindows);
    const type = app.data.type;

    const fullscreenAppWindow: HTMLElement | null = document.querySelector('.app[data-fullscreen]'); 
    const isReduced = reducedManager[app.data.type];

    const exceedsGlobalLimit = _appWindows.length >= limitManager['global'];
    const exceedsWindowLimit = get(appWindows).filter(app => app.data.type === type).length >= limitManager[type]; 

    if (fullscreenAppWindow) {
        const id = fullscreenAppWindow.dataset.windowId;
        if (id) fullscreen(id);
    }
    if (isReduced) {
        removeReduce(app.data.type);
        return;
    }
    if (exceedsGlobalLimit) {
        showError('global', { appName: 'Finder', title: 'Limite globale atteinte', message: `La limite globale de fenêtres ouvertes (${limitManager['global']}) a été atteinte.` });
        return;
    }
    if (exceedsWindowLimit) {
        showError(type, { appName: type, title: 'Limite atteinte', message: `La limite de fenêtres ouvertes (${limitManager[type]}) pour l'application "${type}" a été atteinte.` });

        const lastAppWindow = _appWindows.findLast(w => w.data.type === type);
        if (lastAppWindow) focus(lastAppWindow.id);

        return;
    }

    appWindows.update(($appWindows) => [...$appWindows, app]);
    setTimeout(() => focusWindow(app.id));
}
export function close(appWindowId: AppWindow['id']) {
    appWindows.update(($appWindows) => $appWindows.filter(w => w.id !== appWindowId));
}
export function focus(appWindowId: AppWindow['id']) {
    const _appWindows = get(appWindows);
    const lastWindow = _appWindows[_appWindows.length -1];
    const index = _appWindows.findIndex(w => w.id === appWindowId);

    if (lastWindow.id === appWindowId || index === -1) return;

    const [ extractedFromAppWindows ] = get(appWindows).splice(index, 1);
    appWindows.update(($appWindows) => [...$appWindows.filter(w => w.id !== appWindowId), extractedFromAppWindows]);
}
export function limit(type: string, limit: number) {
    if (limit === limitManager[type]) return;

    limitManager[type] = limit;
}
export function fullscreen(appWindowId: AppWindow['id']) {
    const screen = document.querySelector('.device__screen') as HTMLElement | null;
    const appWindow = document.querySelector(`[data-window-id='${appWindowId}']`) as HTMLElement | null;

    [screen, appWindow].forEach(el => {
        if (!el) return;

        const fullscreen = el.dataset.fullscreen;

        if (fullscreen !== undefined) {
            el.removeAttribute('data-fullscreen');
            return;
        } 

        el.dataset.fullscreen = '';
    })
}
export function reduce(appWindowId: AppWindow['id'], appName: string) {
    const screen: HTMLElement | null = document.querySelector('.device__screen[data-fullscreen]');
    const isFullscreen: boolean = screen ? screen.dataset.fullscreen !== undefined : false;

    if (isFullscreen) return;

    const reduced = reducedManager[appName]; 
    if (!reduced) reducedManager[appName] = [];

    addReduce(appWindowId, appName);
}
const addReduce = (appWindowId: AppWindow['id'], appName: string) => {
    const round = (n: number): string => (n).toFixed(5);

    const dockApp = document.querySelector(`.dock__shortcut[data-app-name='${appName}']`);
    const appWindow = document.querySelector(`.app[data-window-id='${appWindowId}']`) as HTMLElement;
    const desktop = document.querySelector('.screen__desktop');

    if (!dockApp || !appWindow || !desktop) return;

    const { x: desktopX, y: desktopY } = desktop.getBoundingClientRect();
    const { x: dockX, y: dockY, width: dockWidth, height: dockHeight } = dockApp.getBoundingClientRect();
    const { width: appWidth, height: appHeight } = appWindow.getBoundingClientRect();

    const properties = [
        { name: '--reduce-left', value: `${round((dockX - desktopX) - (appWidth / 2) + (dockWidth / 2))}px` },
        { name: '--reduce-top', value: `${round((dockY - desktopY) - (appHeight / 2) + (dockHeight / 2))}px` },
        { name: '--reduce-scale', value: round(dockWidth / appWidth) },
    ]

    reducedManager[appName].push(appWindowId)
    appWindow.dataset.reduce = '';
    properties.forEach(p => appWindow.style.setProperty(p.name, p.value))
}
const removeReduce = (appName: string) => {
    const reduced = reducedManager[appName];
    const lastId: string = reduced[reduced.length - 1];
    const properties = ['--reduce-left', '--reduce-top', '--reduce-scale']

    const appWindow = document.querySelector(`.app[data-window-id='${lastId}']`) as HTMLElement;
    if (!appWindow) return;

    reducedManager[appName].pop();
    if (reducedManager[appName].length === 0) delete reducedManager[appName];

    focus(lastId);
    setTimeout(() => focusWindow(lastId));

    appWindow.removeAttribute('data-reduce');
    properties.forEach(p => appWindow.style.removeProperty(p))
}
const focusWindow = (appWindowId: AppWindow['id']) => {
    const focusedWindow: HTMLElement | null = document.querySelector(`.app[data-window-id='${appWindowId}'] > .app__container`);
    if (focusedWindow) focusedWindow.focus({ preventScroll: true });
}
