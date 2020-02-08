import { Reducer, StoreEnHancer } from './types';
import Store from './Store';


export function createStore<T>(reducer: Reducer<T>, initailState?: T, enhancer?: StoreEnHancer<Store<T>>) {
    if (enhancer) {
        return enhancer(new Store(reducer, initailState));
    }
    return new Store(reducer, initailState);
}
