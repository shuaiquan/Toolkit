import Channel from './channel';
import { runSaga } from './runSaga';
import { Dispatch, GetState, ENV } from './type';

export function sagaMiddlewareFactory<T>() {
    const channel = new Channel();

    let env: ENV<T>;

    function sagaMiddleware({ dispatch, getState }: { dispatch: Dispatch, getState: GetState<T> }) {
        env = {
            channel,
            dispatch,
            getState,
        };

        return next => action => {
            // 先继续执行其他中间件，并执行 reducer
            const result = next(action);
            // 发送 Action 到注册的 Saga 上
            channel.put(action);

            return result;
        }
    }

    sagaMiddleware.run = (saga: Generator, ...args: any[]) => {
        // 将 env 以及 初始Saga 传递给启动函数
        runSaga(env, saga, ...args);
    }

    return sagaMiddleware;
}