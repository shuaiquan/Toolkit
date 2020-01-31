import React from 'react';
import ReduceStore from './ReduceStore';
import { shallowEqualObjects } from 'shallow-equal';

interface ReactClass<Props, State> {
    new(props: Props, context: any): React.Component<Props, State>;
}

type ContainerBaseClass<Props, State> = {
    getStores: () => ReduceStore<any>[];
    calculateState: () => State;
} & ReactClass<Props, State>;

interface Options {
    pure?: boolean,
    withProps?: boolean,
    withContext?: boolean,
};

/**
 * 创建 Container 组件
 * @param Base 
 */
function create<Props, State>(Base: ContainerBaseClass<Props, State>, options: Options) {
    enforceInterface(Base);

    class Com extends Base {
        constructor(props: Props, context: any) {
            super(props, context);
            this.listenToStore();
            this.state = Base.calculateState();
        }

        private listenToStore() {
            const stores = Base.getStores();
            stores.forEach(store => {
                store.addEventListener(this.updateState);
            });
        }

        private updateState = () => {
            const state = Base.calculateState();
            this.setState(state);
        }
    }

    return options.pure ? createPureComponent(Com) : Com;
}

/**
 * 如果用户选择了 pure 组件，默认添加 shallowEqual 的比较
 * @param Container 
 */
function createPureComponent<Props, State>(Container: ReactClass<Props, State>) {
    return class extends Container {
        shouldComponentUpdate(nextProps: Props, nextState: State) {
            return !shallowEqualObjects(this.props, nextProps) || !shallowEqualObjects(this.state, nextState);
        }
    }
}

/**
 * 检测 Base 组件是否实现了 getStores 和 calculateState 方法
 * @param base 
 */
function enforceInterface(base: any) {
    if (!base.getStores) {
        throw new Error('Components that use FluxContainer must implement `static getStores()`');
    }

    if (!base.calculateState) {
        throw new Error('Components that use FluxContainer must implement `static calculateState()`');
    }
}

export default { create };