export function debounce(func: Function, wait: number = 0) {
    let timer: number = 0;
    return () => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(func, wait);
    }
}
