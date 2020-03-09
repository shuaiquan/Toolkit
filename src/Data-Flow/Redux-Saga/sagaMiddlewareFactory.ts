import Channel from './channel';

export function sagaMiddlewareFactory() {
    const channel = new Channel();

    function sagaMiddleware() {
        return next => action => {
            // 先继续执行其他中间件，并执行 reducer
            const result = next(action);
            // 发送 Action 到注册的 Saga 上
            channel.put(action);

            return result;
        }
    }

    sagaMiddleware.run = () => {

    }

    return sagaMiddleware;
}