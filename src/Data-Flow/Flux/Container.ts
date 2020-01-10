import React from 'react';
import ReduceStore from './ReduceStore';

export default abstract class Container<P, S, StoreState> extends React.Component<P, S> {
    abstract getStores(): ReduceStore<any>[];

    abstract calculateState(): StoreState;

    constructor(props: P, context: any) {
        super(props, context);

        this.getStores().forEach(store => store.addEventListener(this.subscribeStore));
    }

    private subscribeStore = () => {
        const state = this.calculateState();
        this.setState(state);
    }
}