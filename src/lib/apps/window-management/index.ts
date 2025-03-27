import { genId } from "./utils";
import { open, close, limit, focus, fullscreen, reduce } from "./store";
import type { App } from '../types';
import type { AppWindow, AppWindowHandler, AppWindowOptions } from "./types";
import { writable } from "svelte/store";

const createAppWindow = (data: App) => ({
    created_at: Date.now(),
    id: genId(),
    data,
    fullscreen: writable(false),
    reduce: writable({
        active: false,
        x: 0,
        y: 0,
        scale: 1,
    }),
});
    
const createHandler: AppWindowHandler = (data: App, opts?: AppWindowOptions) => {
    const app: AppWindow = createAppWindow(data);
    const windowLimit = opts?.limit || 2;

    limit(app.data.type, windowLimit);
    open(app);

    return app.id; 
}

const appWindow = (data: App, opts?: AppWindowOptions): AppWindow['id'] => createHandler(data, opts);
appWindow.close = (appWindowId: AppWindow['id']) => close(appWindowId); 

appWindow.focus = (appWindowId: AppWindow['id']) => focus(appWindowId); 
appWindow.fullscreen = (appWindowId: AppWindow['id']) => fullscreen(appWindowId); 
appWindow.reduce = (appWindowId: AppWindow['id'], appName: string) => reduce(appWindowId, appName); 

export default appWindow;
