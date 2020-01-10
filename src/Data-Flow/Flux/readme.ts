// API

interface Dispatcher {
    register: (fn: Function) => string;

    unregister: (token: string) => void;

    dispatch: (payload: Object) => void;

    isDispatching: () => boolean;
}

// waitFor(tokenes: string[]) => void;
