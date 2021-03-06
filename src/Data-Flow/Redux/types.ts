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

export interface Dispatch {
    (action: Action): Action;
}

export interface MiddlewareParam<State> {
    getState: () => State;
    dispatch: Dispatch;
}

export interface MiddlewareResult {
    (dispatch: Dispatch): Dispatch
}

export interface Middleware<State> {
    (param: MiddlewareParam<State>): MiddlewareResult;
}

export interface StoreEnHancer<Store> {
    (store: Store): Store;
}