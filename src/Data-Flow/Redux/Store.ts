import { Action, Listener, Reducer } from './types';

class Store<State> {
    private state: State = null;

    private listeners: Listener[] = [];

    getState() {
        return this.state;
    }

    dispatch(action: Action) {

    }

    // subscribe(fn: Function) {

    // }

    // replaceReducer(nextReducer: Reducer<State>) {

    // }
}

export function createStore<T>(reducer: Reducer<T>, initailState?: T, enhancer?: Function) {

}
