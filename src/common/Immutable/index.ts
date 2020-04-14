import { deepFreeze, clone, isArray, isObjectLike } from '@s7n/utils';

class Immutable {

    /**
     * 将 data 转化为 immutable data
     * @param data 
     */
    immutable<T>(data: T): T {
        // 这里一律对目标 data 使用 Object.freeze ，以保证数据无法被修改
        // TODO: seamless-immutable 中提到这个对性能有影响，所以分为了生产模式和线上模式，如果不这样做如何强制用户无法修改数据？？遍历拦截 set 方法？？
        return <T>deepFreeze(data);
    }

    /**
     * 判断目标数据是否是 immutable data
     * @param data 
     */
    isImmutable(data: Object) {
        // 这里对应 immutable 函数中的操作
        return Object.isFrozen(data);
    }

    /**
     * 使用 partialData 来局部跟新 data
     * @param data 要更新的目标
     * @param partialData 要更新的数据
     */
    merge<T extends Object>(data: T, partialData: Partial<T>) {
        if (isArray(data)) {
            throw new Error('The merge method only support object');
        }

        if (isObjectLike(data)) {
            return {
                ...data,
                ...partialData,
            } as T;
        }

        return data;
    }

    /**
     * 更新目标上对应属性的值
     * @param data 目标对象
     * @param key 属性
     * @param value 属性值
     */
    set<T, K extends keyof T>(data: T, key: K, value: any) {
        if (!isArray(data) && !isObjectLike(data)) {
            throw new Error('The set method only support array or object');
        }
        const newData = clone(data, false);
        newData[key] = value;
        return newData;
    }

    /**
     * 根据属性路径更新目标对象的属性值
     * @param data 目标对象
     * @param path 属性路径
     * @param value 属性值 
     */
    setIn<T, K extends string | number>(data: T, path: K[], value: any) {
        // TODO
    }
}

export default new Immutable();