interface Options {
    leading?: boolean;
    trailing?: boolean;
}

const DEFUALT_OPTIONS = {
    trailing: true,
}


export function throttle(func: Function, wait: number = 0, options: Options = DEFUALT_OPTIONS) {
    // throttled function 被调用时间
    let lastCallTime: number;
    // func 实际的执行时间（默认为：0）
    let lastInvokTime: number = 0;
    // 检查 trailingEdge 是否执行的计时器
    let timerId: number;

    // 标记有 trailingEdge 函数待执行
    let readyCallBack: boolean = false;

    const { leading, trailing } = options;

    const invokeFunc = (time: number) => {
        lastInvokTime = time;
        readyCallBack = false;
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

    // 根据 lastInvokeTime 计算 trailingEdge 函数等待时间
    const remainingWait = (time: number) => {
        const timeSinceLastInvoke = time - lastInvokTime;
        return wait - timeSinceLastInvoke;
    }

    const timeExpired = () => {
        const currentTime = performance.now();
        if (readyCallBack && (currentTime - lastInvokTime) > wait) {
            trailingEdge(currentTime);
        }
        if (!timerId) {
            timerId = setTimeout(timeExpired, remainingWait(currentTime));
        }
    }

    return () => {
        const currentTime = performance.now();
        readyCallBack = true;
        if (leading) {
            leadingEdge(currentTime);
        }
        if (trailing) {
            timerId = setTimeout(timeExpired, wait);
        }
        lastCallTime = currentTime;
    };
}
