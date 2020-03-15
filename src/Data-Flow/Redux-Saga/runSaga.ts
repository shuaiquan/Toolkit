import { ENV, Saga } from './type';
import { proc } from './proc';

/**
 * Saga 的启动函数，会将最开始的任务注册上去
 */
export function runSaga<T>(env: ENV<T>, saga: Saga, ...args: any[]) {
    const iterator = saga(...args);

    const task = proc(env, iterator);

    return task;
}