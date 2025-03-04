import { add, remove } from "./store";
import { genId } from "./utils";
import type { 
    Toast,
    ToastType,
    ToastContent,
    ToastHandler,
    ToastOptions 
} from "./types";

const createToast = ( type: ToastType = 'blank', content: ToastContent, opts?: ToastOptions ) => ({
    created_at: Date.now(),
    type,
    appName: content.appName,
    title: content.title,
    message: content.message,
    icon: opts?.icon,
    id: opts?.id || genId(),
})

const createHandler = (type?: ToastType): ToastHandler => (content, opts) => {
    const toast = createToast(type, content, opts);
    add(toast);
    return toast.id; 
}

export const toast = ( content: ToastContent, opts?: ToastOptions ) => createHandler('blank')(content, opts);

toast.success = createHandler('success');
toast.error = createHandler('error');
toast.missing = createHandler('missing');

toast.remove = (toast: Toast, duration: number = 0) => remove(toast, duration);
