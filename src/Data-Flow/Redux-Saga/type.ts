import { Dispatch } from '../Redux/types';
import Channel from './channel';
import { Effect } from './effectType';

export interface GetState<T> {
    (): T
}

export interface ENV<T> {
    channel: Channel;
    dispatch: Dispatch;
    getState: GetState<T>;
}

export interface Saga {
    (...args: any[]): Generator;
}

export interface Next {
    (args: any, isErr?: boolean): void;
}

export interface RunnerFunc<T> {
    (env: ENV<T>, effect: Effect<any>, cb: Next): void;
}

export {
    Dispatch,
};

