import { ToastOptions, toast, Flip, ToastContent, ToastPromiseParams } from "react-toastify";
const config: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    pauseOnFocusLoss: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Flip,
    // style: { padding: "1.5vw" }
}
export const showToast = (msg: ToastContent<unknown>, type: "info" | "error" | "success" | "warn", options?: ToastOptions) => {
    if (type === "info") {
        return toast.info(msg, { ...config, ...options })
    } else if (type === "success") {
        return toast.success(msg, { ...config, ...options })
    } else if (type === "warn") {
        return toast.warn(msg, { ...config, ...options })
    } else {
        return toast.error(msg, { ...config, ...options });
    }
}
export const promiseToast = (promise: Promise<unknown>, params: ToastPromiseParams<unknown, unknown, unknown>, options?: ToastOptions) => {
    toast.promise(promise, params, {
        ...config,
        ...options
    })
}