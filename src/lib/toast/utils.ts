import type { ToastType } from "./types";

export const toastDefaultIcons: Record<ToastType, string> = {
    success: '✅',
    error: '❌',
    missing: '❓',
    blocked: '🚫',
    blank: '',
}

export const genId = (() => {
	let count = 0;

	return () => {
		count += 1;
		return count.toString();
	};
})();
