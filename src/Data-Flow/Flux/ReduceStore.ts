import Dispatcher, { Action } from './Dispatcher';
import Store from './Store';

/**
 * 作者拆解 Store 功能的第二部分，详细的参考 Store 文件中的注释
 * 
 * 这代码中与 Flux 实现不太一样的地方表现在 onDispatch 函数（对应 Flux ReduceStore.__invokeOnDispatch）
 * 
 * Flux ReduceStore.__invokeOnDispatch 函数基本重写了 Store。__invokeOnDispatch 方法
 * 
 * 而当前实现中，我认为 ReduceStore 只需要 onDispatch 部分即可，这也和 ReduceStore 主要负责 State 的设计理念比较一致
 * 至于那些触发回调函数的逻辑依旧保留在 Store结构中 
 */
export default abstract class ReduceStore<State> extends Store {
    private state: State;

    constructor(dispatcher: Dispatcher) {
        super(dispatcher);
        this.state = this.getInitialState();
    }

    getState(): State {
        return this.state;
    }

    /**
     * 初始化 state . 必须由用户实现
     */
    abstract getInitialState(): State;

    /**
     * 定义如何根据 Action 计算新的 state
     * @param state 
     * @param payload 
     */
    abstract reduce(state: State, payload: Action): State;

    /**
     * 判断前后两个 state 是否相等。
     * 
     * 是简单的全等判断，如果是 非基本类型 且不是 immutable 时会有风险，需要用户 override
     * 
     * 推崇使用 immutable
     * 
     * @param one 
     * @param two 
     */
    areEqual(one: State, two: State): boolean {
        return one === two;
    }

    /**
     * 响应 dispatching , 由 Store 中的 invokeFunc 函数发起调用
     * @param payload 
     */
    onDispatch(payload: Action) {
        const oldState = this.state;
        const newState = this.reduce(oldState, payload);

        if (!this.areEqual(oldState, newState)) {
            // 更新 state
            this.state = newState;
            // 标记 state 是修改过的
            this.emitChange();
        }
    }
}