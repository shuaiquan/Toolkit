import Dispatcher, { Action } from './Dispatcher';

/**
 * Store 是 Flux 体系中的一个基类，按照其描述它会提供以下几种能力：
 * 
 * 1. Cache data                                                            // 保存数据
 * 2. Expose public getters to access data (never have public setters)      // 提供访问数据的方法
 * 3. Respond to specific actions from the dispatcher                       // 响应 dispaching
 * 4. Always emit a change when their data changes                          // 这个也不总是，有 data 是否改变的先觉判断
 * 5. Only emit changes during a dispatch                                   // 
 * 
 * https://facebook.github.io/flux/docs/flux-utils#store
 * 
 * 不过作者在实际设计的时候，拆分了这几部分能力。
 * 我认为大概拆解为两部分：
 * 第一部分：和 Dispatcher 建立联系，响应 dispatching , 并触发回掉
 * 第二部分：维护数据，并规定 dispatching 时如何重新计算数据
 * 
 * 那 Store 这个数据结构就是完成了第一部分工作
 */
export default abstract class Store {
    private registToken: string;

    private dispatcher: Dispatcher = null;

    /**
     * 官方代码中事件监听是通过 eventemitter 实现的，这里简化一下逻辑，仅用一个数组来实现
     */
    private listeners: Function[] = [];

    private changed: boolean = false;

    constructor(dispatcher: Dispatcher) {
        this.dispatcher = dispatcher;
        this.registToken = dispatcher.register(this.invokeFunc);
    }

    /**
     * 注册一些监听函数，当 store 改变时会被调用（官网：when the store changes the given callback will be called）
     * 
     * 这个返回一个 remove 方法用于删除当前注册的监听函数，这个设计还是比较奇怪的
     * 
     * @param fn 
     */
    addEventListener(fn: Function): { remove: () => void } {
        this.listeners.push(fn);

        return {
            remove: () => {
                const index = this.listeners.findIndex(func => func === fn);
                this.listeners.splice(index, 1);
            }
        }
    }

    getDispatcher() {
        return this.dispatcher;
    }

    getDispatchToken() {
        return this, this.registToken;
    }

    /**
     * 判断 state 是否发生了改变
     */
    hasChanged(): boolean {
        return this.changed;
    }

    /**
     * 由于基类 Store 上不保存 state ，该方法用于给子类标记当次 dispatching 导致了 state 的改变
     */
    protected emitChange() {
        this.changed = true;
    }

    abstract onDispatch(payload: Action): void;

    private invokeFunc(payload: Action) {
        this.changed = false;
        this.onDispatch(payload);
        if (this.changed) {
            this.listeners.forEach(fn => fn());
        }
    }
}