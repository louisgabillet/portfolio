import type { ToastType } from "./types";

export const toastDefaultIcons: Record<ToastType, string> = {
    success: '✅',
    error: '❌',
    missing: '❓',
    blank: '',
}

export const genId = (() => {
	let count = 0;

	return () => {
		count += 1;
		return count.toString();
	};
})();
