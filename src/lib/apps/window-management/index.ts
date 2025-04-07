import { genId } from "./utils";
import { open, close, limit, focus, fullscreen, reduce } from "./store";
import type { App } from '../types';
import type { AppWindow, AppWindowHandler, AppWindowOptions } from "./types";

const defaultLimit: Record<string, number> = {
    Music: 1,
}

const createAppWindow = (data: App) => ({
    created_at: Date.now(),
    id: genId(),
    data,
});
    
const createHandler: AppWindowHandler = (data: App, opts?: AppWindowOptions) => {
    const app: AppWindow = createAppWindow(data);

    const windowLimit = opts?.limit || defaultLimit[data.type] || 10;
    const windowProps = opts?.props;

    if (windowProps) app.data.props = windowProps;

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
