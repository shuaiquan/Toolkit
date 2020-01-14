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
        this.resolveResult = value;
        this.resolveCallBacks.forEach(callBack => {
            callBack(value);
        });
    }

    private rejectedFunc: RejectedFunc = (reason?: any) => {
        this.status = PromiseStatus.Rejected;
        this.rejectedResult = reason;
        this.rejectedCallBacks.forEach(callBack => {
            callBack(reason);
        })
    }

    then = <TResult = never>(fn: OnFulFilled<T, TResult>) => {
        if (this.status === PromiseStatus.Pending) {
            return new MyPromise((resolve: ResolveFunc<TResult>, reject: RejectedFunc) => {
                try {
                    this.resolveCallBacks.push((result1) => {
                        const result2 = fn(result1);
                        resolve(result2);
                    });
                } catch (e) {
                    reject(e);
                }
            });
        } else if (this.status === PromiseStatus.Fulfilled) {
            return new MyPromise((resolve: ResolveFunc<TResult>, reject: RejectedFunc) => {
                try {
                    const result = fn(this.resolveResult);
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            });
        }
    }

    catch = <TResult = never>(fn: OnRejected<TResult>) => {
        if (this.status === PromiseStatus.Pending) {
            return new MyPromise((resolve: ResolveFunc<TResult>, reject: RejectedFunc) => {
                try {
                    this.rejectedCallBacks.push((result1) => {
                        const result2 = fn(result1);
                        resolve(result2);
                    });
                } catch (e) {
                    reject(e);
                }
            });
        } else if (this.status === PromiseStatus.Rejected) {
            return new MyPromise((resolve: ResolveFunc<TResult>, reject: RejectedFunc) => {
                try {
                    const result = fn(this.rejectedResult);
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            });
        }
    }
}

export default MyPromise;
