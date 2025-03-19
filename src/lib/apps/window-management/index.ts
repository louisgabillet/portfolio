import { genId } from "./utils";
import { open, close, limit, focus } from "./store";
import type { App } from '../types';
import type { AppWindow, AppWindowHandler, AppWindowOptions } from "./types";

const createAppWindow = (data: App) => ({
    created_at: Date.now(),
    id: genId(),
    data,
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

export default appWindow;
