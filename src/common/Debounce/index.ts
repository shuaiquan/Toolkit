export function debounce(func: Function, wait: number = 0, isLeading: boolean = false) {
    let timer: number;
    return () => {
        if (isLeading) {
            if (timer) {
                clearTimeout(timer);
            } else {
                func();
            }
            timer = setTimeout(() => timer = undefined, wait);
        } else {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(func, wait);
        }
    }
}
