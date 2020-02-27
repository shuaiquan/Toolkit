enum PromiseStatus {
    Pending = 'pending',
    Fulfilled = 'fulfilled',
    Rejected = 'rejected',
}

interface PromiseFunc<T> {
    (resolve?: ResolveFunc<T>, reject?: RejectedFunc): void
}

interface ResolveFunc<T> {
    (value?: T): void;
}

interface RejectedFunc {
    (reason?: any): void;
}

interface OnFulFilled<T, U> {
    (value?: T): U;
}

interface OnRejected<U> {
    (reason: any): U;
}

class MyPromise<T> {
    private status: PromiseStatus = PromiseStatus.Pending;

    private resolveResult: T;
    private resolveCallBacks: OnFulFilled<T, any>[] = [];

    private rejectedResult: any;
    private rejectedCallBacks: OnRejected<any>[] = [];

    constructor(fn: PromiseFunc<T>) {
        fn(this.resolveFunc, this.rejectedFunc);
    }

    private resolveFunc: ResolveFunc<T> = (value?: T) => {
        this.status = PromiseStatus.Fulfilled;
        if (value instanceof MyPromise) {
            (value as MyPromise<T>).then(v => this.excuteResolve(v));
        } else {
            this.excuteResolve(value);
        }
    }

    private rejectedFunc: RejectedFunc = (reason?: any) => {
        this.status = PromiseStatus.Rejected;
        this.rejectedResult = reason;
        this.rejectedCallBacks.forEach(callBack => {
            callBack(reason);
        })
    }

    private excuteResolve = (v?: T) => {
        this.resolveResult = v;
        this.resolveCallBacks.forEach(callBack => {
            callBack(v);
        });
    }

    /**
     * 注册 fullFilled 或者 rejected 的回调函数
     */
    then = <TResult = never>(fulFilled?: OnFulFilled<T, TResult>, rejected?: OnRejected<TResult>) => {
        return this.registeListener(fulFilled, rejected);
    }

    /**
     * 指定发生错误时的回调函数 （包括 rejected 状态）
     */
    catch = <TResult = never>(rejected: OnRejected<TResult>) => {
        return this.registeListener(undefined, rejected);
    }

    /**
     * 内部统一添加 fullFilled 或者 rejected 的回调函数的执行
     */
    private registeListener = <TResult = never>(onFulFilled?: OnFulFilled<T, TResult>, onRejected?: OnRejected<TResult>) => {
        return new MyPromise((resolve: ResolveFunc<TResult>, reject: RejectedFunc) => {
            try {
                if (this.status === PromiseStatus.Pending) {
                    if (onFulFilled) {
                        this.resolveCallBacks.push((result1) => {
                            const result2 = onFulFilled(result1);
                            resolve(result2);
                        });
                    }
                    if (onRejected) {
                        this.rejectedCallBacks.push((result1) => {
                            const result2 = onRejected(result1);
                            resolve(result2);
                        });
                    }
                } else if (this.status === PromiseStatus.Fulfilled) {
                    if (onFulFilled) {
                        const result = onFulFilled(this.resolveResult);
                        resolve(result);
                    }
                } else if (this.status === PromiseStatus.Rejected) {
                    if (onRejected) {
                        const result = onRejected(this.rejectedResult);
                        resolve(result);
                    }
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 返回一个状态为 fulfilled 的 MyPromise
     */
    static resolve<V>(value?: V) {
        return new MyPromise((resolve: (v: V) => void) => {
            resolve(value);
        });
    }

    /**
     * 返回一个状态为 rejected 的 MyPromise
     */
    static reject<V>(value?: V) {
        return new MyPromise((resolve: (v: V) => void, reject: (v: V) => void) => {
            reject(value);
        });
    }
}

export default MyPromise;
