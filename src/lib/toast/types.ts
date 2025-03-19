export interface Toast extends ToastContent {
    created_at: number;
	type: ToastType;
	id: string;
	icon?: string,
}
export type Toasts = Record<string, Toast[]>;
export type ToastType = 'success' | 'error' | 'missing' | 'blocked' | 'blank';

export interface ToastOptions {
    icon?: string,
    id?: string,
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
