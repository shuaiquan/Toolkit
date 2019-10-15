export function throttle(func: Function, wait: number = 0, isLeading: boolean = false) {
    let lastInvokedTime: number = 0;
    return () => {
        const now = performance.now();
        if (lastInvokedTime === 0) {
            lastInvokedTime = now;
            invokeImmediately(func, wait, isLeading);
        } else {
            const diffTime = now - lastInvokedTime;
            if (diffTime > wait) {
                lastInvokedTime = now;
                invokeImmediately(func, wait, isLeading);
            }
        }
    };
}

function invokeImmediately(func: Function, wait: number, isLeading: boolean) {
    return isLeading ? func() : setTimeout(func, wait);
}