interface Options {
    leading?: boolean;
    trailing?: boolean;
}

const DEFUALT_OPTIONS = {
    trailing: true,
}

export function debounce(func: Function, wait: number = 0, options: Options = DEFUALT_OPTIONS) {
    let lastExcuteTime: number;
    let lastInvokeTime: number;
    let timerId: number;

    const { leading, trailing } = options;

    const excute = (time: number) => {
        lastExcuteTime = time;
        func();
    }

    const leadExcute = (time: number) => {
        if (lastInvokeTime === undefined || time - lastInvokeTime > wait) {
            excute(time);
        }
    }

    const trailExcute = (time: number) => {
        if (time === lastExcuteTime) {
            return;
        }
        if (time - lastInvokeTime > wait && timerId) {
            timerId = undefined;
            excute(time);
            return;
        }
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            const nextTime = performance.now();
            trailExcute(nextTime);
        }, wait);
    }

    return () => {
        const now = performance.now();
        if (leading) {
            leadExcute(now);
        }
        if (trailing) {
            trailExcute(now);
        }
        lastInvokeTime = now;
    };
}

