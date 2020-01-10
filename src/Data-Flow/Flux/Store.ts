import Dispatcher from './Dispatcher';

export default class Store {
    private registToken: string;

    constructor(dispatcher: Dispatcher) {
        this.registToken = dispatcher.register(this.invokeFunc)
    }

    private invokeFunc(payload: Object) {

    }
}