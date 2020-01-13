enum PromiseStatus {
    Pending = 'pending',
    Fulfilled = 'fulfilled',
    Rejected = 'rejected',
}

interface PromiseFunc<T, K> {
    (resolve?: ResolveFunc<T>, reject?: RejectedFunc<K>): void
}


interface ResolveFunc<T> {
    (value: T): void;
}

interface RejectedFunc<K> {
    (reason: K): void;
}

interface ThenFunc<T> {
    (value: T): void;
}

interface CatchFunc<K> {
    (reason: K): void;
}

class MyPromise<T, K> {
    private status: PromiseStatus = PromiseStatus.Pending;

    private resolveResult: T;
    private resolveCallBacks: ThenFunc<T>[] = [];

    private rejectedResult: K;
    private rejectedCallBacks: CatchFunc<K>[] = [];

    constructor(fn: PromiseFunc<T, K>) {
        fn(this.resolveFunc, this.rejectedFunc);
    }

    private resolveFunc: ResolveFunc<T> = (value: T) => {
        this.status = PromiseStatus.Fulfilled;
        this.resolveResult = value;
        this.resolveCallBacks.forEach(callBack => {
            callBack(value);
        });
    }

    private rejectedFunc: RejectedFunc<K> = (reason: K) => {
        this.status = PromiseStatus.Rejected;
        this.rejectedResult = reason;
        this.rejectedCallBacks.forEach(callBack => {
            callBack(reason);
        })
    }

    then = (fn: ThenFunc<T>) => {
        if (this.status === PromiseStatus.Pending) {
            this.resolveCallBacks.push(fn);
        } else if (this.status === PromiseStatus.Fulfilled) {
            fn(this.resolveResult);
        }
    }

    catch = (fn: CatchFunc<K>) => {
        if (this.status === PromiseStatus.Pending) {
            this.rejectedCallBacks.push(fn);
        } else if (this.status === PromiseStatus.Rejected) {
            fn(this.rejectedResult);
        }
    }
}

export default MyPromise;
