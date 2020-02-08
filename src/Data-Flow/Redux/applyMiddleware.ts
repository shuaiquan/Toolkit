import { Middleware, MiddlewareParam, MiddlewareResult, Dispatch } from './types';
import { Store } from './Store';

export function applyMiddleware<State>(...middlewares: Middleware<State>[]) {
    return (store: Store<State>) => {
        if (middlewares.length === 0) {
            return store;
        }

        // 如果是这样定义，为什么要给 middleware 传递 dispatch
        const dispatch = () => {
            throw new Error('Dispatching while constructing your middleware is not allowed. ');
        }

        const middlewareParam: MiddlewareParam<State> = {
            dispatch,
            getState: store.getState,
        };

        const chain = middlewares.map(middleware => middleware(middlewareParam));

        store.dispatch = compose(...chain)(store.dispatch);

        return store;
    }
}

function compose(...func: MiddlewareResult[]) {
    if (func.length === 1) {
        return func[0];
    }

    // from right to left
    return func.reduce((a, b) => (dispach: Dispatch) => a(b(dispach)));
}