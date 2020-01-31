import ReduceStore from './ReduceStore';
import Dispatcher from './Dispatcher';
import { RemoveListenerFn } from './Store';
import { shallowEqualArrays } from 'shallow-equal'

/**
 * ContainerListenToStores 是用来辅助 Container组件 监听 stores 变化的结构。（相当于 Flux 中 FluxContainerSubscriptions 和 FluxStoreGroup 的组合）
 * 
 * 将这一部分逻辑抽离出来，可以使 Container组件 更关注数据到视图的映射
 * 
 * 该结构将承担一下几种能力：
 * 1. 注册所监听的 stores ，并允许 Container组件 更新监听了哪些 stores ( Container 可能因为 props 不同而监听不同 stores , 当然我不认这是一个足够智能的方案。TODO: 思考更好的解决方案)
 * 2. 判断所有 stores 都是注册在同一个 dispatcher 下的 （Flux 的设计思想）
 * 3. 假如所监听的 StoreA ， StoreB， StoreC 在一次 dispatching 都发生了数据的变更，那 Container 重新计算 state 的逻辑也只应该执行一次，类似与 debounce 的设计
 */
class ListenToStores {
    private dispatcher: Dispatcher = null;

    private dispatchToken: string;

    private stores: ReduceStore<any>[] = [];

    private removeStoreListenerFn: Array<RemoveListenerFn> = [];

    private callback: () => void;

    private hasStoreChanged: boolean = false;

    constructor(stores: ReduceStore<any>[], callback: () => void) {
        this.callback = callback;
        this.listenToStores(stores);
    }

    /**
     * 用于给视图更新所依赖的 Stores 
     * @param stores 
     */
    setStores(stores: ReduceStore<any>[]) {
        if (shallowEqualArrays(stores, this.stores)) {
            return;
        }

        this.dispose();
        this.listenToStores(stores);
    }

    /**
     * 监听到 Stores 改变的实际操作逻辑
     * 
     * 1. 获取到 dispatcher (唯一)
     * 2. 在所有 Store 上设置监听函数，由于标记数据实际发生了改变
     * 3. dispatcher 注册回调，保证在所有 Store 都更新完毕后，执行视图注册的回调（每次 dispatching 都只执行一次）
     * 
     * @param stores 
     */
    private listenToStores(stores: ReduceStore<any>[]) {
        this.dispatcher = this.getUniformDispatcher(stores);
        this.stores = stores;
        this.removeStoreListenerFn = stores.map(store => store.addEventListener(this.emitStoreChanged));

        this.registerCallBack();
    }

    /**
     * 获取 stores 统一的注册的 dispatcher
     * @param stores 
     */
    private getUniformDispatcher(stores: ReduceStore<any>[]) {
        const dispatcher = stores[0].getDispatcher();

        for (const store of stores) {
            if (store.getDispatcher() !== dispatcher) {
                // 这里直接抛出错误比较欠妥（TODO：学习成熟框架的解决方案）
                throw new Error('All stores in a FluxStoreGroup must use the same dispatcher');
            }
        }

        return dispatcher;
    }

    /**
     * 标记本次 dispatching 有 Store 发生了改变
     */
    private emitStoreChanged() {
        this.hasStoreChanged = true;
    }

    /**
     * 依靠 dispatcher 的 waitFor 机制，保证所依赖的全部 stores 都更新完毕后，再去执行 Container 回调
     */
    private registerCallBack = () => {
        this.dispatchToken = this.dispatcher.register(() => {
            const storeTokenes = this.stores.map(store => store.getDispatchToken());
            this.dispatcher.waitFor(storeTokenes);
            this.invokeFunc();
        });
    }

    /**
     * 判断有 store 数据发生改变后，再执行回调
     */
    private invokeFunc = () => {
        if (this.hasStoreChanged) {
            this.callback();
            this.hasStoreChanged = false;
        }
    }

    /**
     * 释放注册的一些监听，回调之类
     * 
     * 一般在视图 注销 或者 更新Stores 时执行
     */
    dispose() {
        this.removeStoreListenerFn.forEach(listener => {
            listener.remove();
        });

        this.dispatcher.unregister(this.dispatchToken);

        this.callback = null;

        this.stores = null;
    }
}

export default ListenToStores;
