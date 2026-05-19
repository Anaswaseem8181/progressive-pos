import { toast } from "react-toastify";

const defaultOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
};

// Cache to store message timestamps for deduplication/throttling
const toastCache = new Map();
const DEFAULT_COOLDOWN = 2000; // 2 seconds cooldown for duplicate messages

const shouldShowToast = (type, message, options = {}) => {
    if (options.ignoreCooldown) return true;

    const cooldown = options.cooldown !== undefined ? options.cooldown : DEFAULT_COOLDOWN;
    const key = `${type}:${message}`;
    const now = Date.now();
    const lastTime = toastCache.get(key);

    if (lastTime && now - lastTime < cooldown) {
        return false;
    }

    toastCache.set(key, now);

    // Limit cache size to prevent memory leaks
    if (toastCache.size > 50) {
        for (const [k, val] of toastCache.entries()) {
            if (now - val > 30000) {
                toastCache.delete(k);
            }
        }
    }

    return true;
};

export const notify = {
    success: (message, options = {}) => {
        if (shouldShowToast("success", message, options)) {
            toast.success(message, { ...defaultOptions, ...options });
        }
    },
    error: (message, options = {}) => {
        if (shouldShowToast("error", message, options)) {
            toast.error(message, { ...defaultOptions, ...options });
        }
    },
    info: (message, options = {}) => {
        if (shouldShowToast("info", message, options)) {
            toast.info(message, { ...defaultOptions, ...options });
        }
    },
    warn: (message, options = {}) => {
        if (shouldShowToast("warn", message, options)) {
            toast.warn(message, { ...defaultOptions, ...options });
        }
    },
};

