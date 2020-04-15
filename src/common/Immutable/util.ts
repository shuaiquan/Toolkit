import { isArray, isObjectLike } from '@s7n/utils';

export function isArrayOrObject(value: any): value is Object {
    return isArray(value) && isObjectLike(value);
}
