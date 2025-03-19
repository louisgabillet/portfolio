import type { App } from "../types";

export interface AppWindowProps {
    name: string,
    appInfos: App,
}
export interface AppWindow {
    created_at: number;
	id: string;
    data: App,
}
export type AppWindows = AppWindow[];

export interface AppWindowOptions {
    limit?: number;
}
export type AppWindowHandler = (
    data: App,
	opts?: AppWindowOptions,
) => AppWindow['id']; 
