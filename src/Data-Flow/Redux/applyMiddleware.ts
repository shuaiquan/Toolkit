import { Middleware, MiddlewareParam, MiddlewareResult, Dispatch, Action } from './types';
import Store from './Store';

export function applyMiddleware<State>(...middlewares: Middleware<State>[]) {
    return (store: Store<State>) => {
        if (middlewares.length === 0) {
            return store;
        }

        // middleware 在创建过程中，调用 dispatch 将会抛出异常
        let dispatch: Dispatch = (action: Action) => {
            throw new Error('Dispatching while constructing your middleware is not allowed. ');
        }

        const middlewareParam: MiddlewareParam<State> = {
            dispatch: (action: Action) => dispatch(action),
            getState: store.getState,
        };

        const chain = middlewares.map(middleware => middleware(middlewareParam));

        dispatch = compose(...chain)(store.dispatch);
        store.dispatch = dispatch;

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