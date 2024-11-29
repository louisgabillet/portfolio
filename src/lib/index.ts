import type { Apps, TBText } from './data';
import { topBarText } from '$lib/data';
import Window from '../components/window.svelte';
import { writable } from 'svelte/store';

interface Writable<T> {
    subscribe(run: (value: T) => void): void; // type: Unsubscribe
    set(value: T): void;
    update(updater: (value: T) => T): void;
}

interface Comp {
    name: string,
    child: Record<string, any>
}

export let windowOrder: string[] = [];
export const activeTopBar: Writable<TBText> = writable(topBarText.find((el) => (el?.app_name || el?.name) == 'Finder'));

let uniqueName: string = '';
let oldTopBarName: string = 'Finder';
let comp: Comp[] = [];

/**
 * Opening a window of a specific app.
 * @param {Apps} app Data of the app we want to open
 */
export const openAppWindow = (app: Apps) => {
    const {name, app_name, safari_link, path } = app;
    const appOrCustom = app_name ?? name;
    const nbrAppPageOpen = document?.querySelectorAll(`.app-window[data-app-name='${appOrCustom}']`)?.length;
    uniqueName = `${appOrCustom}-${nbrAppPageOpen + 1}`;

    const activeName: string = app_name ?? name;
    const currData = getNewTopBarText(activeName);

    if (currData && activeName !== oldTopBarName) {
        oldTopBarName = activeName;
        activeTopBar.set(currData);
    }

    //if (isRedirectOn) {
    //    const link = launchpadApps?.find(app => ( app?.name || app?.app_name ) === name )?.redirect_link;
    //    if (link) window.open(link, '_blank');
    //}

    //if (isLaunchpad) isLaunchpad = false;

    const parent = document?.getElementById('desktop');
    if (!parent) return;
    windowOrder = [...windowOrder, uniqueName];

    const child = new Window({
        target: parent,
        props: {
            name: appOrCustom,
            order: windowOrder,
            safariLink: safari_link ?? '',
            finderPath: path ?? ['louisgabillet'],
        }
    })
    comp = [...comp, {name: uniqueName,  child: child}];
}

/**
 * Closing the window.
 * @param {string} name The name of the closing app (eg. Safari-2: name-index)
 */
export const closeAppWindow = (name: string) => {
    const component = comp?.find((el: Comp) => el.name === name)?.child;
    component?.$destroy();
    comp = comp?.filter((el: Comp) => el?.name !== name);
    removeFocusedAppWindow(name)

    const activeName = 'Finder';
    const currData = getNewTopBarText(activeName);

    if (windowOrder?.length === 0 && currData && activeName !== oldTopBarName) {
        oldTopBarName = activeName;
        activeTopBar.set(currData);
    }
}

/**
 * Changing the order at which the windows appear.
 * @param {string} name The name of the app we focus (eg. Safari-1: name-index)
 */
export const changeAppWindowsOrder = (name: string) => {
    const activeName: string = name.split('-')[0];
    const currData = getNewTopBarText(activeName);

    if (currData && activeName !== oldTopBarName) {
        oldTopBarName = activeName;
        activeTopBar.set(currData);
    }

    removeFocusedAppWindow(name)
    windowOrder = [...windowOrder, name];

    comp.forEach(el => {
        el?.child?.$set({
            order: windowOrder,
        })
    })
}

/**
 * Getting the content for the TopBar based on the latest opened app.
 * @param {string} activeName the name of the latest opened app (eg. Safari)
 * @returns {TBText | undefined} the new content for the TopBar
 */
const getNewTopBarText = (activeName: string): TBText | undefined => {
    const currData: TBText | undefined = topBarText.find((el) => (el?.app_name || el?.name) == activeName );

    return currData;
}
/**
 * Removing the app if already open and placing it at the end of the order (placed on top of every other one).
 * @param {string} appName the name of the focused app (eg. Safari-2: name-index)
 */
const removeFocusedAppWindow = (appName: string) => {
    const remove = windowOrder?.includes(appName);
    if (remove) windowOrder = windowOrder?.filter((name) => name !== appName);
}
