import { ENV, Next, RunnerFunc } from './type';
import { EffectType, TakeEffect, PutEffect } from './effectType';
import { AnyAction } from '../Redux/types';
import { matcherFactory } from './matcher';

/**
 * 这里定义针对不同类型 Effect 的执行方法
 */

/**
 * 执行 Take 类型的 Effect
 * 
 * 本质：等待匹配的 Action 出现，再执行 Next 函数让遍历器往后走
 */
function runTakeEffect<T>(env: ENV<T>, effect: TakeEffect, cb: Next) {
    const takerFunc = (action: AnyAction) => {
        cb(action, false);
    }

    const { channel } = env;
    const { payload: pattern } = effect;
    try {
        channel.take(takerFunc, matcherFactory(pattern));
    } catch (err) {
        cb(err, true);
    }
}

/**
 * 执行 Put 类型的 Effect
 * 
 * 本质：将当前的 Action 转发到 channel 上，并调用 Next 函数让遍历器往后走
 */
function runPutEffect<T>(env: ENV<T>, effect: PutEffect, cb: Next) {
    const { channel } = env;
    const { payload: action } = effect;

    try {
        const result = channel.put(action);
        cb(result, false);
    } catch (err) {
        cb(err, true);
    }
}

export const effectRunnerMap: { [key in EffectType]: RunnerFunc<any> } = {
    [EffectType.TAKE]: runTakeEffect,
    [EffectType.PUT]: runPutEffect,
}
