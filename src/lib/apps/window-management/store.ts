import Window from "$lib/components/window.svelte";
import { get, writable, type Writable } from "svelte/store";
import type { AppWindow, AppWindowProps, AppWindows } from "./types";
import { browser } from "$app/environment";
import { SvelteComponent } from "svelte";
import { toast } from "$lib/toast";
import type { ToastContent } from "$lib/toast/types";

type WindowManager = {
    id: string,
    type: string,
    child: SvelteComponent<AppWindowProps>, 
}
type LimitManager = Record<string, number>;
type ToastManager = Record<string, boolean>;

const appWindows: Writable<AppWindows> = writable([])
export default appWindows;

const windowManager: WindowManager[] = []; 
const limitManager: LimitManager = { global: 70 };
const toastManager: ToastManager = {};

const showError = (limitName: string, log: string, toastContent: ToastContent) => {
    console.log(log);

    if (toastManager[limitName]) {
        return;
    }

    toastManager[limitName] = true;
    setTimeout(() => {
        toast.blocked(toastContent);
    })
}
export function open(app: AppWindow) {
    if (!browser) {
        return;
    }

    if (windowManager.length >= limitManager['global']) {
        showError(
            'global',
            'Global limit for windows reached',
            {
                appName: 'Finder',
                title: 'Limite globale atteinte',
                message: `La limite de fenêtres ouvertes (${limitManager['global']}) a été atteinte.`,
            });

        return;
    }

    const target = document.querySelector('.screen__desktop');
    if (!target) {
        console.log('Location for the window not found');
        return;
    };

    const data = app.data;
    const type = data.type;
    const nbrWindowOpened = document.querySelectorAll(`[data-app-name='${type}']`)?.length ?? 0;

    if (nbrWindowOpened + 1 > limitManager[type]) {
        showError(
            type,
            `Limit of windows for '${type}' reached`, 
            {
                appName: type,
                title: 'Limite atteinte',
                message: `La limite de fenêtres ouvertes pour ${type} (${limitManager[type]}) a été atteinte.`,
            });

        const lastAppWindow = windowManager.findLast(w => w.type === type);
        if (lastAppWindow) {
            focus(lastAppWindow.id);
        }

        return;
    }
    
    const child: SvelteComponent<AppWindowProps> = new Window({
        target,
        props: {
            name: type,
            appWindowId: app.id,
            appInfos: data,
        }
    })

    windowManager.push({ id: app.id, type, child }); 
    appWindows.update(($appWindows) => [...$appWindows, app]);

    const newAppWindow = document.querySelector(`[data-app-window-id='${app.id}']`) as HTMLDivElement;
    if (newAppWindow) {
        newAppWindow.focus({ preventScroll: true });
    }
}
export function close(appWindowId: AppWindow['id']) {
    const index = windowManager.findIndex(w => w.id === appWindowId);

    if (index === -1) {
        console.log(`No window found`);
        return;
    }

    const appWindow = windowManager.splice(index, 1)[0];

    appWindow.child.$destroy();
    appWindows.update(($appWindows) => $appWindows.filter(w => w.id !== appWindowId));
}
export function focus(appWindowId: AppWindow['id']) {
    const lastWindow = windowManager[windowManager.length -1];
    if (lastWindow.id === appWindowId) {
        return;
    }

    const index = windowManager.findIndex(w => w.id === appWindowId);
    if (index === -1) {
        console.log(`No window found`);
        return;
    }

    const extract = <T>(arr: T[]) => arr.splice(index, 1);

    const [extractedFromManager] = extract(windowManager);
    const [extractedFromAppWindows] = extract(get(appWindows));

    windowManager.push(extractedFromManager);
    appWindows.update(($appWindows) => [...$appWindows.filter(w => w.id !== appWindowId), extractedFromAppWindows]);
}
export function limit(type: string, limit: number) {
    if (limit === limitManager[type]) {
        return;
    }

    limitManager[type] = limit;
}
