function getUUID() {
    return new Date().getTime().toString();
}

export interface Action {
    [key: string]: any,
    type: string;
}

type RegisterFunc = (payload: Action) => void;

interface Listener {
    token: string;
    fn: RegisterFunc;
}

export default class Dispatcher {
    private listeners: Listener[] = [];

    private isPending: { [key: string]: boolean } = {};

    private payload: Action = null;

    private dispatching: boolean = false;

    /**
     * 注册 callback 函数，会接受到 Dispatcher 实例的广播
     * @param fn 
     */
    register(fn: RegisterFunc): string {
        const token = getUUID();

        this.listeners.push({ token, fn });
        return token;
    }

    /**
     * 移除已注册的 callback 函数
     * @param token 
     */
    unregister(token: string) {
        const index = this.listeners.findIndex(l => l.token === token);
        this.listeners.splice(index, 1);
    }

    /**
     * 调用所有注册的 callback , 并将 payload 传递给他们
     * @param payload 
     */
    dispatch(payload: Action) {
        this.dispatching = true;

        this.payload = payload;

        this.listeners.forEach(listener => this.invokeCallBack(listener));

        this.dispatching = false;
    }

    /**
     * 判断是不是在广播中
     */
    isDispatching(): boolean {
        return this.dispatching;
    }

    /**
     * 由于 dispatch 时，callbacks 是按照注册的顺序执行的
     * 当用户希望，更新 C 前要保证 A ， B 已更新，则可以在 C 的 callback 中使用 waitFor([A, B]) 实现
     * 
     * 问题在于，这样的更新机制无法解决用户可能写出的循环依赖，即 A 依赖 B ，B 依赖 A 的情况
     * 官方代码中的处理是，给出一个错误，并无视后一个执行的依赖，往下执行
     * 
     * 这里对于循环依赖的解决方案暂时保持与官方解决方案相同
     * 
     * TODO：
     * 思考怎样是更好的解决方案
     * 
     * @param tokens 要等待的 tokens 
     */
    waitFor(tokens: string[]) {
        for (let token in tokens) {
            if (this.isPending[token]) {
                // 进入这里表明陷入了循环依赖，提示一下并往下执行
                // log(`Dispatcher.waitFor(...): Circular dependency detected while waiting for ${token}`);
                continue;
            }
            const listener = this.listeners.find(l => l.token === token);
            this.invokeCallBack(listener)
        }
    }

    /**
     * 执行 callback 的函数
     * 
     * 在一个函数开始执行，且没有执行完的情况下，标记 pending 状态。以此来发现产生循环依赖，避免死锁
     * 
     * @param listener 
     */
    private invokeCallBack(listener: Listener) {
        const { token, fn } = listener;
        this.isPending[token] = true;
        fn(this.payload);
        delete this.isPending[token];
    }
}
