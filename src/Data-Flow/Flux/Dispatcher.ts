function getUUID() {
    return new Date().getTime().toString();
}

interface Listener {
    token: string;
    fn: Function;
}

export default class Dispatcher {
    private listeners: Listener[] = [];

    private dispatching: boolean = false;

    register(fn: Function): string {
        const token = getUUID();

        this.listeners.push({ token, fn });
        return token;
    }

    unregister(token: string) {
        const index = this.listeners.findIndex(l => l.token === token);
        this.listeners.splice(index, 1);
    }

    dispatch(payload: Object) {
        this.dispatching = true;

        this.listeners.forEach(l => {
            const { fn } = l;
            fn(payload);
        });

        this.dispatching = false;
    }

    isDispatching(): boolean {
        return this.dispatching;
    }
}


/**
 * TODO
 * function waitFor
 */