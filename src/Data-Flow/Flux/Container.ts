import React from 'react';
import ReduceStore from './ReduceStore';
import { shallowEqualObjects } from 'shallow-equal';
import ListenToStores from './ListenToStores';

interface ReactClass<Props, State> {
    new(props: Props, context: any): React.Component<Props, State>;
}

type ContainerBaseClass<Props, State> = {
    getStores: (props?: Props, context?: any) => ReduceStore<any>[];
    calculateState: (preState: State, props?: Props, context?: any) => State;
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
function create<Props, State>(Base: ContainerBaseClass<Props, State>, options: Options = { pure: true }) {
    enforceInterface(Base);

    /**
     * 根据用户配置设置 Stores
     * @param maybeProps 
     * @param maybeContext 
     */
    const getStores = (maybeProps: Props, maybeContext: any) => {
        const props = options.withProps ? maybeProps : undefined;
        const context = options.withContext ? maybeContext : undefined;
        return Base.getStores(props, context);
    };

    /**
     * 根据用户配置重新计算 state
     * @param state 
     * @param maybeProps 
     * @param maybeContext 
     */
    const getState = (state: State, maybeProps: Props, maybeContext: any) => {
        const props = options.withProps ? maybeProps : undefined;
        const context = options.withContext ? maybeContext : undefined;
        return Base.calculateState(state, props, context);
    }

    class Com extends Base {
        private listenToStores: ListenToStores = null;

        constructor(props: Props, context: any) {
            super(props, context);
            const stores = getStores(props, context);
            // 监听 stores , 并注册更新函数
            this.listenToStores = new ListenToStores(stores, this.updateState);
            // 初始化 state
            this.updateState();
        }

        UNSAFE_componentWillReceiveProps(nextProps: Props, nextContext: any) {
            if (super.componentWillReceiveProps) {
                super.componentWillReceiveProps(nextProps, nextContext);
            }
            if (options.withProps || options.withContext) {
                const stores = getStores(nextProps, nextContext);
                this.listenToStores.setStores(stores);
                this.setState(prevState => getState(prevState, nextProps, nextContext));
            }
        }


        componentWillUnmount() {
            if (super.componentWillUnmount) {
                super.componentWillUnmount();
            }
            this.listenToStores.dispose();
        }

        private updateState = () => {
            this.setState(prevState => getState(prevState, this.props, this.context));
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