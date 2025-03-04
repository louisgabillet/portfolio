import { writable, get, type Writable } from "svelte/store";
import type { Toast } from "./types";

type Toasts = Record<string, Toast[]>;

export const toasts: Writable<Toasts> = writable({})

export function add(toast: Toast) {
    const appName: Toast['appName'] = toast.appName;

    toasts.update(($toasts) => {
        const _toasts: Toast[] = $toasts[appName] ?? [];

        return {
            ...$toasts,
            [appName]: [
                ..._toasts,
                toast,
            ],
        }
    })
}
export function remove(toast: Toast, duration: number = 0) {
    const { appName, id } = toast;
    const _toasts = get(toasts);

    const arr = _toasts[appName]; 
    const newArr: Toast[] = arr.filter(t => t.id !== id);
    const isEmpty = newArr.length === 0;

    if (isEmpty) {
        removeKey(appName, duration);
    }

    toasts.update($toasts => {
        return { 
            ...$toasts,
            [appName]: newArr, 
        };
    });
}

function removeKey(appName: string, duration: number) {
    setTimeout(() => {
        toasts.update(($toasts) => {
            const { [appName]: _, ...rest } = $toasts; 
            return rest; 
        });
    }, duration)
}
