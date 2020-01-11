export function forEach<T>(arr: T[], fn: (value: T) => void) {
    const length = arr.length;
    for (let i = 0; i < length; i++) {
        fn.call(arr, arr[i]);
    }
}

export function isNull(value: any) {
    return value === null;
}

export function isUndefined(value: any) {
    return value === undefined;
}

export function isNumber(value: any) {
    return typeof value === 'number';
}

export function isBoolean(value: any) {
    return typeof value === 'boolean';
}

export function isString(value: any) {
    return typeof value === 'string';
}

export function isObject(value: any) {
    return value !== null && typeof value === 'object';
}

export function isArray(value: any) {
    return 'isArray' in Array ? Array.isArray(value) : toString.call(value) === '[object Array]';
}

export function isNaN(value: any) {
    return isNumber(value) && value !== value;
}
