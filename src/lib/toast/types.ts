import type { App } from "$lib/apps/types";

export interface Toast extends ToastContent {
    created_at: number;
	type: ToastType;
	id: string;
	icon?: string,
    props?: App['props'],
}
export type Toasts = Record<string, Toast[]>;
export type ToastType = 'success' | 'error' | 'missing' | 'blocked' | 'blank';

export interface ToastOptions {
    icon?: string,
    id?: string,
    props?: App['props'],
}
export type ToastContent = {
    appName: string,
    title: string,
    message: string,
}
export type ToastHandler = (
    content: ToastContent,
	opts?: ToastOptions,
) => string;
