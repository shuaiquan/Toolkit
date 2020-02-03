export interface Action {
    [key: string]: any;
    type: string;
}

export interface Listener {
    token: string;
    fn: Function;
}

export interface Reducer<State> {
    (state: State, action: Action): State;
}
