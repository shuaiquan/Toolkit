import { ENV } from './type';

/**
 * Saga 的启动函数，会将最开始的任务注册上去
 */
export function runSaga<T>(env: ENV<T>, saga: Generator, ...args: any[]) {
    // TODO 
}