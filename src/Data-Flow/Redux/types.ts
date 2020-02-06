export interface Action {
    type: string;
}

export interface AnyAction extends Action {
    [key: string]: any;
}

export interface Listener {
    token: string;
    fn: Function;
}

export interface Reducer<State, A extends Action = Action> {
    (state: State, action: A): State;
}
