export function throttle(func: Function, wait: number = 0) {
    let lastInvokedTime: number = 0;
    return () => {
        const now = performance.now();
        if (lastInvokedTime === 0) {
            lastInvokedTime = now;
            setTimeout(func, wait);
        } else {
            const diffTime = now - lastInvokedTime;
            if (diffTime > wait) {
                lastInvokedTime = now;
                setTimeout(func, wait);
            }
        }
    };
}
