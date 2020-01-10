import Dispatcher from './Dispatcher';

// 直接使用 ReduceStore 建立和 Dispatcher 的联系

export default abstract class ReduceStore<State> {
    private registToken: string;
    private state: State;

    private lisnter: Function[];

    constructor(dispatcher: Dispatcher) {
        this.registToken = dispatcher.register(this.invokeFunc);
        this.state = this.getInitialState();
    }

    private invokeFunc = (payload: Object) => {
        this.state = this.reduce(this.getState(), payload);
        this.lisnter.forEach(fn => fn());
    }

    getState(): State {
        return this.state;
    }

    abstract getInitialState(): State;

    abstract reduce(state: State, payload: Object): State;

    areEqual(one: State, two: State): boolean {
        return one === two;
    }

    addEventListener(fn: Function) {
        this.lisnter.push(fn);
    }
}