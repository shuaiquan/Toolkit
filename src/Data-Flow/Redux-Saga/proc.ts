import { ENV, Next } from './type';
import { isPromise, isIterator } from './util';
import { effectRunnerMap } from './effectRunnerMap';
import { Effect } from './effectType';

/**
 * 循环自动执行 Saga 任务
 */
export function proc<T>(env: ENV<T>, iteractor: Generator) {
    function next(args?: any[], isErr: boolean = false) {
        if (isErr) {
            // Todo
        }

        const result = iteractor.next(args);

        if (!result.done) {
            runEffect(result.value, next);
        } else {
            //  Todo
        }
    }

    function runEffect(effect: Effect<any>, cb: Next) {
        if (isPromise(effect)) {
            // TODO
        } else if (isIterator(effect)) {
            // TODO
        } else if (effect) {
            const runner = effectRunnerMap[effect.type];
            runner(env, effect, cb);
        } else {

        }
    }

    next();
}
