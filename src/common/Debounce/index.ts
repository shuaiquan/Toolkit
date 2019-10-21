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

    // 检查 trailingEdge 是否执行
    const timeExpired = () => {
        const currentTime = performance.now();

        // 新一轮的首次
        if (!lastCallTime || (currentTime - lastCallTime >= wait && !timerId)) {
            timerId = setTimeout(timeExpired, wait);
        } else {
            // 判断 trailing 调用是否执行
            if (callBackReady && (currentTime - lastCallTime >= wait)) {
                trailingEdge(currentTime);
            }
            // 取消上次 trailing , 重新计时
            if (timerId) {
                clearTimeout(timerId);
                timerId = setTimeout(timeExpired, wait);
            }
        }
    }

    return () => {
        const currentTime = performance.now();
        callBackReady = true;
        if (leading) {
            leadingEdge(currentTime);
        }
        if (trailing) {
            timeExpired();
        }
        lastCallTime = currentTime;
    }
}
