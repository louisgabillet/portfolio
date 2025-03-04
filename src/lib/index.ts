import Window from '../components/window.svelte';
import { writable, type Writable } from 'svelte/store';
import type { App } from './apps/types';

interface Comp {
    name: string,
    child: Record<string, any>
}
export interface Notification {
    uid?: string,
    app_name: string,
    src: string,
    title: string,
    message: string,
}

let windowOrder: string[] = [];

export const notifQueue: Writable<Record<string, Notification[]>> = writable({});
export const globalWindowOrder: Writable<string[]> = writable([]);
export const activeTopBar: Writable<string> = writable('Finder-1');
export const isResponsive: Writable<boolean> = writable();
export const isIpad: Writable<boolean> = writable();
//export const playingAudio = writable<{ html: HTMLElement|null, name: string }>({ html: null, name: '' });
export const playingAudio = writable<{ html: HTMLElement | null, name: string }>({ 
    html: null, 
    name: '',
});

let uniqueName: string = '';
//let oldTopBarName: string = 'Finder';
let comp: Comp[] = [];

/**
 * Opening a window of a specific app.
 * @param {Apps} app Data of the app we want to open
 */
export const openAppWindow = (app: App) => {
    const nbrAppPageOpen = document?.querySelectorAll(`.app[data-app-name='${app.type}']`)?.length;
    uniqueName = `${app.type}-${nbrAppPageOpen + 1}`;

    const parent = document.querySelector('.screen__desktop');
    if (!parent) return;

    const child = new Window({
        target: parent,
        props: {
            name: app.type,
            appInfos: app,
        }
    })
    const newApp = { name: uniqueName, child };
    comp.push(newApp);
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
    globalWindowOrder.set(windowOrder);

    //const innerWidth: number = window.innerWidth;
    //if (innerWidth <= 995) {
    //    const dock = document.getElementById('dock'); 
    //    if (dock) dock.style.removeProperty('z-index');
    //}

    if (windowOrder?.length === 0) { 
        //const activeName = 'Finder';
        //getNewTopBarText(activeName);
        activeTopBar.set('Finder-1');
    }
}

/**
 * Changing the order at which the windows appear.
 * @param {string} name The name of the app we focus (eg. Safari-1: name-index)
 */
export const changeAppWindowsOrder = (name: string) => {
    //const activeName: string = name.split('-')[0];
    //getNewTopBarText(activeName);
    activeTopBar.set(name);

    if (windowOrder[windowOrder.length - 1] !== name) {
        removeFocusedAppWindow(name)
        windowOrder.push(name);
        globalWindowOrder.set(windowOrder);
    }
}

/**
 * Getting the content for the TopBar based on the latest opened app.
 * @param {string} name the name of the latest opened app (eg. Safari)
 */
//const getNewTopBarText = (name: string) => {
//    const currData: TBText | undefined = topBarText.find((el) => el.app_name == name);
//
//    if (currData && name !== oldTopBarName) {
//        oldTopBarName = name;
//        activeTopBar.set(currData);
//    }
//}
/**
 * Removing the app if already open and placing it at the end of the order (placed on top of every other one).
 * @param {string} name the name of the focused app (eg. Safari-2: name-index)
 */
const removeFocusedAppWindow = (name: string) => {
    const index = windowOrder.indexOf(name);
    if (index !== -1) {
        //windowOrder.splice(index, 1);
        windowOrder = windowOrder.filter(n => n !== name);
    }
}
/**
 * Add a notification to the queue.
 * @param {string} app_name the name of the app concerned.
 * @param {string} src the icon of the app.
 * @param {string} title the title of the notification.
 * @param {string} message the message of the notification.
 */
export const addNotifToQueue = (app_name: string, src: string, title: string, message: string) => {
    notifQueue.update(curr => {
        const currKey = curr[app_name] ?? [];
        return {
            ...curr,
            [app_name]: [
                ...currKey,
                { 
                    uid: crypto.randomUUID(),
                    app_name,
                    src,
                    title,
                    message,
                },
            ],
        }
    })
}
/**
 * Remove a notification from the queue.
 * @param {string} uid the uid of the notification.
 * @param {string} key the name of the key.
 */
export const removeNotifFromQueue = (uid: string, key: string) => {
    notifQueue.update(curr => {
        const currKey = curr[key] ?? [];
        const updatedKey = currKey.filter(obj => obj.uid !== uid);

        //if (updatedKey.length === 0) {
        //    const { [key]: _, ...rest } = curr; 
        //    return rest; 
        //}

        return { ...curr, [key]: updatedKey }; 
    });
}
//export const removeNotifFromQueue = (uid: string, key: string) => {
//    notifQueue.update(curr => {
//        const currKey = curr[key] ?? [];
//        return {
//            ...curr,
//            [key]: currKey.filter(obj => obj.uid !== uid),
//        }
//    })
//}
