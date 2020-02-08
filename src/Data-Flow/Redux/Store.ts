import { Action, Listener, Reducer } from './types';
import { getUUID } from './utils';

/**
 * TODO：
 * 1. 将执行 reducer 的过程标记为 dispatching , 
 * 2. 不允许在 reducer 过程中再次触发 dispatch 。（这种操作会带来哪些问题）
 * 3. listerner 列表进行拷贝，dispatching 中也不允许 subscribe, remove (https://redux.js.org/api-reference/store#subscribelistener)
 * 
 * 4. 完善的参数校验，仅有 TS 的类型检测是否足够
 */

export class Store<State> {
    private state: State = null;

    private listeners: Listener[] = [];

    private reducer: Reducer<State> = null;

    constructor(reducer: Reducer<State>) {
        this.reducer = reducer;
    }

    getState() {
        return this.state;
    }

    dispatch(action: Action) {
        // isPlainObject

        // action valid

        // isDispatching

        this.invokeReducer(action);
        this.invokeListener();
        return action;
    }

    subscribe(fn: Function) {
        // 这里采用了类似 Flux 的 token 方案，Redux 中直接记录 fn 的引用做判断的
        const token = getUUID();
        this.listeners.push({ token, fn });
        return this.remove(token);
    }

    /**
     * 暂不了解使用场景
     */
    // replaceReducer(nextReducer: Reducer<State>) {

    // }

    private remove(token: string) {
        return () => {
            const index = this.listeners.findIndex(l => l.token === token);
            if (index !== -1) {
                this.listeners.splice(index, 1);
            }
        }
    }

    private invokeReducer(action: Action) {
        try {
            this.state = this.reducer(this.state, action);
        } catch (e) {
            // do nothing
        }
    }

    private invokeListener() {
        this.listeners.forEach(listener => {
            const { fn } = listener;
            fn();
        });
    }
}

export function createStore<T>(reducer: Reducer<T>, initailState?: T, enhancer?: Function) {
    return new Store(reducer);
}
