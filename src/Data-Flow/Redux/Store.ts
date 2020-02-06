import { Action, Listener, Reducer } from './types';
import { getUUID } from './utils';

class Store<State> {
    private state: State = null;

    private listeners: Listener[] = [];

    getState() {
        return this.state;
    }

    dispatch(action: Action) {
        this.listeners.forEach(listener => {
            listener.fn();
        });
    }

    subscribe(fn: Function) {
        const token = getUUID();
        this.listeners.push({ token, fn });
        return this.remove(token);
    }

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
}

export function createStore<T>(reducer: Reducer<T>, initailState?: T, enhancer?: Function) {

}
