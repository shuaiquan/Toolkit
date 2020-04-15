import { deepFreeze, clone, isArray, isObjectLike } from '@s7n/utils';
import { isArrayOrObject } from './util';

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
     * 使用 partialData 来局部更新 data
     * @param data 要更新的目标
     * @param partialData 要更新的数据
     */
    merge<T extends Object>(data: T, partialData: Partial<T>) {
        if (!isObjectLike(data)) {
            throw new Error('The merge method only support object');
        }

        let newData: T = clone(data);
        let hasDifferent: boolean = false;
        for (const key of Object.keys(partialData)) {
            // 这里如果发现两个属性值都是对象的话，要进行深度对比，从而不从引用关系上得结论
            const newValue = isObjectLike(partialData[key]) && isObjectLike(data[key]) ? this.merge(data[key], partialData[key]) : partialData[key];
            if (newValue !== data[key]) {
                hasDifferent = true;
                newData[key] = newValue;
            }
        }

        return hasDifferent ? this.immutable(newData) : data;
    }

    /**
     * 更新目标上对应属性的值
     * @param data 目标对象
     * @param key 属性
     * @param value 属性值
     */
    set<T, K extends keyof T>(data: T, key: K, value: T[K]) {
        if (!isArray(data) && !isObjectLike(data)) {
            throw new Error('The set method only support array or object');
        }

        if (this.isEqual(data[key], value, true)) {
            return data;
        }

        const newData = clone(data, false);
        newData[key] = value;
        return this.immutable(newData);
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

    /**
     * 比较两个对象是否一致（默认是浅比较，用于 immutable data）
     * @param value1 
     * @param value2 
     * @param deep 是否进行深度比较
     */
    isEqual<T extends Object>(value1: T, value2: T, deep: boolean = false) {
        // 浅比较，用于 immutable data
        if (!deep) {
            return value1 === value2;
        }

        const keys1 = Object.keys(value1);
        const keys2 = Object.keys(value2);

        if (keys1 !== keys2) {
            return false;
        }

        for (const key of keys1) {
            const kValue1 = value1[key];
            const kValue2 = value2[key];
            if (isArrayOrObject(kValue1) && isArrayOrObject(kValue2)) {
                if (!this.isEqual(kValue1, kValue2)) {
                    return false;
                }
            } else if (kValue1 !== kValue2) {
                return false;
            }
        }

        return true;
    }
}

export default new Immutable();