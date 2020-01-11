interface retryFunc<T> {
    (...arg: any[]): Promise<T>
}

interface delayFunc<T> {
    (...arg: any[]): T | Promise<T>;
}


/**
 * 接受一个返回值是 Promise 的函数，当 Promise 的状态变为 rejected 时，重新执行该函数，并返回结果
 * @param fn 返回值是 Promise 的函数
 */
export function retryOnce<T>(fn: retryFunc<T>): retryFunc<T> {
    return (...arg: any[]) => {
        return fn(...arg).catch(() => fn(...arg));
    };
}

/**
 * 接受一个返回值是 Promise 的函数，当 Promise 的状态变为 rejected 时，延迟指定时间（默认 1000 ms）重新执行该函数，并返回结果
 * @param fn 返回值是 Promise 的函数
 * @param delay 延迟时间
 */
export function retryOnceWithDelay<T>(fn: retryFunc<T>, delay: number = 1000): retryFunc<T> {
    return (...arg: any[]) => {
        return fn(...arg).catch(() => delayFunc(fn, delay)(...arg));
    };
}

/**
 * 接受一个函数，并延迟执行
 * @param fn 要延迟操作的函数
 * @param delay 延迟时间
 */
export function delayFunc<T>(fn: delayFunc<T>, delay: number = 1000): (...arg: any[]) => Promise<T> {
    return (...arg: any[]) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const result = fn(...arg);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }, delay);
        });
    }
}