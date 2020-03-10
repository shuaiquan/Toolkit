import { Dispatch } from '../Redux/types';
import Channel from './channel';

export interface GetState<T> {
    (): T
}

export interface ENV<T> {
    channel: Channel;
    dispatch: Dispatch;
    getState: GetState<T>;
}

export {
    Dispatch,
};
