import type { App } from "../types";

export interface AppWindowProps {
    name: string,
    appWindowData: App,
}
export interface AppWindow {
    created_at: number;
	id: string;
    data: App,
}
export interface AppWindowOptions {
    limit?: number;
    props?: App['props'],
}
export type AppWindowHandler = (
    data: App,
	opts?: AppWindowOptions,
) => AppWindow['id']; 
