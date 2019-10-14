export function throttle(func: Function, wait: number = 0) {
    let lastInvokedTime: number = 0;
    return () => {
        if (lastInvokedTime === 0) {
            lastInvokedTime = performance.now();
        } else {
            const diffTime = performance.now() - lastInvokedTime;
            if (diffTime > wait) {
                lastInvokedTime = performance.now();
                func();
            }
        }
    };
}
