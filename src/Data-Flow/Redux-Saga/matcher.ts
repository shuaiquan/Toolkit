import { AnyAction } from "../Redux/types";

export interface Matcher {
    (action: AnyAction): boolean;
}

export const wildcard = () => true;
export const string = (pattern: string) => (action: AnyAction) => action.type === pattern;

/**
 * 最简单的版本只支持字符串类型的匹配
 */
export function matcherFactory(pattern: string) {
    switch (pattern) {
        case '*':
            return wildcard;
        default:
            return string;
    }
}
