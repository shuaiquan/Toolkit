interface Params {
    [key: string]: any;
}

export function buildUrl(url: string, params?: Params) {
    if (!params) {
        return url;
    }

    const search = parseParams(params);

    return `${url}${isUrlHasSearch(url) ? '&' : '?'}${search}`;
}

function parseParams(params: Params) {
    const paths: string[] = [];

    // for (let [key, value] of Object.en) {

    // }

    Object.keys(params).forEach(key => {
        const value = params[key];

        // 忽略 null 和 undefined 的参数
        if (value === null || value === undefined) {
            return;
        }

        if (Array.isArray(value)) {
            // TODO 标准化的解析方式是什么
        } else if (typeof value === 'object') {
            // TODO 标准化的解析方式是什么
        } else {
            paths.push(`${key}=${value}`);
        }
    });

    return paths.join('&');
}

function isUrlHasSearch(url: string) {
    return url.indexOf('?') !== -1;
}

export function isUrlSearchParams(value: any) {
    return typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams;
}

export function isObject(value: any) {
    return value !== null && typeof value === 'object';
}
