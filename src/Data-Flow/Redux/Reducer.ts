import { Reducer, Action } from './types';

type ReducerMap<State> = {
    [K in keyof State]: Reducer<State[K]>;
}

export function combineReducers<State, A extends Action>(reducersMap: ReducerMap<State>): Reducer<State> {
    return function (state: State, action: A) {
        // 这里类型的处理，还有待推敲
        const nextState: Partial<State> = {};
        let hasChanged = false;
        Object.keys(reducersMap).forEach(key => {
            const newStateForKey = reducersMap[key](state[key], action);
            if (newStateForKey === undefined) {
                throw new Error(`reducer "${key}" returned undefined.`);
            }
            // 这里还是依靠用户完成 immutable
            if (newStateForKey !== state[key]) {
                hasChanged = true;
            }
            nextState[key] = newStateForKey;
        });
        return (hasChanged ? nextState : state) as State;
    };
}