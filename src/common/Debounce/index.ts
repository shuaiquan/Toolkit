interface Options {
    leading?: boolean;
    trailing?: boolean;
}

const DEFUALT_OPTIONS = {
    trailing: true,
}

export function debounce(func: Function, wait: number = 0, options: Options = DEFUALT_OPTIONS) {
    // debounced 函数上次调用时间
    let lastCallTime: number;
    // 检查 trailingEdge 是否执行的计时器
    let timerId: number;

    // 标记有 trailingEdge 函数待执行
    let callBackReady: boolean = false;

    const { leading, trailing } = options;

    const invokeFunc = (time: number) => {
        callBackReady = false;
        func();
    }

    const leadingEdge = (time: number) => {
        if (!lastCallTime || time - lastCallTime > wait) {
            invokeFunc(time);
        }
    }

    const trailingEdge = (time: number) => {
        timerId = undefined;
        invokeFunc(time);
    }

    // 根据 lastCallTime 计算 trailingEdge 函数等待时间
    const remainingWait = (time: number) => {
        const timeSinceLastCall = time - lastCallTime;
        return wait - timeSinceLastCall;
    }

    // 检查 trailingEdge 是否执行
    const timerExpired = () => {
        const currentTime = performance.now();
        if (callBackReady && (currentTime - lastCallTime >= wait)) {
            trailingEdge(currentTime);
        }
        if (!timerId) {
            timerId = setTimeout(timerExpired, remainingWait(currentTime));
        }
    }

    return () => {
        const currentTime = performance.now();
        callBackReady = true;
        if (leading) {
            leadingEdge(currentTime);
        }
        if (trailing) {
            timerId = setTimeout(timerExpired, wait);
        }
        lastCallTime = currentTime;
    }
}
